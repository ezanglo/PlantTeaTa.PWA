<template>
<q-pull-to-refresh @refresh="refresh" color="primary">
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
        <div :props="props" class="q-pa-xs col-xs-6 col-sm-4 col-md-3 col-lg-2">
          <q-card class="q-ma-xs my-card" >
            <q-item clickable @click="showAddToCartDialog(props.row)">
                <q-item-section>
                  <q-item-label class="ellipsis"> {{props.row.productName}} </q-item-label>
                  <q-item-label class="ellipsis" caption>{{props.row.productCategory}} | {{props.row.productType}}</q-item-label>
                  <q-btn size="sm" class="q-mt-sm" style="width:100%" color="primary" outline>
                    <div class="ellipsis">
                      <q-icon name="add_shopping_cart"/>
                      ADD TO CART
                    </div>
                  </q-btn>  
                </q-item-section>
              </q-item>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="addToCartDialog" transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px" class="column">
        <q-card-section>
          <div class="text-h6">{{currentProduct.productName}}</div>
          <q-item-label caption>{{currentProduct.productCategory}} | {{currentProduct.productType}}</q-item-label>
        </q-card-section>
        <q-card-section>
          <q-item v-for="price in currentProduct.productPrices" :key="price.id">
            <q-btn color="primary" style="width: 100%" @click="addToCart(currentProduct, price)">
              {{price.productPrice | toCurrency}} / {{price.productSize}}
            </q-btn>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCEL" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</q-pull-to-refresh>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      addToCartDialog: false,
      currentProduct: {},
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
    ...mapActions('product', ['getAllProducts', 'getProductCategories']),
    async refresh(done) {
      await this.getAllProducts()
      await this.getProductCategories()
      done()
    },
    setBlur () {
      this.$emit('setBlur')
    },
    productImage(type) {
      if(type == "Snacks"){
        return require('src/assets/tusok.jpg')
      }
      else {
        return require('src/assets/milktea.jpg')
      }
    },
    showAddToCartDialog(product){
      this.addToCartDialog = true
      this.currentProduct = {...product}
    },
    async addToCart(product, price){
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
        this.addToCartDialog = false
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem adding product to cart: ${err}`,
          color: 'negative',
          position: 'bottom-left',
          actions: [
            { label: 'Dismiss', color: 'white' }
          ]
        })
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.my-card
  border-left: 3px solid teal
</style>