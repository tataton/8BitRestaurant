var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

var connectionString = 'postgres://localhost:5432/eight_bit_database';

router.post('/', function(req, res) {
    console.log(req.body);
    if (req.body && req.body.first_name && req.body.last_name &&
        req.body.first_name !== '' && req.body.last_name !== '') {
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                client.query('INSERT INTO employees (first_name, last_name) VALUES ($1, $2)', [req.body.first_name, req.body.last_name]);
                res.send('ok');
            }
        }); // end connect
    } else {
        res.sendStatus(418);
    }
}); // end post

module.exports = router;
