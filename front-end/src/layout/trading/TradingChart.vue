<template>
  <div>
    <trading-vue
      :data="data"
      :width="width"
      :height="height"
      @range-changed="rangeChange"
      :toolbar="true"
      :titleTxt="tradingPair"
      :chart-config="{ DEFAULT_LEN: candleLength }"
      :indexBased="true"
      :drawingMode="true"
      :timezone="currentTimezone"
      :extensions="extensions"
      skin="Alps"
      ref="tradingVue"
    />
    <TFSelector @tfSelected="changeIntervalType" />
  </div>
</template>

<script>
import Alps from "@/layout/trading/extension/Alps";
import { TradingVue, DataCube } from 'trading-vue-js'
import {listTrades} from "@/plugins/backend";
import {notificationWithCustomMessage} from "@/plugins/notification";
const debounce = require('debounce');
const BigNumber = require('bignumber.js');
import TFSelector from "@/layout/trading/tf/TFSelector";
export default {
  name: 'app',
  components: { TradingVue, TFSelector },
  props: {
    tradingPair: {
      type: String,
      required: true
    },
    pairId: {
      type: String,
      required: true
    },
    newTradeCreated: {
      required: true
    },
  },
  data() {
    return {
      extensions: [Alps],
      data: new DataCube({
        chart: {
          tf: '1m',
          data: []
        },
        offchart: [{
          type: 'BuySellBalance',
          name: 'Buy/Sell Rate',
          data: [],
          settings: {}
        }],
      }, { aggregation: 100, auto_scroll: false }),
      intervalType: '1m',
      millisecondStep: 60000,
      candleLength: 50,
      maxCandleLength: 100,
      width: (window.innerWidth / 2.05),
      height: (window.innerHeight / 2.8),
      currentCandleLength: 0,
      currentTimezone: new Date().getTimezoneOffset() / (-60),
      isProcessing: false,
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  watch: {
    pairId() {
      this.listTrades();
    },
    intervalType() {
      this.listTrades();
    },
    newTradeCreated(trade, oldVal) {
      if (!trade) return;
      if (this.candleLength < this.maxCandleLength) this.candleLength++;

      const tradeVolume = new BigNumber(trade.volume).div(new BigNumber(10).pow(18)).toFixed();
      const roundDownTradeTimestamp = Math.floor(trade.timestamp / (60 * 1000)) * 60 * 1000;
      this.data.update({
        t: roundDownTradeTimestamp,
        price: parseFloat(trade.price),
        volume: parseFloat(tradeVolume),
      })
      if (this.data.data.chart.data.length > this.currentCandleLength && !this.isProcessing) {
        this.$refs.tradingVue.resetChart();
        this.currentCandleLength = this.data.data.chart.data.length;
      } else if (this.data.data.chart.data.length < 50) {
        this.$refs.tradingVue.resetChart();
        this.isProcessing = false;
      }
    },
  },
  methods: {
    onResize() {
      this.width = window.innerWidth / 2.05
      this.height = window.innerHeight / 2.8 - 50
    },
    changeIntervalType(tf) {
      this.intervalType = tf.intervalType;
      this.millisecondStep = tf.millisecondStep;
      this.data.data.chart.tf = tf.tf;
      this.data.set('data.chart.tf', tf.tf)
    },
    listTrades() {
      const toTimestamp = Math.floor(Date.now() / (60 * 1000)) * 60 * 1000 + 60 * 1000;
      const fromTimestamp= toTimestamp - (this.millisecondStep * this.candleLength);
      listTrades(this.pairId, fromTimestamp, toTimestamp, this.intervalType).then(res => {
        this.data.data.chart.data = res.data.data.map(e => {
          e.close = parseFloat(e.close);
          e.high = parseFloat(e.high);
          e.low = parseFloat(e.low);
          e.open = parseFloat(e.open);
          e.volume = parseFloat(e.volume);
          return Object.values(e)
        });
        this.$refs.tradingVue.resetChart()
        this.currentCandleLength = this.data.data.chart.data.length;
        // this.data.onrange(this.load_chunk)
      }).catch(error => {
        return notificationWithCustomMessage('warning', this, error.message);
      })
    },
    rangeChange: debounce(function (data) {
      const fromTimestamp = Math.floor(data[0] / (60 * 1000)) * 60 * 1000 + 60 * 1000;
      const toTimestamp = this.data.data.chart.data[0][0];
      if (fromTimestamp >= toTimestamp) return;
      this.isProcessing = true;
      const lastOHLCV = JSON.parse(JSON.stringify(this.data.data.chart.data[0]));
      listTrades(this.pairId, fromTimestamp, toTimestamp, this.intervalType).then(res => {
        let isSame = false;
        for (const candle of res.data.data.reverse()) {
          candle.close = parseFloat(candle.close);
          candle.high = parseFloat(candle.high);
          candle.low = parseFloat(candle.low);
          candle.open = parseFloat(candle.open);
          candle.volume = parseFloat(candle.volume);
          if (candle.timestamp + 60 * 1000 === lastOHLCV[0] && !isSame) {
            candle.close = lastOHLCV[1];
            this.data.data.chart.data.unshift(Object.values(candle))
            isSame = true;
          } else this.data.data.chart.data.unshift(Object.values(candle))
        }
      }).catch(error => {
        return notificationWithCustomMessage('warning', this, error.message);
      })
    }, 500),
  }
}

</script>
