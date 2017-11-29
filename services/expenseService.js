//External dependencies
var log4js = require('log4js');
var _ = require('lodash');

//Internal dependencies
var config = require("../config/config.js");
var envConfig = config.environmentConfig();
var model = require('../dao/db.js');

// logger
var logger = log4js.getLogger('[appointmentServices]');
logger.setLevel(envConfig.logLevel);

//Function to add appointment in DB
var addExpense = function  (ExpenseObj, callback) {
	var METHOD_NAME = "[addExpense] ";
    var sql = "INSERT INTO Expense SET ?";
    model.expense(ExpenseObj).save(function (error, result) {
        if (error) {
        	logger.error(METHOD_NAME + error);
        	callback(error, null);
		} else {
			callback(null, result);
		}
    });
};

var getExpense = function(callback) {
    var METHOD_NAME = "[getExpense] ";
    model.expense.find({}).sort({$natural: -1}).exec(function(error, result) {
        if (error) {
            logger.error(METHOD_NAME + error);
            callback(error, null);
        } else {
            callback(null, result);
        }
    })
};

module.exports.addExpense = addExpense;
module.exports.getExpense = getExpense;