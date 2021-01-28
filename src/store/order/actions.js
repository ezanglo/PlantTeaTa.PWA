import * as orderService from '../../services/order.service.js'
import { store } from '../index.js'

export const getAllOrders = async function (context) {
  const allOrders = await orderService.getAllOrders()
  context.commit('setAllOrders', allOrders);
}

export const updateOrder = async function ({ state, commit }, payload) {
  await orderService.updateOrder(payload)
  commit('updateOrder', payload);
}

export const addOrder = async function (context, payload) {
  const order_payload = {
    ...payload,
    branchName: store.state.user.currentUser.branchName,
    createdBy: store.state.user.currentUser.id,
    createdDate: new Date(),
    isDeleted: false
  }
  const doc = await orderService.insertOrder(order_payload);
  if(doc){
    await store.dispatch('user/clearCurrentUserCart')
  }
  context.commit('addOrder', { ...order_payload, id: doc.id });
}

export const markOrderDeleted = async function ({ state, commit }, id) {
  const payload = { id: id, isDeleted: true }
  await orderService.updateOrder(payload)
  commit('updateOrder', payload);
}

export const deleteOrder = async function ({ commit }, id) {
  await orderService.deleteOrder(id)
  commit('deleteOrder', id);
}

export const getLastOrder = function({ state }){
  const currentUserBranch = store.state.user.currentUser.branchName
  let lastOrder = state.allOrders.filter(e => { 
    return e.branchName == currentUserBranch && !(e.isDeleted)
  });
  lastOrder = lastOrder.sort((a,b) => {
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
  if(lastOrder.length > 0){
    return lastOrder[0];
  }
  return {}
}