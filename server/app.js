var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var port = process.env.PORT || 8080;

app.use(express.static('public'));

var connectionString = 'postgres://localhost:5432/eight_bit_database';

// -- ROUTES -- //

var employees = require('../routers/employees');
app.use('/employees', employees);
var tables = require('../routers/tables');
app.use('/tables', tables);
var combined = require('../routers/combined');
app.use('/combined', combined);


// spin up server
app.listen(port, function(){
  console.log('server up on', port);
});
