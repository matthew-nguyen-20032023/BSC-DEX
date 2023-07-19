<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      active-nav-item-class="font-weight-bold"
      active-tab-class="font-weight-bold text-success"
      small
    >
      <b-tab title="Limit" :title-link-class="'text-light'">
        <b-card-text>
          <b-row>
            <b-col>
              <b-input v-model="buyMakerPrice" class="mt-1" :placeholder="'Price'"></b-input>
              <b-input v-model="buyMakerAmount" class="mt-1" :placeholder="'Amount'"></b-input>
              <b-input :disabled="true" v-model="buyMakerTotal" class="mt-1" :placeholder="'Total'"></b-input>
              <i class="mt-1">Estimate fee: {{ buyMakerCost }}</i>
              <b-button class="w-100 mt-1" variant="success" @click="createOrder('buy')">Buy {{ baseTokenSymbol }}</b-button>
            </b-col>
            <b-col>
              <b-input v-model="sellMakerPrice" class="mt-1" :placeholder="'Price'"></b-input>
              <b-input v-model="sellMakerAmount" class="mt-1" :placeholder="'Amount'"></b-input>
              <b-input :disabled="true" v-model="sellMakerTotal" class="mt-1" :placeholder="'Total'"></b-input>
              <i class="mt-1">Estimate fee: {{ sellMakerCost }}</i>
              <b-button class="w-100 mt-1" variant="danger" @click="createOrder('sell')">Sell {{ baseTokenSymbol }}</b-button>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
      <b-tab title="Market" :title-link-class="'text-light'">
        <b-card-text>Tab contents 2</b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { LimitOrder, SignatureType } from "@0x/protocol-utils";
import { exchangeABI } from "@/libs/abi/exchange.ts";
import { erc20ABI } from "@/libs/abi/erc20.ts";
import { createOrder } from "@/plugins/backend";
import { notificationWithCustomMessage } from "@/plugins/notification";
const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const debounce = require('debounce');

