
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