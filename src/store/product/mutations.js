export const setAllProducts = (state, allProducts) => {
  state.allProducts = allProducts
}

export const addNewProduct = (state, product) => {
  state.allProducts.push(product)
}

export const deleteProduct = (state, id) => {
  state.allProducts.forEach(function(product, index) {
    if(product.id == id){
      state.allProducts.splice(index, 1)
      return;
    }
  })
}

export const updateproduct = (state, payload) => {
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
  let allProducts = []
  state.allProducts.forEach(product => {
    const prices = []
    productPrices.forEach(price => {
      if(price.productId == product.id){
        prices.push(price);
      }
    });
    allProducts.push({
      ...product,
      productPrice: prices
    })
  });

  state.allProducts = allProducts;
  state.productPrices = productPrices
}

export const setProductCategories = (state, productCategories) => {
  state.productCategories = productCategories
}

export const setProductTypes = (state, productTypes) => {
  state.productTypes = productTypes
}

export const setProductDialog = (state, productDialog) => {
  state.productDialog = productDialog
}