

app.controller('formCtrl', function($scope, $http, $route) {
    $scope.expense = {};
    $scope.expenseArray = [];
    
    $scope.getExpenses = function() {

        $http({
            method: 'GET',
            url: '/expense'/*?skipRecord=' + skipRecord + "&limit=" + limit*/
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
        $scope.expense = expense;
    }
});