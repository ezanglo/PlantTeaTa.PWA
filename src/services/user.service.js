
import * as db from './firebase/db.js'

const collectionName = 'users'

export const getUser = (id) => {
    return db.getDocument(collectionName, id);
}

export const getAllUsers = function() {
    return db.getCollection({
        collectionName: collectionName
    })
}

export const updateUser = (data) => {
    return db.updateDocument(collectionName, data)
}

export const deleteUser = (id) => {
    return db.deleteDocument(collectionName, id)
}

export const getUserCart = function(userId) {
    return db.getCollection({
        collectionName: 'users/' + userId + '/cart'
    })
}

export const addProductToCart = function(userId, data) {
    return db.addDocument('users/' + userId + '/cart', data)
}

export const updateUserCart = function(userId, data) {
    return db.updateDocument('users/' + userId + '/cart', data)
}

export const removeCartProduct = function(userId, id) {
    return db.deleteDocument('users/' + userId + '/cart', id)
}

export const clearUserCart = function(userId) {
    return db.clearCollection('users/' + userId + '/cart')
}

export const insertRewardTransaction = (data) => {
    return db.addDocument('reward_transactions', data)
}

export const getRewardTransactions = (id) => {
    let params = { collectionName: 'reward_transactions' }
    if(id){
        params.where = {
            field: 'userId',
            condition: '==',
            value: id
        }
    }
    return db.getCollection(params)
}

export const updateRewardTransaction = (data) => {
    return db.updateDocument('reward_transactions', data)
}

export const deleteRewardTransaction = (id) => {
    return db.deleteDocument('reward_transactions', id)
}
