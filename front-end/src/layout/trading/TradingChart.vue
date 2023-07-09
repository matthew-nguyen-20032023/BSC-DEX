<template>
  <div>
    <trading-vue
      :data="getTrades()"
      :width="getTradingViewWith()"
      @range-changed="rangeChange"
      :toolbar="true"
      :titleTxt="tradingPair"
      :chart-config="{ DEFAULT_LEN: 100 }"
      :indexBased="true"
      :drawingMode="true"
      ref="tradingVue"
    />
    <br>
    <hr>
    <br>
  </div>
</template>
<script>

import TradingVue from 'trading-vue-js';

const dataObjectFromFile = require('./data.json');
delete dataObjectFromFile.offchart;
delete dataObjectFromFile.onchart;

dataObjectFromFile.chart = {
  type: "Candles",
  data: dataObjectFromFile.ohlcv,
  settings: {},
  tf: "1D"
};
delete dataObjectFromFile.ohlcv;

console.log(dataObjectFromFile);

export default {
  name: 'app',
  components: { TradingVue },
  data() {
    return {
      a: 0,
      tradingPair: "BTC/BUSD",
      ohlcv: [
        [1625832000000, 50.25, 52.14, 49.75, 51.20, 100],
        [1625832900000, 51.22, 53.10, 50.85, 52.60, 92],
        [1625833800000, 52.65, 54.28, 52.50, 54.10, 85],
        [1625834700000, 54.12, 55.40, 53.95, 54.80, 78],
        [1625835600000, 54.85, 56.20, 54.70, 55.90, 81],
        [1625836500000, 55.92, 57.10, 55.75, 56.60, 77],
        [1625837400000, 56.62, 58.00, 56.40, 57.80, 82],
        [1625838300000, 57.82, 59.30, 57.70, 58.90, 79],
        [1625839200000, 58.92, 60.20, 58.80, 59.70, 76],
        [1625840100000, 59.72, 61.10, 59.60, 60.40, 73],
        [1625841000000, 60.42, 61.80, 60.30, 61.10, 77],
        [1625841900000, 61.12, 62.50, 60.90, 62.00, 82],
        [1625842800000, 62.02, 63.40, 61.80, 63.10, 79],
        [1625845500000, 64.52, 65.90, 64.30, 65.10, 77],
        [1625846400000, 65.12, 66.50, 64.90, 66.00, 82],
        [1625847300000, 66.02, 67.40, 65.80, 67.10, 79],
        [1625848200000, 67.12, 68.50, 66.90, 68.00, 76],
        [1625849100000, 68.02, 69.40, 67.80, 69.10, 73],
        [1625850000000, 69.12, 70.50, 68.90, 70.00, 77],
        [1625852700000, 72.02, 73.40, 71.80, 73.10, 76],
        [1625853600000, 73.12, 74.50, 72.90, 74.00, 73],
        [1625854500000, 74.02, 75.40, 73.80, 75.10, 77],
        [1625855400000, 75.12, 76.50, 74.90, 76.00, 82],
        [1625856300000, 76.02, 77.40, 75.80, 77.10, 79],
        [1625857200000, 77.12, 78.50, 76.90, 78.00, 76],
        [1625858100000, 78.02, 79.40, 77.80, 79.10, 73],
        [1625859000000, 79.12, 80.50, 78.90, 80.00, 77],
        [1625861700000, 82.02, 83.40, 81.80, 83.10, 76],
        [1625862600000, 83.12, 84.50, 82.90, 84.00, 73],
        [1625863500000, 84.02, 85.40, 83.80, 85.10, 77],
        [1625864400000, 85.12, 86.50, 84.90, 86.00, 82],
        [1625865300000, 86.02, 87.40, 85.80, 87.10, 79],
        [1625866200000, 87.12, 88.50, 86.90, 88.00, 76],
        [1625868900000, 90.02, 91.40, 89.80, 91.10, 82],
        [1625869800000, 91.12, 92.50, 90.90, 92.00, 79],
        [1625870700000, 92.02, 93.40, 91.80, 93.10, 76],
        [1625871600000, 93.12, 94.50, 92.90, 94.00, 73],
        [1625872500000, 94.02, 95.40, 93.80, 95.10, 77],
        [1625873400000, 95.12, 96.50, 94.90, 96.00, 82],
        [1625874300000, 96.02, 97.40, 95.80, 97.10, 79],
      ]
    }
  },
  mounted() {
    // todo: set rage get trades for first initialize trading view
    // this.$nextTick(() =>
    //   this.$refs.tradingVue.setRange(t1, t2)
    // )
  },
  methods: {
    getTrades() {
      return dataObjectFromFile;
    },
    buttons() {
      return [
        {
          name: 'Test',
          icon: 'eyJwYXlsb2FkIjp7ImFsbFNob3J0Y3V0c0VuYWJsZWQiOmZhbHNlLCJmaWxlVHJlZSI6eyJkb2NzL2FwaS9hc3NldHMiOnsiaXRlbXMiOlt7Im5hbWUiOiJJQi5naWYiLCJwYXRoIjoiZG9jcy9hcGkvYXNzZXRzL0lCLmdpZiIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9LHsibmFtZSI6IlJFQURNRS0wNDg3ZDA4YS5wbmciLCJwYXRoIjoiZG9jcy9hcGkvYXNzZXRzL1JFQURNRS0wNDg3ZDA4YS5wbmciLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiJSRUFETUUtNmNlNzM2YzIucG5nIiwicGF0aCI6ImRvY3MvYXBpL2Fzc2V0cy9SRUFETUUtNmNlNzM2YzIucG5nIiwiY29udGVudFR5cGUiOiJmaWxlIn0seyJuYW1lIjoiUkVBRE1FLWIwZDJkNzk3LnBuZyIsInBhdGgiOiJkb2NzL2FwaS9hc3NldHMvUkVBRE1FLWIwZDJkNzk3LnBuZyIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9LHsibmFtZSI6IlJFQURNRS1iYzQzNTlhZS5wbmciLCJwYXRoIjoiZG9jcy9hcGkvYXNzZXRzL1JFQURNRS1iYzQzNTlhZS5wbmciLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiJSRUFETUUtY2JlNDAyOGMucG5nIiwicGF0aCI6ImRvY3MvYXBpL2Fzc2V0cy9SRUFETUUtY2JlNDAyOGMucG5nIiwiY29udGVudFR5cGUiOiJmaWxlIn0seyJuYW1lIjoiUkVBRE1FLWVkMmM5ZGVmLnBuZyIsInBhdGgiOiJkb2NzL2FwaS9hc3NldHMvUkVBRE1FLWVkMmM5ZGVmLnBuZyIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9XSwidG90YWxDb3VudCI6N30sImRvY3MvYXBpIjp7Iml0ZW1zIjpbeyJuYW1lIjoiYXNzZXRzIiwicGF0aCI6ImRvY3MvYXBpL2Fzc2V0cyIsImNvbnRlbnRUeXBlIjoiZGlyZWN0b3J5In0seyJuYW1lIjoiREFUQVNFVFMubWQiLCJwYXRoIjoiZG9jcy9hcGkvREFUQVNFVFMubWQiLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiJJQi5tZCIsInBhdGgiOiJkb2NzL2FwaS9JQi5tZCIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9LHsibmFtZSI6IlJFQURNRS5tZCIsInBhdGgiOiJkb2NzL2FwaS9SRUFETUUubWQiLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiJTSEFERVJTLm1kIiwicGF0aCI6ImRvY3MvYXBpL1NIQURFUlMubWQiLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiJTVERMSUIubWQiLCJwYXRoIjoiZG9jcy9hcGkvU1RETElCLm1kIiwiY29udGVudFR5cGUiOiJmaWxlIn1dLCJ0b3RhbENvdW50Ijo2fSwiZG9jcyI6eyJpdGVtcyI6W3sibmFtZSI6ImFwaSIsInBhdGgiOiJkb2NzL2FwaSIsImNvbnRlbnRUeXBlIjoiZGlyZWN0b3J5In0seyJuYW1lIjoiZGF0YWN1YmUiLCJwYXRoIjoiZG9jcy9kYXRhY3ViZSIsImNvbnRlbnRUeXBlIjoiZGlyZWN0b3J5In0seyJuYW1lIjoiZmFxIiwicGF0aCI6ImRvY3MvZmFxIiwiY29udGVudFR5cGUiOiJkaXJlY3RvcnkifSx7Im5hbWUiOiJndWlkZSIsInBhdGgiOiJkb2NzL2d1aWRlIiwiY29udGVudFR5cGUiOiJkaXJlY3RvcnkifSx7Im5hbWUiOiJvdmVybGF5cyIsInBhdGgiOiJkb2NzL292ZXJsYXlzIiwiY29udGVudFR5cGUiOiJkaXJlY3RvcnkifV0sInRvdGFsQ291bnQiOjV9LCIiOnsiaXRlbXMiOlt7Im5hbWUiOiIuZ2l0aHViIiwicGF0aCI6Ii5naXRodWIiLCJjb250ZW50VHlwZSI6ImRpcmVjdG9yeSJ9LHsibmFtZSI6ImFzc2V0cyIsInBhdGgiOiJhc3NldHMiLCJjb250ZW50VHlwZSI6ImRpcmVjdG9yeSJ9LHsibmFtZSI6ImRhdGEiLCJwYXRoIjoiZGF0YSIsImNvbnRlbnRUeXBlIjoiZGlyZWN0b3J5In0seyJuYW1lIjoiZGlzdCIsInBhdGgiOiJkaXN0IiwiY29udGVudFR5cGUiOiJkaXJlY3RvcnkifSx7Im5hbWUiOiJkb2NzIiwicGF0aCI6ImRvY3MiLCJjb250ZW50VHlwZSI6ImRpcmVjdG9yeSJ9LHsibmFtZSI6InNyYyIsInBhdGgiOiJzcmMiLCJjb250ZW50VHlwZSI6ImRpcmVjdG9yeSJ9LHsibmFtZSI6InRlc3QiLCJwYXRoIjoidGVzdCIsImNvbnRlbnRUeXBlIjoiZGlyZWN0b3J5In0seyJuYW1lIjoidG9vbHMiLCJwYXRoIjoidG9vbHMiLCJjb250ZW50VHlwZSI6ImRpcmVjdG9yeSJ9LHsibmFtZSI6IndlYnBhY2siLCJwYXRoIjoid2VicGFjayIsImNvbnRlbnRUeXBlIjoiZGlyZWN0b3J5In0seyJuYW1lIjoiLmJhYmVscmMiLCJwYXRoIjoiLmJhYmVscmMiLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiIuZXNsaW50cmMuanMiLCJwYXRoIjoiLmVzbGludHJjLmpzIiwiY29udGVudFR5cGUiOiJmaWxlIn0seyJuYW1lIjoiLmdpdGlnbm9yZSIsInBhdGgiOiIuZ2l0aWdub3JlIiwiY29udGVudFR5cGUiOiJmaWxlIn0seyJuYW1lIjoiQ0hBTkdFTE9HLm1kIiwicGF0aCI6IkNIQU5HRUxPRy5tZCIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9LHsibmFtZSI6IkNPTlRSSUJVVElORy5tZCIsInBhdGgiOiJDT05UUklCVVRJTkcubWQiLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiJET05BVElPTi5tZCIsInBhdGgiOiJET05BVElPTi5tZCIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9LHsibmFtZSI6IkxJQ0VOU0UubWQiLCJwYXRoIjoiTElDRU5TRS5tZCIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9LHsibmFtZSI6IlJFQURNRS5tZCIsInBhdGgiOiJSRUFETUUubWQiLCJjb250ZW50VHlwZSI6ImZpbGUifSx7Im5hbWUiOiJwYWNrYWdlLWxvY2suanNvbiIsInBhdGgiOiJwYWNrYWdlLWxvY2suanNvbiIsImNvbnRlbnRUeXBlIjoiZmlsZSJ9LHsibmFtZSI6InBhY2thZ2UuanNvbiIsInBhdGgiOiJwYWNrYWdlLmpzb24iLCJjb250ZW50VHlwZSI6ImZpbGUifV0sInRvdGFsQ291bnQiOjE5fX0sImZpbGVUcmVlUHJvY2Vzc2luZ1RpbWUiOjkuMzUyMDE1OTk5OTk5OTk5LCJmb2xkZXJzVG9GZXRjaCI6W10sInJlZHVjZWRNb3Rpb25FbmFibGVkIjpudWxsLCJyZXBvIjp7ImlkIjoxNzYxNDUxNDMsImRlZmF1bHRCcmFuY2giOiJtYXN0ZXIiLCJuYW1lIjoidHJhZGluZy12dWUtanMiLCJvd25lckxvZ2luIjoidHZqc3giLCJjdXJyZW50VXNlckNhblB1c2giOmZhbHNlLCJpc0ZvcmsiOmZhbHNlLCJpc0VtcHR5IjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAxOS0wMy0xN1QxODo0Nzo0NC4wMDBaIiwib3duZXJBdmF0YXIiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvNjI4MDM1MzE/dj00IiwicHVibGljIjp0cnVlLCJwcml2YXRlIjpmYWxzZSwiaXNPcmdPd25lZCI6dHJ1ZX0sInJlZkluZm8iOnsibmFtZSI6Im1hc3RlciIsImxpc3RDYWNoZUtleSI6InYwOjE2Nzc5MDAxNTEuNDI4OTAxMiIsImNhbkVkaXQiOmZhbHNlLCJyZWZUeXBlIjoiYnJhbmNoIiwiY3VycmVudE9pZCI6ImJkYmZlNzgzMjc0YzdhYjUxYzlhYzNlNDU4ODQwYjhhODAwOGYzODkifSwicGF0aCI6ImRvY3MvYXBpL2Fzc2V0cy9SRUFETUUtMDQ4N2QwOGEucG5nIiwiY3VycmVudFVzZXIiOm51bGwsImJsb2IiOnsicmF3QmxvYiI6bnVsbCwiY29sb3JpemVkTGluZXMiOm51bGwsInN0eWxpbmdEaXJlY3RpdmVzIjpudWxsLCJjc3YiOm51bGwsImNzdkVycm9yIjpudWxsLCJkZXBlbmRhYm90SW5mbyI6eyJzaG93Q29uZmlndXJhdGlvbkJhbm5lciI6ZmFsc2UsImNvbmZpZ0ZpbGVQYXRoIjpudWxsLCJuZXR3b3JrRGVwZW5kYWJvdFBhdGgiOiIvdHZqc3gvdHJhZGluZy12dWUtanMvbmV0d29yay91cGRhdGVzIiwiZGlzbWlzc0NvbmZpZ3VyYXRpb25Ob3RpY2VQYXRoIjoiL3NldHRpbmdzL2Rpc21pc3Mtbm90aWNlL2RlcGVuZGFib3RfY29uZmlndXJhdGlvbl9ub3RpY2UiLCJjb25maWd1cmF0aW9uTm90aWNlRGlzbWlzc2VkIjpudWxsLCJyZXBvQWxlcnRzUGF0aCI6Ii90dmpzeC90cmFkaW5nLXZ1ZS1qcy9zZWN1cml0eS9kZXBlbmRhYm90IiwicmVwb1NlY3VyaXR5QW5kQW5hbHlzaXNQYXRoIjoiL3R2anN4L3RyYWRpbmctdnVlLWpzL3NldHRpbmdzL3NlY3VyaXR5X2FuYWx5c2lzIiwicmVwb093bmVySXNPcmciOnRydWUsImN1cnJlbnRVc2VyQ2FuQWRtaW5SZXBvIjpmYWxzZX0sImRpc3BsYXlOYW1lIjoiUkVBRE1FLTA0ODdkMDhhLnBuZyIsImRpc3BsYXlVcmwiOiJodHRwczovL2dpdGh1Yi5jb20vdHZqc3gvdHJhZGluZy12dWUtanMvYmxvYi9tYXN0ZXIvZG9jcy9hcGkvYXNzZXRzL1JFQURNRS0wNDg3ZDA4YS5wbmc/cmF3PXRydWUiLCJoZWFkZXJJbmZvIjp7ImJsb2JTaXplIjoiNTYyIEJ5dGVzIiwiZGVsZXRlSW5mbyI6eyJkZWxldGVQYXRoIjoiaHR0cHM6Ly9naXRodWIuY29tL3R2anN4L3RyYWRpbmctdnVlLWpzL2RlbGV0ZS9tYXN0ZXIvZG9jcy9hcGkvYXNzZXRzL1JFQURNRS0wNDg3ZDA4YS5wbmciLCJkZWxldGVUb29sdGlwIjoiWW91IG11c3QgYmUgc2lnbmVkIGluIHRvIG1ha2Ugb3IgcHJvcG9zZSBjaGFuZ2VzIn0sImVkaXRJbmZvIjp7ImVkaXRUb29sdGlwIjoiWW91IG11c3QgYmUgc2lnbmVkIGluIHRvIG1ha2Ugb3IgcHJvcG9zZSBjaGFuZ2VzIn0sImdoRGVza3RvcFBhdGgiOiJodHRwczovL2Rlc2t0b3AuZ2l0aHViLmNvbSIsImdpdExmc1BhdGgiOm51bGwsIm9uQnJhbmNoIjp0cnVlLCJzaG9ydFBhdGgiOiI5MGVjNzY4Iiwic2l0ZU5hdkxvZ2luUGF0aCI6Ii9sb2dpbj9yZXR1cm5fdG89aHR0cHMlM0ElMkYlMkZnaXRodWIuY29tJTJGdHZqc3glMkZ0cmFkaW5nLXZ1ZS1qcyUyRmJsb2IlMkZtYXN0ZXIlMkZkb2NzJTJGYXBpJTJGYXNzZXRzJTJGUkVBRE1FLTA0ODdkMDhhLnBuZyIsImlzQ1NWIjpmYWxzZSwiaXNSaWNodGV4dCI6ZmFsc2UsInRvYyI6bnVsbCwibGluZUluZm8iOnsidHJ1bmNhdGVkTG9jIjpudWxsLCJ0cnVuY2F0ZWRTbG9jIjpudWxsfSwibW9kZSI6ImZpbGUifSwiaW1hZ2UiOnRydWUsImlzQ29kZW93bmVyc0ZpbGUiOm51bGwsImlzVmFsaWRMZWdhY3lJc3N1ZVRlbXBsYXRlIjpmYWxzZSwiaXNzdWVUZW1wbGF0ZUhlbHBVcmwiOiJodHRwczovL2RvY3MuZ2l0aHViLmNvbS9hcnRpY2xlcy9hYm91dC1pc3N1ZS1hbmQtcHVsbC1yZXF1ZXN0LXRlbXBsYXRlcyIsImlzc3VlVGVtcGxhdGUiOm51bGwsImRpc2N1c3Npb25UZW1wbGF0ZSI6bnVsbCwibGFuZ3VhZ2UiOm51bGwsImxhcmdlIjpmYWxzZSwibG9nZ2VkSW4iOmZhbHNlLCJuZXdEaXNjdXNzaW9uUGF0aCI6Ii90dmpzeC90cmFkaW5nLXZ1ZS1qcy9kaXNjdXNzaW9ucy9uZXciLCJuZXdJc3N1ZVBhdGgiOiIvdHZqc3gvdHJhZGluZy12dWUtanMvaXNzdWVzL25ldyIsInBsYW5TdXBwb3J0SW5mbyI6eyJyZXBvSXNGb3JrIjpudWxsLCJyZXBvT3duZWRCeUN1cnJlbnRVc2VyIjpudWxsLCJyZXF1ZXN0RnVsbFBhdGgiOiIvdHZqc3gvdHJhZGluZy12dWUtanMvYmxvYi9tYXN0ZXIvZG9jcy9hcGkvYXNzZXRzL1JFQURNRS0wNDg3ZDA4YS5wbmciLCJzaG93RnJlZU9yZ0dhdGVkRmVhdHVyZU1lc3NhZ2UiOm51bGwsInNob3dQbGFuU3VwcG9ydEJhbm5lciI6bnVsbCwidXBncmFkZURhdGFBdHRyaWJ1dGVzIjpudWxsLCJ1cGdyYWRlUGF0aCI6bnVsbH0sInB1Ymxpc2hCYW5uZXJzSW5mbyI6eyJkaXNtaXNzQWN0aW9uTm90aWNlUGF0aCI6Ii9zZXR0aW5ncy9kaXNtaXNzLW5vdGljZS9wdWJsaXNoX2FjdGlvbl9mcm9tX2RvY2tlcmZpbGUiLCJkaXNtaXNzU3RhY2tOb3RpY2VQYXRoIjoiL3NldHRpbmdzL2Rpc21pc3Mtbm90aWNlL3B1Ymxpc2hfc3RhY2tfZnJvbV9maWxlIiwicmVsZWFzZVBhdGgiOiIvdHZqc3gvdHJhZGluZy12dWUtanMvcmVsZWFzZXMvbmV3P21hcmtldHBsYWNlPXRydWUiLCJzaG93UHVibGlzaEFjdGlvbkJhbm5lciI6ZmFsc2UsInNob3dQdWJsaXNoU3RhY2tCYW5uZXIiOmZhbHNlfSwicmVuZGVySW1hZ2VPclJhdyI6dHJ1ZSwicmljaFRleHQiOm51bGwsInJlbmRlcmVkRmlsZUluZm8iOm51bGwsInRhYlNpemUiOjgsInRvcEJhbm5lcnNJbmZvIjp7Im92ZXJyaWRpbmdHbG9iYWxGdW5kaW5nRmlsZSI6ZmFsc2UsImdsb2JhbFByZWZlcnJlZEZ1bmRpbmdQYXRoIjpudWxsLCJyZXBvT3duZXIiOiJ0dmpzeCIsInJlcG9OYW1lIjoidHJhZGluZy12dWUtanMiLCJzaG93SW52YWxpZENpdGF0aW9uV2FybmluZyI6ZmFsc2UsImNpdGF0aW9uSGVscFVybCI6Imh0dHBzOi8vZG9jcy5naXRodWIuY29tL2VuL2dpdGh1Yi9jcmVhdGluZy1jbG9uaW5nLWFuZC1hcmNoaXZpbmctcmVwb3NpdG9yaWVzL2NyZWF0aW5nLWEtcmVwb3NpdG9yeS1vbi1naXRodWIvYWJvdXQtY2l0YXRpb24tZmlsZXMiLCJzaG93RGVwZW5kYWJvdENvbmZpZ3VyYXRpb25CYW5uZXIiOmZhbHNlLCJhY3Rpb25zT25ib2FyZGluZ1RpcCI6bnVsbH0sInRydW5jYXRlZCI6ZmFsc2UsInZpZXdhYmxlIjpmYWxzZSwid29ya2Zsb3dSZWRpcmVjdFVybCI6bnVsbCwic3ltYm9scyI6bnVsbH0sImNzcmZfdG9rZW5zIjp7Ii90dmpzeC90cmFkaW5nLXZ1ZS1qcy9icmFuY2hlcyI6eyJwb3N0IjoibjV2cVFSTDBaTklEVVZwSmUwMVJqZllXREhGTTZVbHNYNTZicUZ0ZzNwVVNtOHQwQ2JDcFN6emEybWZVU0dKelBsb1pqcXNKdzFIMWUxWmNyX2l5dFEifX19LCJ0aXRsZSI6InRyYWRpbmctdnVlLWpzL2RvY3MvYXBpL2Fzc2V0cy9SRUFETUUtMDQ4N2QwOGEucG5nIGF0IG1hc3RlciDCtyB0dmpzeC90cmFkaW5nLXZ1ZS1qcyIsImxvY2FsZSI6ImVuIn0=' // Base64 URL
        }
      ]
    },
    rangeChange(data) {
      console.log(data[0] - this.a);
      console.log(new Date(data[0]))
      this.a = data[0];
    },
    getTradingViewWith() {
      return window.innerWidth / 2.8;
    }
  }
}

</script>
