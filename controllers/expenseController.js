//External Dependencies
var log4js = require('log4js');
var _ = require('lodash');
var async = require('async');
var Joi = require('joi');
//Internal dependencies
var config = require("../config/config.js");
var envConfig = config.environmentConfig();
var expenseService = require('../services/expenseService.js');
var constants = require('../utils/constants.js');


// logger
var logger = log4js.getLogger('[dao/db]');
logger.setLevel(envConfig.logLevel);


//Function to add Expense and send response to client.
var addExpense = function(req, res) {
	var METHOD_NAME = "[addExpense] ";
	var response;
	var expenseObj = req.body;
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        amount: Joi.number().required()
    }).with('name', 'description', 'amount');

    const schemaResult = Joi.validate(expenseObj, schema);
	if(schemaResult.error !== null) {
		response = {
			status: 400,
			message: constants.BAD_REQUEST
		};
		return res.status(400).send(response);
	}
    expenseObj.createdDate = new Date();
	expenseService.addExpense(expenseObj, function(error, result) {
		if(error) {
			logger.error(METHOD_NAME + error);
            response = {
                status: 500,
                message: constants.INTERNAL_SERVER_ERROR
            };
            res.status(500).send(response);
		} else if(!_.isEmpty(result)) {
            response = {
                status: 500,
                message: constants.EXPENSE_ADDED_SUCCESS,
				data: {
                	expense: true
				}
            };
            res.status(200).send(response);
		} else {
            response = {
                status: 500,
                message: constants.EXPENSE_ADD_FAILURE,
                data: {
                    expense: false
                }
            };
            res.status(200).send(response);
		}
	})
};
/**
 * Function to get all Expense and send response to client.
 * @param req
 * @param res
 */
var getExpense = function(req, res) {
	var METHOD_NAME = "[getExpense] ";
	var response;
    expenseService.getExpense(function(error, result) {
        if(error) {
            logger.error(METHOD_NAME + error);
            response = {
                status: 500,
                message: constants.INTERNAL_SERVER_ERROR
            };
            res.status(500).send(response);
        } else if(!_.isEmpty(result)) {
            response = {
                status: 200,
                message: constants.EXPENSE_FETCH_SUCCESS,
                data: {
                    expense: true,
					expenseData: result
                }
            };
            res.status(200).send(response);
        } else {
            response = {
                status: 200,
                message: constants.EXPENSE_FETCH_FAILURE,
                data: {
                    expense: false
                }
            };
            res.status(200).send(response);
        }
	})
};

/**
 * Function to edit Expense and send response to client.
 * @param req
 * @param res
 * @returns {*}
 */
var editExpense = function(req, res) {
    var METHOD_NAME = "[editExpense] ";
    var response;
    var expenseObj = req.body;
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        amount: Joi.number().required(),
        expenseId: Joi.string().required()
    }).with('name', 'description', 'amount', 'expenseId');

    const schemaResult = Joi.validate(expenseObj, schema);
    if(schemaResult.error !== null) {
        response = {
            status: 400,
            message: constants.BAD_REQUEST
        };
        return res.status(400).send(response);
    }
    expenseObj.updatedDate = new Date();
    expenseService.editExpense(expenseObj, function(error, result) {
        if(error) {
            logger.error(METHOD_NAME + error);
            response = {
                status: 500,
                message: constants.INTERNAL_SERVER_ERROR
            };
            res.status(500).send(response);
        } else if(!_.isEmpty(result)) {
            response = {
                status: 500,
                message: constants.EXPENSE_EDITED_SUCCESS,
                data: {
                    expense: true
                }
            };
            res.status(200).send(response);
        } else {
            response = {
                status: 500,
                message: constants.EXPENSE_EDIT_FAILURE,
                data: {
                    expense: false
                }
            };
            res.status(200).send(response);
        }
    })
};

/**
 * Function to delete Expense and send response to client.
 * @param req
 * @param res
 * @returns {*}
 */
var deleteExpense = function(req, res) {
    var METHOD_NAME = "[deleteExpense] ";
    var response;
    var expenseId = req.params.expenseId;
    const schema = Joi.string().required();

    const schemaResult = Joi.validate(expenseId, schema);
    if(schemaResult.error !== null) {
        response = {
            status: 400,
            message: constants.BAD_REQUEST
        };
        return res.status(400).send(response);
    }
    expenseService.deleteExpense(expenseId, function(error, result) {
        if(error) {
            logger.error(METHOD_NAME + error);
            response = {
                status: 500,
                message: constants.INTERNAL_SERVER_ERROR
            };
            res.status(500).send(response);
        } else if(!_.isEmpty(result) && result.result.n >= 1) {
            response = {
                status: 200,
                message: constants.EXPENSE_DELETED_SUCCESS,
                data: {
                    expense: true
                }
            };
            res.status(200).send(response);
        } else {
            response = {
                status: 200,
                message: constants.EXPENSE_DELETE_FAILURE,
                data: {
                    expense: false
                }
            };
            res.status(200).send(response);
        }
    })
};


module.exports.addExpense = addExpense;
module.exports.getExpense = getExpense;
module.exports.editExpense = editExpense;
module.exports.deleteExpense = deleteExpense;