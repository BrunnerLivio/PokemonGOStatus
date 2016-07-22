var mongoose = require('mongoose');
var isPokemonGoUp = require('../isPokemonGoUp');
var dateFormat = require('dateformat');
var Status = require('../models/status');
var StatusType = require('../models/statusType');

function updateStatus() {

    isPokemonGoUp()
        .then(save, save);

}

function save(time){
    var currentStatus;

    if (time === -1) currentStatus = StatusType.UNKNOWN;
    if (time < 800) currentStatus = StatusType.UP;
    if (time >= 800 && time < 3000) currentStatus = StatusType.SLOW;
    if (time >= 3000) currentStatus = statusType.DOWN;

    Status.count({}, function (err, count) {
        if (count >= 1000) {
            //oldest Status
            Status.findOne({}, {}, { sort: { 'timestamp': -1 } }, function (err, status) {
                status.remove(function (err) {
                    if (err) {
                        console.log("COULD NOT DELETE " + err);
                    } else {
                        console.log('Successfully removed status ' + dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT"));
                    }
                });
            });
        }
    });
    var status = new Status({ state: currentStatus, responseTime: time });

    status.save(function (err) {
        if (err) {
            console.log('COULD NOT SAVE :');
            console.log(err);
        } else {
            console.log('Successfully saved status :' + currentStatus + ' at: ' + dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT") + ' resonse time : ' + time);
        }
    });
}

module.exports = updateStatus;