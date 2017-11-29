// External dependencies
var log4js = require('log4js');
var mongoose = require('mongoose');

// Internal dependencies
var config = require("../config/config.js");
var envConfig = config.environmentConfig();

// logger
var logger = log4js.getLogger('[dao/db]');
logger.setLevel(envConfig.logLevel);


var connectToMongo = function() {
    // Connect to DB
    // var mongoURL = process.env.MONGO_OVERRIDE || environmentConfig.dbConnectionString;
    var mongoURL = envConfig.dbConnectionString;
    mongoose.connect(mongoURL);
    db = mongoose.connection;
    db.on('error', function onError(err) {
        logger.warn('Connection to Mongo Unsuccessful: ' + err);
    });

    // When the connection is disconnected
    db.on('disconnected', function() {
        logger.info('Mongoose default connection disconnected');
    });

    // When successfully connected
    db.on('connected', function() {
        logger.info('Mongoose default connection open');
    });

    db.once('open', function callback() {
        logger.info('Connection to Mongo Successful');
    });
};

var Schema = mongoose.Schema;

var SchemaTypes = mongoose.Schema.Types;
var expense = new Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    amount: { type: Number, require: true },
    createdDate: { type: Date, require: true },
    updatedDate: { type: Date }
});


// Exports modules.
module.exports.expense = mongoose.model('expense', expense, 'expense');


//Mongoose Connection
module.exports.db = mongoose.connection;
module.exports.connectToMongo = connectToMongo;