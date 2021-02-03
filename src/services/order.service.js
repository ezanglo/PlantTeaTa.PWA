
import * as db from './firebase/db.js'

const collectionName = 'orders'

export const getOrder = (id) => {
    return db.getDocument(collectionName, id);
}

export const getAllOrders = () => {
    return db.getCollection({
        collectionName: collectionName
    })
}

export const getAllOrdersForUser = (userId) => {
    return db.getCollection({
        collectionName: collectionName,
        where: {
            field: 'userId',
            condition: '==',
            value: userId
        },
        orderBy: {
            field: 'createdDate',
            direction: 'desc'
        }
    })
}

export const updateOrder = (data) => {
    return db.updateDocument(collectionName, data)
}

export const insertOrder = (data) => {
    return db.addDocument(collectionName, data)
}

export const deleteOrder = (id) => {
    return db.deleteDocument(collectionName, id)
}