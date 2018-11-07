'use strict';

const express = require('express');
const path = require('path');
const httpLogger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const apiRoutes = require('./routes')
const app = express();
const port = 3000;

app.use(httpLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// allow Cross Origin Requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    /**
     * This is causing problems with CORS access on Firefox, needs to be explicitly set
     *
     * res.header("Access-Control-Allow-Methods", "*");
     * 
     */

    res.header("Access-Control-Allow-Methods", "*, PUT");

    next();
});

app.use('/v1/api/', apiRoutes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('404 - Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = ['development', 'DEV'].indexOf(req.app.get('env')) >= 0 ? err : {};

    res.status(err.status || 500);
    res.send('');
});

let server = app.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.info('Listening on ' + bind);
}


//Provide a static server for the website

const app2 = express();
const port2 = 3001;
const server2 = http.createServer(app2);

app2.use("/js", express.static(path.join(__dirname,"../js")));
app2.use("/css", express.static(path.join(__dirname,"../css")));
app2.use("/resources", express.static(path.join(__dirname,"../resources")));
app2.get("/", function(req, res){
	res.sendFile(path.join(__dirname,"../index.html"));
});

server2.listen(port2);
console.log(`

Webserver is listening on port ${port2},
Browse to http://localhost:${port2} for the interface.
`);