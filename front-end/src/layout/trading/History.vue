<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      active-nav-item-class="font-weight-bold"
      active-tab-class="font-weight-bold text-success"
      small
      v-model="historyTab"
    >
      <b-tab title="My Orders" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Type</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Remaining</th>
              <th>Expiry</th>
              <th>Action</th>
              <th></th>
            </tr>
            <tr v-for="(data, i) in myOrders" :key="i">
              <td>{{ data.type }}</td>
              <td>{{ Math.abs(data.price).toFixed(2) }}</td>
              <td>{{ removeDecimal(data.makerAmount) }}</td>
              <td>{{ removeDecimal(data.remainingAmount) }}</td>
              <td>{{ convertExpiryToDate(data.expiry) }}</td>
              <td>
                <b-button v-if="Number(data.expiry) * 1000 > Date.now() && data.status === 'fill-able'" size="sm" variant="warning">Cancel</b-button>
                <p style="color: rgb(35, 167, 118)" v-if="data.status === 'completed'">{{ data.status.charAt(0).toUpperCase() + data.status.slice(1) }}</p>
                <p style="color: orange" v-if="Number(data.expiry) * 1000 < Date.now() && data.status === 'fill-able'">Expiry</p>
              </td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
      <b-tab title="My Trades" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Type</th>
              <th>Price</th>
              <th>Out</th>
              <th>In</th>
              <th>Time</th>
              <th>Transaction</th>
            </tr>
            <tr v-for="(data, i) in myTrades" :key="i">
              <td>{{ data.orderType }}</td>
              <td>{{ Math.abs(data.price).toFixed(2) }}</td>
              <td>{{ calculateOutTrade(data.orderType, data.price, data.volume) }}</td>
              <td>{{ calculateInTrade(data.orderType, data.price, data.volume) }}</td>
              <td>{{ convertTimestampToDate(data.timestamp) }}</td>
              <td><a style="color: rgb(35, 167, 118)" href="#">DETAIL</a></td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import {listMyTrades, listOrder} from "@/plugins/backend";
import Web3 from "web3";
import {socket} from "@/plugins/socket";
const debounce = require('debounce');
const BigNumber = require('bignumber.js');
const moment = require('moment');


export default {
  props: {
    baseTokenAddress: {
      type: String,
      required: true
    },
    quoteTokenAddress: {
      type: String,
      required: true
    },
    baseTokenSymbol: {
      type: String,
      required: true
    },
    quoteTokenSymbol: {
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
      myOrders: [],
      myTrades: [],
      historyTab: 0,
      currentAccountWallet: null,
    };
  },
  watch: {
    pairId(newVal, oldVal) {
      if (oldVal) {
        socket.off(`NewTradeCreated_${oldVal}`);
        socket.off(`NewOrderCreated_${oldVal}`);
      }
      if (this.historyTab === 0) {
        this.listMyOrder();
      }
      if (this.historyTab === 1) {
        this.listMyTrades();
      }
      if (newVal) {
        this.initSocketNewOrderCreated();
        this.initOrderMatched();
      }
    },
    historyTab(newVal, oldVal) {
      if (newVal === 0) {
        this.listMyOrder();
      }
      if (newVal === 1) {
        this.listMyTrades();
      }
    },
    currentAccountWallet(newVal, oldVal) {
      if (newVal != null) {
        this.listMyOrder();
      }
      if (newVal === 1) {
        this.listMyTrades();
      }
    }
  },
  mounted() {
  },
  created: debounce(function () {
    this.client = new Web3(window.ethereum);
    this.client.eth.getAccounts().then(res => { this.currentAccountWallet = res[0] });
    this.listMyOrder();
  }, 500),
  methods: {
    initOrderMatched() {
      socket.on(`NewTradeCreated_${this.pairId}`, (trade) => {
        if (
          trade.maker.toLowerCase() === this.currentAccountWallet.toLowerCase() ||
          trade.taker.toLowerCase() === this.currentAccountWallet.toLowerCase()
        ) {
          if (this.historyTab === 0) {
            this.listMyOrder();
          }
          if (this.historyTab === 1) {
            this.listMyTrades();
          }
        }
      });
    },
    initSocketNewOrderCreated() {
      socket.on(`NewOrderCreated_${this.pairId}`, (data) => {
        if (data.maker.toLowerCase() === this.currentAccountWallet.toLowerCase()) {
          this.listMyOrder();
        }
      });
    },
    convertExpiryToDate(expiry) {
      const dateObject = new Date(expiry * 1000);
      return moment(dateObject).local().format('YYYY/MM/DD-HH:mm:ss');
    },
    convertTimestampToDate(timestamp) {
      const dateObject = new Date(timestamp);
      return moment(dateObject).local().format('YYYY/MM/DD-HH:mm:ss');
    },
    removeDecimal(value) {
      return new BigNumber(value).div(new BigNumber(10).pow(18)).toFixed(2);
    },
    calculateOutTrade(type, price, volume) {
      if (type === 'buy') {
        const amount = new BigNumber(price).times(volume).div(new BigNumber(10).pow(18));
        return `${amount.toFixed(2)} ${this.quoteTokenSymbol}`
      } else {
        const amount = new BigNumber(volume).div(new BigNumber(10).pow(18));
        return `${amount.toFixed(2)} ${this.baseTokenSymbol}`;
      }
    },
    calculateInTrade(type, price, volume) {
      if (type === 'buy') {
        const amount = new BigNumber(volume).div(new BigNumber(10).pow(18));
        return `${amount.toFixed(2)} ${this.baseTokenSymbol}`;
      } else {
        const amount = new BigNumber(price).times(volume).div(new BigNumber(10).pow(18));
        return `${amount.toFixed(2)} ${this.quoteTokenSymbol}`
      }
    },
    listMyOrder() {
      if (this.currentAccountWallet === null) return;
      listOrder(null, this.baseTokenAddress, this.quoteTokenAddress, null, 1, 6, this.currentAccountWallet, 'desc')
      .then(res => {
        this.myOrders = res.data.data;
      })
    },
    listMyTrades() {
      listMyTrades(1, 6, this.currentAccountWallet.toLowerCase(), this.pairId)
      .then(res => {
        this.myTrades = res.data.data;
      })
    }
  }
};
</script>
