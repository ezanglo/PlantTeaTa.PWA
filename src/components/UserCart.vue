<template>
  <q-card style="min-width: 400px;">
    <q-form @submit="checkOutOrders" class="full-height column">
      <q-card-section class="bg-teal text-white col-auto">
        <div class="text-h6">Your Cart</div>
      </q-card-section>
      
      <div v-if="currentUserCart.length <= 0" class="absolute-center" style="opacity:.5">
        <div class="text-h5 text-primary text-center">
          Your Cart is Empty  
        </div>
      </div>
      <q-card-section class="col overflow-auto">
        <q-item v-for="product in currentUserCart" :key="product.id" class="row justify-between items-center q-mb-lg">
          <q-item-section class="col-3">
            <q-item-label :title="product.productName">{{product.productName | truncate(25, '...')}}</q-item-label>
          </q-item-section>
          <q-item-section class="col-1 content-center">
            <q-item-label>{{product.productSize}}</q-item-label>
          </q-item-section>
          <q-item-section class="col-3 content-center">
            <div class="row items-center" style="width:auto">
              <q-btn dense flat icon="remove" @click="decreaseProductQuantity(product)"/>
              <q-item-label>{{product.productQuantity}}</q-item-label>
              <q-btn dense flat icon="add"  @click="increaseProductQuantity(product)"/>
            </div>
          </q-item-section>
          <q-item-section class="col-3 content-center">
            <q-item-label>{{getComputedPrice(product) | toCurrency}}</q-item-label>
          </q-item-section>
          <q-item-section class="col-1 content-center">
              <q-btn dense flat icon="delete"  @click="removeProductFromCart(product)"/>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section v-if="currentUserCart.length > 0" align="right">
        <q-item-label>Total: {{totalCartAmount | toCurrency}}</q-item-label>
      </q-card-section>
      <q-card-actions align="right" class="col-auto">
        <q-btn flat label="CANCEL" color="primary" v-close-popup />
        <q-btn flat label="CHECKOUT" type="submit" color="primary" v-close-popup v-if="currentUserCart.length > 0"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'UserCart',
  data() {
    const { meta } = this;
    return {
      
    }
  },
  mounted: function() {
    
  },
  computed: {
    ...mapGetters('user', ['currentUserCart']),
    ...mapGetters('product', ['allProducts']),
    totalCartAmount: {
      get(){
        return this.getTotalCartAmount()
      }
    }
  },
  methods: {
    ...mapActions('user', ['updateCartProductQuantity', 'removeCartProduct']),
    checkOutOrders(){
      console.log(JSON.stringify(this.currentUserCart));
    },
    getTotalCartAmount(){
      let total = 0;
      this.currentUserCart.forEach(cartProduct => {
        const price = this.getPriceFromProduct(cartProduct)
        if(price){
          total += (parseInt(cartProduct.productQuantity) * parseInt(price.productPrice))
        }
      })
      return total;
    },
    getPriceFromProduct(cartProduct){
      const product = this.allProducts.find(function(product){
        return product.productName == cartProduct.productName
      })
      if(product){
        let price = product.productPrices.find(function(price){
          return price.productSize == cartProduct.productSize
        })
        if(price){
          return price
        }
      }
      return null
    },
    getComputedPrice(product){
      const price = this.getPriceFromProduct(product)
      if(price){
        return (parseInt(product.productQuantity) * parseInt(price.productPrice))
      }
      return 0
    },
    async increaseProductQuantity(product){
      let quantity = parseInt(product.productQuantity) + 1
      await this.updateCartProductQuantity({
        id: product.id,
        productQuantity: quantity
      })
    },
    async decreaseProductQuantity(product){
      let quantity = parseInt(product.productQuantity) - 1
      if(quantity == 0){
        this.removeProductFromCart(product)
      }
      else {
        await this.updateCartProductQuantity({
          id: product.id,
          productQuantity: quantity
        })
      }
    },
    removeProductFromCart(product) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to remove ' + product.productName + ' from cart?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await this.removeCartProduct(product.id)
          
          const price = this.getPriceFromProduct(product)
          this.$q.notify({
            message: product.productName + '(' + price.productSize + ') has been removed from your cart',
            type: 'positive',
            icon: 'delete',
            position: 'bottom-left',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
        } catch (err) {
          this.$q.notify({
            message: `Looks like a problem removing product to cart: ${err}`,
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