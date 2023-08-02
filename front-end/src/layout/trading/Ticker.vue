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
      <th v-if="change >= 0" style="color: rgb(35, 167, 118)">
        {{ Math.abs(change) }}
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="high >= 0" style="color: rgb(35, 167, 118)">
        {{ Math.abs(high) }}
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="low >= 0" style="color: rgb(35, 167, 118)">
        {{ Math.abs(low) }}
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="volume >= 0" style="color: rgb(35, 167, 118)">
        {{ removeDecimal(volume) }}
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>

      <th v-if="change < 0" style="color: rgb(229, 65, 80)">
        {{ Math.abs(change) }}
         <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="high < 0" style="color: rgb(229, 65, 80)">
        {{ Math.abs(high) }}
         <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': false, 'growing': false}"
        />
      </th>
      <th v-if="low < 0" style="color: rgb(229, 65, 80)">
        {{ Math.abs(low) }}
         <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': false, 'growing': false}"
        />
      </th>
      <th v-if="volume < 0" style="color: rgb(229, 65, 80)">
        {{ removeDecimal(volume) }}
        <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': false, 'growing': false}"
        />
      </th>
    </tr>
  </table>
</template>

<script>
import {getTicker24H, listPair} from "@/plugins/backend";
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
      this.getTicker();
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
    async getTicker() {
      if (this.pairId === null) return;
      const ticker = await getTicker24H(this.pairId);
      this.change = ticker.data.data.change;
      this.high = ticker.data.data.high;
      this.low = ticker.data.data.low;
      this.volume = ticker.data.data.volume;
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
