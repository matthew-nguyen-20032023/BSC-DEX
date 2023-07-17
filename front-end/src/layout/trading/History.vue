<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      active-nav-item-class="font-weight-bold"
      active-tab-class="font-weight-bold text-success"
      small
    >
      <b-tab title="Orders" :title-link-class="'text-light'">
        <b-card-text>
          <table class="w-100 mt-1">
            <tr>
              <th>Order type</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Total</th>
              <th>Filled</th>
              <th>Remain</th>
            </tr>
            <tr v-for="i in [1,2,3,1,1,1]" :key="i">
              <td>Limit</td>
              <td>10</td>
              <td>9</td>
              <td>90</td>
              <td>70</td>
              <td>20</td>
            </tr>
          </table>
        </b-card-text>
      </b-tab>
      <b-tab title="Trades" :title-link-class="'text-light'">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
export default {
  props: {
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
