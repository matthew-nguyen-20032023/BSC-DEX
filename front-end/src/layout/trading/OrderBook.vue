<template>
  <table :id="orderBookType" style="position: relative; font-size: 12px">
    <tr v-if="orderBookType === 'sell'" style="color: rgb(132, 142, 156)">
      <th>Price</th>
      <th>Amount</th>
      <th>Total</th>
    </tr>
    <tr v-if="orderBookType === 'buy'" style="color: rgb(132, 142, 156)">
      <th>Price</th>
      <th>Amount</th>
      <th>Total</th>
    </tr>
    <tr v-for="(order, index) in orderBook" :key="index">
      <td>{{ order.price }}</td>
      <td>{{ order.amount }}</td>
      <td>{{ order.total }}</td>
    </tr>
  </table>
</template>

<script>
import {listOrderBook} from "@/plugins/backend";
import {notificationWithCustomMessage} from "@/plugins/notification";
import {socket} from "@/plugins/socket";
const BigNumber = require('bignumber.js');
const debounce = require('debounce');

export default {
  props: {
    orderBookType: {
      type: String,
      required: true
    },
    pairId: {
      type: String,
      required: true
    }
  },
  watch: {
    pairId() {
      this.getOrderBook();
    },
  },
  created: debounce(function () {
    this.getOrderBook();
  }, 500),
  data() {
    return {
      orderBook: [],
    };
  },
  mounted() {
    const table = document.getElementById(this.orderBookType);
    if (this.orderBookType === 'sell') {
      table.style.color = '#e54150';
    }
    if (this.orderBookType === 'buy') {
      table.style.color = '#23a776';
    }
  },
  methods: {
    initSocketForNewOrderBook() {
      socket.on("NewOrderCreated", (data) => {
        if (data.type === this.orderBookType) {
          if (this.orderBook.length === 0) {
            const buildOrderBook = {
              price: data.price,
              amount: new BigNumber(data.remainingAmount).div(new BigNumber(10).pow(18)),
              total: new BigNumber(data.remainingAmount).times(data.price).div(new BigNumber(10).pow(18))
            }
            this.orderBook.push(buildOrderBook);
            return;
          }

          let index = -1;
          let isAdded = false;
          let insertFrom = index;
          let stop = false;
          for (const order of this.orderBook) {
            if (order.price === data.price) {
              const totalNoDecimal = new BigNumber(data.remainingAmount).div(new BigNumber(10).pow(18));
              order.total = totalNoDecimal.plus(order.total).toFixed();
              isAdded = true;
              break;
            }
            index++;

            if (this.orderBookType === 'buy') {
              if (data.price > order.price && !stop) {
                insertFrom = index;
                stop = true;
              }
            }

            if (this.orderBookType === 'sell') {
              if (data.price > order.price && !stop) {
                insertFrom = index;
                stop = true;
              }
            }
          }

          if (!isAdded) {
            const buildOrderBook = {
              price: data.price,
              amount: new BigNumber(data.remainingAmount).div(new BigNumber(10).pow(18)),
              total: new BigNumber(data.remainingAmount).times(data.price).div(new BigNumber(10).pow(18))
            }
            this.orderBook.splice(insertFrom, 0, buildOrderBook);
          }
        }
      });
    },
    getOrderBook() {
      this.orderBook = []
      listOrderBook(this.pairId, this.orderBookType, 15).then(res => {
        this.orderBook = res.data.data.map(e => {
          return {
            price: e.price,
            amount: new BigNumber(e.amount).div(new BigNumber(10).pow(18)),
            total: new BigNumber(e.amount).times(e.price).div(new BigNumber(10).pow(18))
          }
        });
        this.initSocketForNewOrderBook();
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
