<template>
  <table style="font-size: 12px; width: 100%;">
    <tr style="color: rgb(132, 142, 156)">
      <th>Trading Pair</th>
      <th>24h Change</th>
      <th>24h High</th>
      <th>24h Low</th>
      <th>24h Volume</th>
    </tr>
    <tr>
      <th>
        <select style="color: rgb(132, 142, 156); border-radius: 5px" v-model="pairSelected">
          <option v-for="(data, i) in optionsPair" :key="i" :value="data.value">{{ data.text }}</option>
        </select>
      </th>
      <th v-if="change >= 0" style="color: rgb(35, 167, 118)">{{ Math.abs(change) }}</th>
      <th v-if="high >= 0" style="color: rgb(35, 167, 118)">{{ Math.abs(high) }}</th>
      <th v-if="low >= 0" style="color: rgb(35, 167, 118)">{{ Math.abs(low) }}</th>
      <th v-if="volume >= 0" style="color: rgb(35, 167, 118)">{{ removeDecimal(volume) }}</th>

      <th v-if="change < 0" style="color: rgb(229, 65, 80)">{{ Math.abs(change) }}</th>
      <th v-if="high < 0" style="color: rgb(229, 65, 80)">{{ Math.abs(high) }}</th>
      <th v-if="low < 0" style="color: rgb(229, 65, 80)">{{ Math.abs(low) }}</th>
      <th v-if="volume < 0" style="color: rgb(229, 65, 80)">{{ removeDecimal(volume) }}</th>
    </tr>
  </table>
</template>

<script>
import { listPair } from "@/plugins/backend";
import {socket} from "@/plugins/socket";
import BigNumber from "bignumber.js";

export default {
  props: {},
  data() {
    return {
      pairId: null,
      pairSelected: null,
      optionsPair: [],
      change: "0",
      low: "0",
      high: "0",
      volume: "0",
    };
  },
  created() {
    this.listPair();
    this.initTicker24h();
  },
  watch: {
    pairSelected(newVal, oldVal) {
      if (newVal !== null) {
        this.$emit('pairChange', newVal);
      }
    }
  },
  mounted() {},
  methods: {
    initTicker24h() {
      socket.on("TickerChange", (ticker) => {
        if (ticker.pairId === this.pairId) {
          this.change = ticker.change;
          this.high = ticker.high;
          this.low = ticker.low;
          this.volume = ticker.volume;
        } else {}
      });
    },
    removeDecimal(value) {
      return new BigNumber(Math.abs(value)).div(new BigNumber(10).pow(18)).toFixed();
    },
    listPair() {
      listPair().then(res => {
        this.pairSelected = res.data.data[0];
        this.pairId = this.pairSelected._id.toString();
        this.$emit('pairChange', this.pairSelected);
        this.optionsPair = res.data.data.map(e => {
          return { value: e, text: e.name }
        })
      })
    },
  }
};
</script>

<style scoped>
</style>
