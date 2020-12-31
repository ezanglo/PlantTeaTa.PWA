import { firestoreAction } from 'vuexfire'
import * as userService from '../../services/user.service.js'

/** Get current user from the firestore collection user's
 * via firebase uid
 *
 * @param  {Ojbect} payload.id - Firebase currentUser id
 */
export const getCurrentUser = firestoreAction(({ bindFirestoreRef }, id) => {
  return bindFirestoreRef('currentUser', userService.getUser(id))
})

/** Get all users from the firestore collection user
 */
export const getAllUsers = async function (context) {
  const users = await userService.getAllUsers()
  context.commit('setAllUsers', users);
}

/**
 * @param  {Object} {state}
 * @param  {String} id
 * @param  {Object} payload
 */
export const updateUserData = async function ({ state }, payload) {
  return userService.updateUser(payload)
}