export default {
  props: {
    baseTokenSymbol: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      baseTokenContract: null,
      quoteTokenContract: null,
      baseTokenAddress: "0xf0fbdc550bbA5689b5c51e7B7AF339E2c731ee5f",
      quoteTokenAddress: "0x0518D7a894d7E08DDDaCCD2550C33eBa399ad2b6",
      zeroExContract: null,
      orderContract: null,
      client: null,
      currentAccountWallet: null,
      buyMakerPrice: null,
      buyMakerAmount: null,
      buyMakerTotal: null,
      buyMakerCost: 0,
      sellMakerPrice: null,
      sellMakerAmount: null,
      sellMakerTotal: null,
      sellMakerCost: 0,
    };
  },
  watch: {
    buyMakerPrice: debounce( function () {
      if (this.buyMakerPrice && this.buyMakerAmount) {
        this.buyMakerTotal = this.buyMakerPrice * this.buyMakerAmount
        this.estimateFee('buy');
      } else {
        this.buyMakerTotal = null;
        this.buyMakerCost = 0;
      }
    }, 1000),
    buyMakerAmount: debounce(function () {
      if (this.buyMakerPrice && this.buyMakerAmount) {
        this.buyMakerTotal = this.buyMakerPrice * this.buyMakerAmount
        this.estimateFee('buy');
      } else {
        this.buyMakerTotal = null;
        this.buyMakerCost = 0;
      }
    }, 1000),
    sellMakerPrice: debounce(function () {
      if (this.sellMakerPrice && this.sellMakerAmount) {
        this.sellMakerTotal = this.sellMakerPrice * this.sellMakerAmount
        this.estimateFee('sell');
      } else {
        this.sellMakerCost = 0;
        this.sellMakerTotal = null;
      }
    }, 1000),
    sellMakerAmount: debounce(function () {
      if (this.sellMakerPrice && this.sellMakerAmount) {
        this.sellMakerTotal = this.sellMakerPrice * this.sellMakerAmount
        this.estimateFee('sell');
      } else {
        this.sellMakerCost = 0;
        this.sellMakerTotal = null;
      }
    }, 1000),
  },
  created() {
    this.client = new Web3(window.ethereum);
    this.baseTokenContract = new this.client.eth.Contract(erc20ABI, this.baseTokenAddress);
    this.quoteTokenContract = new this.client.eth.Contract(erc20ABI, this.quoteTokenAddress);
    this.zeroExContract = new this.client.eth.Contract(exchangeABI, process.env.VUE_APP_ZERO_CONTRACT_ADDRESS);
    this.orderContract = new this.client.eth.Contract(exchangeABI, process.env.VUE_APP_ORDER_ADDRESS);
    this.client.eth.getAccounts().then(res => { this.currentAccountWallet = res[0] });
  },
  mounted() {},
  methods: {
    async estimateFee(type) {
      const tx = await this.approveToken(type, false);
      const gas = await tx.estimateGas({from: this.currentAccountWallet});
      const gasPrice = await this.client.eth.getGasPrice();
      const gasCost = new BigNumber(gas).times(gasPrice).div(new BigNumber(10).pow(18));
      if (type === 'buy') {
        this.buyMakerCost = gasCost;
      } else {
        this.sellMakerCost = gasCost;
      }
    },
    async approveToken(type, isSend = true) {
      let tx;
      if (type === 'buy') {
        tx = this.quoteTokenContract.methods.approve(process.env.VUE_APP_ORDER_ADDRESS, new BigNumber(this.buyMakerAmount).times(new BigNumber(10).pow(18)))
      } else {
        tx = this.baseTokenContract.methods.approve(process.env.VUE_APP_ORDER_ADDRESS, new BigNumber(this.sellMakerAmount).times(new BigNumber(10).pow(18)))
      }

      if (isSend) {
        await tx.send({
          from: this.currentAccountWallet,
          gas: 800000,
          gasPrice: 20e9
        });
        return;
      }
      return tx;
    },
    async createLimitOrder(type = 'buy') {
      return new LimitOrder({
        chainId: Number(process.env.VUE_APP_CHAIN_ID),
        verifyingContract: process.env.VUE_APP_ZERO_CONTRACT_ADDRESS,
        maker: this.currentAccountWallet,
        taker: process.env.VUE_APP_ZERO_ADDRESS,
        makerToken: type === 'buy' ? this.quoteTokenAddress : this.baseTokenAddress,
        takerToken: type === 'buy' ? this.baseTokenAddress : this.quoteTokenAddress,
        makerAmount: type === 'buy' ?
          new BigNumber(this.buyMakerAmount).times(new BigNumber(10).pow(18)).toString() :
          new BigNumber(this.sellMakerAmount).times(new BigNumber(10).pow(18)).toString(),
        takerAmount: type === 'buy' ?
          new BigNumber(this.buyMakerTotal).times(new BigNumber(10).pow(18)).toString() :
          new BigNumber(this.sellMakerTotal).times(new BigNumber(10).pow(18)).toString(),
        takerTokenFeeAmount: new BigNumber(0).toString(),
        sender: process.env.VUE_APP_ZERO_ADDRESS,
        feeRecipient: process.env.VUE_APP_ZERO_ADDRESS,
        expiry: Math.floor(Date.now() / 1000 + 3000),
        pool: process.env.VUE_APP_DEFAULT_POOL,
        salt: Date.now().toString()
      });
    },
    async createOrder(type) {
      // await this.baseTokenContract.methods.mint("0x2b98a2c5A0155d9D6aAa0747E6bbE3D285EA7bb7", '100000000000000000000000').send({from: this.currentAccountWallet});
      // await this.quoteTokenContract.methods.mint("0x19Ef6AB7a5e9753C214462df01F77aD324dA645D", '100000000000000000000000').send({from: this.currentAccountWallet});
      // return;
      const limitOrder = await this.createLimitOrder(type);
      const signature = await limitOrder.getSignatureWithProviderAsync(window.web3.currentProvider, SignatureType.EIP712, this.currentAccountWallet);
      await this.approveToken(type);
      createOrder({...limitOrder, type, signature: JSON.stringify(signature)}).then(res => {
        notificationWithCustomMessage('success', this, res.data.message);
      }).catch(error => {
        notificationWithCustomMessage('warning', this, error.response.data.message);
      })
    },
    async takeOrder() {
      const limitOrder = JSON.parse(localStorage.getItem('limitOrder'));
      await this.approveToken('sell');
      const data = await this.orderContract.methods.fillLimitOrder(
        limitOrder,
        JSON.parse(localStorage.getItem('signature')),
        new BigNumber(this.buyMakerTotal).times(new BigNumber(10).pow(18)).toString()
      ).send({
        from: this.currentAccountWallet,
        value: 0,
        gas: 800000,
        gasPrice: 20e9
      });
      console.log(data);
    }
  }
};
</script>
