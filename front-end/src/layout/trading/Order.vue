<template>
  <b-card style="background-color: rgb(18, 24, 38)">
    <b-tabs
      active-nav-item-class="font-weight-bold"
      active-tab-class="font-weight-bold text-success"
      small
    >
      <b-tab title="Spot" :title-link-class="'text-light'">
        <b-card-text class="mt-2">
          <b-row>
            <b-col>
              <i class="mt-1" style="color: white">{{quoteTokenSymbol}} balance: {{ quoteTokenBalance }}</i>
              <b-input min="0" type="number" v-model="buyMakerPrice" class="mt-1" :placeholder="'Price'"></b-input>
              <b-input min="0" type="number" v-model="buyMakerAmount" class="mt-1" :placeholder="'Amount'"></b-input>
              <b-input :disabled="true" v-model="buyMakerTotal" class="mt-1" :placeholder="'Total'"></b-input>
              <i class="mt-1">Estimate fee: {{ buyMakerCost }}</i>
              <b-button :disabled="isCreatingOrder" class="w-100 mt-1" variant="success" @click="createOrder('buy')">
                Buy {{ baseTokenSymbol }}
                <b-spinner v-if="isCreatingOrder" style="position: absolute; right: 30%; top: 28%" small type="border"></b-spinner>
              </b-button>
            </b-col>
            <b-col>
              <i class="mt-1" style="color: white">{{baseTokenSymbol}} balance: {{ baseTokenBalance }}</i>
              <b-input min="0" type="number" v-model="sellMakerPrice" class="mt-1" :placeholder="'Price'"></b-input>
              <b-input min="0" type="number" v-model="sellMakerAmount" class="mt-1" :placeholder="'Amount'"></b-input>
              <b-input  :disabled="true" v-model="sellMakerTotal" class="mt-1" :placeholder="'Total'"></b-input>
              <i class="mt-1">Estimate fee: {{ sellMakerCost }}</i>
              <b-button :disabled="isCreatingOrder" class="w-100 mt-1" variant="danger" @click="createOrder('sell')">
                Sell {{ baseTokenSymbol }}
                <b-spinner v-if="isCreatingOrder" style="position: absolute; right: 30%; top: 28%" small type="border"></b-spinner>
              </b-button>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
      <b-tab title="Market" :title-link-class="'text-light'">
        <b-card-text class="mt-2">
          <b-row>
            <b-col>
              <i class="mt-1" style="color: white">{{quoteTokenSymbol}} balance: {{ quoteTokenBalance }}</i>
              <b-input min="0" type="number" v-model="marketBuyAmount" class="mt-1" :placeholder="'Amount'"></b-input>
              <b-button :disabled="isCreatingOrder" class="w-100 mt-1" variant="success" @click="createMarketOrder('buy')">
                Buy {{ baseTokenSymbol }}
                <b-spinner v-if="isCreatingOrder" style="position: absolute; right: 30%; top: 28%" small type="border"></b-spinner>
              </b-button>
            </b-col>
            <b-col>
              <i class="mt-1" style="color: white">{{baseTokenSymbol}} balance: {{ baseTokenBalance }}</i>
              <b-input min="0" type="number" v-model="marketSellAmount" class="mt-1" :placeholder="'Amount'"></b-input>
              <b-button :disabled="isCreatingOrder" class="w-100 mt-1" variant="danger" @click="createMarketOrder('sell')">
                Sell {{ baseTokenSymbol }}
                <b-spinner v-if="isCreatingOrder" style="position: absolute; right: 30%; top: 28%" small type="border"></b-spinner>
              </b-button>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
import { LimitOrder, SignatureType } from "@0x/protocol-utils";
import { exchangeABI } from "@/libs/abi/exchange.ts";
import { erc20ABI } from "@/libs/abi/erc20.ts";
import {createOrder, estimateAllowance, getMatchOffers} from "@/plugins/backend";
import { notificationWithCustomMessage } from "@/plugins/notification";
const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const debounce = require('debounce');

