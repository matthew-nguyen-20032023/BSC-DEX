<template>
  <table style="font-size: 12px; width: 100%;">
    <tr style="color: rgb(132, 142, 156)">
      <th>Trading Pair</th>
      <th>24h Change</th>
      <th>24h High</th>
      <th>24h Low</th>
      <th>24h Volume</th>
    </tr>
    <tr>
      <th>{{ pairName }}</th>
      <th>100</th>
      <th>115</th>
      <th>98</th>
      <th>1000977</th>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    pairName: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
    };
  },
  mounted() {},
  methods: {
  }
};
</script>

<style>
/* Add your component styles here */
</style>
