<template>
<q-pull-to-refresh @refresh="refresh" color="primary">
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Sales Report"
        class="my-sticky-column-table"
        :data="allActiveOrders"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :filter-method="customFilter" 
        :pagination.sync="pagination"
      >
      <template v-slot:top-right>
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
      </template>
      <template v-slot:body-cell-orderList="props">
        <q-td :props="props">
          <q-btn color="teal" size="sm" @click="showOrderPreview(props.row)">
              {{JSON.parse(props.row.orderList).length}} item(s)
          </q-btn>
        </q-td>
      </template>
       <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn dense color="red" icon="delete" @click="deleteOrder(props.row)"/>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog 
      v-model="orderPreview" 
      :maximized="$q.screen.lt.sm?true:false">
        <cart :meta="currentOrder" />
    </q-dialog>
  </q-page>
</q-pull-to-refresh>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { date } from 'quasar'

export default {
  components: {
    'cart': () => import('../../components/Cart.vue'),
  },
  data() {
    const self = this;
    return {
      mode: "list",
      orderPreview: false,
      currentOrder: {},
      checkToday: false,
      filters: {
        branch: '',
        date: ''
      },
      columns: [
        {
          name: "orderId",
          required: true,
          label: "Order ID",
          align: "left",
          field: "id",
          format: function(val){
            return val.toUpperCase()
          },
          sortable: true
        },
        {
          name: "totalAmount",
          align: "left",
          label: "Total Amount",
          field: "totalAmount",
          format: function(val){
            return self.$options.filters.toCurrency(val)
          },
          sortable: true
        },
        {
          name: "orderList",
          align: "center",
          label: "Order List",
          field: "orderList",
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
          name: "createdDate",
          align: "left",
          label: "Created Date",
          field: "createdDate",
          format: function(val){
            if(val){
              const phTimeDate = self.$options.filters.toPHTimezone(val)
              return date.formatDate(phTimeDate, 'ddd MMM DD YYYY hh:mm A')
            }
          },
          sortable: true
        },
        {
          name: "orderDescription",
          align: "left",
          label: "Order Description",
          field: "orderDescription",
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
        sortBy: "createdDate",
        descending: true
      },
      branches: [
        'Cavite',
        'Bulacan'
      ],
      totalFilteredAmount: 0
    }
  },
  mounted(){

  },
  computed: {
    ...mapGetters('order', ['allOrders']),
    ...mapGetters('user', ['allUsers']),
    filter() {
      return {
        branch: this.filters.branch,
        date: this.filters.date     
      }
    },
    allActiveOrders: {
      get() {
        return this.allOrders.filter(e => { return !(e.isDeleted) })
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
    today(){
      return date.formatDate(new Date(), 'YYYY/MM/DD')
    },
  },
  methods: {
    ...mapActions('order', ['markOrderDeleted', 'getAllOrders']),
    ...mapActions('user', ['getAllUsers']),
    async refresh(done) {
      await this.getAllOrders()
      await this.getAllUsers()
      done()
    },
    setBlur () {
      this.$emit('setBlur')
    },
    showOrderPreview(order) {
      this.currentOrder = order
      this.orderPreview = true
    },
    async deleteOrder(order) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete ' + order.id.toUpperCase() + '?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await this.markOrderDeleted(order.id)
        } catch (err) {
          this.$q.notify({
            message: `Looks like a problem delete product: ${err}`,
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

        let createdDate = this.$options.filters.toPHTimezone(row.createdDate)
        let rowDate = date.formatDate(createdDate, 'YYYY/MM/DD')
        let date_filter = (terms.date) && terms.date == rowDate
        
        let match = (
          !(terms.date) && 
          !(terms.branch)
        )
        
        if((!terms.date || date_filter) && (!terms.branch || branch_filter)){
          match = true
          totalFilteredAmount += row.totalAmount
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