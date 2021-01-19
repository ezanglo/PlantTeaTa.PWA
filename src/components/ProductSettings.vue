<template>
  <q-card style="min-width: 40vw;">
    <q-form @submit="saveProductData" class="full-height column">
      <q-card-section class="bg-teal text-white col-auto">
          <div class="text-h6">{{title}}</div>
      </q-card-section>
      <q-card-section class="col">
        <q-item class="row justify-between items-center q-mb-lg">
          <label class="col-4" for="productName">Name</label>
          <q-input class="col" id="productName" filled v-model="productName" borderless="borderless" dense="dense" type="text"></q-input>
        </q-item>
        <q-item class="row justify-between items-center q-mb-lg">
          <label class="col-4" for="productType">Type</label>
          <q-select 
          class="col" 
          id="productType" 
          filled 
          v-model="productType" 
          :options="productTypes" 
          dense="dense"
          @input="setOptionsFromType()" />
        </q-item>
        <q-item class="row justify-between items-center q-mb-lg">
          <label class="col-4" for="productCategory">Category</label>
          <q-select class="col" id="productCategory" filled v-model="productCategory" :options="productCategoryNames" dense="dense"/>
        </q-item>
      </q-card-section>
      <q-card-actions align="right" class="col-auto">
        <q-btn flat label="CANCEL" color="primary" v-close-popup />
        <q-btn flat label="SAVE" type="submit" color="primary" v-close-popup />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { QUploaderBase } from 'quasar'
import { productCategories } from 'src/store/product/getters';
export default {
  name: 'ProductSettings',
  props: {
    meta: {
      type: Object
    },
    productTypes: {
      type: Array
    },
    productCategories: {
      type: Array
    },
    productSizes: {
      type: Array
    },
  },
  data() {
    const { meta } = this;
    return {
      id: meta.id,
      productName: meta.productName,
      productType: meta.productType,
      productCategory: meta.productCategory,
      productPrices: meta.productPrices,
      isUpdating: (meta.id),
      title: (meta.id)? "Edit Product" : "Add New Product",
      text: (meta.id)? "Updating" : "Creating",
      secondDialog: false,
      productCategoryNames: [],
      productSizeNames: [],
      priceSize: '',
      priceAmount: ''
    }
  },
  computed: {
    ...mapGetters('product', ['allProducts']),
  },
  mounted: function() {
    this.setOptionsFromType()
  },
  methods: {
    ...mapActions('product', ['updateProductData', 'addNewProduct', 'addProductPrice', 'deleteProductPrice']),
    ...mapMutations('product', ['setProductDialog']),
    async saveProductData () {
      const { id, productName, productType, productCategory } = this
       this.$q.loading.show({
        message: this.text + ' product, please stand by...',
        customClass: 'text-h3, text-bold'
      })
      try {
        if (this.isUpdating) {
          await this.updateProductData({ id, productName, productType, productCategory })
        } else {
          await this.addNewProduct({productName, productType, productCategory })
        }
      } catch (err) {
        this.$q.notify({
          message: `Looks like a problem ${this.text} the product: ${err}`,
          color: 'negative'
        })
      } finally {
        this.$q.loading.hide()
        this.setProductDialog(false)
      }
    },
    setOptionsFromType () {
      let productCategoryFound = false;
      this.productCategoryNames = [];
      this.productCategories.forEach(category => {
        if(category.productType == this.productType){
          this.productCategoryNames.push(category.categoryName)
          if(this.productCategory == category.categoryName){
            productCategoryFound = true;
          }
        }
      })
      this.productCategory = (productCategoryFound) ? this.productCategory: ''
    },
    getCurrentProduct() {
      let currentProduct = {}
      this.allProducts.forEach(product => {
        if(product.id == this.id){
          currentProduct = product
        }
      })
      return currentProduct;
    }
  }
}
</script>

<style lang="stylus">
  .product-settings
    background-color $grey-1
    padding 25px
    .product-info
      max-width 25.5em
      margin auto
      label
        text-align left
        font-weight bold
</style>