<template>
  <div>
    <b-navbar class="justify-content-center" type="dark" variant="dark" style="height: 30px; top: -1px">
      <b-navbar-nav>
        <b-nav-item @click="changeIntervalType('1m')">1m</b-nav-item>
        <b-nav-item @click="changeIntervalType('3m')">3m</b-nav-item>
        <b-nav-item @click="changeIntervalType('5m')">5m</b-nav-item>
        <b-nav-item @click="changeIntervalType('15m')">15m</b-nav-item>
        <b-nav-item @click="changeIntervalType('30m')">30m</b-nav-item>
        <b-nav-item @click="changeIntervalType('1h')">1h</b-nav-item>
        <b-nav-item @click="changeIntervalType('1h')">2h</b-nav-item>
        <b-nav-item @click="changeIntervalType('1h')">4h</b-nav-item>
        <b-nav-item @click="changeIntervalType('1h')">8h</b-nav-item>
        <b-nav-item @click="changeIntervalType('1h')">15h</b-nav-item>
        <b-nav-item @click="changeIntervalType('1h')">1d</b-nav-item>
        <b-nav-item-dropdown text="More" right>
          <b-dropdown-item @click="changeIntervalType('3d')">3d</b-dropdown-item>
          <b-dropdown-item @click="changeIntervalType('1w')">1w</b-dropdown-item>
          <b-dropdown-item @click="changeIntervalType('1mth')">1month</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>

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
      chart: {
        chart: {
          type: "Candles",
          data: [],
          settings: {},
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
    changeIntervalType(intervalType) {
      this.intervalType = intervalType;
    },
    listTrades() {
      listTrades(this.pairId, 1689870748784, 1689870983259, this.intervalType).then(res => {
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
