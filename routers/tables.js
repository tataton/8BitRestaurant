var express = require('express');
var router = express.Router();
var pg = require('pg');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

var connectionString = 'postgres://localhost:5432/eight_bit_database';

router.post('/', function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
        } else {
            client.query('INSERT INTO tabletops (name, capacity) VALUES ($1, $2)', [req.body.name, req.body.capacity]);
            res.send('OK');
        }
    });
});
router.put('/', function(req, res){
    pg.connect(connectionString, function(err, client, done){
        if (err){
            console.log(err);
        } else {
            client.query('UPDATE tabletops set status=$1, employee_id=$2 WHERE id=$3', [req.body.status, req.body.employee_id, req.body.id]);
            res.send('OK');
        }
    });
});
module.exports = router;
