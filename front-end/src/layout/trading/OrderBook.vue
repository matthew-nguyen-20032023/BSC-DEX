<template>
  <b-row class="ml-1 mt-2">
    <table id="sellOrders" style="font-size: 12px; color: #e54150">
      <tr>
        <th style="text-align: center; color: #525f7f" colspan="3"><strong>Order Book</strong></th>
      </tr>
      <tr style="color: rgb(132, 142, 156)">
        <th>Price ({{quoteTokenSymbol}})</th>
        <th>Amount</th>
        <th>Total</th>
      </tr>
      <tbody>
      </tbody>
<!--      <tr v-for="(order, index) in sellOrders" :key="index">-->
<!--        <td>{{ order.price }}</td>-->
<!--        <td>{{ order.amount }}</td>-->
<!--        <td>{{ order.total }}</td>-->
<!--      </tr>-->
    </table>
    <hr>
    <table id="buyOrders" style="font-size: 12px; color: #23a776">
      <tr style="color: rgb(132, 142, 156)">
        <th>Price ({{quoteTokenSymbol}})</th>
        <th>Amount</th>
        <th>Total</th>
      </tr>
      <tbody>
      </tbody>
<!--      <tr v-for="(order, index) in buyOrders" :key="index">-->
<!--        <td>{{ order.price }}</td>-->
<!--        <td>{{ order.amount }}</td>-->
<!--        <td>{{ order.total }}</td>-->
<!--      </tr>-->
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
    },
    quoteTokenSymbol: {
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
  },
  created: debounce(function () {
    this.getOrderBook();
  }, 500),
  data() {
    return {
      buyOrders: [],
      sellOrders: [],
      defaultLengthOrderBook: window.innerHeight < 1100 ? 5 : 8,
    };
  },
  methods: {
    initSocketOrderBook() {
      socket.on(`OrderBookByPair_${this.pairId}`, (orderBook) => {
        this.buyOrders = orderBook.buyOrders;
        this.sellOrders = orderBook.sellOrders;
        if (this.sellOrders.length > this.defaultLengthOrderBook) {
          this.sellOrders = this.sellOrders.splice(0, this.defaultLengthOrderBook);
        }
        if (this.buyOrders.length > this.defaultLengthOrderBook) {
          this.buyOrders = this.buyOrders.splice(0, this.defaultLengthOrderBook);
        }
        this.updateOrderBook();
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
    },
    updateOrderBook() {
      const buyOrdersTable = document.getElementById("buyOrders").querySelector("tbody");
      const sellOrdersTable = document.getElementById("sellOrders").querySelector("tbody");

      // Clear existing rows
      buyOrdersTable.innerHTML = "";
      sellOrdersTable.innerHTML = "";

      // Find the highest total
      const highestTotalBuy = Math.max(...this.buyOrders.map((order) => order.total));
      const highestTotalSell = Math.max(...this.sellOrders.map((order) => order.total));
      const highestTotal = Math.max(highestTotalBuy, highestTotalSell);

      // Add buy orders dynamically
      this.buyOrders.forEach((order) => {
        const row = buyOrdersTable.insertRow();
        const priceCell = row.insertCell(0);
        const amountCell = row.insertCell(1);
        const totalCell = row.insertCell(2);
        priceCell.innerText = order.price;
        amountCell.innerText = order.amount;
        totalCell.innerText = order.total;
        const heightPercentage = (order.total / highestTotal) * 100;
        row.style.backgroundImage = `linear-gradient(to right, rgba(35, 167, 118, 0.1) ${heightPercentage}%, transparent ${heightPercentage}%)`;
      });

      // Add sell orders dynamically
      this.sellOrders.forEach((order) => {
        const row = sellOrdersTable.insertRow();
        const priceCell = row.insertCell(0);
        const amountCell = row.insertCell(1);
        const totalCell = row.insertCell(2);
        priceCell.innerText = order.price;
        amountCell.innerText = order.amount;
        totalCell.innerText = order.total;
        const heightPercentage = (order.total / highestTotal) * 100;
        row.style.backgroundImage = `linear-gradient(to right, rgba(229, 65, 80, 0.1) ${heightPercentage}%, transparent ${heightPercentage}%)`;
      });
    }
  }
};
</script>

<style>
/* Add your component styles here */
</style>
