import { firestoreAction } from 'vuexfire'
import * as userService from '../../services/user.service.js'

/** Get current user from the firestore collection user's
 * via firebase uid
 *
 * @param  {Ojbect} payload.id - Firebase currentUser id
 */
export const getCurrentUser = firestoreAction(({ bindFirestoreRef }, id) => {
  return bindFirestoreRef('currentUser', userService.getUser(id))
})

/** Get all users from the firestore collection user
 */
export const getAllUsers = async function (context) {
  const users = await userService.getAllUsers()
  context.commit('setAllUsers', users);
}

/**
 * @param  {Object} {state}
 * @param  {String} id
 * @param  {Object} payload
 */
export const updateUserData = async function ({ state }, payload) {
  return userService.updateUser(payload)
}

/** Get all users from the firestore collection user
 */
export const getCurrentUserCart = async function (context, id) {
  const currentUserId = context.state.currentUser.id;
  const currentUserCart = await userService.getUserCart(currentUserId)
  context.commit('setCurrentUserCart', currentUserCart);
}

export const addProductToCart = async function (context, payload) {
  var product = context.state.currentUserCart.find(function(product){
    return product.productName == payload.productName && 
          product.productSize == payload.productSize
  })

  if(product){
    await updateCartProductQuantity(context, {
      ...product,
      productQuantity: product.productQuantity + 1
    })
  }
  else {
    const currentUserId = context.state.currentUser.id;
    const doc = await userService.addProductToCart(currentUserId, payload);
    context.commit('addProductToCart', { ...payload, id: doc.id });
  }
}

export const updateCartProductQuantity = async (context, payload) => {
  if(isNaN(payload.productQuantity) || payload.productQuantity < 0){
    return
  }
  const currentUserId = context.state.currentUser.id;
  await userService.updateUserCart(currentUserId, payload)
  context.commit('updateCartProductQuantity', payload);
}

export const removeCartProduct = async function (context, id) {
  const currentUserId = context.state.currentUser.id;
  await userService.removeCartProduct(currentUserId, id)
  context.commit('removeCartProduct', id);
}