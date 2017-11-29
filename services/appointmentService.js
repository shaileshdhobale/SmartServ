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
var addAppointment = function  (appointmentObj, callback) {
	var METHOD_NAME = "[addAppointment] ";
	model.appointment(appointmentObj).save(function(error, result) {
		if(error) {
			logger.error(METHOD_NAME + error);
			callback(error, null);
		} else {
			if(!_.isEmpty(result)) {
				delete result.__v;
				delete result._id;	
			}
			logger.debug(METHOD_NAME + JSON.stringify(result));
			callback(null, result);
		}
	})
}


//Function to check for appoientment slot in DB
var checkAppointmentSlot = function(appointmentObj, callback) {
	var METHOD_NAME = "[checkAppointmentSlot] ";
	logger.debug("HERE");
	model.appointment.findOne({
    $or:[{
            $and:[{
                startDate: {$lte: appointmentObj.startDate},
                endDate: {$gt: appointmentObj.startDate},
            }]
        },
       {
            $and:[{
                startDate: {$lt: appointmentObj.endDate},
                endDate: {$gt: appointmentObj.endDate}
            }]
        },
        {
        	$and:[{
        		startDate: {$gt: appointmentObj.startDate},
        		endDate: {$lt: appointmentObj.endDate}
        	}
        	]
        }
    ]
}, function(error, result) {
		if(error) {
			logger.error(METHOD_NAME + error);
			callback(error, null);
		} else {
			logger.debug(METHOD_NAME + JSON.stringify(result));
			callback(null, result);
		}
	})
}


//Function to get all appointments from DB
var getALLAppointment = function(callback) {
	var METHOD_NAME = "[getALLAppointment] ";
	model.appointment.find({}, function(error, result) {
		if(error) {
			logger.error(METHOD_NAME + error);
			callback(error, null);
		} else {
			logger.debug(METHOD_NAME + JSON.stringify(result));
			callback(null, result);
		}
	})
}

module.exports.addAppointment = addAppointment;
module.exports.checkAppointmentSlot = checkAppointmentSlot;
module.exports.getALLAppointment = getALLAppointment;