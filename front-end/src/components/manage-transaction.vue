<template>
  <div>
    <Notifications/>
    <b-row>
      <b-table hover :items="transactions" :fields="transactionsFields" :per-page="perPageTransaction" current-page="1">
        <template #cell(transactionId)="row">
          <a :href="urlCheckTransaction + row.value" target="_blank">{{row.value}}</a>
        </template>
      </b-table>
      <div class="mt-3">
        <b-pagination v-model="currentTransactionPage" :per-page="perPageTransaction" :total-rows="totalTransaction" align="fill"></b-pagination>
      </div>
    </b-row>
  </div>
</template>

<script>
import {getTransaction} from "@/services";
import {HEDERA_TRANSACTION_CHECK} from "@/services/config";

export default {
  data() {
    return {
      urlCheckTransaction: HEDERA_TRANSACTION_CHECK,
      totalTransaction: 0,
      perPageTransaction: 5,
      currentTransactionPage: 1,
      transactions: [],
      transactionsFields: [
        {key: '_id', label: 'Id', sortable: true},
        {key: 'type', label: 'Transaction type', variant: 'primary', sortable: true},
        {key: 'transactionId', label: 'Transaction id', sortable: true},
        {key: 'status', label: 'Status', variant: 'primary', sortable: true},
        {key: 'createdAt', label: 'CreatedAt', sortable: true},
        {key: 'updatedAt', label: 'UpdatedAt', sortable: true},
      ],
    };
  },
  created() {
    this.getTransaction();
  },
  watch: {
    currentTransactionPage() {
      this.getTransaction();
    },
  },
  methods: {
    getTransaction: function () {
      getTransaction(this.currentTransactionPage, this.perPageTransaction)
          .then(response => {
            this.transactions = response.data.data;
            this.totalTransaction = response.data.metadata.total;
            this.$notify({
              title: 'Transaction',
              text: response.data.message,
              type: 'success'
            });
          })
          .catch(error => {
            this.$notify({
              title: 'Transaction',
              text: error.response.data.message,
              type: 'warn'
            });
          })
    },
  }
};
</script>
