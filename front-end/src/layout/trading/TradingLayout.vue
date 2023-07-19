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
      <b-row class="justify-content-center mb-3">
        <b-col class="custom-ticker-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <ticker @pairChange="pairChange"/>
        </b-col>
      </b-row>

      <b-row class="justify-content-center">
        <b-col style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <order-book :order-book-type="'ask'"/>
          </b-row>
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <order-book :order-book-type="'bid'"/>
          </b-row>
        </b-col>

        <b-col class="custom-trading-col">
          <div style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
            <TradingChart/>
          </div>
        </b-col>
        <b-col style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <market-trade />
          </b-row>
        </b-col>
      </b-row>

      <b-row class="justify-content-center mt-3">
        <b-col cols="1" class="custom-trade-history-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <history />
        </b-col>
        <b-col cols="1" class="custom-order-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <order
            :base-token-symbol="baseTokenSymbol"
            :base-token-address="baseTokenAddress"
            :quote-token-address="quoteTokenAddress"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>

import NoMetamask from "@/layout/trading/notifications/NoMetamask";
import {notificationApp} from "@/plugins/notification";
import SomethingWrong from "@/layout/trading/notifications/SomethingWrong";
import TradingChart from "@/layout/trading/TradingChart";
import OrderBook from "@/layout/trading/OrderBook";
import MarketTrade from "@/layout/trading/MarketTrade";
import Ticker from "@/layout/trading/Ticker";
import History from "@/layout/trading/History";
import Order from "@/layout/trading/Order";

export default {
  data() {
    return {
      walletAddress: '',
      sortWalletAddress: '',
      baseTokenSymbol: '',
      baseTokenAddress: '',
      quoteTokenAddress: '',
    }
  },
  components: {
    Order,
    History,
    Ticker,
    MarketTrade,
    TradingChart,
    OrderBook
  },
  methods: {
    pairChange(newPair) {
      this.baseTokenSymbol = newPair.name.split(" / ")[0];
      this.baseTokenAddress = newPair.baseTokenAddress;
      this.quoteTokenAddress = newPair.quoteTokenAddress;
    },
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

<style lang="scss" scoped>
.custom-trading-col {
  flex-basis: calc((100% / 12) * 4.5);
  max-width: calc((100% / 12) * 4.5);
}

.custom-ticker-col {
  flex-basis: calc((100% / 12) * 6.5);
  max-width: calc((100% / 12) * 6.5);
}

.custom-trade-history-col {
  flex-basis: calc((100% / 12) * 4.25);
  max-width: calc((100% / 12) * 4.25);
}

.custom-order-col {
  flex-basis: calc((100% / 12) * 2.25);
  max-width: calc((100% / 12) * 2.25);
}
</style>
