<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      card
      active-nav-item-class="font-weight-bold text-uppercase text-danger"
      active-tab-class="font-weight-bold text-success"
    >
      <b-tab title="Orders" active>
        <b-card-text>Tab contents 1</b-card-text>
      </b-tab>
      <b-tab title="Trades">
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
