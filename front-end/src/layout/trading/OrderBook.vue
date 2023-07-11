<template>
  <table :id="orderBookType" style="position: relative; font-size: 12px">
    <tr v-if="orderBookType === 'ask'" style="color: rgb(132, 142, 156)">
      <th>Price</th>
      <th>Amount</th>
      <th>Total</th>
    </tr>
    <tr v-if="orderBookType === 'bid'" style="color: rgb(132, 142, 156)">
      <th>Math price</th>
      <th>USD</th>
      <th>More</th>
    </tr>
    <tr v-for="(order, index) in orderBook" :key="index">
      <td>{{ order.price }}</td>
      <td>{{ order.amount }}</td>
      <td>{{ order. price * order.amount }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    orderBookType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderBook: [
        { price: 100, amount: 10, total: 1000 },
        { price: 99, amount: 5, total: 495 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
        { price: 101, amount: 7, total: 700 },
      ],
      orderBookFields: ['Price', 'Amount', 'Total'],
    };
  },
  mounted() {
    const table = document.getElementById(this.orderBookType);
    if (this.orderBookType === 'ask') {
      table.style.color = '#e54150';
    }
    if (this.orderBookType === 'bid') {
      table.style.color = '#23a776';
    }
  },
  methods: {
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
