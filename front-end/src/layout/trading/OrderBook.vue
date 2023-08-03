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
    pairId() {
      this.getOrderBook();
      this.initSocketForNewOrderBook();
      this.initSocketNewTrade()
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
    initSocketNewTrade() {
      socket.on('NewTradeCreated', (trade) => {
        if (trade.pairId !== this.pairId) return;
        if (trade.orderType === 'buy' && this.buyOrders.length === 0) return;
        if (trade.orderType === 'sell' && this.sellOrders.length === 0) return;
        let orders = trade.orderType === 'buy' ? this.buyOrders : this.sellOrders;

        for (const order of orders) {
          if (order.price === trade.price) {
            const volumeNoDecimal = new BigNumber(trade.volume).div(new BigNumber(10).pow(18));
            const totalUpdate = new BigNumber(trade.volume).times(trade.price).div(new BigNumber(10).pow(18));
            order.amount = new BigNumber(order.amount).minus(volumeNoDecimal).toFixed();
            order.total = new BigNumber(order.total).minus(totalUpdate).toFixed();
            if (Number(order.amount) <= 0) {
              const indexOfOrder = orders.indexOf(order);
              if (trade.orderType === 'buy') {
                this.buyOrders = this.buyOrders.slice(indexOfOrder + 1);
              } else {
                this.sellOrders = this.sellOrders.slice(indexOfOrder + 1);
              }
            }
            break;
          }
        }
      })
    },
    initSocketForNewOrderBook() {
      socket.on("NewOrderCreated", (trade) => {
        let orders = trade.orderType === 'buy' ? this.buyOrders : this.sellOrders;
        if (orders.length === 0) {
          const buildOrderBook = {
            price: trade.price,
            amount: new BigNumber(trade.remainingAmount).div(new BigNumber(10).pow(18)).toFixed(),
            total: new BigNumber(trade.remainingAmount).times(trade.price).div(new BigNumber(10).pow(18)).toFixed()
          }
          orders.push(buildOrderBook);
          return;
        }

        let index = -1;
        let isAdded = false;
        let insertFrom = index;
        let stop = false;
        for (const order of orders) {
          if (order.price === trade.price) {
            const amountUpdate = new BigNumber(trade.remainingAmount).div(new BigNumber(10).pow(18));
            const totalUpdate = new BigNumber(trade.remainingAmount).times(trade.price).div(new BigNumber(10).pow(18));
            order.amount = amountUpdate.plus(order.amount).toFixed();
            order.total = totalUpdate.plus(order.total).toFixed();
            isAdded = true;
            break;
          }
          index++;

          if (trade.price > order.price && !stop) {
            insertFrom = index;
            stop = true;
          }
        }

        if (!isAdded) {
          const buildOrderBook = {
            price: trade.price,
            amount: new BigNumber(trade.remainingAmount).div(new BigNumber(10).pow(18)).toFixed(),
            total: new BigNumber(trade.remainingAmount).times(trade.price).div(new BigNumber(10).pow(18)).toFixed()
          }
          if (trade.orderType === 'buy') {
            this.buyOrders.splice(insertFrom, 0, buildOrderBook);
          } else {
            this.sellOrders.splice(insertFrom, 0, buildOrderBook);
          }
        }
      });
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
