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
                <b-badge
                  v-if="Number(data.expiry) * 1000 > Date.now() && data.status === 'fill-able'"
                  variant="warning" @click="cancelOrder(data)"
                  :style="{ cursor: 'pointer' }"
                >
                  Cancel
                </b-badge>
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
                <p style="color: #5be8be" v-if="Number(data.expiry) * 1000 > Date.now() && data.status === 'fill-able'">Filling</p>
                <p style="color: orange" v-if="data.status === 'cancelled'">Cancelled</p>
                <p style="color: rgb(35, 167, 118)" v-if="data.status === 'completed'">{{ data.status.charAt(0).toUpperCase() + data.status.slice(1) }}</p>
                <p style="color: #fd5d93" v-if="Number(data.expiry) * 1000 < Date.now() && data.status === 'fill-able'">Expiry</p>
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
import {LimitOrder} from "@0x/protocol-utils";
import {exchangeABI} from "@/libs/abi/exchange.ts";
const debounce = require('debounce');
const BigNumber = require('bignumber.js');
const moment = require('moment');


export default {
  props: {
    walletProp: {
      type: String,
      required: true
    },
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
    orderCancelled: {
      required: true
    },
    newTradeCreated: {
      required: true
    },
    newOrderCreated: {
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
    orderCancelled(newVal, oldVal) {
      if (!newVal) return;
      this.changeTab();
    },
    newTradeCreated(newVal, oldVal) {
      if (!newVal) return;
      this.changeTab();
    },
    newOrderCreated(newVal, oldVal) {
      if (!newVal) return;
      this.changeTab();
    },
    walletProp(newWallet, oldWallet) {
      if (newWallet) {
        this.currentAccountWallet = newWallet;
        this.changeTab();
      }
    },
    pairId() {
      this.changeTab();
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
    historyTab() {
      this.changeTab();
    },
  },
  mounted() {
  },
  created() {
    this.client = new Web3(window.ethereum);
    this.zeroExContract = new this.client.eth.Contract(exchangeABI, process.env.VUE_APP_ZERO_CONTRACT_ADDRESS);
  },
  methods: {
    changeTab() {
      if (this.historyTab === 0) {
        this.listMyOpenOrder();
      }
      if (this.historyTab === 1) {
        this.listMyOrder();
      }
      if (this.historyTab === 2) {
        this.listMyTrades();
      }
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
      if (!this.currentAccountWallet) return;
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
      if (!this.currentAccountWallet) return;
      listOrder(null, this.baseTokenAddress, this.quoteTokenAddress, null, this.currentMyOrderPage, this.limitMyOrder, this.currentAccountWallet, 'desc')
      .then(res => {
        this.myOrders = res.data.data;
        this.totalMyOrder = res.data.metadata.total;
      })
    },
    listMyTrades() {
      if (!this.currentAccountWallet) return;
      listMyTrades(this.currentMyTradePage, this.limitMyTrade, this.currentAccountWallet.toLowerCase(), this.pairId)
      .then(res => {
        this.myTrades = res.data.data;
        this.totalMyTrade = res.data.metadata.total;
      })
    },
    async cancelOrder(order) {
      const limitOrder = new LimitOrder({
        chainId: Number(order.chainId),
        verifyingContract: order.verifyingContract,
        maker: order.maker,
        taker: order.taker,
        makerToken: order.makerToken,
        takerToken: order.takerToken,
        makerAmount: order.makerAmount,
        takerAmount: order.takerAmount,
        takerTokenFeeAmount: order.takerTokenFeeAmount,
        sender: order.sender,
        feeRecipient: order.feeRecipient,
        expiry: Number(order.expiry),
        pool: order.pool,
        salt: order.salt
      });
      await this.zeroExContract.methods.batchCancelLimitOrders(
        [limitOrder]
      ).send({
        from: this.currentAccountWallet,
        value: 0,
        gas: 800000,
        gasPrice: 20e9
      });
    },
  }
};
</script>
