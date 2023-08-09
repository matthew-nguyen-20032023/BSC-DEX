<template>
  <table style="font-size: 12px; width: 100%;">
    <tr style="color: rgb(132, 142, 156)">
      <th>Trading Pair</th>
      <th v-if="pairSelected !== null" style="text-align: right">24h Change ({{pairSelected.name.split('/')[1]}})</th>
      <th style="text-align: right">24h High</th>
      <th style="text-align: right">24h Low</th>
      <th v-if="pairSelected !== null" style="text-align: right">24h Volume ({{pairSelected.name.split('/')[0]}})</th>
      <th rowspan="2">
        <b-nav align="right" pills>
          <b-button v-if="!walletAddress" @click="connectWallet()" variant="warning">
            <span><i class="tim-icons icon-wallet-43 mb-1"></i> Connect wallet</span>
          </b-button>
          <b-dropdown v-if="walletAddress" id="dropdown-left" variant="success">
            <template #button-content>
              <span><i class="tim-icons icon-wallet-43 mb-1"></i> {{ sortWalletAddress }}</span>
            </template>
            <b-dropdown-item @click="disconnectWallet()">Disconnect</b-dropdown-item>
          </b-dropdown>
        </b-nav>
      </th>
    </tr>
    <tr>
      <th>
        <select style="color: white; background-image: linear-gradient(to bottom left, #00f2c3, #0098f0, #00f2c3); border-radius: 5px" v-model="pairSelected">
          <option v-for="(data, i) in optionsPair" :key="i" :value="data.value">{{ data.text }}</option>
        </select>
      </th>
      <th v-if="price >= 0" style="color: rgb(35, 167, 118); text-align: right">
        {{ Math.abs(price).toFixed(2) }} {{ change }}%
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="price < 0" style="color: rgb(229, 65, 80); text-align: right">
        {{ Math.abs(price).toFixed(2) }} {{ change }}%
        <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>

      <th style="text-align: right">
        {{ Math.abs(high).toFixed(2) }}
      </th>

      <th style="text-align: right">
        {{ Math.abs(low).toFixed(2) }}
      </th>

      <th style="text-align: right">
        {{ removeDecimal(volume) }}
      </th>
    </tr>
  </table>
</template>

<script>
import {getTicker24H, listPair} from "@/plugins/backend";
import {socket} from "@/plugins/socket";
import BigNumber from "bignumber.js";
import {notificationApp} from "@/plugins/notification";
import SomethingWrong from "@/layout/trading/notifications/SomethingWrong";
import NoMetamask from "@/layout/trading/notifications/NoMetamask";
const Web3 = require('web3');

export default {
  props: {},
  data() {
    return {
      pairId: null,
      pairSelected: null,
      optionsPair: [],
      price: "0",
      change: "0",
      low: "0",
      high: "0",
      volume: "0",
      walletAddress: '',
      sortWalletAddress: '',
    };
  },
  created() {
    this.listPair();
    this.initWalletIfHave();
  },
  watch: {
    pairSelected(newVal, oldVal) {
      if (oldVal) socket.off(`TickerChange_${oldVal._id.toString()}`)
      if (newVal !== null) {
        this.pairId = newVal._id.toString();
        this.$emit('pairChange', newVal);
        this.getTicker();
        this.initTicker24h()
      }
    },
    walletAddress(newWallet, oldWallet) {
      if (newWallet !== null) {
        this.$emit('newWalletChange', newWallet);
      }
    }
  },
  mounted() {},
  methods: {
    getCurrentWallet(client) {
      client.eth.getAccounts().then(res => {
        if (res[0] && this.walletAddress === res[0]) return;
        if (!res[0]) return;
        this.walletAddress = res[0]
        this.sortWalletAddress = this.walletAddress.substring(0, 5)
          + '...'
          + this.walletAddress.substring(this.walletAddress.length - 4)
      });
    },
    initWalletIfHave() {
      if (window.ethereum) {
        const client = new Web3(window.ethereum);
        this.getCurrentWallet(client);
        setInterval(() => {
          this.getCurrentWallet(client);
        }, 2000);
      }
    },
    disconnectWallet() {
      this.walletAddress = '';
      this.sortWalletAddress = '';
    },
    connectWallet() {
      if (typeof window.ethereum !== "undefined") {
        ethereum
          .request({ method: "eth_requestAccounts" })
          .then(async (accounts) => {
            this.walletAddress = accounts[0];
            this.sortWalletAddress = this.walletAddress.substring(0, 5)
              + '...'
              + this.walletAddress.substring(this.walletAddress.length - 4)
          })
          .catch(() => {
            notificationApp(this, SomethingWrong);
          });
      } else {
        notificationApp(this, NoMetamask);
      }
    },
    initTicker24h() {
      socket.on(`TickerChange_${this.pairId}`, (ticker) => {
        this.price = ticker.price;
        this.change = ticker.change;
        this.high = ticker.high;
        this.low = ticker.low;
        this.volume = ticker.volume;
      });
    },
    async getTicker() {
      if (this.pairId === null) return;
      const ticker = await getTicker24H(this.pairId);
      this.price = ticker.data.data.price;
      this.change = ticker.data.data.change;
      this.high = ticker.data.data.high;
      this.low = ticker.data.data.low;
      this.volume = ticker.data.data.volume;
    },
    removeDecimal(value) {
      return new BigNumber(Math.abs(value)).div(new BigNumber(10).pow(18)).toFixed(2);
    },
    listPair() {
      listPair().then(res => {
        this.pairSelected = res.data.data[0];
        this.pairId = this.pairSelected._id.toString();
        this.$emit('pairChange', this.pairSelected);
        this.optionsPair = res.data.data.map(e => {
          return { value: e, text: e.name }
        })
        this.initTicker24h();
      })
    },
  }
};
</script>

<style scoped>
</style>
