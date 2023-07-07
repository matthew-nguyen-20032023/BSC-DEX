<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <Notifications/>
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"><h3>Stake NFT</h3></slot>
          </div>

          <b-table hover :items="itemConfigStakes" :fields="configStakeFields" :per-page="perPageConfigStake" current-page="1">
            <template #cell(manage)="data">
              <b-button variant="success" @click="stakeNFT(data.item.stakeType)">
                <span v-if="!isProcessStake">Stake</span>
                <b-spinner small v-if="isProcessStake"></b-spinner>
              </b-button>
            </template>
          </b-table>
          <div class="mt-3">
            <b-pagination v-model="currentPageStake" :per-page="perPageConfigStake" :total-rows="totalItemConfigStake" align="fill"></b-pagination>
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

import {getConfigStakeRule, stakeNFT} from "@/services";

export default {
  props: {
    show: Boolean,
    nftId: String,
  },
  created() {
  },
  watch: {
    show(newVal) {
      if (newVal) this.getStakeRuleConfig();
    }
  },
  data() {
    return {
      isProcessStake: false,
      totalItemConfigStake: 0,
      currentPageStake: 1,
      itemConfigStakes: [],
      configStakeFields: [
        {key: 'stakeType', label: 'Stake type', variant: 'primary', sortable: true},
        {key: 'duration', label: 'Duration', sortable: true},
        {key: 'rewardBalance', label: 'Reward balance', variant: 'primary', sortable: true},
        {key: 'penaltyBalance', label: 'Penalty balance', sortable: true},
        {key: 'manage', label: '', sortable: true},
      ],
      perPageConfigStake: 5,
    };
  },
  methods: {
    stakeNFT: function (stakeType) {
      if (this.isProcessStake) return;
      this.isProcessStake = true;
      stakeNFT(stakeType, this.nftId)
      .then(response => {
        this.$emit('staked');
        this.$notify({
          title: 'Stake',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Stake',
          text: error.response.data.message,
          type: 'warn'
        });
      })
      .finally(() => {
        this.isProcessStake = false;
      })
    },
    getStakeRuleConfig: function () {
      getConfigStakeRule(this.currentPageStake, this.perPageConfigStake)
          .then(response => {
            this.itemConfigStakes = response.data.data.configs;
            this.totalItemConfigStake = response.data.data.total;
            this.$notify({
              title: 'Get Stake Rule',
              text: response.data.message,
              type: 'success'
            });
          })
          .catch(error => {
            this.$notify({
              title: 'Get Stake Rule',
              text: error.response.data.message,
              type: 'warn'
            });
          })
    },
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