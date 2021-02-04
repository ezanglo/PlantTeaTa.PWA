<template>
  <q-card :style="$q.screen.lt.sm?'':'min-width: 450px;'">
    <q-form @submit="showConfirmCheckOutDialog" class="full-height column">
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
        <q-item class="row justify-between items-center q-mb-none">
          <q-item-section style="justify-end">
            <!-- <q-item-label class="text-h6">Points: {{totalOrderPoints}}</q-item-label> -->
            <q-item-label class="text-h6">Sub Total: {{totalOrderAmount | toCurrency}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions align="right" class="col-auto">
        <q-btn flat label="LAST ORDER" color="primary" @click="showLastOrder" v-if="!readOnly"/>
        <q-btn flat label="CANCEL" color="primary" v-close-popup />
        <q-btn flat label="CHECKOUT" type="submit" color="primary" v-if="cartItems.length > 0 && !readOnly"/>
      </q-card-actions>
    </q-form>
    <q-dialog v-model="QRCodeScannerDialog">
      <qrcode-scanner @scan="handleQRCodeScan"/>
    </q-dialog>
    <q-dialog v-model="confirmCheckOutDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px" class="column">
        <q-card-section>
          <div class="text-h6">Checkout your order</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-item>
            <q-input filled style="width:100%" v-model="selectedUserFullName" 
              label="User" 
              readonly 
              :hint="'User will get ' + totalOrderPoints + ' points'">
              <template v-slot:append>
                <q-icon name="qr_code" class="cursor-pointer" @click="QRCodeScannerDialog = true"/>
              </template>
            </q-input>
          </q-item>
          <q-item>
            <q-input filled style="width:100%" label="Date" v-model="orderDateString" readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="orderDate" v-close-popup/>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-item>
          <q-item>
            <q-select filled style="width:100%" label="Branch" class="q-mr-sm" color="black" v-model="orderBranch" :options="branches"/>
          </q-item>
          <q-item>
            <q-input filled style="width:100%" label="Description" v-model="orderDescription"/>
          </q-item>
          <q-item class="row justify-between items-center q-mb-none">
            <q-item-section style="justify-end">
              <q-item-label class="text-h6">Points: {{totalOrderPoints}}</q-item-label>
              <q-item-label class="text-h6">Total: {{totalOrderAmount | toCurrency}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCEL" color="primary" v-close-popup />
          <q-btn flat label="CHECKOUT" @click="checkOutOrders"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'Cart',
  components: {
    'qrcode-scanner': () => import('./QRCodeScanner.vue')
  },
  props: {
    meta: {
      type: Object
    }
  },
  data() {
    return {
      currentOrder: this.meta,
      orderDate: date.formatDate(new Date(), 'YYYY/MM/DD'),
      orderBranch: '',
      orderDescription: '',
      branches: ['Cavite', 'Bulacan'],
      QRCodeScannerDialog: false,
      selectedUser: '',
      confirmCheckOutDialog: false
    }
  },
  mounted: function() {
    this.orderBranch = this.currentUser.branchName
  },
  computed: {
    ...mapGetters('user', ['currentUser','currentUserCart', 'allUsers']),
    ...mapGetters('product', ['allProducts', 'productCategories']),
    totalOrderAmount: {
      get(){
        return this.getTotalOrderAmount()
      }
    },
    totalOrderPoints() {
      return this.getTotalOrderPoints()
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
    orderDateString: {
      get() {
        return new Date(this.orderDate).toDateString()
      },
      set() {
        return
      }
    },
    selectedUserFullName() {
      const self = this
      const user = this.allUsers.find(function(user){
        return user.id == self.selectedUser
      })
      if(user){
        return (user.fullName) ? user.fullName : user.email
      }
      return ''
    }
  },
  methods: {
    ...mapActions('user', ['updateCartProductQuantity', 'removeCartProduct']),
    ...mapActions('order', ['addOrder', 'getLastOrder']),
    handleQRCodeScan(value){
      this.QRCodeScannerDialog = false
      this.selectedUser = value
    },
    showConfirmCheckOutDialog(){
      this.confirmCheckOutDialog = true
      this.selectedUser = ''
    },
    async checkOutOrders(){
      if(this.readOnly){
        return
      }
      this.$q.loading.show({
        message: 'Checking out order, please stand by...',
        customClass: 'text-h3, text-bold'
      })
      try {
        let today = date.formatDate(new Date(), 'YYYY/MM/DD')
        await this.addOrder({
          orderList: JSON.stringify(this.cartItems),
          totalAmount: this.totalOrderAmount,
          orderDescription: this.orderDescription,
          branchName: this.orderBranch,
          createdDate: this.orderDate == today ? new Date(): new Date(this.orderDate),
          userId: this.selectedUser,
          orderPoints: this.totalOrderPoints
        })
        this.confirmCheckOutDialog = false
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
    },
    getTotalOrderAmount(){
      let total = 0;
      this.cartItems.forEach(cartProduct => {
        const price = this.getPriceFromProduct(cartProduct)
        if(price){
          total += (parseInt(cartProduct.productQuantity) * parseInt(price.productPrice))
        }
      })
      return total;
    },
    getTotalOrderPoints(){
      let total = 0;
      this.cartItems.forEach(cartProduct => {
        if(cartProduct.productSize == '22oz' || cartProduct.productSize == '16oz'){
          const price = this.getPriceFromProduct(cartProduct)
          if(price){
            total += (parseInt(cartProduct.productQuantity) * parseInt(price.productPrice))
          }
        }
      })
      return total / 10;
    },
    getProductPoints(cartProduct){
      const product = this.allProducts.find(function(product){
        return product.productName == cartProduct.productName
      })
      if(product)
      {
        const productCategory = this.productCategories.find(category => {
          return category.categoryName == product.productCategory
        })
        if(productCategory && productCategory.productSizes.length > 0){
          const productSize = productCategory.productSizes.find(price => {
            return price.productSize == cartProduct.productSize
          })
          if(productSize){
            return productSize
          }
        }
      }
      return null
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