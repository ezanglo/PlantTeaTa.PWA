import * as expenseService from '../../services/expense.service.js'
import { store } from '../index.js'

export const getAllExpenses = async function (context) {
  const allExpenses = await expenseService.getAllExpenses()
  context.commit('setAllExpenses', allExpenses);
}

export const updateExpense = async function ({ state, commit }, payload) {
    payload.expenseDate = new Date(payload.expenseDate)
    await expenseService.updateExpense(payload)
    commit('updateExpense', payload);
}

export const addExpense = async function (context, payload) {
    const order_payload = {
        ...payload,
        expenseDate: new Date(payload.expenseDate),
        createdBy: store.state.user.currentUser.id,
        createdDate: new Date(),
        isDeleted: false
    }
    const doc = await expenseService.insertExpense(order_payload);
    context.commit('addExpense', { ...order_payload, id: doc.id });
}

export const deleteExpense = async function ({ commit }, id) {
    await expenseService.deleteExpense(id)
    commit('deleteExpense', id);
  }
  