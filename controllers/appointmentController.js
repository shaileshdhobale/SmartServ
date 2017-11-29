//External Dependencies
var log4js = require('log4js');
var _ = require('lodash');
var async = require('async');

//Internal dependencies
var config = require("../config/config.js");
var envConfig = config.environmentConfig();
var appointmentServices = require('../services/appointmentService.js');
var constants = require('../utils/constants.js');


// logger
var logger = log4js.getLogger('[dao/db]');
logger.setLevel(envConfig.logLevel);


//Function to add appointment and send response to client.
var addAppointment = function(req, res) {
	var METHOD_NAME = "[addAppointment] ";
	var response;
	var appointmentObj = req.body;
	logger.debug(METHOD_NAME + JSON.stringify(appointmentObj));

	if(_.isEmpty(appointmentObj.title) || _.isEmpty(appointmentObj.startDate) || _.isEmpty(appointmentObj.endDate) || _.isEmpty(appointmentObj.description)) {
		response = {
			status: "400",
			message: constants.BAD_REQUEST,
		}
		return res.status(400).send(response);
	}
	async.waterfall([
		function checkAppointmentSlot(callback) {
			appointmentServices.checkAppointmentSlot(appointmentObj, function(error, result) {
				if(error) {
					logger.error(METHOD_NAME + error);
					callback(error, null);
				} else {
					callback(null, result);
				}
			})
		},
		function addAppointment(result, callback){
			if(_.isEmpty(result)) {
				appointmentServices.addAppointment(appointmentObj, function(error, result) {
					if(error) {
						logger.error(METHOD_NAME + error);
						callback(error, null);
					} else {
						callback(null, result);
					}
				})
			} else {
				callback(null, constants.APPOINTMENTBOOKED);
			}
		}
	], function(error, finalResult) {
		if(error) {
			logger.error(METHOD_NAME + error);
			response = {
				status: "500",
				message: constants.INTERNAL_SERVER_ERROR
			}
			return res.status(500).send(response);
		} else if(constants.APPOINTMENTBOOKED == finalResult) {
			response = {
				status: "200",
				message: constants.APPOINTMENT_SLOT_UNAVALIABLE,
				data: false
			}
			return res.status(200).send(response);	
		} 
		else if(!_.isEmpty(finalResult)) {
			response = {
				status: "201",
				message: constants.APPOINTMENT_ADDED_SUCCESS,
				data: finalResult
			}
			return res.status(201).send(response);
		} else {
			response = {
				status: "200",
				message: constants.APPOINTMENT_ADDED_FAILURE,
				data: false
			}
			return res.status(200).send(response);
		}
	})
};

//Function to get all appointments and send to client.
var fetchAllAppointment = function (req, res) {
	var METHOD_NAME = "[fetchAllAppointment] ";
	var response;
	appointmentServices.getALLAppointment(function(error, result) {
		if(error) {
			logger.error(METHOD_NAME + error);
			response = {
				status: "500",
				message: constants.INTERNAL_SERVER_ERROR
			}
			 res.status(500).send(response);
		} else if(!_.isEmpty(result)) {
			response = {
				status: "200",
				message: constants.APPOINTMENT_FETCH_SUCCESS,
				data: result
			}
			 res.status(200).send(response);
		} else {
			response = {
				status: "200",
				message: constants.APPOINTMENT_FETCH_FAILURE,
				data: false
			}
			 res.status(200).send(response);
		}	
	})
}
module.exports.fetchAllAppointment = fetchAllAppointment;
module.exports.addAppointment = addAppointment;