export default {
  props: {
    walletProp: {
      type: String,
      required: true
    },
    pairId: {
      type: String,
      required: true
    },
    baseTokenSymbol: {
      type: String,
      required: true
    },
    quoteTokenSymbol: {
      type: String,
      required: true
    },
    baseTokenAddress: {
      type: String,
      required: true
    },
    quoteTokenAddress: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      baseTokenContract: null,
      quoteTokenContract: null,
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
      baseTokenBalance: 0,
      quoteTokenBalance: 0,
      isCreatingOrder: false,
      autoUpdateBalance: null,
      marketBuyAmount: null,
      marketSellAmount: null,
    };
  },
  watch: {
    walletProp(newVal, oldVal) {
      if (newVal !== '') {
        this.currentAccountWallet = newVal;
        this.getBalances();
      }
    },
    pairId: debounce(async function () {
      await this.setBaseQuoteContract();
      await this.getBalances();
    }, 500),
    buyMakerPrice: debounce( function () {
      if (this.buyMakerPrice > 0 && this.buyMakerAmount > 0) {
        this.buyMakerTotal = this.buyMakerPrice * this.buyMakerAmount
        this.estimateFee('buy');
      } else {
        this.buyMakerTotal = null;
        this.buyMakerCost = 0;
      }
    }, 1000),
    buyMakerAmount: debounce(function () {
      if (this.buyMakerPrice > 0 && this.buyMakerAmount > 0) {
        this.buyMakerTotal = this.buyMakerPrice * this.buyMakerAmount
        this.estimateFee('buy');
      } else {
        this.buyMakerTotal = null;
        this.buyMakerCost = 0;
      }
    }, 1000),
    sellMakerPrice: debounce(function () {
      if (this.sellMakerPrice > 0 && this.sellMakerAmount > 0) {
        this.sellMakerTotal = this.sellMakerPrice * this.sellMakerAmount
        this.estimateFee('sell');
      } else {
        this.sellMakerCost = 0;
        this.sellMakerTotal = null;
      }
    }, 1000),
    sellMakerAmount: debounce(function () {
      if (this.sellMakerPrice > 0 && this.sellMakerAmount > 0) {
        this.sellMakerTotal = this.sellMakerPrice * this.sellMakerAmount
        this.estimateFee('sell');
      } else {
        this.sellMakerCost = 0;
        this.sellMakerTotal = null;
      }
    }, 1000),
  },
  created: debounce(function () {
    this.client = new Web3(window.ethereum);
    this.setBaseQuoteContract();
    this.zeroExContract = new this.client.eth.Contract(exchangeABI, process.env.VUE_APP_ZERO_CONTRACT_ADDRESS);
    this.orderContract = new this.client.eth.Contract(exchangeABI, process.env.VUE_APP_ORDER_ADDRESS);
    this.client.eth.getAccounts().then(res => { if (res[0]) this.currentAccountWallet = res[0] });
  }, 500),
  mounted() {},
  methods: {
    async setBaseQuoteContract() {
      this.baseTokenContract = new this.client.eth.Contract(erc20ABI, this.baseTokenAddress);
      this.quoteTokenContract = new this.client.eth.Contract(erc20ABI, this.quoteTokenAddress);
    },
    async getTokenBalance() {
      setTimeout(async () => {
        const quoteTokenBalance = await this.quoteTokenContract.methods.balanceOf(this.currentAccountWallet).call();
        const baseTokenBalance = await this.baseTokenContract.methods.balanceOf(this.currentAccountWallet).call();
        this.quoteTokenBalance = new BigNumber(quoteTokenBalance).div(new BigNumber(10).pow(18)).toFixed(2);
        this.baseTokenBalance = new BigNumber(baseTokenBalance).div(new BigNumber(10).pow(18)).toFixed(2);
      }, 1000);
    },
    async getBalances() {
      await this.getTokenBalance();
      if (this.autoUpdateBalance) {
        clearInterval(this.autoUpdateBalance);
      }
      this.autoUpdateBalance = setInterval(() => {
        this.getTokenBalance()
      }, 4000)
    },
    async estimateFee(type) {
      const tx = await this.approveToken(type, false);
      const gas = await tx.estimateGas({from: this.currentAccountWallet});
      const gasPrice = await this.client.eth.getGasPrice();
      const gasCost = new BigNumber(gas).times(gasPrice).div(new BigNumber(10).pow(18)).toFixed(10);
      if (type === 'buy') {
        this.buyMakerCost = gasCost;
      } else {
        this.sellMakerCost = gasCost;
      }
    },
    async approveToken(type, isSend = true) {
      let estimateAmountApprove;
      let tx;
      if (type === 'buy') {
        estimateAmountApprove = (await estimateAllowance(this.currentAccountWallet, this.quoteTokenAddress)).data.data;
        estimateAmountApprove = new BigNumber(estimateAmountApprove).plus(this.buyMakerTotal);
        tx = this.quoteTokenContract.methods.approve(process.env.VUE_APP_ORDER_ADDRESS, estimateAmountApprove.times(new BigNumber(10).pow(18)))
      } else {
        estimateAmountApprove = (await estimateAllowance(this.currentAccountWallet, this.baseTokenAddress)).data.data;
        estimateAmountApprove = new BigNumber(estimateAmountApprove).plus(this.sellMakerAmount);
        tx = this.baseTokenContract.methods.approve(process.env.VUE_APP_ORDER_ADDRESS, estimateAmountApprove.times(new BigNumber(10).pow(18)))
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
          new BigNumber(this.buyMakerTotal).times(new BigNumber(10).pow(18)).toFixed() :
          new BigNumber(this.sellMakerAmount).times(new BigNumber(10).pow(18)).toFixed(),
        takerAmount: type === 'buy' ?
          new BigNumber(this.buyMakerAmount).times(new BigNumber(10).pow(18)).toFixed() :
          new BigNumber(this.sellMakerTotal).times(new BigNumber(10).pow(18)).toFixed(),
        takerTokenFeeAmount: new BigNumber(0).toString(),
        sender: process.env.VUE_APP_ZERO_ADDRESS,
        feeRecipient: process.env.VUE_APP_ZERO_ADDRESS,
        expiry: Math.floor(Date.now() / 1000 + 3000),
        pool: process.env.VUE_APP_DEFAULT_POOL,
        salt: Date.now().toString()
      });
    },
    async approveTokenForMarket(type, amount) {
      let estimateAmountApprove;
      let tx;
      if (type === 'buy') {
        estimateAmountApprove = (await estimateAllowance(this.currentAccountWallet, this.quoteTokenAddress)).data.data;
        estimateAmountApprove = new BigNumber(estimateAmountApprove).plus(amount);
        if (estimateAmountApprove.gt(new BigNumber(this.quoteTokenBalance).times(new BigNumber(10).pow(18)))) {
          notificationWithCustomMessage('warning', this, `Not enough balances`);
          throw Error('');
        }
        tx = this.quoteTokenContract.methods.approve(process.env.VUE_APP_ORDER_ADDRESS, estimateAmountApprove)
      } else {
        estimateAmountApprove = (await estimateAllowance(this.currentAccountWallet, this.baseTokenAddress)).data.data;
        estimateAmountApprove = new BigNumber(estimateAmountApprove).plus(amount);
        if (estimateAmountApprove.gt(new BigNumber(this.baseTokenBalance).times(new BigNumber(10).pow(18)))) {
          notificationWithCustomMessage('warning', this, `Not enough balances`);
          throw Error('');
        }
        tx = this.baseTokenContract.methods.approve(process.env.VUE_APP_ORDER_ADDRESS, estimateAmountApprove)
      }
      await tx.send({
        from: this.currentAccountWallet,
        gas: 800000,
        gasPrice: 20e9
      });
    },
    async createMarketOrder(type) {
      if (this.isCreatingOrder) return;
      this.isCreatingOrder = true;
      if (type === 'buy') {
        if (!this.marketBuyAmount) {
          this.isCreatingOrder = false;
          return notificationWithCustomMessage('warning', this, `Please input full fill`);
        }
      }
      if (type === 'sell') {
        if (!this.marketSellAmount) {
          this.isCreatingOrder = false;
          return notificationWithCustomMessage('warning', this, `Please input full fill`);
        }
      }

      let remainingAmount = type === 'buy' ?
        new BigNumber(this.marketBuyAmount).times(new BigNumber(10).pow(18)) :
        new BigNumber(this.marketSellAmount).times(new BigNumber(10).pow(18));

      let approveAmount = type === 'sell' ? remainingAmount.toFixed() : new BigNumber("0");

      const matchOrders = await getMatchOffers(
        type === 'buy' ? this.quoteTokenAddress : this.baseTokenAddress,
        type === 'buy' ? this.baseTokenAddress : this.quoteTokenAddress,
        "1",
        remainingAmount.toFixed(),
        true,
      );
      if (matchOrders.data.data.length === 0) {
        this.isCreatingOrder = false;
        return notificationWithCustomMessage('warning', this, `There no open order on market`);
      }

      const signatures = [];
      const limitOrders = [];
      const takerTokenFillAmounts = [];
      const revertIfNotFullFill = false;

      for (const order of matchOrders.data.data) {
        let takerTokenFillAmount;
        if (remainingAmount.minus(order.remainingAmount).gte(0)) {
          takerTokenFillAmount = type === 'buy' ?
            new BigNumber(order.remainingAmount).times(order.price).toFixed() :
            new BigNumber(order.remainingAmount).toFixed();
          remainingAmount = remainingAmount.minus(order.remainingAmount);
        } else {
          takerTokenFillAmount = type === 'buy' ?
            remainingAmount.times(order.price).toFixed() :
            remainingAmount.toFixed();
          remainingAmount = new BigNumber('0');
        }
        if (type === 'buy') {
          approveAmount = approveAmount.plus(takerTokenFillAmount);
        }
        takerTokenFillAmounts.push(takerTokenFillAmount);

        signatures.push(JSON.parse(order.signature));
        limitOrders.push(new LimitOrder({
          chainId: Number(order.chainId),
          verifyingContract: order.verifyingContract,
          maker: order.maker,
          taker: order.taker,
          makerToken: order.makerToken,
          takerToken: order.takerToken,
          makerAmount: order.makerAmount,
          takerAmount: order.takerAmount,
          takerTokenFeeAmount: order.takerTokenFeeAmount,
          sender: order.sender,
          feeRecipient: order.feeRecipient,
          expiry: Number(order.expiry),
          pool: order.pool,
          salt: order.salt
        }));
      }

      if (remainingAmount.gt('0')) {
        this.isCreatingOrder = false;
        return notificationWithCustomMessage('warning', this, `Market not have enough balances`);
      }

      try {
        await this.approveTokenForMarket(type, approveAmount);
        await this.zeroExContract.methods.batchFillLimitOrders(
          limitOrders,
          signatures,
          takerTokenFillAmounts,
          revertIfNotFullFill
        ).send({
          from: this.currentAccountWallet,
          value: 0,
          gasPrice: 20e10,
        });
      } catch {
        this.isCreatingOrder = false;
      }
      this.isCreatingOrder = false;
    },
    async createOrder(type) {
      if (this.isCreatingOrder) return;
      if (type === 'buy') {
        if (!this.buyMakerTotal) {
          return notificationWithCustomMessage('warning', this, `Please input full fill`);
        }
        if (new BigNumber(this.buyMakerAmount).gt(this.quoteTokenBalance)) {
          return notificationWithCustomMessage('warning', this, `Not enough balance of ${this.quoteTokenSymbol}`);
        }
      }
      if (type === 'sell') {
        if (!this.sellMakerTotal) {
          return notificationWithCustomMessage('warning', this, `Please input full fill`);
        }
        if (new BigNumber(this.sellMakerAmount).gt(this.baseTokenBalance)) {
          return notificationWithCustomMessage('warning', this, `Not enough balance of ${this.baseTokenSymbol}`);
        }
      }
      this.isCreatingOrder = true;
      const limitOrder = await this.createLimitOrder(type);

      try {
        await this.approveToken(type);
      } catch {
        this.isCreatingOrder = false;
        return;
      }

      const matchOrders = await getMatchOffers(
        limitOrder.makerToken,
        limitOrder.takerToken,
        type === 'buy' ? this.buyMakerPrice : this.sellMakerPrice,
        type === 'buy' ? limitOrder.takerAmount : limitOrder.makerAmount,
        type
      );

      if (matchOrders.data.data.length > 0) {
        const signatures = [];
        const limitOrders = [];
        const takerTokenFillAmounts = [];
        const revertIfNotFullFill = false;
        let remainingBaseAmount = type === 'buy' ?
          new BigNumber(limitOrder.takerAmount) : new BigNumber(limitOrder.makerAmount);

        for (const order of matchOrders.data.data) {
          let takerTokenFillAmount;
          if (remainingBaseAmount.minus(order.remainingAmount).gte(0)) {
            takerTokenFillAmount = type === 'buy' ?
              new BigNumber(order.remainingAmount).times(this.buyMakerPrice).toFixed() :
              new BigNumber(order.remainingAmount).toFixed();
            remainingBaseAmount = remainingBaseAmount.minus(order.remainingAmount);
          } else {
            takerTokenFillAmount = type === 'buy' ?
              remainingBaseAmount.times(this.buyMakerPrice).toFixed() :
              remainingBaseAmount.toFixed();
            remainingBaseAmount = new BigNumber('0')
          }
          takerTokenFillAmounts.push(takerTokenFillAmount);

          signatures.push(JSON.parse(order.signature));
          limitOrders.push(new LimitOrder({
            chainId: Number(order.chainId),
            verifyingContract: order.verifyingContract,
            maker: order.maker,
            taker: order.taker,
            makerToken: order.makerToken,
            takerToken: order.takerToken,
            makerAmount: order.makerAmount,
            takerAmount: order.takerAmount,
            takerTokenFeeAmount: order.takerTokenFeeAmount,
            sender: order.sender,
            feeRecipient: order.feeRecipient,
            expiry: Number(order.expiry),
            pool: order.pool,
            salt: order.salt
          }));
        }

        try {
          await this.zeroExContract.methods.batchFillLimitOrders(
            limitOrders,
            signatures,
            takerTokenFillAmounts,
            revertIfNotFullFill
          ).send({
            from: this.currentAccountWallet,
            value: 0,
            gasPrice: 20e10,
          });
        } catch {
          this.isCreatingOrder = false;
        }


        if (remainingBaseAmount.eq('0')) {
          this.isCreatingOrder = false;
          return;
        }
        else {
          limitOrder.makerAmount = type === 'buy' ?
            remainingBaseAmount.times(this.buyMakerPrice).toFixed() :
            remainingBaseAmount.toFixed()
          limitOrder.takerAmount = type === 'buy' ?
            remainingBaseAmount.toFixed() :
            remainingBaseAmount.times(this.sellMakerPrice).toFixed();
        }
      }

      const signature = await limitOrder.getSignatureWithProviderAsync(window.web3.currentProvider, SignatureType.EIP712, this.currentAccountWallet);
      const price = type === 'buy' ?
        new BigNumber(limitOrder.makerAmount).div(limitOrder.takerAmount).toString() :
        new BigNumber(limitOrder.takerAmount).div(limitOrder.makerAmount).toString();

      createOrder({...limitOrder, type, orderHash: limitOrder.getHash(), price, signature: JSON.stringify(signature)}).then(res => {
        notificationWithCustomMessage('success', this, res.data.message);
      }).catch(error => {
        notificationWithCustomMessage('warning', this, error.response.data.message);
      }).finally(() => {
        this.isCreatingOrder = false;
      })
    }
  }
};
</script>
