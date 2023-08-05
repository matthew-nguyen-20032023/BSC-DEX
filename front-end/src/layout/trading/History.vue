<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      active-nav-item-class="font-weight-bold"
      active-tab-class="font-weight-bold text-success"
      small
      v-model="historyTab"
    >
      <b-tab title="Open Orders" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Type</th>
              <th>Amount ({{baseTokenSymbol}})</th>
              <th>Price</th>
              <th>Remaining</th>
              <th>Expiry</th>
              <th>Action</th>
              <th></th>
            </tr>
            <tr v-for="(data, i) in myOpenOrders" :key="i">
              <td>{{ data.type }}</td>
              <td>{{ data.type === 'buy' ? removeDecimal(data.takerAmount) : removeDecimal(data.makerAmount) }}</td>
              <td>{{ Math.abs(data.price).toFixed(2) }}</td>
              <td>{{ removeDecimal(data.remainingAmount) }}</td>
              <td>{{ convertExpiryToDate(data.expiry) }}</td>
              <td>
                <b-badge v-if="Number(data.expiry) * 1000 > Date.now() && data.status === 'fill-able'" variant="warning">Cancel</b-badge>
                <p style="color: rgb(35, 167, 118)" v-if="data.status === 'completed'">{{ data.status.charAt(0).toUpperCase() + data.status.slice(1) }}</p>
                <p style="color: orange" v-if="Number(data.expiry) * 1000 < Date.now() && data.status === 'fill-able'">Expiry</p>
              </td>
            </tr>
            <tr>
              <th colspan="6">
                <b-pagination
                  v-if="totalMyOpenOrder > limitMyOpenOrder"
                  class="mt-3"
                  align="center"
                  v-model="currentMyOpenOrderPage"
                  :total-rows="totalMyOpenOrder"
                  :per-page="limitMyOpenOrder"
                  aria-controls="my-table"
                  first-text="First"
                  prev-text="Prev"
                  next-text="Next"
                  last-text="Last"
                >
                  <template #first-text><span class="text-success">First</span></template>
                  <template #prev-text><span class="text-success">Prev</span></template>
                  <template #next-text><span class="text-danger">Next</span></template>
                  <template #last-text><span class="text-danger">Last</span></template>
                </b-pagination>
              </th>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
      <b-tab title="Order History" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Type</th>
              <th>Amount ({{baseTokenSymbol}})</th>
              <th>Price</th>
              <th>Remaining</th>
              <th>Expiry</th>
              <th>Action</th>
              <th></th>
            </tr>
            <tr v-for="(data, i) in myOrders" :key="i">
              <td>{{ data.type }}</td>
              <td>{{ data.type === 'buy' ? removeDecimal(data.takerAmount) : removeDecimal(data.makerAmount) }}</td>
              <td>{{ Math.abs(data.price).toFixed(2) }}</td>
              <td>{{ removeDecimal(data.remainingAmount) }}</td>
              <td>{{ convertExpiryToDate(data.expiry) }}</td>
              <td>
                <b-badge v-if="Number(data.expiry) * 1000 > Date.now() && data.status === 'fill-able'" variant="warning">Cancel</b-badge>
                <p style="color: rgb(35, 167, 118)" v-if="data.status === 'completed'">{{ data.status.charAt(0).toUpperCase() + data.status.slice(1) }}</p>
                <p style="color: orange" v-if="Number(data.expiry) * 1000 < Date.now() && data.status === 'fill-able'">Expiry</p>
              </td>
            </tr>
            <tr>
              <th colspan="6">
                <b-pagination
                  v-if="totalMyOrder > limitMyOrder"
                  class="mt-3"
                  align="center"
                  v-model="currentMyOrderPage"
                  :total-rows="totalMyOrder"
                  :per-page="limitMyOrder"
                  aria-controls="my-table"
                  first-text="First"
                  prev-text="Prev"
                  next-text="Next"
                  last-text="Last"
                >
                  <template #first-text><span class="text-success">First</span></template>
                  <template #prev-text><span class="text-success">Prev</span></template>
                  <template #next-text><span class="text-danger">Next</span></template>
                  <template #last-text><span class="text-danger">Last</span></template>
                </b-pagination>
              </th>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
      <b-tab title="Trade History" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Type</th>
              <th>Price</th>
              <th>Amount In</th>
              <th>Amount Out</th>
              <th>Time</th>
              <th>Transaction</th>
            </tr>
            <tr v-for="(data, i) in myTrades" :key="i">
              <td>{{ data.orderType }}</td>
              <td>{{ Math.abs(data.price).toFixed(2) }}</td>
              <td>{{ calculateAmountIn(data.orderType, data.price, data.volume, data.maker) }}</td>
              <td>{{ calculateAmountOut(data.orderType, data.price, data.volume, data.maker) }}</td>
              <td>{{ convertTimestampToDate(data.timestamp) }}</td>
              <td><b-badge style="color: rgb(35, 167, 118)" href="#">Detail</b-badge></td>
            </tr>
            <th colspan="6">
              <b-pagination
                v-if="totalMyTrade > limitMyTrade"
                class="mt-3"
                align="center"
                v-model="currentMyTradePage"
                :total-rows="totalMyTrade"
                :per-page="limitMyTrade"
                aria-controls="my-table"
                first-text="First"
                prev-text="Prev"
                next-text="Next"
                last-text="Last"
              >
                <template #first-text><span class="text-success">First</span></template>
                <template #prev-text><span class="text-success">Prev</span></template>
                <template #next-text><span class="text-danger">Next</span></template>
                <template #last-text><span class="text-danger">Last</span></template>
              </b-pagination>
            </th>
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
      historyTab: 0,
      currentAccountWallet: null,

      myOpenOrders: [],
      currentMyOpenOrderPage: 1,
      totalMyOpenOrder: 1,
      limitMyOpenOrder: 7,

      myOrders: [],
      currentMyOrderPage: 1,
      totalMyOrder: 1,
      limitMyOrder: 7,

      myTrades: [],
      currentMyTradePage: 1,
      totalMyTrade: 1,
      limitMyTrade: 7,
    };
  },
  watch: {
    pairId(newVal, oldVal) {
      if (oldVal) {
        socket.off(`NewTradeCreated_${oldVal}`);
        socket.off(`NewOrderCreated_${oldVal}`);
      }
      if (this.historyTab === 0) {
        this.listMyOpenOrder();
      }
      if (this.historyTab === 1) {
        this.listMyOrder();
      }
      if (this.historyTab === 2) {
        this.listMyTrades();
      }
      if (newVal) {
        this.initSocketNewOrderCreated();
        this.initOrderMatched();
      }
    },
    currentMyOrderPage() {
      this.listMyOrder();
    },
    currentMyOpenOrderPage() {
      this.listMyOpenOrder();
    },
    currentMyTradePage() {
      this.listMyTrades();
    },
    historyTab(newVal, oldVal) {
      if (newVal === 0) {
        this.listMyOpenOrder();
      }
      if (newVal === 1) {
        this.listMyOrder();
      }
      if (newVal === 2) {
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
  created() {
    this.client = new Web3(window.ethereum);
    this.client.eth.getAccounts().then(res => { this.currentAccountWallet = res[0] });
  },
  methods: {
    initOrderMatched() {
      socket.on(`NewTradeCreated_${this.pairId}`, (trade) => {
        if (
          trade.maker.toLowerCase() === this.currentAccountWallet.toLowerCase() ||
          trade.taker.toLowerCase() === this.currentAccountWallet.toLowerCase()
        ) {
          if (this.historyTab === 1) {
            this.listMyOrder();
          }
          if (this.historyTab === 2) {
            this.listMyTrades();
          }
        }
      });
    },
    initSocketNewOrderCreated() {
      socket.on(`NewOrderCreated_${this.pairId}`, (data) => {
        if (data.maker.toLowerCase() === this.currentAccountWallet.toLowerCase()) {
          if (this.historyTab === 0) {
            this.listMyOpenOrder();
          }
          if (this.historyTab === 1) {
            this.listMyOrder();
          }
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
    calculateAmountOut(type, price, volume, maker) {
      const baseAmount = `${new BigNumber(volume).div(new BigNumber(10).pow(18)).toFixed(2)} ${this.baseTokenSymbol}`;
      const quoteAmount = `${new BigNumber(volume).times(price).div(new BigNumber(10).pow(18)).toFixed(2)} ${this.quoteTokenSymbol}`;

      if (maker.toLowerCase() === this.currentAccountWallet.toLowerCase() && type === 'buy') return quoteAmount;
      if (maker.toLowerCase() === this.currentAccountWallet.toLowerCase() && type === 'sell') return baseAmount;

      if (maker.toLowerCase() !== this.currentAccountWallet.toLowerCase() && type === 'buy') return baseAmount;
      if (maker.toLowerCase() !== this.currentAccountWallet.toLowerCase() && type === 'sell') return quoteAmount;
    },
    calculateAmountIn(type, price, volume, maker) {
      const baseAmount = `${new BigNumber(volume).div(new BigNumber(10).pow(18)).toFixed(2)} ${this.baseTokenSymbol}`;
      const quoteAmount = `${new BigNumber(volume).times(price).div(new BigNumber(10).pow(18)).toFixed(2)} ${this.quoteTokenSymbol}`;

      if (maker.toLowerCase() === this.currentAccountWallet.toLowerCase() && type === 'buy') return baseAmount;
      if (maker.toLowerCase() === this.currentAccountWallet.toLowerCase() && type === 'sell') return quoteAmount;

      if (maker.toLowerCase() !== this.currentAccountWallet.toLowerCase() && type === 'buy') return quoteAmount;
      if (maker.toLowerCase() !== this.currentAccountWallet.toLowerCase() && type === 'sell') return baseAmount;
    },
    listMyOpenOrder() {
      if (this.currentAccountWallet === null) return;
      listOrder(
        null, this.baseTokenAddress, this.quoteTokenAddress, null, this.currentMyOpenOrderPage,
        this.limitMyOrder, this.currentAccountWallet, 'desc', 'fill-able'
      )
        .then(res => {
          this.myOpenOrders = res.data.data;
          this.totalMyOpenOrder = res.data.metadata.total;
        })
    },
    listMyOrder() {
      if (this.currentAccountWallet === null) return;
      listOrder(null, this.baseTokenAddress, this.quoteTokenAddress, null, this.currentMyOrderPage, this.limitMyOrder, this.currentAccountWallet, 'desc')
      .then(res => {
        this.myOrders = res.data.data;
        this.totalMyOrder = res.data.metadata.total;
      })
    },
    listMyTrades() {
      listMyTrades(this.currentMyTradePage, this.limitMyTrade, this.currentAccountWallet.toLowerCase(), this.pairId)
      .then(res => {
        this.myTrades = res.data.data;
        this.totalMyTrade = res.data.metadata.total;
      })
    }
  }
};
</script>
