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
        <b-col id="ticker" class="custom-ticker-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <ticker @pairChange="pairChange"/>
        </b-col>
      </b-row>

      <b-row class="justify-content-center">
        <b-col id="order-book" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <order-book :pair-id="pairId" :order-book-type="'sell'"/>
          </b-row>
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <order-book :pair-id="pairId" :order-book-type="'buy'"/>
          </b-row>
        </b-col>

        <b-col class="custom-trading-col" id="chart-trading">
          <div style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
            <TradingChart :pair-id="pairId" :trading-pair="`${baseTokenSymbol} / ${quoteTokenSymbol}`"/>
          </div>
        </b-col>
        <b-col id="market-trade" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <market-trade :pair-id="pairId" />
          </b-row>
        </b-col>
      </b-row>

      <b-row class="justify-content-center mt-3">
        <b-col cols="1" class="custom-trade-history-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <history
            :base-token-address="baseTokenAddress"
            :quote-token-address="quoteTokenAddress"
            :pair-id="pairId"
          />
        </b-col>
        <b-col cols="1" class="custom-order-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <order
            :pair-id="pairId"
            :base-token-symbol="baseTokenSymbol"
            :quote-token-symbol="quoteTokenSymbol"
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
const debounce = require('debounce');

export default {
  data() {
    return {
      walletAddress: '',
      sortWalletAddress: '',
      baseTokenSymbol: '',
      quoteTokenSymbol: '',
      baseTokenAddress: '',
      quoteTokenAddress: '',
      pairId: '',
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
  created: debounce(function () {
    this.onResize()
  },500),
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  methods: {
    onResize() {
      const chartTrading = document.getElementById('trading-vue-js');
      const myTrade = document.getElementById('market-trade');
      const myOrderBook = document.getElementById('order-book');
      myTrade.style.maxHeight = chartTrading.style.height;
      myOrderBook.style.maxHeight = chartTrading.style.height;
    },
    pairChange(newPair) {
      this.baseTokenSymbol = newPair.name.split(" / ")[0];
      this.quoteTokenSymbol = newPair.name.split(" / ")[1];
      this.baseTokenAddress = newPair.baseTokenAddress;
      this.quoteTokenAddress = newPair.quoteTokenAddress;
      this.pairId = newPair._id.toString();
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
  flex-basis: calc((100% / 12) * 4);
  max-width: calc((100% / 12) * 4);
}

.custom-ticker-col {
  flex-basis: calc((100% / 12) * 6);
  max-width: calc((100% / 12) * 6);
}

.custom-trade-history-col {
  flex-basis: calc((100% / 12) * 3.75);
  max-width: calc((100% / 12) * 3.75);
}

.custom-order-col {
  flex-basis: calc((100% / 12) * 2.25);
  max-width: calc((100% / 12) * 2.25);
}
</style>
