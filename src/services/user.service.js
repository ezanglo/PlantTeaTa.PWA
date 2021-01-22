
import * as db from './firebase/db.js'

const collectionName = 'users'

export const getUser = (id) => {
    return db.getDocument(collectionName, id);
}

export const getAllUsers = function() {
    return db.getCollection(collectionName)
}

export const updateUser = (data) => {
    db.updateDocument(collectionName, data)
}

export const deleteUser = (id) => {
    db.deleteDocument(collectionName, id)
}

export const getUserCart = function(userId) {
    return db.getCollection('users/' + userId + '/cart')
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