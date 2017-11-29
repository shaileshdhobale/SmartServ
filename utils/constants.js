
//Constants
var constant = function() {
	this.BAD_REQUEST = "Bad request.";
	this.INTERNAL_SERVER_ERROR = "Internal Server Error.";
	this.EXPENSE_ADDED_SUCCESS = "Expense Added successfully.";
	this.EXPENSE_ADD_FAILURE = "Failed to add new Expense.";
	this.EXPENSE_FETCH_SUCCESS = "Expense fetched successfully.";
    this.EXPENSE_FETCH_FAILURE = "Failed to fetch Expense details.";
}

module.exports = new constant();