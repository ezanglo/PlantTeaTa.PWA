
import * as db from './firebase/db.js'

const collectionName = 'products'

export const getProduct = (id) => {
    return db.getDocument(collectionName, id);
}

export const getAllProducts = () => {
    return db.getCollection(collectionName)
}

export const getAllProductPrices = () => {
    return db.getCollection('product_price')
}

export const getProductCategories = () => {
    return db.getCollection('product_categories')
}

export const getProductTypes = () => {
    return db.getCollection('product_types')
}

export const updateProduct = (data) => {
    return db.updateDocument(collectionName, data)
}

export const insertProduct = (data) => {
    return db.addDocument(collectionName, data)
}

export const deleteProduct = (id) => {
    return db.deleteDocument(collectionName, id)
}