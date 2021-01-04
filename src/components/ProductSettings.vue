<template>
  <div class="product-settings full-width">
    <q-form class="full-height" @submit="saveProductData">
        <section class="product-info">
          <h6 class="q-mt-none q-mb-md text-center">{{title}}</h6>
          <div class="row justify-between items-center q-mb-lg">
            <label class="col-4" for="productName">Name</label>
            <q-input class="col" id="productName" filled v-model="productName" borderless="borderless" dense="dense" type="text"></q-input>
          </div>
          <div class="row justify-between items-center q-mb-lg">
            <label class="col-4" for="productType">Type</label>
            <q-select class="col" id="productType" filled v-model="productType" :options="productTypes" dense="dense"/>
          </div>
          <div class="row justify-between items-center q-mb-lg">
            <label class="col-4" for="productCategory">Category</label>
            <q-select class="col" id="productCategory" filled v-model="productCategory" :options="productCategories" dense="dense"/>
          </div>
        </section>
        <div class="row justify-between q-my-lg q-px-md absolute-bottom">
            <q-btn color="primary" label="CANCEL" style="min-width:6em;" @click="setProductDialog(false)"></q-btn>
            <q-btn color="primary" type="submit" label="SAVE" style="min-width:6em;"></q-btn>
        </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { QUploaderBase } from 'quasar'
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
  },
  data() {
    const { meta } = this;
    return {
      id: meta.id,
      productName: meta.productName,
      productType: meta.productType,
      productCategory: meta.productCategory,
      isUpdating: (meta.id),
      title: (meta.id)? "Edit Product" : "Add New Product",
      text: (meta.id)? "Updating" : "Creating",
    }
  },
  computed: {
    
  },
  mounted: function() {
  },
  methods: {
    ...mapActions('product', ['updateProductData', 'addNewProduct', 'getAllProducts', 'getProductCategories', 'getProductTypes']),
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
        // await this.getAllProducts()
        this.$q.loading.hide()
        this.setProductDialog(false)
      }
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