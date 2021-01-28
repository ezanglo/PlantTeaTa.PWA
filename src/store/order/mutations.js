export const setAllOrders = (state, allOrders) => {
    state.allOrders = allOrders
}
  
export const addOrder = (state, order) => {
    state.allOrders.push(order)
}
  
export const deleteOrder = (state, id) => {
    state.allOrders.forEach(function(order, index) {
        if(order.id == id){
            state.allOrders.splice(index, 1)
            return;
        }
    })
}
  
export const updateOrder = (state, payload) => {
    state.allOrders.forEach(function(order) {
        if(order.id == payload.id){
            order.userId = payload.userId
            order.orderDescription = payload.orderDescription
            order.orderList = payload.orderList
            order.couponCode = payload.couponCode
            order.totalAmount = payload.totalAmount
            order.isDeleted = payload.isDeleted
            return;
        }
    })
}