var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/eight_bit_database';

router.get('/', function(req, res) {
    var employees = [];
    var tables = [];
    console.log('in getCombined');
    //connect to db
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected to db');
            var employeeQuery = client.query('SELECT * FROM employees');
            employeeQuery.on('row', function(row) {
                employees.push(row);
            }); // end query
            // var tableQuery = client.query('SELECT * from tabletops LEFT JOIN employees ON employees.id = tabletops.employee_id');
            var tableQuery = client.query('SELECT * from tabletops ORDER BY name ASC');
            tableQuery.on('row', function(row) {
                tables.push(row);
            });
            tableQuery.on('end', function() {
                done();
                console.log(employees);
                var object_to_send = {
                    employees: employees,
                    tables: tables
                };
                res.send(object_to_send);
            });
        }
    });
});

module.exports = router;
