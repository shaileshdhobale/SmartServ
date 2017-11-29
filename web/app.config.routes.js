
var app = angular.module('expenseApp', ['ngRoute']);

app.config(['$locationProvider' ,'$routeProvider',
  function($locationProvider, $routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/Expense.html',
        controller: 'formCtrl'
    })
    .otherwise('/', {
        templateUrl : "views/Expense.html",
        controller: 'formCtrl'
    });
  }]
);