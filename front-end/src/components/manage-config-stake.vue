<template>
  <div>
    <Notifications/>
    <b-row>
      <b-col>
        <b-form-input v-model="stakeType" placeholder="Stake type"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="duration" placeholder="Duration"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="rewardBalance" placeholder="Reward"></b-form-input>
      </b-col>
      <b-col>
        <b-form-input v-model="penaltyBalance" placeholder="Penalty"></b-form-input>
      </b-col>
      <b-col>
        <b-button variant="primary" @click="createNewRule()">
          <span v-if="!isCreating">Create New Rule Stake</span>
          <b-spinner small v-if="isCreating"></b-spinner>
        </b-button>
      </b-col>
    </b-row>
    <hr>
    <b-table hover :items="itemConfigStakes" :fields="configStakeFields" :per-page="perPageConfigStake" current-page="1">
<!--      <template #cell(accountId)="row">-->
<!--        <a :href="urlCheckToken + row.value" target="_blank">{{row.value}}</a>-->
<!--      </template>-->
    </b-table>
    <div class="mt-3">
      <b-pagination v-model="currentPageStake" :per-page="perPageConfigStake" :total-rows="totalItemConfigStake" align="fill"></b-pagination>
    </div>
  </div>
</template>

<script>
import {configStake, getConfigStakeRule} from "@/services";

export default {
  data() {
    return {
      totalItemConfigStake: 0,
      currentPageStake: 1,
      itemConfigStakes: [],
      configStakeFields: [
        {key: '_id', label: 'Id', sortable: true},
        {key: 'stakeType', label: 'Stake type', variant: 'primary', sortable: true},
        {key: 'duration', label: 'Duration', sortable: true},
        {key: 'rewardBalance', label: 'Reward balance', variant: 'primary', sortable: true},
        {key: 'penaltyBalance', label: 'Penalty balance', sortable: true},
        {key: 'isActive', label: 'Is active', variant: 'primary', sortable: true},
        {key: 'createdAt', label: 'CreatedAt', sortable: true},
        {key: 'updatedAt', label: 'UpdatedAt', sortable: true},
      ],
      perPageConfigStake: 5,
      isCreating: false,
      stakeType: null,
      duration: null,
      rewardBalance: null,
      penaltyBalance: null
    };
  },
  watch: {
    currentPageStake() {
      this.getStakeRuleConfig();
    },
  },
  created() {
    this.getStakeRuleConfig();
  },
  methods: {
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
    createNewRule: function () {
      if (this.isCreating) return;
      this.isCreating = true;
      configStake(this.stakeType, this.duration, this.rewardBalance, this.penaltyBalance)
      .then(response => {
        this.getStakeRuleConfig();
        this.$notify({
          title: 'Config Stake Rule',
          text: response.data.message,
          type: 'success'
        });
      })
      .catch(error => {
        this.$notify({
          title: 'Config Stake Rule',
          text: error.response.data.message,
          type: 'warn'
        });
      })
      .finally(() => {
        this.isCreating = false;
      })
    }
  }
};
</script>
