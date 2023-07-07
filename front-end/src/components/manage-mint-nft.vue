<template>
  <div>
    <Notifications/>
    <b-row>
      <b-col>
        <b-form-input v-model="receiverEmail" placeholder="Receiver email"></b-form-input>
      </b-col>
      <b-col>
        <b-form-select placeholder="Select an option" class="mb-3" v-model="nftTypeId" :options="nftTypes"></b-form-select>
      </b-col>
      <b-col>
        <b-form-input v-model="tier" placeholder="Tier (optional)"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="balance" placeholder="Balance (optional)"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="description" placeholder="Description"></b-form-input>
      </b-col>
      <b-col>
        <b-button @click="chooseRandomImage()" variant="primary">Random Image</b-button>
      </b-col>
      <b-col>
        <b-button variant="primary" @click="mintNFT()">
          <span v-if="!isMinting">Mint NFT</span>
          <b-spinner small v-if="isMinting"></b-spinner>
        </b-button>
      </b-col>
    </b-row>
    <b-container class="bv-example-row">
      <b-row class="justify-content-md-center">
        <b-col col lg="2">
          <RandomImage :show="isShowRandomImage" @ipfsUpdated="ipfsUpdate"/>
        </b-col>
      </b-row>
    </b-container>
    <UpdateNft :show="isShowUpdateNFT" :nft="nftUpdate" @cancelUpdateNFT="cancelUpdateNFT" @nftUpdated="nftUpdatedSuccess"/>
    <b-row>
      <b-table hover :items="nfts" :fields="nftsFields" :per-page="perPageNft" current-page="1">
        <template #cell(manage)="data">
          <b-button variant="outline-warning" @click="openUpdateNFT(data.item)">Edit</b-button>
        </template>
      </b-table>
      <div class="mt-3">
        <b-pagination v-model="currentNftPage" :per-page="perPageNft" :total-rows="totalNft" align="fill"></b-pagination>
      </div>
    </b-row>
  </div>
</template>

<script>
import {getNftCreated, listNFTCollections, mintNFT} from "@/services";
import {HEDERA_TRANSACTION_CHECK} from "@/services/config";
import RandomImage from "@/components/random-image";
import UpdateNft from "@/components/update-nft";

export default {
  components: {
    RandomImage,
    UpdateNft,
  },
  data() {
    return {
      isShowUpdateNFT: false,
      isShowRandomImage: false,
      urlCheckTransaction: HEDERA_TRANSACTION_CHECK,
      totalNft: 0,
      perPageNft: 5,
      currentNftPage: 1,
      nfts: [],
      nftsFields: [
        {key: 'nftType', label: 'Collection', variant: 'primary', sortable: true},
        {key: 'ownerId', label: 'Owner id', sortable: true},
        {key: 'tokenId', label: 'Token id', variant: 'primary', sortable: true},
        {key: 'tier', label: 'Tier', sortable: true},
        {key: 'balance', label: 'Balance', variant: 'primary', sortable: true},
        {key: 'ipfs', label: 'ipfs', sortable: true},
        {key: 'isStake', label: 'Is stake', sortable: true},
        {key: 'createdAt', label: 'CreatedAt', sortable: true},
        {key: 'manage', label: 'Manage', sortable: true},
      ],
      isMinting: false,
      tier: null,
      balance: null,
      receiverEmail: '',
      description: '',
      ipfs: '',
      nftTypeId: null,
      nftTypes: [{value: null, text: 'Select NFT collection', disabled: true}],
      nftUpdate: null,
    };
  },
  created() {
    this.setNftType();
    this.getNFT();
  },
  watch: {
    currentNftPage() {
      this.getNFT();
    },
  },
  methods: {
    nftUpdatedSuccess: function () {
      this.getNFT();
      this.isShowUpdateNFT = false;
    },
    cancelUpdateNFT: function () {
      this.isShowUpdateNFT = false;
    },
    openUpdateNFT: function (nft) {
      this.isShowUpdateNFT = true;
      this.nftUpdate = nft;
    },
    ipfsUpdate: function (imageUrl) {
      this.ipfs = imageUrl;
      this.isShowRandomImage = false;
    },
    chooseRandomImage: function () {
      this.isShowRandomImage = true;
    },
    getNFT: function () {
      getNftCreated(this.currentNftPage, this.perPageNft)
      .then(response => {
        this.nfts = response.data.data;
        this.totalNft = response.data.metadata.total;
        this.$notify({
          title: 'Get NFT',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Get NFT',
          text: error.response.data.message,
          type: 'warn'
        });
      })
    },
    mintNFT: function () {
      if (this.isMinting) return;
      this.isMinting = true;
      mintNFT(this.receiverEmail, this.nftTypeId, this.ipfs, this.tier, this.balance, this.description)
      .then(response => {
        this.getNFT();
        this.$notify({
          title: 'Mint NFT',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Mint NFT',
          text: error.response.data.message,
          type: 'warn'
        });
      })
      .finally(() => {
        this.isMinting = false;
      })
    },
    setNftType: function () {
      listNFTCollections(1, 100000)
      .then(response => {
        response.data.data.map(e => {
           this.nftTypes.push({value: e._id, text: `${e.nftType} - ${e.accountId} - ${e.isRegister}`})
        })
        this.$notify({
          title: 'NFT',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch((error) => {
        this.$notify({
          title: 'NFT',
          text: error.response.data.message,
          type: 'warn'
        });
      })
    }
  }
};
</script>
