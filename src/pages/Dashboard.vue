<template>
<q-pull-to-refresh @refresh="refresh" color="primary">
  <q-page class="q-pa-sm">
    <q-card class="bg-transparent no-shadow no-border">
      <q-card-section class="q-pa-none">
        <div class="row q-col-gutter-sm ">
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #546bfa" class="q-pa-none ">
                <q-item-section class=" q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{getTotalSalesAmount(allActiveOrders) - totalExpenses | toCurrency}}</q-item-label>
                  <q-item-label>Net Income</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="fas fa-dollar-sign" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #3a9688" class="q-pa-none">
                <q-item-section class="q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{bulacanIncome + caviteIncome | toCurrency}}</q-item-label>
                  <q-item-label>Gross Income</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="fas fa-dollar-sign" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #7cb342" class="q-pa-none ">
                <q-item-section class=" q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{totalExpenses | toCurrency}}</q-item-label>
                  <q-item-label>Expenses</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="credit_card" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
          <div class="col-md-3 col-sm-12 col-xs-12">
            <q-card>
              <q-item style="background-color: #f88c2b" class="q-pa-none">
                <q-item-section class=" q-pa-md q-ml-none  text-white">
                  <q-item-label class="text-white text-h6 text-weight-bolder">{{allUsers.length}}</q-item-label>
                  <q-item-label>Active Users</q-item-label>
                </q-item-section>
                <q-item-section side class="q-mr-md text-white">
                  <q-icon name="person" color="white" size="44px"></q-icon>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-sm">
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="fas fa-chart-line" size="44px"/>
          </q-item-section>

          <q-item-section>
            <div class="text-h6">Product Sales Stats</div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="row">
        <div class="col-lg-7 col-sm-12 col-xs-12 col-md-7">
          <div class="row">
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="blue" text-color="white" icon="free_breakfast"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-blue text-bold">{{milkTeaSales.length}}</q-item-label>
                  <q-item-label caption>Milk Tea</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="grey-8" text-color="white" icon="local_pizza"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-grey-8 text-bold">{{snackSales.length}}</q-item-label>
                  <q-item-label caption>Snacks</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="green-6" text-color="white" icon="playlist_add"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-green-6 text-bold">{{addOnSales.length}}</q-item-label>
                  <q-item-label caption>Add Ons</q-item-label>
                </q-item-section>
              </q-item>
            </div>
            <div class="col-lg-3 col-md-3 col-xs-6 col-sm-6">
              <q-item>
                <q-item-section top avatar>
                  <q-avatar color="orange-8" text-color="white" icon="bluetooth"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 text-orange-8 text-bold">0</q-item-label>
                  <q-item-label caption>Vouchers</q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
          <div>
            <IEcharts style="height: 250px" :option="getSalesOptions" :resizable="true"/>
          </div>
        </div>
        <div class="col-lg-5 col-sm-12 col-xs-12 col-md-5">
          <q-item>
            <q-item-section avatar class="">
              <q-icon color="blue" name="fas fa-gift" class="q-pl-md" size="24px"/>
            </q-item-section>

            <q-item-section>
              <div class="text-h6">TODAY SALES ({{todaySalesAmount | toCurrency}})</div>
            </q-item-section>
          </q-item>
          <div>
            <IEcharts style="height: 250px" :option="getPieOptions" :resizable="true"/>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-mt-sm">
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="fa fa-shopping-cart" size="44px"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <div class="text-h6">Latest Sales</div>
            </q-item-label>
            <q-item-label caption class="text-black">
              Monitoring Your products. Tracking sales, and shipping status here.
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="q-pa-none q-ma-none">
        <q-table
        class="my-sticky-column-table"
        :data="allActiveOrders"
        :columns="sales_column"
        :pagination.sync="pagination"
        row-key="name" >
        <template v-slot:body-cell-orderList="props">
          <q-td :props="props">
            <q-btn color="teal" size="sm" @click="showOrderPreview(props.row)">
                {{JSON.parse(props.row.orderList).length}} item(s)
            </q-btn>
          </q-td>
        </template>
      </q-table>
      </q-card-section>
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

import { mapGetters, mapActions } from 'vuex'
import { date } from 'quasar'

