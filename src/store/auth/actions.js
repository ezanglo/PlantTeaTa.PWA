// Remember, we have access to our Vue instance not using
// an arrow function in our actions file. This allows us
// to create a scoped reference to our firebaseService - $fb
// That was assigned to the Vue instance earlier in our serviceConnection
// boot file.

import { firestoreAction } from 'vuexfire'
import User from '../../models/User.js'
import { store } from '../index.js'

export const addUserToUsersCollection = async function (state, userRef) {
  const
    { email, fullName, mobile, profilePhoto } = state,
    user = new User({ 
      email,
      fullName,
      mobile,
      profilePhoto,
    })
  return userRef.set(user)
}

export const createNewUserWithEmail = async function ($root, data) {
  const $fb = this.$fb
  const { email, password, fullName } = data
  const fbAuthResponse = await $fb.createUserWithEmail(email, password)
  const id = fbAuthResponse.user.uid
  const userRef = $fb.userRef('users', id)
  return addUserToUsersCollection({ email, fullName }, userRef)
}

export const createNewUser = async function($root, payload) {
  const $fb = this.$fb
  const userRef = $fb.userRef('users', payload.id)
  const user = await userRef.get()
  if(!user.data()){
    return addUserToUsersCollection(payload, userRef)
  } 
}

export const loginUser = async function ($root, payload) {
  const $fb = this.$fb
  const { email, password } = payload
  return $fb.loginWithEmail(email, password)
}

export const logoutUser = async function ({ state }) {
  await store.dispatch('user/clearCurrentUser')
  await firestoreAction(({ unbindFirestoreRef }) => { unbindFirestoreRef('currentUser') })
  this.$fb.logoutUser()
}

export function routeUserToAuth () {
  this.$router.push({
    path: '/auth/login'
  })
}