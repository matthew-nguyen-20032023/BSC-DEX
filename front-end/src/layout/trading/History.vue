<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      active-nav-item-class="font-weight-bold"
      active-tab-class="font-weight-bold text-success"
      small
      v-model="historyTab"
    >
      <b-tab title="Open Buy Offers" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Price</th>
              <th>Remaining Amount</th>
              <th>Expiry</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
            <tr v-for="(data, i) in buyOffers" :key="i">
              <td>{{ data.price }}</td>
              <td>{{ removeDecimal(data.remainingAmount) }}</td>
              <td>{{ convertExpiryToDate(data.expiry) }}</td>
              <td>{{ data.createdAt }}</td>
              <td><b-button size="sm" variant="warning" @click="fillOrder(data)">Fill</b-button></td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
      <b-tab title="Open Sell Offers" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Price</th>
              <th>Remaining Amount</th>
              <th>Expiry</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
            <tr v-for="(data, i) in sellOffer" :key="i">
              <td>{{ data.price }}</td>
              <td>{{ removeDecimal(data.remainingAmount) }}</td>
              <td>{{ convertExpiryToDate(data.expiry) }}</td>
              <td>{{ data.createdAt }}</td>
              <td><b-button size="sm" variant="success" @click="fillOrder(data)">Fill</b-button></td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { listOrder } from "@/plugins/backend";
import { LimitOrder } from "@0x/protocol-utils";
import Web3 from "web3";
import {exchangeABI} from "@/libs/abi/exchange.ts";
import {erc20ABI} from "@/libs/abi/erc20.ts";
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
  },
  data() {
    return {
      buyOffers: [],
      sellOffer: [],
      historyTab: null,
      currentAccountWallet: null,
    };
  },
  watch: {
    baseTokenAddress() {
      this.listBuyOffer()
      this.listSellOffer()
    },
    quoteTokenAddress() {
      this.listBuyOffer()
      this.listSellOffer()
    },
    historyTab(newVal, oldVal) {
      if (newVal === 0) {
        this.listBuyOffer();
      }
      if (newVal === 1) {
        this.listSellOffer();
      }
    }
  },
  mounted() {
  },
  created: debounce(function () {
    this.listBuyOffer();
    this.listSellOffer();
    this.client = new Web3(window.ethereum);
    this.client.eth.getAccounts().then(res => { this.currentAccountWallet = res[0] });
  }, 500),
  methods: {
    convertExpiryToDate(expiry) {
      const dateObject = new Date(expiry * 1000);
      return moment(dateObject).format('YYYY-MM-DDTHH:mm:ss.Z');
    },
    removeDecimal(value) {
      return new BigNumber(value).div(new BigNumber(10).pow(18)).toString();
    },
    listBuyOffer() {
      listOrder('desc', this.baseTokenAddress, this.quoteTokenAddress, 'buy', 1, 6)
      .then(res => {
        this.buyOffers = res.data.data;
      })
    },
    listSellOffer() {
      listOrder('asc', this.baseTokenAddress, this.quoteTokenAddress, 'sell', 1, 6)
      .then(res => {
        this.sellOffer = res.data.data;
      })
    },
    async fillOrder(order) {
      const signature = JSON.parse(order.signature);
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

      const erc20TokenContract = new this.client.eth.Contract(erc20ABI, order.takerToken);
      const orderContract = new this.client.eth.Contract(exchangeABI, process.env.VUE_APP_ORDER_ADDRESS);
      await erc20TokenContract.methods.approve(process.env.VUE_APP_ORDER_ADDRESS, order.takerAmount).send({
        from: this.currentAccountWallet,
        gas: 800000,
        gasPrice: 20e9
      });
      await orderContract.methods.fillLimitOrder(
        limitOrder,
        signature,
        order.takerAmount
      ).send({
        from: this.currentAccountWallet,
        value: 0,
        gas: 800000,
        gasPrice: 20e9
      });
    }
  }
};
</script>
