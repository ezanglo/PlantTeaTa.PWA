import * as productService from '../../services/product.service.js'

/** Get all users from the firestore collection user
 */
export const getAllProducts = async function () {
  return productService.getAllProducts();
}

export const addNewProduct = function(data) {
    return productService.addNewProduct(data)
}