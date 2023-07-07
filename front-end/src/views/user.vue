<template>
  <div>
    <b-row class="mb-3">
      <b-nav tabs justified>
        <b-nav-item :active="isActiveMyNft" @click="activeMyNft()">My NFT</b-nav-item>
        <b-nav-item :active="isActiveManageTransaction" @click="activeManageTransaction()">Transaction Manage</b-nav-item>
        <b-nav-item-dropdown
            id="my-nav-dropdown"
            text="Account"
            toggle-class="nav-link-custom"
            right
        >
          <b-dropdown-item @click="openWallet()">My wallet</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item @click="logout()">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-nav>
    </b-row>

    <Wallet :show="isShowWallet" @close="closeWallet()"/>
    <ManageTransaction v-if="isActiveManageTransaction"/>
    <MyNft v-if="isActiveMyNft"/>
  </div>
</template>

<script>
import MyNft from "@/components/my-nft";
import ManageTransaction from "@/components/manage-transaction";
import Wallet from "@/components/wallet";

export default {
  components: {
    ManageTransaction,
    Wallet,
    MyNft
  },
  created() {
    if (!localStorage.getItem('role')) window.location.href = '/';
  },
  data() {
    return {
      isShowWallet: false,
      isActiveManageTransaction: false,
      isActiveMyNft: true,
    };
  },
  methods: {
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
    activeManageTransaction: function () {
      this.isActiveMyNft = false;
      this.isActiveManageTransaction = true;
    },
    activeMyNft: function () {
      this.isActiveMyNft = true;
      this.isActiveManageTransaction = false;
    }
  }
};
</script>
