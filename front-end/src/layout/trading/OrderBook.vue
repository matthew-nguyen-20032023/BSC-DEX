<template>
  <b-row class="mt-2">
    <table style="font-size: 12px; color: #e54150">
      <tr style="color: rgb(132, 142, 156); text-align: center">
        <th>Price</th>
        <th>Amount</th>
        <th style="text-align: left">Total</th>
      </tr>
    </table>
    <table id="sellOrders" style="font-size: 12px; color: #e54150">
      <tbody>
      </tbody>
    </table>
    <strong v-if="currentPrice === previousPrice" style="padding-left: 20px; color: white; font-size: 18px">
      {{ currentPrice }}
    </strong>
    <strong v-if="currentPrice > previousPrice" style="padding-left: 20px; color: rgb(35, 167, 118); font-size: 18px">
      {{ currentPrice }}
      <b-icon
        :icon="'arrow-up-circle'"
        :class="{'grow-up': true, 'growing': true}"
      />
    </strong>
    <strong v-if="previousPrice > currentPrice" style="padding-left: 20px; color: rgb(229, 65, 80); font-size: 18px">
      {{ currentPrice }}
      <b-icon
        :icon="'arrow-down-circle'"
        :class="{'grow-up': true, 'growing': true}"
      />
    </strong>
    <table id="buyOrders" style="font-size: 12px; color: #23a776; padding-left: 20px">
      <tbody>
      </tbody>
    </table>
  </b-row>
</template>

<script>
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
    },
    newTradeCreated: {
      required: true
    },
  },
  watch: {
    pairId(newVal, oldVal) {
      if (oldVal) {
        socket.off(`OrderBookByPair_${oldVal}`);
      }
      if (newVal) {
        this.initSocketOrderBook();
      }
    },
    newTradeCreated(newVal, oldVal) {
      if (!newVal) return;
      this.previousPrice = this.currentPrice;
      this.currentPrice = new BigNumber(newVal.price).toFixed(4);
    },
  },
  created: debounce(function () {
    this.updateOrderBook();
  }, 500),
  data() {
    return {
      buyOrders: [],
      sellOrders: [],
      defaultLengthOrderBook: window.innerHeight < 1100 ? 6 : 9,
      currentPrice: 0,
      previousPrice: 0,
    };
  },
  methods: {
    initSocketOrderBook() {
      socket.on(`OrderBookByPair_${this.pairId}`, (orderBook) => {
        this.buyOrders = orderBook.buyOrders;
        this.sellOrders = orderBook.sellOrders;
        if (this.sellOrders.length > this.defaultLengthOrderBook) {
          this.sellOrders = this.sellOrders.splice(this.sellOrders.length - this.defaultLengthOrderBook, this.defaultLengthOrderBook);
        }
        if (this.buyOrders.length > this.defaultLengthOrderBook) {
          this.buyOrders = this.buyOrders.splice(0, this.defaultLengthOrderBook);
        }
        this.updateOrderBook();
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

      if (this.buyOrders.length < this.defaultLengthOrderBook) {
        const defaultArray = new Array(this.defaultLengthOrderBook - this.buyOrders.length)
          .fill({ price: '--', amount: '--', total: '--' });
        this.buyOrders = this.buyOrders.concat(defaultArray);

      }
      if (this.sellOrders.length < this.defaultLengthOrderBook) {
        const defaultArray = new Array(this.defaultLengthOrderBook - this.sellOrders.length)
          .fill({ price: '--', amount: '--', total: '--' });
        this.sellOrders = defaultArray.concat(this.sellOrders);
      }

      // Add buy orders dynamically
      this.buyOrders.forEach((order) => {
        const row = buyOrdersTable.insertRow();
        const priceCell = row.insertCell(0);
        const amountCell = row.insertCell(1);
        const totalCell = row.insertCell(2);
        priceCell.innerText = order.price;
        priceCell.style.paddingLeft = "20px";
        amountCell.innerText = order.amount;
        totalCell.innerText = order.total;
        const heightPercentage = (order.total / highestTotalBuy) * 100;
        row.style.backgroundImage = `linear-gradient(to right, rgba(35, 167, 118, 0.1) ${heightPercentage}%, transparent ${heightPercentage}%)`;
      });

      // Add sell orders dynamically
      this.sellOrders.forEach((order) => {
        const row = sellOrdersTable.insertRow();
        const priceCell = row.insertCell(0);
        const amountCell = row.insertCell(1);
        const totalCell = row.insertCell(2);
        priceCell.innerText = order.price;
        priceCell.style.paddingLeft = "20px";
        amountCell.innerText = order.amount;
        totalCell.innerText = order.total;
        const heightPercentage = (order.total / highestTotalSell) * 100;
        row.style.backgroundImage = `linear-gradient(to right, rgba(229, 65, 80, 0.1) ${heightPercentage}%, transparent ${heightPercentage}%)`;
      });
    }
  }
};
</script>

<style scoped>
/* Add your component styles here */
</style>
