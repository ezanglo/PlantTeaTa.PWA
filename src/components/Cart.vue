<template>
  <q-card :style="$q.screen.lt.sm?'':'min-width: 450px;'">
    <q-form @submit="checkOutOrders" class="full-height column">
      <q-card-section class="bg-teal text-white col-auto">
        <div class="text-h6">{{title}}</div>
      </q-card-section>
      
      <div v-if="cartItems.length <= 0" class="absolute-center" style="opacity:.5">
        <div class="text-h5 text-primary text-center">
          Your Cart is Empty  
        </div>
      </div>
      <q-card-section class="col overflow-auto">
        <q-item v-for="product in cartItems" :key="product.id" class="row justify-between items-center q-mb-none">
          <q-item-section class="col-4">
            <q-item-label :title="product.productName">{{product.productName | truncate(25, '...')}}</q-item-label>
            <q-item-label caption>{{product.productSize}}</q-item-label>
          </q-item-section>
          <q-item-section class="col-3 content-center">
            <div class="row items-center" style="width:auto">
              <q-btn v-if="!readOnly" dense flat icon="remove" @click="decreaseProductQuantity(product)"/>
              <q-item-label>{{product.productQuantity}}</q-item-label>
              <q-btn v-if="!readOnly" dense flat icon="add"  @click="increaseProductQuantity(product)"/>
            </div>
          </q-item-section>
          <q-item-section class="col-3 content-center">
            <q-item-label>{{getComputedPrice(product) | toCurrency}}</q-item-label>
          </q-item-section>
          <q-item-section v-if="!readOnly" class="col-1 content-center">
              <q-btn dense flat icon="delete"  @click="removeProductFromCart(product)"/>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator/>
      <q-card-section v-if="cartItems.length > 0" align="right">
        <q-item v-if="!readOnly" class="q-pr-none justify-end">
          <q-select style="width:90px;" class="q-mr-sm" color="black" v-model="cartBranch" :options="branches" dense/>
          <q-input v-model="cartDateString" style="width:140px" dense readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="cartDate" v-close-popup/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item>
        <q-item-label class="text-h6">Total: {{totalCartAmount | toCurrency}}</q-item-label>
      </q-card-section>
      <q-card-actions align="right" class="col-auto">
        <q-btn flat label="LAST ORDER" color="primary" @click="showLastOrder" v-if="!readOnly"/>
        <q-btn flat label="CANCEL" color="primary" v-close-popup />
        <q-btn flat label="CHECKOUT" type="submit" color="primary" v-if="cartItems.length > 0 && !readOnly"/>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'Cart',
  props: {
    meta: {
      type: Object
    }
  },
  data() {
    return {
      currentOrder: this.meta,
      cartDate: date.formatDate(new Date(), 'YYYY/MM/DD'),
      cartBranch: '',
      branches: ['Cavite', 'Bulacan']
    }
  },
  mounted: function() {
    this.cartBranch = this.currentUser.branchName
  },
  computed: {
    ...mapGetters('user', ['currentUser','currentUserCart']),
    ...mapGetters('product', ['allProducts']),
    totalCartAmount: {
      get(){
        return this.getTotalCartAmount()
      }
    },
    cartItems: {
      get() {
        let items = this.currentUserCart
        if(this.currentOrder){
          items = JSON.parse(this.currentOrder.orderList)
        }
        return items
      },
      set(val) {
        return val
      }
    },
    readOnly: {
      get() {
        return (this.currentOrder)
      }
    },
    title: {
      get() {
        return (this.currentOrder) ? 'ORDER: ' + this.currentOrder.id.toUpperCase() : 'Your Cart'
      }
    },
    cartDateString: {
      get() {
        return new Date(this.cartDate).toDateString()
      },
      set() {
        return
      }
    }
  },
  methods: {
    ...mapActions('user', ['updateCartProductQuantity', 'removeCartProduct']),
    ...mapActions('order', ['addOrder', 'getLastOrder']),
    checkOutOrders(){
      if(this.readOnly){
        return
      }

      this.$q.dialog({
        title: 'Checkout your Order',
        message: 'Enter a description',
        prompt: {
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(async data => {
        try {
          let today = date.formatDate(new Date(), 'YYYY/MM/DD')
          // console.log(date.formatDate(new Date(), 'ddd MMM DD YYYY hh:mm A'));
          await this.addOrder({
            orderList: JSON.stringify(this.cartItems),
            totalAmount: this.totalCartAmount,
            orderDescription: (data) ? data : '',
            branchName: this.cartBranch,
            createdDate: this.cartDate == today ? new Date(): new Date(this.cartDate)
          })
          this.$q.notify({
            message: 'Order Complete!',
            type: 'positive',
            position: 'bottom-left',
            actions: [
              { label: 'Dismiss', color: 'white' }
            ]
          })
        } catch (err) {
          this.$q.notify({
            message: `Looks like a problem adding the orders: ${err}`,
            color: 'negative'
          })
        } finally {
          this.$q.loading.hide()
        }
      })
    },
    getTotalCartAmount(){
      let total = 0;
      this.cartItems.forEach(cartProduct => {
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
      if(this.readOnly){
        return
      }
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
    },
    async showLastOrder(){
      const lastOrder = await this.getLastOrder()
      if(lastOrder.id){
        this.currentOrder = lastOrder
      }
    }
  }
}
</script>