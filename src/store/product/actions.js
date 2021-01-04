import * as productService from '../../services/product.service.js'

/** Get all users from the firestore collection user
 */
export const getAllProducts = async function (context) {
  const allProducts = await productService.getAllProducts()
  context.commit('setAllProducts', allProducts);
}

export const getProductPrices = async function (context) {
  const productPrices = await productService.getAllProductPrices()
  context.commit('setProductPrices', productPrices);
}

export const getProductCategories = async function (context) {
  const product_categories = await productService.getProductCategories()
  let productCategories = [];
  product_categories.forEach(category => {
    productCategories.push(category.name)
  })
  context.commit('setProductCategories', productCategories);
}

export const getProductTypes = async function (context) {
  const product_types = await productService.getProductTypes()
  let productTypes = [];
  product_types.forEach(type => {
    productTypes.push(type.name)
  })
  context.commit('setProductTypes', productTypes);
}

export const updateProductData = async function ({ state, commit }, payload) {
  await productService.updateProduct(payload)
  commit('updateproduct', payload);
}

export const addNewProduct = async function ({ commit }, payload) {
  const doc = await productService.insertProduct(payload);
  commit('addNewProduct', { ...payload, id: doc.id });
}

export const deleteProduct = async function ({ commit }, id) {
  await productService.deleteProduct(id)
  commit('deleteProduct', id);
}
