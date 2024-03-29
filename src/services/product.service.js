
import * as db from './firebase/db.js'

const collectionName = 'products'

export const getProduct = (id) => {
    return db.getDocument(collectionName, id);
}

export const getAllProducts = () => {
    return db.getCollection({
        collectionName: collectionName
    })
}

export const getAllProductPrices = () => {
    return db.getCollection({
        collectionName: 'product_price'
    })
}

export const getProductSizes = () => {
    return db.getCollection({
        collectionName: 'product_sizes'
    })
}

export const getProductTypes = () => {
    return db.getCollection({
        collectionName: 'product_types'
    })
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

export const insertProductPrice = (data) => {
    return db.addDocument('product_price', data)
}

export const deleteProductPrice = (id) => {
    return db.deleteDocument('product_price', id)
}

export const getProductCategories = () => {
    return db.getCollection({
        collectionName: 'product_categories',
        orderBy: {
            field: 'order',
            direction: 'asc'
        }
    })
}

export const insertProductCategory = (data) => {
    return db.addDocument('product_categories', data)
}

export const updateProductCategory = (data) => {
    return db.updateDocument('product_categories', data)
}

export const deleteProductCategory = (id) => {
    return db.deleteDocument('product_categories', id)
}