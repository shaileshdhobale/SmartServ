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


//Function to add appointment and send response to client.
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

var getExpense = function(req, res) {
	var METHOD_NAME = "[getExpense] ";
	var response;
	/*var queryObj = req.query;
    const schema = Joi.object().keys({
        limit: Joi.string().required(),
        skipRecord: Joi.string().required()
    }).with('limit', 'skipRecord');
    const schemaResult = Joi.validate(queryObj, schema);
    if(schemaResult.error !== null) {
        response = {
            status: 400,
            message: constants.BAD_REQUEST
        };
        return res.status(400).send(response);
    }*/
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

module.exports.addExpense = addExpense;
module.exports.getExpense = getExpense;
