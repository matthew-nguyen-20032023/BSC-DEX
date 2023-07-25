<template>
  <table style="font-size: 12px">
    <tr style="color: rgb(132, 142, 156);">
      <th>Price</th>
      <th>Amount</th>
      <th>Time</th>
    </tr>
    <tr v-for="(trade, index) in data" :key="index">
      <td :style="getTradeColor(trade.orderType)">{{ trade.price }}</td>
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
import {socket} from "@/plugins/socket";

export default {
  props: {
    pairId: {
      type: String,
      required: true
    },
  },
  watch: {
    pairId() {
      this.listMarket();
    }
  },
  created: debounce(function () {
    this.listMarket();
    this.initSocketTradeCreated()
  }, 200),
  data() {
    return {
      data: [],
    };
  },
  mounted() {},
  methods: {
    initSocketTradeCreated() {
      socket.on("NewTradeCreated", (data) => {
        this.data.unshift(data);
        if (this.data.length > 20) {
          this.data.pop()
        }
      })
    },
    listMarket() {
      this.data = [];
      listCurrentOriginTrades(this.pairId, 20).then(res => {
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
      return new BigNumber(volume).div(new BigNumber(10).pow(18)).toFixed();
    }
  }
};
</script>

<style>
/* Add your component styles here */
</style>
