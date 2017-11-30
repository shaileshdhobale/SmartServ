

app.controller('formCtrl', function($scope, $http, $route) {
    $scope.expense = {};
    $scope.expenseArray = [];
    $scope.expenseId = "";

    $scope.getExpenses = function() {

        $http({
            method: 'GET',
            url: '/expense'
        }).success(function (data) {
            if(data.data.expenseData) {
                $scope.expenseArray = [];
                $scope.expenseArray = data.data.expenseData;
            }
        }).error(function (error) {
            $route.reload();
        });
    };

    $scope.getExpenses();

    $scope.addExpense = function() {
        $http({
            method: 'POST',
            url: '/expense',
            data: $scope.expense
        }).success(function (data) {
            $scope.expenseArray.unshift($scope.expense);
            $scope.expense = {};
            $route.reload();
        }).error(function (error) {
            $route.reload();
        });
    };

    $scope.editExpense = function(expense) {
        $("#editExpenseModal").modal("show");
        $scope.editExpenseDetails ={};
        $scope.editExpenseDetails.name = expense.name;
        $scope.editExpenseDetails.description = expense.description;
        $scope.editExpenseDetails.amount = expense.amount;
        $scope.editExpenseDetails.expenseId = expense._id;
    };
    
    $scope.openAddModal = function () {
        $("#addExpenseModal").modal("show");
    };

    $scope.updateExpense = function() {
        $http({
            method: 'PUT',
            url: '/expense',
            data: $scope.editExpenseDetails
        }).success(function (data) {
            $("#editExpenseModal").modal("hide");
             $route.reload();
        }).error(function (error) {
            $route.reload();
        });
    };
    $scope.deleteExpenseDetails = function(expenseId) {
        $("#deleteExpenseModal").modal("show");
        $scope.expenseId = expenseId;
    };

    $scope.deleteExpense = function(expenseId) {
        $http({
            method: 'DELETE',
            url: '/expense/' + $scope.expenseId
        }).success(function (data) {
            $("#deleteExpenseModal").modal("hide");
            $route.reload();
        }).error(function (error) {
            $route.reload();
        });
    };
});