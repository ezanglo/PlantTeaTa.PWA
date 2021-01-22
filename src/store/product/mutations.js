export const setAllProducts = (state, allProducts) => {
  state.allProducts = allProducts.map(product => {
    return {
      ...product,
      productPrices:[]
    }
  })
}

export const addNewProduct = (state, product) => {
  state.allProducts.push({
    ...product,
    productPrices: []
  })
}

export const deleteProduct = (state, id) => {
  state.allProducts.forEach(function(product, index) {
    if(product.id == id){
      state.allProducts.splice(index, 1)
      return;
    }
  })
}

export const addProductPrice = (state, productPrice) => {
  state.allProducts.forEach(function(product) {
    if(product.id == productPrice.productId){
      product.productPrices = [
        ...product.productPrices,
        productPrice
      ]
    }
  })
}

export const deleteProductPrice = (state, id) => {
  state.allProducts.forEach(function(product) {
    if(product.hasOwnProperty('productPrices'))
    {
      product.productPrices.forEach((price, index) => {
        if(price.id == id){
          product.productPrices.splice(index, 1)
        }
      })
    }
  })
}

export const updateProduct = (state, payload) => {
  state.allProducts.forEach(function(product) {
    if(product.id == payload.id){
      product.productName = payload.productName;
      product.productType = payload.productType;
      product.productCategory = payload.productCategory;
      product.productPrices = payload.productPrices;
      return;
    }
  })
}

export const setProductPrices = (state, productPrices) => {
  state.allProducts.forEach(product => {
    let product_prices = productPrices.filter(e => { return e.productId == product.id });
    product.productPrices = product_prices
  })
  state.productPrices = productPrices
}

export const setProductCategories = (state, productCategories) => {
  productCategories.sort(function(a, b){
    return a.order - b.order
  })
  state.productCategories = productCategories
}

export const setProductSizes = (state, productSizes) => {
  state.productSizes = productSizes
}

export const setProductTypes = (state, productTypes) => {
  state.productTypes = productTypes
}

export const setProductDialog = (state, productDialog) => {
  state.productDialog = productDialog
}

export const addProductCategory = (state, productCategory) => {
  state.productCategories.push(productCategory)
}

export const updateProductCategory = (state, payload) => {
  state.productCategories.forEach(function(category) {
    if(category.id == payload.id){
      category.categoryName = payload.categoryName;
      category.productType = payload.productType;
      category.categoryIcon = payload.categoryIcon;
      return;
    }
  })
}

export const deleteProductCategory = (state, id) => {
  state.productCategories.forEach(function(category, index) {
    if(category.id == id){
      state.productCategories.splice(index, 1)
    }
  })
}