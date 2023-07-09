<template>
  <div class="wrapper" style="background-color: rgb(18, 24, 38)">
    <b-nav align="right" pills class="mr-3 mt-3">
      <b-button v-if="!walletAddress" @click="connectWallet()" variant="warning" class="h-100">
        <span><i class="tim-icons icon-wallet-43 mb-1"></i> Connect wallet</span>
      </b-button>
      <b-dropdown v-if="walletAddress" id="dropdown-left" variant="primary" class="h-100">
        <template #button-content>
          <span><i class="tim-icons icon-wallet-43 mb-1"></i> {{ sortWalletAddress }}</span>
        </template>
        <b-dropdown-item @click="disconnectWallet()">Disconnect</b-dropdown-item>
      </b-dropdown>
    </b-nav>
    <b-container fluid>
      <b-row class="justify-content-center">
        <b-col style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <order-book :order-book-type="'ask'"/>
          </b-row>
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <order-book :order-book-type="'bid'"/>
          </b-row>
        </b-col>
        <b-col cols="5">
          <div style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
            <TradingChart/>
          </div>
        </b-col>
        <b-col style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <market-trade />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<style lang="scss">
</style>
<script>

import NoMetamask from "@/layout/trading/notifications/NoMetamask";
import {notificationApp} from "@/plugins/notification";
import SomethingWrong from "@/layout/trading/notifications/SomethingWrong";
import TradingChart from "@/layout/trading/TradingChart";
import OrderBook from "@/layout/trading/OrderBook";
import MarketTrade from "@/layout/trading/MarketTrade";

export default {
  data() {
    return {
      walletAddress: '',
      sortWalletAddress: ''
    }
  },
  components: {
    MarketTrade,
    TradingChart,
    OrderBook
  },
  methods: {
    connectWallet() {
      if (typeof window.ethereum !== "undefined") {
        ethereum
          .request({ method: "eth_requestAccounts" })
          .then(async (accounts) => {
            this.walletAddress = accounts[0];
            this.sortWalletAddress = this.walletAddress.substring(0, 5)
              + '...'
              + this.walletAddress.substring(this.walletAddress.length - 4)
          })
          .catch(() => {
            notificationApp(this, SomethingWrong);
          });
      } else {
        notificationApp(this, NoMetamask);
      }
    },
    disconnectWallet() {
      this.walletAddress = '';
      this.sortWalletAddress = '';
    }
  }
};
</script>
