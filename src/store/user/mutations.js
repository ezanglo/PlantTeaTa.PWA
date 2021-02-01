export const setEditUserDialog = (state, editUserDialog) => {
  state.editUserDialog = editUserDialog
}

export const setAllUsers = (state, allUsers) => {
  state.allUsers = allUsers
}

export const updateUser = (state, payload) => {
  state.allUsers.forEach(user => {
    if(user.id == payload.id){
      user.fullName = payload.fullName
      user.mobile = payload.mobile
      user.role = payload.role
      user.branchName = payload.branchName
    }
  });
}

export const addProductToCart = (state, product) => {
  state.currentUserCart.push(product)
}

export const setCurrentUserCart = (state, currentUserCart) => {
  state.currentUserCart = currentUserCart
}

export const updateCartProductQuantity = (state, payload) => {
  state.currentUserCart.forEach(product => {
    if(product.id == payload.id){
      product.productQuantity = payload.productQuantity
    }
  });
}

export const removeCartProduct = (state, id) => {
  state.currentUserCart.forEach(function(product, index) {
    if(product.id == id){
      state.currentUserCart.splice(index, 1)
      return;
    }
  })
}