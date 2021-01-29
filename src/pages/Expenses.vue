<template>
<q-pull-to-refresh @refresh="refresh" color="primary">
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Expense Report"
        class="my-sticky-column-table"
        :data="allExpenses"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :filter-method="customFilter" 
        :pagination.sync="pagination"
      >
      <template v-slot:top-right="props">
        <q-checkbox v-model="checkToday" class="q-mr-sm q-mb-sm" label="Today" />
        <q-input v-model="totalAmount" readonly label="Total" dense clearable outlined class="q-mr-sm q-mb-sm" style="width:140px"/>
        <q-select label="Branch" v-model="filters.branch" :options="branches" class="q-mr-sm q-mb-sm" style="min-width:120px" dense clearable outlined />
        <q-input label="Date" v-model="filters.date" mask="date" class="q-mr-sm q-mb-sm" style="width:140px" dense outlined>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="filters.date" v-close-popup/>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn @click="showExpenseDialog(props.row)" outline color="primary" label="Add Expense" class="q-mr-sm q-mb-sm"/>
      </template>
      <template v-slot:body-cell-expenseDescription="props">
        <q-td :props="props">
          {{props.row.expenseDescription}}
        </q-td>
      </template>
       <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn dense color="red" icon="delete" @click="removeExpense(props.row)"/>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog v-model="expenseDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px" class="column">
      <q-form ref="expenseForm">
        <q-card-section>
          <div class="text-h6">{{expenseDialogTitle}} Expense</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
            <q-input
              outlined
              color="primary"
              for="expenseAmount"
              lazy-rules="lazy-rules"
              name="expenseAmount"
              label="Amount"
              style="width: 100%"
              v-model="currentExpense.expenseAmount"
              type="number"
              :rules="[val => !!val || '*Field is required']"
            />
            <q-input
              type="textarea"
              outlined
              color="primary"
              for="description"
              lazy-rules="lazy-rules"
              name="description"
              label="Description"
              style="width: 100%"
              v-model="currentExpense.expenseDescription"
              :rules="[val => !!val || '*Field is required']"
            />
            <q-select 
              label="Branch" 
              v-model="currentExpense.branchName" 
              :options="branches" 
              style="width: 100%"
              class="q-mb-md"
              outlined />
            <q-input label="Date" v-model="currentExpense.expenseDate" mask="date" style="width: 100%" outlined :rules="[val => !!val || '*Field is required']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="currentExpense.expenseDate" v-close-popup/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCEL" color="primary" v-close-popup />
          <q-btn flat label="OK" @click="saveExpense"/>
        </q-card-actions>
      </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</q-pull-to-refresh>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { date } from 'quasar'

