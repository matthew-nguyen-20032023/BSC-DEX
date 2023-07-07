<template>
  <div>
    <b-row class="mb-3">
      <b-nav tabs justified>
        <b-nav-item :active="isActiveManageNFT" @click="activeManageNFTCollection()">Manage NFT Collections</b-nav-item>
        <b-nav-item :active="isActiveMintNFT" @click="activeMintNFT()">Mint NFT</b-nav-item>
        <b-nav-item :active="isActiveConfigStake" @click="activeConfigStake()">Config Stake</b-nav-item>
        <b-nav-item :active="isActiveManageTransaction" @click="activeManageTransaction()">Transaction Manage</b-nav-item>
        <b-nav-item-dropdown
            id="my-nav-dropdown"
            text="Account"
            toggle-class="nav-link-custom"
            right
        >
          <b-dropdown-item @click="openWallet()">My wallet</b-dropdown-item>
          <b-dropdown-item @click="openUserUI()">User UI</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>
    </b-row>

    <Wallet :show="isShowWallet" @close="closeWallet()"/>

    <ManageNftCollection v-if="isActiveManageNFT"/>
    <ManageMintNft v-if="isActiveMintNFT"/>
    <ManageConfigStake v-if="isActiveConfigStake"/>
    <ManageTransaction v-if="isActiveManageTransaction"/>
  </div>
</template>

<script>
import ManageNftCollection from "@/components/manage-nft-collection";
import ManageMintNft from "@/components/manage-mint-nft";
import ManageConfigStake from "@/components/manage-config-stake";
import ManageTransaction from "@/components/manage-transaction";
import Wallet from "@/components/wallet";

export default {
  components: {
    ManageNftCollection,
    ManageMintNft,
    ManageConfigStake,
    ManageTransaction,
    Wallet
  },
  created() {
    if (localStorage.getItem('role') !== 'admin') window.location.href = '/';
  },
  data() {
    return {
      isShowWallet: false,
      isActiveManageNFT: true,
      isActiveMintNFT: false,
      isActiveConfigStake: false,
      isActiveManageTransaction: false,
    };
  },
  methods: {
    openUserUI: function () {
      window.location.href = '/user';
    },
    openWallet: function () {
      this.isShowWallet = true;
    },
    closeWallet: function () {
      this.isShowWallet = false;
    },
    logout: function() {
      localStorage.clear();
      window.location.href = "/";
    },
    activeManageNFTCollection: function() {
      this.isActiveManageNFT = true;
      this.isActiveMintNFT = false;
      this.isActiveConfigStake = false;
      this.isActiveManageTransaction = false;
    },
    activeMintNFT: function() {
      this.isActiveManageNFT = false;
      this.isActiveMintNFT = true;
      this.isActiveConfigStake = false;
      this.isActiveManageTransaction = false;
    },
    activeConfigStake: function() {
      this.isActiveManageNFT = false;
      this.isActiveMintNFT = false;
      this.isActiveConfigStake = true;
      this.isActiveManageTransaction = false;
    },
    activeManageTransaction: function () {
      this.isActiveManageNFT = false;
      this.isActiveMintNFT = false;
      this.isActiveConfigStake = false;
      this.isActiveManageTransaction = true;
    }
  }
};
</script>
