
import * as db from './firebase/db.js'

const collectionName = 'products'

export const getProduct = (id) => {
    return db.getDocument(collectionName, id);
}

export const getAllProducts = async function() {
    const users = await db.getCollection(collectionName)
}

export const updateProduct = (data) => {
    db.updateDocument(collectionName, data)
}

export const deleteProduct = (id) => {
    db.deleteDocument(collectionName, id)
}