export default {
  data() {
    const self = this;
    return {
      mode: "list",
      checkToday: false,
      currentExpense: {},
      filters: {
        branch: '',
        date: ''
      },
      columns: [
        {
          name: "expenseId",
          required: true,
          label: "Expense ID",
          align: "left",
          field: "id",
          format: function(val){
            return val.toUpperCase()
          },
          sortable: true
        },
        {
          name: "expenseAmount",
          align: "left",
          label: "Expense Amount",
          field: "expenseAmount",
          format: function(val){
            return self.$options.filters.toCurrency(val)
          },
          sortable: true
        },
        {
          name: "expenseDescription",
          align: "center",
          label: "Expense Description",
          field: "expenseDescription",
          format: function(val){
            if(val){
              return JSON.parse(val)
            }
          },
          sortable: false
        },
        {
          name: "createdBy",
          align: "left",
          label: "Created By",
          field: "createdBy",
          format: function(val){
            const user = self.allUsers.find(function(user){
              return user.id == val
            })
            if(user){
              return (user.fullName) ? user.fullName : user.email
            }
          },
          sortable: true
        },
        {
          name: "expenseDate",
          align: "left",
          label: "Expense Date",
          field: "expenseDate",
          format: function(val){
            if(val){
              if(!(val instanceof Date)){
                val = val.toDate()
              }
              return val.toDateString()
            }
          },
          sortable: true
        },
        {
          name: "branchName",
          align: "left",
          label: "Branch",
          field: "branchName",
          sortable: true
        },
        {
          name: "action",
          align: "center",
          label: "Action",
          field: "action",
          sortable: true
        }
      ],
      pagination: {
        rowsPerPage: 10,
        sortBy: "expenseDate",
        descending: true
      },
      branches: [
        'Cavite',
        'Bulacan'
      ],
      totalFilteredAmount: 0,
      expenseDialog: false
    }
  },
  mounted(){
    
  },
  computed: {
    ...mapGetters('expense', ['allExpenses']),
    ...mapGetters('user', ['allUsers']),
    filter() {
      return {
        branch: this.filters.branch,
        date: this.filters.date     
      }
    },
    totalAmount: {
      get(){
        return this.$options.filters.toCurrency(this.totalFilteredAmount)
      },
      set(val){
        return val
      }
    },
    expenseDialogTitle: {
      get() {
        return this.currentExpense.id ? 'Update' : 'Add'
      }
    },
    isUpdatingExpense: {
      get() {
        return this.currentExpense.id ? true : false
      }
    },
    today(){
      return date.formatDate(new Date(), 'YYYY/MM/DD')
    }
  },
  methods: {
    ...mapActions('expense', ['getAllExpenses','deleteExpense', 'addExpense', 'updateExpense']),
    ...mapActions('user', ['getAllUsers']),
    async refresh(done) {
      await this.getAllUsers()
      await this.getAllExpenses()
      done()
    },
    setBlur () {
      this.$emit('setBlur')
    },
    showExpenseDialog(expense){
      this.expenseDialog = true
      this.currentExpense = (expense) ? {...expense} : {}
      this.currentExpense.branchName = this.$store.state.user.currentUser.branchName
    },
    async saveExpense () {
       this.$q.loading.show({
        message: this.expenseDialogTitle + ' expense, please stand by...',
        customClass: 'text-h3, text-bold'
      })
      try {
        if (this.isUpdatingExpense) {
          await this.updateExpense(this.currentExpense)
        } else {
          await this.addExpense(this.currentExpense)
        }
        
        let typeLabel = (this.isUpdatingExpense) ? "updated" : "added"
        this.$q.notify({
          message: 'Expense has been ' + typeLabel + '.',
          type: 'positive',
          actions: [
            { label: 'Dismiss', color: 'white' }
          ]
        })
        this.expenseDialog = false
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem ${this.expenseDialogTitle} the expense: ${err}`,
          color: 'negative'
        })
      } finally {
        this.$q.loading.hide()
      }
    },
    async removeExpense(expense) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete ' + expense.id.toUpperCase() + '?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await this.deleteExpense(expense.id)
        } catch (err) {
          this.$q.notify({
            message: `Looks like a problem deleting expense: ${err}`,
            color: 'negative'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
    },
    customFilter(rows, terms){
      // rows contain the entire data
      // terms contains whatever you have as filter

      let totalFilteredAmount = 0
      
      const filteredRows = rows.filter((row, i) => {
        
        let branch_filter = (terms.branch) && terms.branch == row.branchName

        if(!(row.createdDate instanceof Date)){
          row.createdDate = row.createdDate.toDate()
        }
        let rowDate = date.formatDate(row.createdDate, 'YYYY/MM/DD')
        let date_filter = (terms.date) && terms.date == rowDate
        
        let match = (
          !(terms.date) && 
          !(terms.branch)
        )
        
        if((!terms.date || date_filter) && (!terms.branch || branch_filter)){
          match = true
          totalFilteredAmount += row.expenseAmount
        }

        return match

      })
      
      this.totalFilteredAmount = totalFilteredAmount
      return filteredRows
    }
  },
  watch: {
    checkToday (val) {
      if(val){
        this.filters.date = this.today
      }
      else {
        this.filters.date = ''
      }
    }
  }
}
</script>
<style lang="sass">
.my-sticky-column-table
  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #fff

  td:first-child
    background-color: #f5f5dc

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>