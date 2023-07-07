<template>
  <b-card
      no-body
      style="max-width: 20rem;"
      :img-src="ipfs"
      img-alt="Image"
      img-top
  >
    <Notifications/>
    <StakeNft :show="isOpenStake" :nft-id="nftId" @staked="handleNFTStaked()" @close="closeStake"/>
    <template #header>
      <b-card-title>Collection: <b-badge :variant="getVariant()">{{ nftType }}</b-badge></b-card-title>
      <b-card-title>Id: <b-badge :variant="getVariant()">{{ tokenId }}</b-badge></b-card-title>
    </template>

    <b-card-body>
      <b-card-title>Tier: <b-badge :variant="getVariant()">{{ tier }}</b-badge></b-card-title>
      <b-card-title>Balance: <b-badge :variant="getVariant()">{{ balance }}C</b-badge></b-card-title>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item>Created At {{ createdAt }}</b-list-group-item>
      <b-list-group-item>{{ description }}</b-list-group-item>
      <b-list-group-item v-if="isStake && remaining !== `0d 0h 0m 0s`">Remaining time <span><b-badge small :variant="getVariant()">{{ remaining }}</b-badge></span></b-list-group-item>
    </b-list-group>

    <b-card-body>
      <b-button-group class="w-100">
        <b-button variant="outline-primary" v-if="!isStake" @click="openStake()">Stake</b-button>

        <b-button variant="outline-danger" v-if="isStake && remaining !== `0d 0h 0m 0s`" @click="unStake(true)">
          <span v-if="!isProcessUnStake">Un Stake</span>
          <b-spinner small v-if="isProcessUnStake"></b-spinner>
        </b-button>
        <b-button variant="outline-success" v-if="isStake && remaining === `0d 0h 0m 0s`" @click="unStake()">
          <span v-if="!isProcessUnStake">Get Reward</span>
          <b-spinner small v-if="isProcessUnStake"></b-spinner>
        </b-button>
      </b-button-group>
    </b-card-body>
  </b-card>
</template>

<script>
import StakeNft from "@/components/stake-nft";
import {unStakeNFT} from "@/services";

export default {
  components: {
    StakeNft
  },
  props: {
    nftId: String,
    endTime: Number,
    description: String,
    isStake: Boolean,
    nftType: String,
    tokenId: String,
    tier: String,
    balance: Number,
    ipfs: String,
    createdAt: String,
  },
  data() {
    return {
      remaining: '0d 0h 0m 0s',
      isProcessUnStake: false,
      isOpenStake: false
    }
  },
  created() {
    this.checkTime();
  },
  methods: {
    getVariant: function () {
      if (this.balance <= 50) return 'secondary';
      if (this.balance <= 100) return 'info';
      if (this.balance <= 150) return 'success';
      if (this.balance <= 200) return 'primary';
      if (this.balance <= 300) return 'warning';
      if (this.balance <= 500) return 'danger';
      return 'dark';
    },
    checkTime: function () {
      if (!this.isStake || this.endTime - new Date().getTime() < 0) return;
      const checking = setInterval(() => {
        const now = new Date().getTime();
        const distance = this.endTime - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        this.remaining =  days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ";

        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(checking);
          this.remaining = '0d 0h 0m 0s';
        }
      }, 1000)
    },
    handleNFTStaked: function () {
      this.$emit('staked', this.nftId);
      this.isOpenStake = false;
      this.$emit('reloadNFT');
    },
    openStake: function () {
      this.isOpenStake = true;
    },
    closeStake: function () {
      this.isOpenStake = false;
    },
    unStake: function (isAlert) {
      if (isAlert) return confirm(`Your NFT balance will be decreased because of un stake early. Do you want to continue?`)
      if (this.isProcessUnStake) return;
      this.isProcessUnStake = true;
      unStakeNFT(this.nftId)
      .then(response => {
        this.$emit('unStake');
        this.$notify({
          title: 'Un Stake',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Un Stake',
          text: error.response.data.message,
          type: 'warn'
        });
      })
      .finally(() => {
        this.isProcessUnStake = false;
      })
    }
  }
}
</script>
