<template>
  <div>
    <Notifications/>
    <b-row>
      <b-col>
        <b-form-select style="overflow-y: auto" placeholder="Select an option" class="mb-3 h-75" multiple v-model="nftTypeIds" :options="nftTypes"></b-form-select>
      </b-col>
      <b-col>
        <b-button variant="primary" @click="getNFT()">
          <span v-if="!isSearching">Search</span>
          <b-spinner small v-if="isSearching"></b-spinner>
        </b-button>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col v-for="item in nfts" :key="item">
        <NftCard
            :is-stake="item.isStake"
            :nft-id="item._id"
            :description="item.description ? item.description : 'Good NFT'"
            :balance="item.balance"
            :nft-type="item.nftType"
            :tier="item.tier"
            :created-at="item.createdAt"
            :token-id="item.tokenId"
            :ipfs="item.ipfs"
            :end-time="item.endTime"
            @staked="handStakedNFT"
            @unStake="handleUnStakeNFT"
            @reloadNFT="getNFT"
        />
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <div class="mt-3">
        <b-pagination v-model="currentNftPage" :per-page="perPageNft" :total-rows="totalNft" align="fill"></b-pagination>
      </div>
    </b-row>
  </div>
</template>

<script>
import {listNFTCollections, myNft} from "@/services";
import {HEDERA_TRANSACTION_CHECK} from "@/services/config";
import NftCard from "@/components/nft-card";

export default {
  components: {NftCard},
  data() {
    return {
      urlCheckTransaction: HEDERA_TRANSACTION_CHECK,
      totalNft: 0,
      perPageNft: 5,
      currentNftPage: 1,
      nfts: [],
      isSearching: false,
      receiverEmail: '',
      ipfs: '',
      nftTypeIds: null,
      nftTypes: [{value: null, text: 'Select NFT collection'}]
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
    handleUnStakeNFT: function () {
      this.getNFT();
    },
    handStakedNFT: function (nftId) {
      for (const nft of this.nfts) {
        if (nft._id === nftId) nft.isStake = true;
      }
    },
    getNFT: function () {
      myNft(this.currentNftPage, this.perPageNft, this.nftTypeIds)
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
    setNftType: function () {
      listNFTCollections(1, 100000)
          .then(response => {
            response.data.data.map(e => {
              this.nftTypes.push({value: e.nftType, text: `${e.nftType} - ${e.accountId} - ${e.isRegister}`})
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
