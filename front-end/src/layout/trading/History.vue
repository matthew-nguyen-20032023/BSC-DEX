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
              <th></th>
            </tr>
            <tr v-for="(data, i) in myOrders" :key="i">
              <td>{{ data.type }}</td>
              <td>{{ data.price }}</td>
              <td>{{ removeDecimal(data.makerAmount) }}</td>
              <td>{{ removeDecimal(data.remainingAmount) }}</td>
              <td>{{ convertExpiryToDate(data.expiry) }}</td>
              <td><b-button size="sm" variant="warning">Cancel</b-button></td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
      <b-tab title="My Trades" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Price</th>
              <th>Remaining Amount</th>
              <th>Expiry</th>
              <th>Created</th>
            </tr>
            <tr v-for="(data, i) in sellOffer" :key="i">
              <td>{{ data.price }}</td>
              <td>{{ removeDecimal(data.remainingAmount) }}</td>
              <td>{{ convertExpiryToDate(data.expiry) }}</td>
              <td>{{ data.createdAt }}</td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { listOrder } from "@/plugins/backend";
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
    pairId: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      myOrders: [],
      sellOffer: [],
      historyTab: 0,
      currentAccountWallet: null,
    };
  },
  watch: {
    pairId() {
      if (this.historyTab === 0) {
        this.listMyOrder();
      }
      if (this.historyTab === 1) {
        // this.listSellOffer();
      }
    },
    historyTab(newVal, oldVal) {
      if (newVal === 0) {
        this.listMyOrder();
      }
      if (newVal === 1) {
        // this.listSellOffer();
      }
    }
  },
  mounted() {
  },
  created: debounce(function () {
    this.client = new Web3(window.ethereum);
    this.client.eth.getAccounts().then(res => { this.currentAccountWallet = res[0] });
    this.listMyOrder();
    this.initSocketNewOrderCreated();
    this.initOrderMatched();
  }, 500),
  methods: {
    initOrderMatched() {
      socket.on("OrderMatched", (order) => {
        if (order.maker.toLowerCase() === this.currentAccountWallet.toLowerCase()) {
          this.listMyOrder();
        }
      });
    },
    initSocketNewOrderCreated() {
      socket.on("NewOrderCreated", (data) => {
        if (data.pairId === this.pairId && data.maker.toLowerCase() === this.currentAccountWallet.toLowerCase()) {
          this.myOrders.unshift(data);
        }
      });
    },
    convertExpiryToDate(expiry) {
      const dateObject = new Date(expiry * 1000);
      return moment(dateObject).local().format('YYYY/MM/DD-HH:mm:ss');
    },
    removeDecimal(value) {
      return new BigNumber(value).div(new BigNumber(10).pow(18)).toString();
    },
    listMyOrder() {
      listOrder(null, this.baseTokenAddress, this.quoteTokenAddress, null, 1, 6, this.currentAccountWallet, 'desc')
      .then(res => {
        this.myOrders = res.data.data;
      })
    },
  }
};
</script>
