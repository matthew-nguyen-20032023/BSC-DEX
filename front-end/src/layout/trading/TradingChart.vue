<template>
  <div>
    <trading-vue
      :data="getTrades()"
      :width="getTradingViewWith()"
      :height="getTradingViewHeight()"
      @range-changed="rangeChange"
      :toolbar="true"
      :titleTxt="tradingPair"
      :chart-config="{ DEFAULT_LEN: 100 }"
      :indexBased="true"
      :drawingMode="true"
      ref="tradingVue"
    />
    <br>
    <hr>
    <br>
  </div>
</template>
<script>

import TradingVue from 'trading-vue-js';

const dataObjectFromFile = require('./data.json');
delete dataObjectFromFile.offchart;
delete dataObjectFromFile.onchart;

dataObjectFromFile.chart = {
  type: "Candles",
  data: dataObjectFromFile.ohlcv,
  settings: {},
  // tf: "1D"
};
delete dataObjectFromFile.ohlcv;
export default {
  name: 'app',
  components: { TradingVue },
  data() {
    return {
      a: 0,
      tradingPair: "BTC/BUSD",
      ohlcv: []
    }
  },
  mounted() {
    // todo: set rage get trades for first initialize trading view
    // this.$nextTick(() =>
    //   this.$refs.tradingVue.setRange(t1, t2)
    // )
  },
  methods: {
    getTrades() {
      return dataObjectFromFile;
    },
    rangeChange(data) {
      console.log(data[0] - this.a);
      console.log(new Date(data[0]))
      this.a = data[0];
    },
    getTradingViewWith() {
      return window.innerWidth / 2.8;
    },
    getTradingViewHeight() {
      return window.innerHeight / 1.97;
    }
  }
}

</script>
