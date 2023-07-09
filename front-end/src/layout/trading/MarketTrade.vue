<template>
  <table style="font-size: 12px">
    <tr style="color: rgb(132, 142, 156);">
      <th>Price</th>
      <th>Amount</th>
      <th>Time</th>
    </tr>
    <tr v-for="(order, index) in orderBook" :key="index">
      <td :style="getTradeColor(order.type)">{{ order.price }}</td>
      <td>{{ order.amount }}</td>
      <td>16:09:09</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
  },
  data() {
    return {
      orderBook: [
        { price: 100, amount: 10, type: 'bid' },
        { price: 99, amount: 5, type: 'bid' },
        { price: 101, amount: 7, type: 'ask' },
        { price: 101, amount: 7, type: 'bid' },
        { price: 101, amount: 7, type: 'ask' },
        { price: 101, amount: 7, type: 'bid' },
        { price: 101, amount: 7, type: 'ask' },
        { price: 101, amount: 7, type: 'ask' },
        { price: 101, amount: 7, type: 'ask' },
        { price: 101, amount: 7, type: 'bid' },
        { price: 101, amount: 7, type: 'bid' },
      ],
      orderBookFields: ['Price', 'Amount', 'Total'],
    };
  },
  mounted() {},
  methods: {
    getTradeColor(type) {
      return type === 'bid' ? 'color: #23a776' : 'color: #e54150';
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
