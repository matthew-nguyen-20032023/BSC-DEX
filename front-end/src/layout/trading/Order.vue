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
              <b-input class="mt-1" :placeholder="'Price'"></b-input>
              <b-input class="mt-1" :placeholder="'Amount'"></b-input>
              <b-input class="mt-1" :placeholder="'Total'"></b-input>
              <i class="mt-1">Estimate fee: 0.0008</i>
              <b-button class="w-100 mt-1" variant="success" @click="createOrder()">Buy {{ baseTokenSymbol }}</b-button>
            </b-col>
            <b-col>
              <b-input class="mt-1" :placeholder="'Price'"></b-input>
              <b-input class="mt-1" :placeholder="'Amount'"></b-input>
              <b-input class="mt-1" :placeholder="'Total'"></b-input>
              <i class="mt-1">Estimate fee: 0.0008</i>
              <b-button class="w-100 mt-1" variant="danger">Sell {{ baseTokenSymbol }}</b-button>
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
const BigNumber = require('bignumber.js');
const Web3 = require('web3');

export default {
  props: {
    baseTokenSymbol: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      client: null,
      contractEx: null,
      contractToken: null,
      contractOtherToken: null,
      nativeOrderContract: null,
    };
  },
  mounted() {},
  methods: {
    async approveToken() {
      this.contractToken = new this.client.eth.Contract(erc20ABI, '0xa877612B5330541eB161b96976a6c447e9ce4e7D');
      this.contractOtherToken = new this.client.eth.Contract(erc20ABI, '0xc5f4ae3af43e8260d5101b17def71ff43eb7680b');
      await this.contractToken.methods.approve('0x6fc4D23d60472B78901CF59beF7EA8990f49B61D', new BigNumber(2).times(new BigNumber(10).pow(18)).toString())
        .send({
          from: '0x594Ab22De186eBad2f4c0FD4F3D224599BEc3Cac',
          value: 0,
          gas: 800000,
          gasPrice: 20e9
        });
      await this.contractOtherToken.methods.approve('0x6fc4D23d60472B78901CF59beF7EA8990f49B61D', new BigNumber(4).times(new BigNumber(10).pow(18)).toString())
        .send({
          from: '0x594Ab22De186eBad2f4c0FD4F3D224599BEc3Cac',
          value: 0,
          gas: 800000,
          gasPrice: 20e9
        });
    },
    async createOrder() {
      if (window.ethereum) {
        this.client = new Web3(window.ethereum);
        this.contractEx = new this.client.eth.Contract(exchangeABI,'0x51Bfa0FCebd9a9F72b0523aa37968794F3C214a7');
        this.nativeOrderContract = new this.client.eth.Contract(exchangeABI,'0x6fc4D23d60472B78901CF59beF7EA8990f49B61D');
      }
      await this.approveToken();
      const limitOrder = new LimitOrder({
        chainId: 97,
        verifyingContract: '0x51Bfa0FCebd9a9F72b0523aa37968794F3C214a7',
        maker: '0x594Ab22De186eBad2f4c0FD4F3D224599BEc3Cac',
        taker: '0x0000000000000000000000000000000000000000',
        makerToken: '0xa877612B5330541eB161b96976a6c447e9ce4e7D',
        takerToken: '0xc5f4ae3af43e8260d5101b17def71ff43eb7680b',
        makerAmount: new BigNumber(2).times(new BigNumber(10).pow(18)).toString(),
        takerAmount: new BigNumber(4).times(new BigNumber(10).pow(18)).toString(),
        takerTokenFeeAmount: new BigNumber(0).toString(),
        sender: '0x0000000000000000000000000000000000000000',
        feeRecipient: '0x0000000000000000000000000000000000000000',
        expiry: Math.floor(Date.now() / 1000 + 300),
        pool: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: Date.now().toString(),
      });

      const signature = await limitOrder.getSignatureWithProviderAsync(window.web3.currentProvider, SignatureType.EIP712, '0x594Ab22De186eBad2f4c0FD4F3D224599BEc3Cac');
      await this.nativeOrderContract.methods.fillLimitOrder(
        limitOrder,
        signature,
        new BigNumber(4).times(new BigNumber(10).pow(18)).toString()
      ).send({
        from: '0x594Ab22De186eBad2f4c0FD4F3D224599BEc3Cac',
        value: 0,
        gas: 800000,
        gasPrice: 20e9
      });
    }
  }
};
</script>
