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
              <td><b-button size="sm" variant="warning">Fill</b-button></td>
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
              <td><b-button size="sm" variant="success">Fill</b-button></td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { listOrder } from "@/plugins/backend";
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
      historyTab: null
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
    }
  }
};
</script>
