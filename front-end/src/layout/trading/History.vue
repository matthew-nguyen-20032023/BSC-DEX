<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      active-nav-item-class="font-weight-bold"
      active-tab-class="font-weight-bold text-success"
      small
    >
      <b-tab title="Orders" :title-link-class="'text-light'">
        <b-card-text>Tab contents 1</b-card-text>
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
