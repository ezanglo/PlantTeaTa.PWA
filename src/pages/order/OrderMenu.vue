<template>
  <q-page class="q-pa-sm">
    <q-table
      :data="allProducts"
      :columns="columns"
      row-key="name"
      :grid="true"
      :filter="categoryFilter"  
      :pagination.sync="pagination"
      hide-header
      hide-bottom
    >
      <template v-slot:item="props">
        <div class="q-pa-xs col-grow col-xs-6 col-sm-3 col-md-3 col-lg-2">
          <q-card class="q-ma-xs" :props="props">
            <q-img style :src="productImage(props.row.productType)">
              <div class="absolute-bottom">
                  <div class="text-h6"> {{props.row.productName}} </div>
                  <div class="text-subtitle2"> {{props.row.productCategory}} | {{props.row.productType}}</div>
              </div>
            </q-img>
            <q-list>
              <q-item v-if="props.row.productPrices.length == 0">
                <q-item-section>
                  <q-item-label>Not Available</q-item-label>
                  <q-item-label caption>No Price found.</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-for="price in props.row.productPrices" :key="price.id" clickable @click="addToCart(props.row, price)">
                <q-item-section avatar>
                  <q-icon color="blue" name="fa fa-cart-plus" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ price.productPrice | toCurrency }}</q-item-label>
                  <q-item-label caption>{{ price.productSize }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      customer: {},
      columns: [
        {
          name: "productName",
          required: true,
          label: "Product",
          align: "left",
          field: "productName",
          sortable: true
        },
        {
          name: "productCategory",
          align: "left",
          label: "Category",
          field: "productCategory",
          sortable: true
        },
        {
          name: "productType",
          align: "left",
          label: "Type",
          field: "productType",
          sortable: true
        },
        {
          name: "productPrices",
          align: "left",
          label: "Prices",
          field: "productPrices",
          sortable: true
        }
      ],
      pagination: {
        rowsPerPage: 0,
        sortBy: "productName"
      },
      tab: null,
    }
  },
  computed: {
    ...mapGetters('product', ['allProducts', 'productCategories']),
    categoryFilter: {
      get() {
        return this.$route.query.category
      }
    }
  },
  methods: {
    ...mapActions('user', ['addProductToCart']),
    setBlur () {
      this.$emit('setBlur')
    },
    clickItem(item){
      
    },
    productImage(type) {
      if(type == "Snacks"){
        return require('src/assets/tusok.jpg')
      }
      else {
        return require('src/assets/milktea.jpg')
      }
    },
    addToCart(product, price){
      const productPrice = this.$options.filters.toCurrency(price.productPrice)
      this.$q.dialog({
        title: 'Add to Cart',
        message: 
          product.productName + ' | ' +
          price.productSize + ' | ' +
          productPrice
          ,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await this.addProductToCart({
            productName: product.productName,
            productQuantity: 1,
            productSize: price.productSize
          })
          this.$q.notify({
            message: product.productName + '(' + price.productSize + ') has been added to cart',
            type: 'positive',
            position: 'bottom-left',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
        } catch (err) {
          this.$q.notify({
            message: `Looks like a problem adding product to cart: ${err}`,
            color: 'negative',
            position: 'bottom-left',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
        } finally {

        }
      }).onCancel(() => {
        
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>