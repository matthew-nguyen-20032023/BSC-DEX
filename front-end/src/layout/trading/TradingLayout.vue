<template>
  <div class="wrapper" style="background-color: rgb(18, 24, 38); display: grid; place-items: center; height: 85vh;">
    <b-container fluid>
      <b-row class="justify-content-center mb-3">
        <b-col id="ticker" class="custom-ticker-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <ticker @pairChange="pairChange" @newWalletChange="newWalletChange"/>
        </b-col>
      </b-row>

      <b-row class="justify-content-center">
        <b-col class="custom-order-book-col" id="order-book" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <order-book :pair-id="pairId" :quote-token-symbol="quoteTokenSymbol" :new-trade-created="newTradeCreated"/>
        </b-col>

        <b-col class="custom-trading-col" id="chart-trading">
          <div style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
            <TradingChart :new-trade-created="newTradeCreated" :pair-id="pairId" :trading-pair="`${baseTokenSymbol} / ${quoteTokenSymbol}`"/>
          </div>
        </b-col>
        <b-col class="custom-market-trade-col" id="market-trade" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);" cols="1">
          <b-row class="mt-1  ml-1 mr-1 mb-1">
            <market-trade :pair-id="pairId" :quote-token-symbol="quoteTokenSymbol" :new-trade-created="newTradeCreated" />
          </b-row>
        </b-col>
      </b-row>

      <b-row class="justify-content-center mt-3">
        <b-col cols="1" class="custom-trade-history-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <history
            :wallet-prop="walletAddress"
            :base-token-address="baseTokenAddress"
            :quote-token-address="quoteTokenAddress"
            :quote-token-symbol="quoteTokenSymbol"
            :base-token-symbol="baseTokenSymbol"
            :pair-id="pairId"
            :new-order-created="newOrderCreated"
            :new-trade-created="newTradeCreated"
            :order-cancelled = "orderCancelled"
          />
        </b-col>
        <b-col cols="1" class="custom-order-col" style="border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);">
          <order
            :wallet-prop="walletAddress"
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
import {socket} from "@/plugins/socket";
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

      orderCancelled: null,
      newTradeCreated: null,
      newOrderCreated: null,
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
    this.onResize();
  },500),
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  watch: {
    pairId(newVal, oldVal) {
      if (!newVal) return;
      if (oldVal) {
        socket.off(`NewOrderCreated_${oldVal}`)
        socket.off(`OrderCancelled_${oldVal}`)
        socket.off(`NewTradeCreated_${oldVal}`)
      }
      this.initSocket();
    }
  },
  methods: {
    initSocket() {
      if (!this.pairId) return;
      socket.on(`NewOrderCreated_${this.pairId}`, (order) => {
        this.newOrderCreated = order;
      })
      socket.on(`OrderCancelled_${this.pairId}`, (order) => {
        this.orderCancelled = order;
      })
      socket.on(`NewTradeCreated_${this.pairId}`, (trade) => {
        this.newTradeCreated = trade;
      })
    },
    onResize() {
      const chartTrading = document.getElementById('trading-vue-js');
      const myTrade = document.getElementById('market-trade');
      const myOrderBook = document.getElementById('order-book');
      myTrade.style.maxHeight = chartTrading.style.height;
      myOrderBook.style.maxHeight = chartTrading.style.height;
    },
    newWalletChange(newWallet) {
      this.walletAddress = newWallet;
    },
    pairChange(newPair) {
      this.baseTokenSymbol = newPair.name.split(" / ")[0];
      this.quoteTokenSymbol = newPair.name.split(" / ")[1];
      this.baseTokenAddress = newPair.baseTokenAddress;
      this.quoteTokenAddress = newPair.quoteTokenAddress;
      this.pairId = newPair._id.toString();
    },
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  padding-bottom: 7%;
  min-height: 100vh;
}

.wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(18, 24, 38);
  z-index: -1;
}

.custom-trading-col {
  flex-basis: calc((100% / 12) * 6);
  max-width: calc((100% / 12) * 6);
}

.custom-order-book-col {
  flex-basis: calc((100% / 12) * 1.3);
  max-width: calc((100% / 12) * 1.3);
}

.custom-market-trade-col {
  flex-basis: calc((100% / 12) * 1.35);
  max-width: calc((100% / 12) * 1.35);
}

.custom-ticker-col {
  flex-basis: calc((100% / 12) * 8.65);
  max-width: calc((100% / 12) * 8.65);
}

.custom-trade-history-col {
  flex-basis: calc((100% / 12) * 5.05);
  max-width: calc((100% / 12) * 5.05);
  max-height: 31vh;
}

.custom-order-col {
  flex-basis: calc((100% / 12) * 3.6);
  max-width: calc((100% / 12) * 3.6);
  max-height: 31vh;
}
</style>
