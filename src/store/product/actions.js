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
  context.commit('setProductCategories', product_categories);
}

export const getProductSizes = async function (context) {
  const product_sizes = await productService.getProductSizes()
  context.commit('setProductSizes', product_sizes);
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
  commit('updateProduct', payload);
}

export const addNewProduct = async function ({ commit }, payload) {
  const doc = await productService.insertProduct(payload);
  commit('addNewProduct', { ...payload, id: doc.id });
}

export const deleteProduct = async function ({ commit }, id) {
  await productService.deleteProduct(id)
  commit('deleteProduct', id);
}

export const addProductPrice = async function ({ commit }, payload) {
  const doc = await productService.insertProductPrice(payload);
  commit('addProductPrice', { ...payload, id: doc.id });
}

export const deleteProductPrice = async function ({ commit }, id) {
  await productService.deleteProductPrice(id)
  commit('deleteProductPrice', id);
}

/** Product Category */
export const addProductCategory = async function ({ state, commit }, payload) {
  const doc = await productService.insertProductCategory(payload)
  commit('addProductCategory', { ...payload, id: doc.id });
}

export const updateProductCategory = async function ({ state, commit }, payload) {
  await productService.updateProductCategory(payload)
  commit('updateProductCategory', payload);
}

export const deleteProductCategory = async function ({ commit }, id) {
  await productService.deleteProductCategory(id)
  commit('deleteProductCategory', id);
}