<template>
  <div>
    <trading-vue
      :data="chart"
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
import {listTrades} from "@/plugins/backend";
import {notificationWithCustomMessage} from "@/plugins/notification";
const debounce = require('debounce');

export default {
  name: 'app',
  components: { TradingVue },
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
      a: 0,
      chart: {
        chart: {
          type: "Candles",
          data: [],
          settings: {},
        }
      }
    }
  },
  mounted() {
    // todo: set rage get trades for first initialize trading view
    // this.$nextTick(() =>
    //   this.$refs.tradingVue.setRange(t1, t2)
    // )
  },
  created: debounce(function () {
    this.listTrades();
  }, 600),
  methods: {
    listTrades() {
      listTrades(this.pairId, 1689870748784, 1689870983259, "1m").then(res => {
        this.chart.chart.data = res.data.data.map(e => {
          e.close = Number(e.close);
          e.high = Number(e.high);
          e.low = Number(e.low);
          e.open = Number(e.open);
          e.volume = Number(e.volume);
          return Object.values(e)
        });
      }).catch(error => {
        return notificationWithCustomMessage('warning', this, error.message);
      })
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
