export const setEditUserDialog = (state, editUserDialog) => {
  state.editUserDialog = editUserDialog
}

export const clearCurrentUser = (state) => {
  state.currentUser = null
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

export const setRewardTransactions = (state, rewardTransactions) => {
  state.rewardTransactions = rewardTransactions
}

export const setCurrentUserRewardTransactions = (state, currentUserRewardTransactions) => {
  state.currentUserRewardTransactions = currentUserRewardTransactions
}

export const addRewardTransaction = (state, rewardTransaction) => {
  state.rewardTransactions.push(rewardTransaction)
  state.currentUserRewardTransactions.push(rewardTransaction)
}

export const updateRewardTransaction = (state, payload) => {
  state.rewardTransactions.forEach(transaction => {
    if(transaction.id == payload.id){
      transaction.description = payload.description
    }
  });

  state.currentUserRewardTransactions.forEach(transaction => {
    if(transaction.id == payload.id){
      transaction.description = payload.description
    }
  });
}

export const deleteRewardTransaction = (state, id) => {
  if(state.rewardTransaction.length > 0){
    state.rewardTransactions.forEach(function(transaction, index) {
      if(transaction.id == id){
        state.rewardTransactions.splice(index, 1)
        return;
      }
    })
  }

  if(state.currentUserRewardTransactions.length > 0){
    state.currentUserRewardTransactions.forEach(function(transaction, index) {
      if(transaction.id == id){
        state.currentUserRewardTransactions.splice(index, 1)
        return;
      }
    })
  }
}