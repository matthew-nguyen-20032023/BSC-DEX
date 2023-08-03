<template>
  <b-row class="ml-1 mt-2">
    <table style="font-size: 12px; color: #e54150">
      <tr>
        <th style="text-align: center; color: #525f7f" colspan="3"><strong>Order Book</strong></th>
      </tr>
      <tr style="color: rgb(132, 142, 156)">
        <th>Price</th>
        <th>Amount</th>
        <th>Total</th>
      </tr>
      <tr v-for="(order, index) in sellOrders" :key="index">
        <td>{{ order.price }}</td>
        <td>{{ order.amount }}</td>
        <td>{{ order.total }}</td>
      </tr>
    </table>
    <hr>
    <table style="font-size: 12px; color: #23a776">
      <tr style="color: rgb(132, 142, 156)">
        <th>Price</th>
        <th>Amount</th>
        <th>Total</th>
      </tr>
      <tr v-for="(order, index) in buyOrders" :key="index">
        <td>{{ order.price }}</td>
        <td>{{ order.amount }}</td>
        <td>{{ order.total }}</td>
      </tr>
    </table>
  </b-row>
</template>

<script>
import {listOrderBook} from "@/plugins/backend";
import {notificationWithCustomMessage} from "@/plugins/notification";
import {socket} from "@/plugins/socket";
const BigNumber = require('bignumber.js');
const debounce = require('debounce');

export default {
  props: {
    pairId: {
      type: String,
      required: true
    }
  },
  watch: {
    pairId(newVal, oldVal) {
      if (oldVal) {
        socket.off(`OrderBookByPair_${oldVal}`);
      }
      this.getOrderBook();
      if (newVal) this.initSocketOrderBook()
    },
    buyOrders() {
      if (this.buyOrders.length > this.defaultLengthOrderBook) {
        this.buyOrders = this.buyOrders.splice(0, this.defaultLengthOrderBook);
      }
    },
    sellOrders() {
      if (this.sellOrders.length > this.defaultLengthOrderBook) {
        this.sellOrders = this.sellOrders.splice(0, this.defaultLengthOrderBook);
      }
    }
  },
  created: debounce(function () {
    this.getOrderBook();
  }, 500),
  data() {
    return {
      buyOrders: [],
      sellOrders: [],
      defaultLengthOrderBook: 8,
    };
  },
  methods: {
    initSocketOrderBook() {
      socket.on(`OrderBookByPair_${this.pairId}`, (orderBook) => {
        this.buyOrders = orderBook.buyOrders;
        this.sellOrders = orderBook.sellOrders;
      })
    },
    getOrderBook() {
      this.sellOrders = []
      this.buyOrders = []
      listOrderBook(this.pairId).then(res => {
        this.buyOrders = res.data.data.buyOrders.map(e => {
          return {
            price: new BigNumber(e.price).toFixed(2),
            amount: new BigNumber(e.amount).div(new BigNumber(10).pow(18)).toFixed(2),
            total: new BigNumber(e.amount).times(e.price).div(new BigNumber(10).pow(18)).toFixed(2)
          }
        });
        this.sellOrders = res.data.data.sellOrders.map(e => {
          return {
            price: new BigNumber(e.price).toFixed(2),
            amount: new BigNumber(e.amount).div(new BigNumber(10).pow(18)).toFixed(2),
            total: new BigNumber(e.amount).times(e.price).div(new BigNumber(10).pow(18)).toFixed(2)
          }
        });
      }).catch(error => {
        return notificationWithCustomMessage('warning', this, `${error.message}`);
      })
    },
    calculateTotal(order) {
      // Calculate the total value for each order
      return order.price * order.size;
    }
  }
};
</script>

<style>
/* Add your component styles here */
</style>
