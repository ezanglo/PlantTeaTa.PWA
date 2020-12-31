import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

/**
 * Firestore
 * https: //firebase.google.com/docs/reference/js/firebase.firestore.Firestore.html
 *
 * @return {Interface} returns Firestore
 */
export const firestore = () => {
  return firebase.firestore()
}

/**
 * @param  {String} collectionName - Firestore collection name
 * @param  {String} id - Uid to assign to a doc in firestore collection
 */
export const userRef = (collectionName, id) => {
  return firestore().collection(collectionName).doc(id)
}

/**
 * @param  {String} collectionName - Firestore collection name
 */
export const usersRef = async (collectionName) => {
  var users = await firestore().collection(collectionName).get()
  return users.docs.map(doc => {
    return doc.data()
  });
}

/**
 * @param  {String} storageLocation - Location on Firebase Storage
 */
export const storageRef = (storageLocation) => {
  return firebase.storage().ref(storageLocation)
}

export const addDocument = (collectionName, data, callback) => {
  firestore().collection(collectionName).add(data)
  .then(function() {
    if(callback){
      callback()
    }
  })
}

export const getDocument = (collectionName, id) => {
  return firestore().collection(collectionName).doc(id)
}

export const getCollection = (collectionName) => {
  return firestore().collection(collectionName).get()
    .then(function(collection) {
      return collection.docs.map(doc => {
        return doc.data()
      });
    })
}

export const updateDocument = (collectionName, data) => {
  return getDocument(collectionName, data.id).update(data)
}

export const deleteDocument = (collectionName, id) => {
  return getDocument(collectionName, id).delete()
}
