<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <Notifications/>
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"><h3>Update NFT</h3></slot>
          </div>
          <b-row>
            <b-col>
              <label>Ipfs</label>
              <b-form-input v-model="ipfs" placeholder="Ipfs"></b-form-input>
            </b-col>
            <b-col>
              <label>Tier</label>
              <b-form-input v-model="tier" placeholder="Tier"></b-form-input>
            </b-col>
            <b-col>
              <label>Balance</label>
              <b-form-input v-model="balance" placeholder="Balance"></b-form-input>
            </b-col>
          </b-row>
          <div class="modal-footer mt-3">
            <b-button class="w-50" variant="outline-warning" @click="update()">
              <span v-if="!isUpdating">Update</span>
              <b-spinner small v-if="isUpdating"></b-spinner>
            </b-button>
              <b-button class="w-50" variant="outline-success" @click="cancel()">Cancel</b-button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>

import {updateNFT} from "@/services";

export default {
  props: {
    show: Boolean,
    nft: Object,
  },
  created() {
  },
  watch: {
    nft(newVal) {
      this.ipfs = newVal.ipfs;
      this.tier = newVal.tier;
      this.balance = newVal.balance;
    }
  },
  data() {
    return {
      isUpdating: false,
      ipfs: null,
      tier: null,
      balance: null,
    };
  },
  methods: {
    update: function () {
      if (this.isUpdating) return;
      this.isUpdating = true;
      updateNFT(this.nft._id, this.ipfs, this.tier, this.balance)
      .then(response => {
        this.$notify({
          title: 'Update NFT',
          text: response.data.message,
          type: 'success'
        });
        this.$emit('nftUpdated')
      })
      .catch(error => {
        this.$notify({
          title: 'Update NFT',
          text: error.response.data.message,
          type: 'warn'
        });
      })
      .finally(() => {
        this.isUpdating = false;
      })
    },
    cancel: function () {
      this.$emit('cancelUpdateNFT');
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