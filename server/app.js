var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
var port = process.env.PORT || 8080;

app.use(express.static('public'));

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/eight_bit_database';

// -- ROUTES -- //

var employees = require('../routers/employees');
app.use('/employees', employees);
var tables = require('../routers/tables');
app.use('/tables', tables);
var combined = require('../routers/combined');
app.use('/combined', combined);


// spin up server
app.listen(port, function() {
    console.log('server up on', port);

    // Create tables if they don't already exist
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            var query = 'CREATE TABLE employees (';
            query += 'id SERIAL PRIMARY KEY NOT NULL,';
            query += 'first_name VARCHAR (50) UNIQUE,';
            query += 'last_name VARCHAR (50) UNIQUE';
            query += ');';
            client.query(query, function(err) {
                if (err) {
                    console.log(err);
                } // end if
            }); //end query

            query = 'CREATE TABLE tabletops (';
            query += 'id SERIAL PRIMARY KEY NOT NULL,';
            query += 'name VARCHAR (50) UNIQUE,';
            query += 'capacity INTEGER,';
            query += 'status VARCHAR (50) DEFAULT ';
            query += ',';
            query += 'employee_id INTEGER REFERENCES employees(id) ON DELETE SET NULL';
            client.query(query, function(err) {
                if (err) {
                    console.log(err);
                } // end if
            }); // end query
        }
    });
});
