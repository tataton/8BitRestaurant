var express = require('express');
var router = express.Router();
var pg = require('pg');
var bodyParser = require('body-parser');

var validStatuses = ['empty', 'dirty', 'seated', 'served'];

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

var connectionString = 'postgres://localhost:5432/eight_bit_database';

router.post('/', function(req, res) {
    // If any value is undefined, or if name is an empty string, or if capacity is not an integer, fail
    if (req.body && req.body.name && req.body.capacity && req.body.name !== '' &&
        !isNaN(parseInt(req.body.capacity))) {
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                client.query('INSERT INTO tabletops (name, capacity) VALUES ($1, $2)', [req.body.name, req.body.capacity]);
                res.send('OK');
            }
        });
    } else {
        res.sendStatus(418);
    }
});
router.put('/', function(req, res) {
    if (validStatuses.indexOf(req.body.status) > -1) {
        pg.connect(connectionString, function(err, client, done) {
            if (err) {
                console.log(err);
            } else {
                client.query('UPDATE tabletops set status=$1, employee_id=$2 WHERE id=$3', [req.body.status, req.body.employee_id, req.body.id], function(err) {
                    console.log(err);
                    // console.log(bool(err));
                    if (err) {
                        res.sendStatus(418);
                    } else {
                        res.send('OK');
                    }
                });
            }
        });
    } else {
        res.sendStatus(418);
    }
});
module.exports = router;
