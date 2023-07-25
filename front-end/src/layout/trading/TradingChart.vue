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
      ref="tradingVue"
    />
    <TFSelector @tfSelected="changeIntervalType" />
  </div>
</template>

<script>
import { TradingVue, DataCube } from 'trading-vue-js'
import {listTrades} from "@/plugins/backend";
import {notificationWithCustomMessage} from "@/plugins/notification";
const debounce = require('debounce');
import {socket} from "@/plugins/socket";
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
  },
  data() {
    return {
      data: new DataCube({
        chart: {
          tf: '1m',
          data: []
        },
      }, { aggregation: 100, auto_scroll: false }),
      a: 0,
      intervalType: '1m',
      millisecondStep: 60000,
      candleLength: 50,
      width: (window.innerWidth / 3.2),
      height: (window.innerHeight / 2.8),
    }
  },
  mounted() {
    // todo: set rage get trades for first initialize trading view
    // this.$nextTick(() =>
    //   this.$refs.tradingVue.setRange(t1, t2)
    // )
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  watch: {
    pairId() {
      this.listTrades();
    },
    intervalType() {
      this.listTrades();
    }
  },
  created: debounce(function () {
    this.listTrades();
    this.initSocketNewTradeCreated();
  }, 600),
  methods: {
    onResize() {
      this.width = window.innerWidth / 3.2
      this.height = window.innerHeight / 2.8 - 50
    },
    initSocketNewTradeCreated() {
      socket.on('NewTradeCreated', (trade) => {
        const tradeVolume = new BigNumber(trade.volume).div(new BigNumber(10).pow(18)).toFixed();
        const roundDownTradeTimestamp = Math.floor(trade.timestamp / (60 * 1000)) * 60 * 1000;
        this.data.update({
          t: roundDownTradeTimestamp,
          price: parseFloat(trade.price),
          volume: parseFloat(tradeVolume),
        })
        this.$refs.tradingVue.resetChart()
      })
    },
    changeIntervalType(tf) {
      this.intervalType = tf.intervalType;
      this.millisecondStep = tf.millisecondStep;
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
        // this.data.onrange(this.load_chunk)
      }).catch(error => {
        return notificationWithCustomMessage('warning', this, error.message);
      })
    },
    rangeChange(data) {
      console.log(data[0] - this.a);
      console.log(new Date(data[0]))
      this.a = data[0];
    },
  }
}

</script>
