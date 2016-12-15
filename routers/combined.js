var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

var connectionString = 'postgres://localhost:5432/eight_bit_database';

router.get('/', function(req, res){
  var employees = [];
  var tables = [];
  console.log('in getCombined');
  //connect to db
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to db');
      var query = client.query('SELECT * FROM employees');
      query.on('row', function(row){
        employees.push(row);
      }); // end query
      query.on('end', function(){
        done();
        console.log(employees);
        //send a response
        res.send(true);
      });
    }
  });
});

module.exports = router;
