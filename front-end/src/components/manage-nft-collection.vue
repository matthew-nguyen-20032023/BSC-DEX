<template>
  <div class="container-md">
    <Notifications/>
    <hr>
    <b-row class="mb-3 w-100">
      <b-col>
        <b-form-input v-model="nftType" placeholder="Collection"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="nftName" placeholder="Collection Name"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="nftSymbol" placeholder="Symbol"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="tier" placeholder="Default Tier"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="defaultBalance" placeholder="Default Balance"></b-form-input>
      </b-col>
      <b-col>
        <b-button variant="primary" @click="createNewTypeNFT()">
          <span v-if="!isCreatingToken">Create new collection</span>
          <b-spinner small v-if="isCreatingToken"></b-spinner>
        </b-button>
      </b-col>
    </b-row>
    <hr>
    <b-table hover :items="nftItems" :fields="fields" :per-page="perPage" current-page="1">
      <template #cell(accountId)="row">
        <a :href="urlCheckToken + row.value" target="_blank">{{row.value}}</a>
      </template>
      <template #cell(isRegister)="data">
        <b-button v-if="!data.item.isRegister" variant="outline-primary" @click="registerNFTCollection(data.item._id)">Register</b-button>
        <b-badge small v-if="data.item.isRegister" variant="success">Active</b-badge>
      </template>
    </b-table>
    <div class="mt-3">
      <b-pagination v-model="currentPage" :per-page="perPage" :total-rows="totalItem" align="fill"></b-pagination>
    </div>
  </div>
</template>

<script>
import {createNewNFTType, listNFTCollections, registerNFTCollection} from "@/services";
import {HEDERA_TOKEN_CHECK} from "@/services/config";
export default {
  data() {
    return {
      isRegisteringNFT: false,
      isCreatingToken: false,
      urlCheckToken: HEDERA_TOKEN_CHECK,
      nftType: '',
      nftName: '',
      nftSymbol: '',
      tier: '',
      defaultBalance: '',
      perPage: 5,
      currentPage: 1,
      totalItem: 0,
      items: [],
      fields: [
        {key: '_id', label: 'Id', sortable: true},
        {key: 'nftType', label: 'Collection', variant: 'primary', sortable: true},
        {key: 'name', label: 'Collection name', sortable: true},
        {key: 'symbol', label: 'Symbol', sortable: true},
        {key: 'accountId', label: 'Address', sortable: true},
        {key: 'tier', label: 'Default tier', sortable: true},
        {key: 'defaultBalance', label: 'Default balance', sortable: true},
        {key: 'isRegister', label: 'Is register', variant: 'primary', sortable: true},
        {key: 'createdAt', label: 'Created At', sortable: true},
        {key: 'updatedAt', label: 'Updated At', sortable: true},
      ],
    };
  },
  created() {
    this.getNFTCollections();
  },
  computed: {
    nftItems() {
      return this.items;
    }
  },
  watch: {
    currentPage() {
      this.getNFTCollections();
    },
  },
  methods: {
    registerNFTCollection: function (nftTypeId) {
      if (this.isRegisteringNFT) return;
      this.isRegisteringNFT = true;
      registerNFTCollection(nftTypeId)
      .then(response => {
        for (const item of this.items) {
          if (item._id === nftTypeId) item.isRegister = true;
        }
        this.$notify({
          title: 'NFT Collection',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'NFT Collection',
          text: error.response.data.message,
          type: 'warn'
        });
      })
      .finally(() => {
        this.isRegisteringNFT = false;
      })
    },
    createNewTypeNFT: function () {
      if (this.isCreatingToken) return;
      this.isCreatingToken = true;
      createNewNFTType(
          this.nftType,
          this.nftName,
          this.nftSymbol,
          this.tier,
          this.defaultBalance,
      )
      .then(response => {
        this.$notify({
          title: 'Collection',
          text: response.data.message,
          type: 'success'
        });
        this.getNFTCollections(this.currentPage, this.perPage);
      })
      .catch(error => {
        this.$notify({
          title: 'Collection',
          text: error.response.data.message,
          type: 'warn'
        });
      })
      .finally(() => {
        this.isCreatingToken = false;
      })
    },
    getNFTCollections: function() {
      listNFTCollections(this.currentPage, this.perPage)
      .then(response => {
        this.items = response.data.data;
        this.totalItem = response.data.metadata.total;
        this.$notify({
          title: 'Collection',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Collection',
          text: error.response.data.message,
          type: 'warn'
        });
      })
    },
  }
};
</script>
