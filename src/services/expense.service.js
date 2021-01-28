
import * as db from './firebase/db.js'

const collectionName = 'expenses'

export const getExpense = (id) => {
    return db.getDocument(collectionName, id);
}

export const getAllExpenses = () => {
    return db.getCollection(collectionName)
}

export const updateExpense = (data) => {
    return db.updateDocument(collectionName, data)
}

export const insertExpense = (data) => {
    return db.addDocument(collectionName, data)
}

export const deleteExpense = (id) => {
    return db.deleteDocument(collectionName, id)
}