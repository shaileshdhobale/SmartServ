//external dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var log4js = require('log4js');

//router
var expenseRouter = require('./router/expenseRouter.js');

//config
var config = require("./config/config.js");
var envConfig = config.environmentConfig();

//middleware
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static(__dirname + '/web'));
if(process.NODE_ENV === "production") {
    app.set('port', process.env.PORT || envConfig.securePort || 443);
} else {
    app.set('port', process.env.PORT || envConfig.port || 8000);    
}


//logger
log4js.configure('./config/logConfig.json');
var logger = log4js.getLogger('[app]');
logger.setLevel(envConfig.logLevel);

// Connect to MongoDB
var db = require('./dao/db.js');
db.connectToMongo();

var server = app.listen(app.get('port'));
logger.info('Express server listening on port ' + server.address().port);



// Connect to MongoDB
var db = require('./dao/db.js');
// db.connectToMongo();

logger.info("Intializing router...");
app.all('*', expenseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    logger.error(JSON.stringify(err.stack));
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err);
});