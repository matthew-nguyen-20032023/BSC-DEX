<template>
  <table style="font-size: 12px;" class="mt-1">
    <tr style="color: rgb(132, 142, 156);">
      <th>Price ({{quoteTokenSymbol}})</th>
      <th>Amount</th>
      <th>Time</th>
    </tr>
    <tr v-for="(trade, index) in data" :key="index">
      <td :style="getTradeColor(trade.orderType)">{{ Math.abs(trade.price).toFixed(2) }}</td>
      <td>{{ convertVolume(trade.volume) }}</td>
      <td>{{ convertToTime(trade.timestamp) }}</td>
    </tr>
  </table>
</template>

<script>
import {listCurrentOriginTrades} from "@/plugins/backend";
import {notificationWithCustomMessage} from "@/plugins/notification";
const BigNumber = require("bignumber.js");
const moment = require('moment');
const debounce = require('debounce');

export default {
  props: {
    pairId: {
      type: String,
      required: true
    },
    quoteTokenSymbol: {
      type: String,
      required: true
    },
    newTradeCreated: {
      required: true
    },
  },
  watch: {
    pairId() {
      this.listMarket();
    },
    newTradeCreated(newVal, oldVal) {
      if (!newVal) return;
      this.data.unshift(newVal);
      if (this.data.length > this.defaultLengthDisplay) {
        this.data.pop()
      }
    },
  },
  created: debounce(function () {
    this.listMarket();
  }, 200),
  data() {
    return {
      data: [],
      defaultLengthDisplay: window.innerHeight < 1100 ? 14 : 19,
    };
  },
  mounted() {},
  methods: {
    listMarket() {
      this.data = [];
      listCurrentOriginTrades(this.pairId, this.defaultLengthDisplay).then(res => {
        this.data = res.data.data
      }).catch(error => {
        return notificationWithCustomMessage('warning', this, error.message);
      })
    },
    getTradeColor(type) {
      return type === 'buy' ? 'color: #23a776' : 'color: #e54150';
    },
    convertToTime(timestamp) {
      const dateObject = new Date(timestamp);
      return moment(dateObject).format('HH:mm:ss');
    },
    convertVolume(volume) {
      return new BigNumber(volume).div(new BigNumber(10).pow(18)).toFixed(2);
    }
  }
};
</script>

<style>
/* Add your component styles here */
</style>
