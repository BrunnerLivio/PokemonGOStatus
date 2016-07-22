var updateStatus = require('./task/updateStatus');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Status = require('./models/status');
var mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();
mongoose.connect('mongodb://localhost/test');

router.get('/status', function (req, res) {
    Status.find(function (err, status) {
        if (err)
            res.send(err);

        res.json(status);
    });
});

app.use('/api', router);


app.listen(port);


updateStatus();
// Every 2 minute
setInterval(updateStatus, 1000 * 60 * 2);
