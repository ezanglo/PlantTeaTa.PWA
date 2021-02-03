import { firestoreAction } from 'vuexfire'
import * as userService from '../../services/user.service.js'
import { store } from '../index.js'

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
export const updateUserData = async function (context, payload) {
  await userService.updateUser(payload)
  context.commit('updateUser', payload);
}

export const updateUserPoints = async function(context, payload) {
  let user = await userService.getUser(payload.userId).get()
  user = user.data();
  if(user){
    const userPoints = (user.points) ? user.points: 0

    if(payload.transactionType == 'Debit'){
      payload.runningBalance = userPoints + payload.points
    }
    else {
      if(payload.points > userPoints){
        throw 'User does not have enough points'
      }
      payload.runningBalance = userPoints - payload.points
    }
    await addRewardTransaction(context, payload)

    await userService.updateUser({
      id: payload.userId,
      points: payload.runningBalance
    })

    context.commit('updateUser', payload);
  }
}

// export const getUserDetails = function (context, userId) {
//   let userDetails = null;
//   context.state.allUsers.forEach(user => {
//       if(user.id == userId){
//         userDetails = user
//       }
//   })
//   return userDetails
// }

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

export const clearCurrentUserCart = async function(context) {
  const currentUserId = context.state.currentUser.id;
  await userService.clearUserCart(currentUserId)
  context.commit('setCurrentUserCart', []);
}

export const getRewardTransactions = async function (context) {
  const rewardTransactions = await userService.getRewardTransactions()
  context.commit('setRewardTransactions', rewardTransactions);
}

export const getCurrentUserRewardTransactions = async function (context) {
  const currentUserId = store.state.auth.uid
  let currentUserRewardTransactions = await userService.getRewardTransactions(currentUserId)
  currentUserRewardTransactions = currentUserRewardTransactions.sort((a,b) => {
    let a_date = a.createdDate
    let b_date = b.createdDate
    if(!(a.createdDate instanceof Date)){
      a_date = a.createdDate.toDate()
    }
    if(!(b.createdDate instanceof Date)){
      b_date = b.createdDate.toDate()
    }
    return b_date - a_date
  })
  context.commit('setCurrentUserRewardTransactions', currentUserRewardTransactions);
}

export const addRewardTransaction = async function ({ commit }, payload) {
  const doc = await userService.insertRewardTransaction(payload);
  commit('addRewardTransaction', { ...payload, id: doc.id });
}

export const updateRewardTransaction = async function ({ state, commit }, payload) {
  await userService.updateRewardTransaction(payload)
  commit('updateRewardTransaction', payload);
}

export const deleteRewardTransaction = async function ({ commit }, id) {
  await userService.deleteRewardTransaction(id)
  commit('deleteRewardTransaction', id);
}