<template>
  <table style="font-size: 12px; width: 100%;">
    <tr style="color: rgb(132, 142, 156)">
      <th>Trading Pair</th>
      <th style="text-align: right">24h Change</th>
      <th style="text-align: right">24h High</th>
      <th style="text-align: right">24h Low</th>
      <th style="text-align: right">24h Volume</th>
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
      <th v-if="change >= 0" style="color: rgb(35, 167, 118); text-align: right">
        {{ Math.abs(change).toFixed(2) }}%
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="change < 0" style="color: rgb(229, 65, 80); text-align: right">
        {{ Math.abs(change).toFixed(2) }}%
        <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>

      <th v-if="high >= 0" style="color: rgb(35, 167, 118); text-align: right">
        {{ Math.abs(high).toFixed(2) }}
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="high < 0" style="color: rgb(229, 65, 80); text-align: right">
        {{ Math.abs(high).toFixed(2) }}
        <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': false, 'growing': false}"
        />
      </th>

      <th v-if="low >= 0" style="color: rgb(35, 167, 118); text-align: right">
        {{ Math.abs(low).toFixed(2) }}
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="low < 0" style="color: rgb(229, 65, 80); text-align: right">
        {{ Math.abs(low).toFixed(2) }}
        <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': false, 'growing': false}"
        />
      </th>

      <th v-if="volume >= 0" style="color: rgb(35, 167, 118); text-align: right">
        {{ removeDecimal(volume) }}
        <b-icon
          :icon="'arrow-up-circle'"
          :class="{'grow-up': true, 'growing': true}"
        />
      </th>
      <th v-if="volume < 0" style="color: rgb(229, 65, 80); text-align: right">
        {{ removeDecimal(volume) }}
        <b-icon
          :icon="'arrow-down-circle'"
          :class="{'grow-up': false, 'growing': false}"
        />
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

export default {
  props: {},
  data() {
    return {
      pairId: null,
      pairSelected: null,
      optionsPair: [],
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
    this.initTicker24h();
    this.initWalletIfHave();
  },
  watch: {
    pairSelected(newVal, oldVal) {
      if (newVal !== null) {
        this.$emit('pairChange', newVal);
      }
      this.getTicker();
    },
    walletAddress(newWallet, oldWallet) {
      if (newWallet !== null) {
        this.$emit('newWalletChange', newWallet);
      }
    }
  },
  mounted() {},
  methods: {
    initWalletIfHave() {
      if (window.ethereum) {
        ethereum
          .request({ method: "eth_requestAccounts" })
          .then(async (accounts) => {
            this.walletAddress = accounts[0];
            this.sortWalletAddress = this.walletAddress.substring(0, 5)
              + '...'
              + this.walletAddress.substring(this.walletAddress.length - 4)
          })
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
      socket.on("TickerChange", (ticker) => {
        if (ticker.pairId === this.pairId) {
          this.change = ticker.change;
          this.high = ticker.high;
          this.low = ticker.low;
          this.volume = ticker.volume;
        } else {}
      });
    },
    async getTicker() {
      if (this.pairId === null) return;
      const ticker = await getTicker24H(this.pairId);
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
      })
    },
  }
};
</script>

<style scoped>
</style>
