<template>
  <div>
    <h1>Order Book</h1>
    <table class="table">
      <thead>
      <tr>
        <th>Price</th>
        <th>Amount</th>
        <th>Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(order, index) in orderBook" :key="index">
        <td :style="{ color: color }">{{ order.price }}</td>
        <td>{{ order.size }}</td>
        <td>{{ calculateTotal(order) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderBook: [
        { price: 100, size: 10 },
        { price: 99, size: 5 },
        { price: 101, size: 7 },
        // Add more order data here
      ]
    };
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