export default {
    name: "Dashboard2",
    components: {
        'IEcharts' : () => import('vue-echarts-v3/src/full.js'),
        'cart': () => import('../components/Cart.vue'),
    },
    data() {
      const self = this
      return {
        sales_column: [
          {
            name: "orderId",
            label: "Product",
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
                if(!(val instanceof Date)){
                  val = val.toDate()
                }
                return val.toDateString()
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
          }
        ],
        pagination: {
          rowsPerPage: 5,
          sortBy: "createdDate",
          descending: true
        },
        orderPreview: false,
        currentOrder: {}
      }
    },
    computed: {
      ...mapGetters('order', ['allOrders']),
      ...mapGetters('expense', ['allExpenses']),
      ...mapGetters('user', ['allUsers']),
      ...mapGetters('product', ['allProducts']),
      getSalesOptions() {
        return {
          tooltip: {
              trigger: 'axis',
              axisPointer: {// Coordinate axis indicator, coordinate axis trigger is valid
                  type: 'shadow' // The default is a straight line, optional:'line' |'shadow'
              },
          },
          grid: {
              left: '2%',
              right: '2%',
              top: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  splitLine: {
                      show: true
                  }
              }
          ],
          series: [
              {
                  name: 'Milk Tea',
                  type: 'bar',
                  data: this.getMonthlySales(this.milkTeaSales),
                  color: '#546bfa'
              },
              {
                  name: 'Snacks',
                  type: 'bar',
                  data: this.getMonthlySales(this.snackSales),
                  color: '#3a9688'
              },
              {
                  name: 'Add Ons',
                  type: 'bar',
                  data: this.getMonthlySales(this.addOnSales),
                  color: '#02a9f4'
              }
          ]
        }
      },
      getPieOptions() {
        const self = this
        return {
          tooltip: {
              trigger: 'item',
              formatter: function(params){
                return params.seriesName + '<br/>'+
                  params.data.name + ': ' + 
                  self.$options.filters.toCurrency(params.data.value) + 
                  ' ('+ params.percent +'%)'
              }
          },
          legend: {
              bottom: 10,
              left: 'center',
              data: ['Milk Tea', 'Snacks', 'Add Ons']
          },
          series: [
              {
                  name: 'Sales',
                  type: 'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      show: false,
                      position: 'center'
                  },
                  emphasis: {
                      label: {
                          show: false,
                          fontSize: '30',
                          fontWeight: 'bold'
                      }
                  },
                  labelLine: {
                      show: false
                  },
                  data: [
                    {
                        value: this.getTotalProductAmount(this.getTodaySales(this.milkTeaSales)), 
                        name: 'Milk Tea',
                        itemStyle: {
                            color: '#546bfa'
                        }
                    },
                    {
                        value: this.getTotalProductAmount(this.getTodaySales(this.snackSales)), 
                        name: 'Snacks',
                        itemStyle: {
                            color: '#3a9688'
                        }
                    },
                    {
                        value: this.getTotalProductAmount(this.getTodaySales(this.addOnSales)), 
                        name: 'Add Ons',
                        itemStyle: {
                            color: '#02a9f4'
                        }
                    }
                  ]
              }
          ]
        }
      },
      caviteIncome() {
        const caviteOrders = this.allActiveOrders.filter(e => e.branchName == 'Cavite')
        return this.getTotalSalesAmount(caviteOrders)
      },
      bulacanIncome() {
        const bulacanOrders = this.allActiveOrders.filter(e => e.branchName == 'Bulacan')
        return this.getTotalSalesAmount(bulacanOrders)
      },
      todaySalesAmount() {
        const todayOrders = this.getTodaySales(this.allActiveOrders)
        return this.getTotalSalesAmount(todayOrders)
      },
      totalExpenses() {
        let total = 0
        this.allExpenses.forEach(expense => {
            total += parseInt(expense.expenseAmount)
        })
        return total
      },
      activeOrders() {
        return this.allOrders.filter(e => !e.isDeleted)
      },
      productSizes() {
        return this.$store.state.product.productSizes
      },
      milkTeaSales() {
        let milkTeaOrders = []
        this.activeOrders.forEach(order => {
          let orderList = JSON.parse(order.orderList)
          orderList = orderList.filter(product => {
            const productSize = this.productSizes.find(size => { 
              return (size.name == product.productSize && size.name != 'Add On') 
            })
            return (productSize && productSize.product_type == 'Milk Tea')
          })
          milkTeaOrders = [...milkTeaOrders, ...orderList.map(product => {
            let createdDate = order.createdDate
            if(!(createdDate instanceof Date)){
              createdDate = createdDate.toDate()
            }
            return product = {
              ...product,
              createdDate: createdDate,
              productPrice: this.getPriceFromProduct(product)
            }
          })]
        })
        return milkTeaOrders
      },
      snackSales() {
        let snackOrders = []
        this.activeOrders.forEach(order => {
          let orderList = JSON.parse(order.orderList)
          orderList = orderList.filter(product => {
            const productSize = this.productSizes.find(size => { 
              return (size.name == product.productSize && size.name) 
            })
            return (productSize && productSize.product_type == 'Snacks')
          })
          snackOrders = [...snackOrders, ...orderList.map(product => {
            let createdDate = order.createdDate
            if(!(createdDate instanceof Date)){
              createdDate = createdDate.toDate()
            }
            return product = {
              ...product,
              createdDate: createdDate,
              productPrice: this.getPriceFromProduct(product)
            }
          })]
        })
        return snackOrders
      },
      addOnSales() {
        let activeOrders = this.allOrders.filter(e => !e.isDeleted)
        let addOnOrders = []
        activeOrders.forEach(order => {
          let orderList = JSON.parse(order.orderList)
          orderList = orderList.filter(product => {
            return (product.productSize == 'Add On')
          })
          addOnOrders = [...addOnOrders, ...orderList.map(product => {
            let createdDate = order.createdDate
            if(!(createdDate instanceof Date)){
              createdDate = createdDate.toDate()
            }
            return product = {
              ...product,
              createdDate: createdDate,
              productPrice: this.getPriceFromProduct(product)
            }
          })]
        })
        return addOnOrders
      },
      allActiveOrders() {
        return this.allOrders.filter(e => { return !(e.isDeleted) })
      },
    },
    methods: {
      ...mapActions('order', ['getAllOrders']),
      ...mapActions('expense', ['getAllExpenses']),
      ...mapActions('user', ['getAllUsers']),
      getPriceFromProduct(item){
        const product = this.allProducts.find(function(product){
          return product.productName == item.productName
        })
        if(product){
          let price = product.productPrices.find(function(price){
            return price.productSize == item.productSize
          })
          if(price){
            return price
          }
        }
        return null
      },
      showOrderPreview(order) {
        this.currentOrder = order
        this.orderPreview = true
      },
      getTotalSalesAmount(sales) {
        let total = 0
        sales.forEach(order => {
          total+=parseInt(order.totalAmount)
        })
        return total
      },
      getTotalProductAmount(products) {
        let total = 0
        products.forEach(product => {
          total+=parseInt(product.productPrice.productPrice)
        })
        return total
      },
      getMonthlySales(products){
        let sales = [0,0,0,0,0,0,0,0,0,0,0,0]
        let now = new Date()
        products.forEach(product => {
          let createdDate = product.createdDate
          if(!(createdDate instanceof Date)){
            createdDate = createdDate.toDate()
          }
          if(createdDate.getYear() == now.getYear()){
            sales[createdDate.getMonth()] += 1
          }
        })
        return sales
      },
      getTodaySales(products){
        const now = date.formatDate(new Date(), 'YYYY/MM/DD')
        return products.filter(product => {
          let createdDate = product.createdDate
          if(!(createdDate instanceof Date)){
            createdDate = createdDate.toDate()
          }
          createdDate = date.formatDate(createdDate, 'YYYY/MM/DD')
          return createdDate == now
        })
      },
      async refresh(done) {
        await this.getAllOrders()
        await this.getAllExpenses()
        await this.getAllUsers()
        done()
      },
      getColor(val) {
          if (val > 70 && val <= 100) {
              return 'green'
          } else if (val > 50 && val <= 70) {
              return 'blue'
          }
          return 'red'
      },
      getChipColor(status) {
          if (status == 'Canceled') {
              return 'negative'
          } else if (status == 'Sent') {
              return 'positive'
          } else if (status == 'Pending') {
              return 'warning'
          } else if (status == 'Paid') {
              return 'info'
          } else {
              return 'dark'
          }
      }
    }
}
</script>

<style scoped>

</style>
