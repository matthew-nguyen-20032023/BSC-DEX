<template>
<!-- Timeframe Selector -->
<div class="tf-selector">
    <span class="timeframe" v-for="(tf, i) in timeFrames"
        v-on:click="on_click(tf, i)"
        v-bind:style= "selected === i ? {color: '#44c767'} : {}">
        {{tf.intervalType}}
    </span>
</div>
</template>

<script>
export default {
    name: 'TfSelector',
    mounted() {
        this.$emit('selected', {
            i: this.selected
        })
    },
    computed: {
    },
    methods: {
        on_click(tf, i) {
            this.selected = i
            this.$emit('tfSelected', tf)
        }
    },
    data() {
        return {
          timeFrames: [
            {tf: '1m', intervalType: "1m", millisecondStep: 60000},
            {tf: '3m', intervalType: "3m", millisecondStep: 180000},
            {tf: '5m', intervalType: "5m", millisecondStep: 300000},
            {tf: '15m', intervalType: "15m", millisecondStep: 900000},
            {tf: '30m', intervalType: "30m", millisecondStep: 1800000},
            {tf: '1H', intervalType: "1h", millisecondStep: 3600000},
            {tf: '2H', intervalType: "2h", millisecondStep: 7200000},
            {tf: '4H', intervalType: "4h", millisecondStep: 14400000},
            {tf: '12H', intervalType: "12h", millisecondStep: 43200000},
            {tf: '1D', intervalType: "1d", millisecondStep: 86400000},
            {tf: '1W', intervalType: "1w", millisecondStep: 604800000},
          ],
            selected: 0
        }
    }
}
</script>

<style>
.tf-selector {
    position: absolute;
    top: 0px;
    right: 93px;
    font: 14px -apple-system,BlinkMacSystemFont,
        Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,
        Fira Sans,Droid Sans,Helvetica Neue,
        sans-serif;
    color: #ccc;
    padding: 8px;
    border-radius: 3px;
    background-color: rgb(18, 24, 38) !important;
    border-style: solid; border-width: 1px; border-color: rgb(160,160,255, 0.25);
}
.timeframe {
    margin-right: 5px;
    user-select: none;
    cursor: pointer;
    font-weight: 200;
    max-width: 10px;
}
.timeframe:hover {
    color: #fff;
}
</style>
