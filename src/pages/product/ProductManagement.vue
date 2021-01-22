<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
        title="Product Management"
        class="my-sticky-column-table"
        :data="allProducts"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :filter-method="customFilter"  
        :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <q-btn @click="showProductDialog({}, 'Add Product')" outline color="primary" label="Add New" class="q-mr-xs"/>

          <q-input outlined dense debounce="300" v-model="filters.search" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>

          <q-btn
            flat
            round
            dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
            v-if="mode === 'list'"
          >
            <q-tooltip
              :disable="$q.platform.is.mobile"
              v-close-popup
            >{{props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}}
            </q-tooltip>
          </q-btn>
          
          <q-select label="Types" v-model="filters.type" :options="productTypes" class="q-mr-sm" style="width:20vh" dense clearable outlined />
          <q-select label="Categories" v-model="filters.category" :options="productCategories" option-value="name" option-label="name" style="width:20vh" dense clearable outlined/>
        </template>
        <template v-slot:body-cell-price="props">
          <q-td :props="props" style="min-width:15em">
            <q-select 
              filled 
              value=''
              label="Prices"
              dense
              :options="props.row.productPrices"
            >
              <template v-slot:option="scope">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.productPrice | toCurrency }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.productSize }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn round dense flat icon="delete" @click.stop="removePrice(scope.opt.id)" />
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Product has no price
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:append>
                <q-btn round dense flat icon="add" @click.stop="showAddProductPriceDialog(props.row)" />
              </template>
            </q-select>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <!-- <q-item-label>{{props.row.productPrice}}</q-item-label> -->
              <q-btn dense color="primary" icon="edit" @click="showProductDialog(props.row); setBlur()"/>
              <q-btn dense color="red" icon="delete" @click="showConfirmDialog(props.row)"/>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <q-dialog 
      v-model="productDialog" 
      full-height
      persistent
      :maximized="$q.screen.lt.sm?true:false" 
      transition-show="slide-left"
      transition-hide="slide-right"
      @before-hide="setBlur">
        <product-settings 
        :meta="currentProduct" 
        :productCategories="productCategories"
        :productTypes="productTypes"
        :productSizes="productSizes"
        ></product-settings>
    </q-dialog>
    <q-dialog v-model="confirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete {{currentProduct.productName}}?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="primary" v-close-popup @click="deleteCurrentProduct()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addProductPriceDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px" class="column">
      <q-form ref="addPriceForm">
        <q-card-section>
          <div class="text-h6">Add Price to {{currentProduct.productName}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-item>
            <q-select 
              outlined
              color="primary"
              for="size"
              lazy-rules="lazy-rules"
              name="size"
              label="Size"
              style="width: 100%"
              v-model="addProductPriceSize"
              :options="productSizeLabels"
              :rules="[val => !!val || '*Field is required']"
            />
          </q-item>
          <q-item>
            <q-input
              outlined
              color="primary"
              for="price"
              lazy-rules="lazy-rules"
              name="price"
              label="Price"
              type="number"
              value=""
              style="width: 100%"
              v-model="addProductPriceAmount"
              :rules="[val => !!val || '*Field is required', val => !isNaN(val) || '*Please provide a valid amount']"
            />
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCEL" color="primary" v-close-popup />
          <q-btn flat label="OK" @click="addPrice()"/>
        </q-card-actions>
      </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    'product-settings': () => import('../../components/ProductSettings.vue')
  },
  data() {
    return {
      customer: {},
      mode: "list",
      filters: {
        search: '',
        type: null,
        category: null
      },
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
          name: "price",
          align: "left",
          label: "Prices",
          field: "productPrices",
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
        sortBy: "productCategory"
      },
      currentProduct: {},
      confirmDialog: false,
      addProductPriceDialog: false,
      addProductPriceAmount: '',
      addProductPriceSize: '',
    }
  },
  mounted: function() {
    this.getAllProducts()
    this.getProductPrices()
    this.getProductCategories()
    this.getProductTypes()
    this.getProductSizes()
  },
  computed: {
    ...mapGetters('product', ['allProducts', 'productCategories', 'productTypes', 'productPrices', 'productSizes']),
    filter() {
      return {
        search: this.filters.search,
        type: this.filters.type,
        category: this.filters.category       
      }
    },
    productDialog: {
      get () {
        return this.$store.state.product.productDialog
      },
      set (val) {
        this.setProductDialog(val)
      }
    },
    productSizeLabels: {
      get () {
        const sizes = []
        this.productSizes.forEach(size => {
          if(size.product_type == this.currentProduct.productType){
            sizes.push(size.name)
          }
        })
        return sizes.sort((a, b) => {
            let fa = a.toLowerCase(),
                fb = b.toLowerCase()

            if (fa < fb) {
                return -1
            }
            if (fa > fb) {
                return 1
            }
            return 0
        })
      }
    }
  },
  methods: {
    ...mapMutations('product', ['setProductDialog']),
    ...mapActions('product', ['getAllProducts', 'deleteProduct', 'addProductPrice', 'deleteProductPrice',
                'getProductCategories', 'getProductTypes', 'getProductPrices', 'getProductSizes']),
    async deleteCurrentProduct() {
      try {
        await this.deleteProduct(this.currentProduct.id)
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem delete product: ${err}`,
          color: 'negative'
        })
      } finally {
        this.$q.loading.hide()
      }
    },
    addPrice() {
      this.$refs.addPriceForm.validate()
      .then( async success => {
        if(success)
        {
          await this.addProductPrice({
            productId: this.currentProduct.id,
            productPrice: this.addProductPriceAmount,
            productSize: this.addProductPriceSize 
          })

          this.addProductPriceDialog = false
          this.addProductPriceAmount = ''
          this.addProductPriceSize = ''
        }
      })
    },
    async removePrice(priceId) {
      try {
        await this.deleteProductPrice(priceId)
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem deleting product: ${err}`,
          color: 'negative'
        })
      } finally {
        
      }
    },
    showConfirmDialog (currentProduct) {
      this.confirmDialog = true
      this.currentProduct = currentProduct
    },
    showProductDialog (currentProduct) {
      this.productDialog = true
      this.currentProduct = currentProduct
    },
    showAddProductPriceDialog (currentProduct) {
      this.addProductPriceDialog = true
      this.currentProduct = currentProduct
    },
    setBlur () {
      this.$emit('setBlur')
    },
    customFilter(rows, terms){
      // rows contain the entire data
      // terms contains whatever you have as filter
      
      const searchlc = terms.search ? terms.search.toLowerCase() : ""

      const filteredRows = rows.filter((row, i) => {

        let type_filter = (terms.type) && terms.type == row.productType
        let category_filter = (terms.category) && terms.category.categoryName == row.productCategory
        let search_filter = (searchlc) && row.productName.toLowerCase().includes(searchlc)
        
        let match = (
          !(terms.search) && 
          !(terms.type) && 
          !(terms.category)
        )
        
        if((!terms.search || search_filter) && (!terms.type || type_filter) && (!terms.category || category_filter)){
          match = true
        }

        return match

      })

      return filteredRows
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