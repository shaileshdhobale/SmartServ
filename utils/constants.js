
//Constants
var constant = function() {
	this.BAD_REQUEST = "Bad request.";
	this.INTERNAL_SERVER_ERROR = "Internal Server Error.";
	this.EXPENSE_ADDED_SUCCESS = "Expense Added successfully.";
	this.EXPENSE_ADD_FAILURE = "Failed to add new Expense.";
	this.EXPENSE_FETCH_SUCCESS = "Expense fetched successfully.";
    this.EXPENSE_FETCH_FAILURE = "Failed to fetch Expense details.";
    this.EXPENSE_EDITED_SUCCESS = "Expense edited successfully.";
    this.EXPENSE_EDIT_FAILURE = "Failed to edit new Expense.";
    this.EXPENSE_DELETED_SUCCESS = "Expense deleted successfully.";
    this.EXPENSE_DELETE_FAILURE = "Failed to delete expsense.";

};

module.exports = new constant();