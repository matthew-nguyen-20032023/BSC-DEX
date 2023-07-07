<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <Notifications/>
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"><h3>Wallet Information</h3></slot>
          </div>

          <div class="modal-body m-lg-3">
            <b-row>
              <b-col>Wallet id</b-col>
              <b-col>{{ walletId }}</b-col>
            </b-row>
            <hr>
            <b-row>
              <b-col>Account id</b-col>
              <b-col>{{ accountId }}</b-col>
            </b-row>
            <hr>
            <b-row>
              <b-col>Evm address</b-col>
              <b-col>{{ evmAddress }}</b-col>
            </b-row>
            <hr>
            <b-row>
              <b-col>Hbar balance</b-col>
              <b-col>{{ hbarBalance }}</b-col>
            </b-row>
            <hr>
            <b-row>
              <b-col>Private key</b-col>
              <b-col @click="exportPrivateKey()" style="color: #0D6efd; cursor: pointer" v-if="!privateKey">Export private key</b-col>
              <b-col style="cursor: pointer; overflow: auto" v-if="privateKey" @click="copyToClipboard(privateKey)">{{ privateKey }}</b-col>
            </b-row>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <b-button class="w-100" @click="$emit('close')">Close</b-button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import {exportPrivateKey, getWalletInformation} from "@/services";

export default {
  props: {
    show: Boolean,
  },
  created() {
    this.getWalletInformation();
  },
  watch: {
    show(newValue) {
      if (newValue === true) this.getWalletInformation();
    }
  },
  data() {
    return {
      walletId: '',
      accountId: '',
      evmAddress: '',
      hbarBalance: '',
      privateKey: false
    };
  },
  methods: {
    copyToClipboard: function (text) {
      this.$notify({
        title: 'Private key',
        text: "Private key have copy to clipboard",
        type: 'success'
      });
      navigator.clipboard.writeText(text);
    },
    exportPrivateKey: function () {
      exportPrivateKey()
      .then(response => {
        this.privateKey = response.data.data.privateKey;
        this.$notify({
          title: 'Wallet',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Wallet',
          text: error.response.data.message,
          type: 'warn'
        });
      })
    },
    getWalletInformation: function () {
      getWalletInformation()
      .then(response => {
        this.walletId = response.data.data.wallet._id;
        this.accountId = response.data.data.wallet.accountId;
        this.evmAddress = response.data.data.wallet.evmAddress;
        this.hbarBalance = response.data.data.balance.hbars;
        this.$notify({
          title: 'Wallet',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Wallet',
          text: error.response.data.message,
          type: 'warn'
        });
      })
    }
  }
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  border-radius: 20px;
  width: 40%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #0D6efd;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>