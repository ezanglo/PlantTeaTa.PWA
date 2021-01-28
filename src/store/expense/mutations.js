export const setAllExpenses = (state, allExpenses) => {
    state.allExpenses = allExpenses
}
  
export const addExpense = (state, expense) => {
    state.allExpenses.push(expense)
}
  
export const deleteExpense = (state, id) => {
    state.allExpenses.forEach(function(expense, index) {
        if(expense.id == id){
            state.allExpenses.splice(index, 1)
            return;
        }
    })
}
  
export const updateExpense = (state, payload) => {
    state.allExpenses.forEach(function(expense) {
        if(expense.id == payload.id){
            expense.expenseDescription = payload.expenseDescription
            expense.expenseDate = payload.expenseDate
            expense.expenseAmount = payload.expenseAmount
            expense.branchName = payload.branchName
            return;
        }
    })
}