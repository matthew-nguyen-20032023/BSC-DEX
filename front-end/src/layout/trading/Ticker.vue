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
      <th>
        <select style="color: rgb(132, 142, 156); border-radius: 5px" v-model="pairSelected">
          <option v-for="(data, i) in optionsPair" :key="i" :value="data.value">{{ data.text }}</option>
        </select>
      </th>
      <th>100</th>
      <th>115</th>
      <th>98</th>
      <th>1000977</th>
    </tr>
  </table>
</template>

<script>
import { listPair } from "@/plugins/backend";

export default {
  props: {},
  data() {
    return {
      pairSelected: null,
      optionsPair: []
    };
  },
  created() {
    this.listPair();
  },
  watch: {
    pairSelected(newVal, oldVal) {
      if (newVal !== null) {
        this.$emit('pairChange', newVal);
      }
    }
  },
  mounted() {},
  methods: {
    listPair() {
      listPair().then(res => {
        this.pairSelected = res.data.data[0];
        this.$emit('pairChange', this.pairSelected);
        this.optionsPair = res.data.data.map(e => {
          return { value: e, text: e.name }
        })
      })
    },
  }
};
</script>

<style scoped>
</style>
