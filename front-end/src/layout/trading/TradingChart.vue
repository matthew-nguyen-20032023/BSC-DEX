<template>
  <div>
    <b-navbar class="justify-content-center" type="dark" variant="dark" style="height: 30px; top: -1px">
      <b-navbar-nav>
        <b-nav-item @click="changeIntervalType('1m','1m', 60000)">1m</b-nav-item>
        <b-nav-item @click="changeIntervalType('3m','3m', 180000)">3m</b-nav-item>
        <b-nav-item @click="changeIntervalType('5m','5m', 300000)">5m</b-nav-item>
        <b-nav-item @click="changeIntervalType('15m','15m', 900000)">15m</b-nav-item>
        <b-nav-item @click="changeIntervalType('30m','30m', 1800000)">30m</b-nav-item>
        <b-nav-item @click="changeIntervalType('1H','1h', 3600000)">1h</b-nav-item>
        <b-nav-item @click="changeIntervalType('2H','2h', 7200000)">2h</b-nav-item>
        <b-nav-item @click="changeIntervalType('4H','4h', 14400000)">4h</b-nav-item>
        <b-nav-item @click="changeIntervalType('12H','12h', 43200000)">12h</b-nav-item>
        <b-nav-item @click="changeIntervalType('1D','1d', 86400000)">1d</b-nav-item>
        <b-nav-item @click="changeIntervalType('1W', '1w', 604800000)">1w</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <trading-vue
      :data="chart"
      :width="getTradingViewWith()"
      :height="getTradingViewHeight()"
      @range-changed="rangeChange"
      :toolbar="true"
      :titleTxt="tradingPair"
      :chart-config="{ DEFAULT_LEN: candleLength }"
      :indexBased="true"
      :drawingMode="true"
      ref="tradingVue"
    />
  </div>
</template>
<style scoped>
  .navbar.bg-dark {
    background-color: rgb(18, 24, 38) !important;
    border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);
  }

  .nav-link {
    color: rgb(132, 142, 156) !important;
  }

  .nav-link:hover {
    color: yellow !important;
  }
</style>
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
  watch: {
    pairId() {
      this.listTrades();
    },
    intervalType() {
      this.listTrades();
    }
  },
  data() {
    return {
      a: 0,
      intervalType: '1m',
      millisecondStep: 60000,
      candleLength: 100,
      chart: {
        chart: {
          type: "Candles",
          data: [],
          settings: {},
          tf: '1m',
        },
        tools: [
          {
            "type": "Cursor",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAxQTFRFAAAATU1NTU1NTU1NwlMHHwAAAAR0Uk5TAOvhxbpPrUkAAAAkSURBVHicY2BgYHBggAByabxg1WoGBq2pRCk9AKUbcND43AEAufYHlSuusE4AAAAASUVORK5CYII="
          },
          {
            "type": "LineToolSegment",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAlQTFRFAAAATU1NJCQkCxcHIQAAAAN0Uk5TAP8SmutI5AAAACxJREFUeJxjYMACGAMgNAsLdpoVKi8AVe8A1QblQlWRKt0AoULw2w1zGxoAABdiAviQhF/mAAAAAElFTkSuQmCC"
          },
          {
            "type": "LineToolExtended",
            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAQMAAAD+JxcgAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFAAAATU1NkJ+rOQAAAAJ0Uk5TAP9bkSK1AAAANElEQVR4nGNggABGEMEEIlhABAeI+AASF0AlHmAqA4kzKAAx8wGQuAMKwd6AoYzBAWonAwAcLwTgNfJ3RQAAAABJRU5ErkJggg=="
          }
        ],
        "tool": "Cursor"
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
    changeIntervalType(tf, intervalType, millisecondStep) {
      this.intervalType = intervalType;
      this.millisecondStep = millisecondStep;
      this.chart.chart.tf = tf;
    },
    listTrades() {
      const toTimestamp = Date.now();
      const fromTimestamp= Date.now() - (this.millisecondStep * this.candleLength);
      listTrades(this.pairId, fromTimestamp, toTimestamp, this.intervalType).then(res => {
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
