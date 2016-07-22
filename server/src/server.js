var updateStatus = require('./task/updateStatus');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Status = require('./models/status');
var mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  var allowedOrigins = ['http://brunnerliv.io', 'http://localhost:8080'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});
var port = 8888;

var router = express.Router();
mongoose.connect('mongodb://localhost/test');

router.get('/status', function (req, res) {
    Status.find().sort('-timestamp').limit(200).exec(function (err, status) {
        if (err)
            res.send(err);

        res.json(status);
    });
});

app.use('/api', router);


app.listen(port);


updateStatus();
// Every 5 minute
setInterval(updateStatus, 1000 * 60 * 5);
