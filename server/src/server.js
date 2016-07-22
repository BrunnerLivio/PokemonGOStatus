var mongoose = require('mongoose');
var isPokemonGoUp = require('is-pokemon-go-up');
var dateFormat = require('dateformat');

mongoose.connect('mongodb://localhost/test');

var StatusType = {
    UP: 0,
    SLOW: 1,
    DOWN: 2,
    UNKNOWN:99
};

var Status = mongoose.model('Status', { state: Number, timestamp: { type: Date, default: Date.now } });

function updateStatus() {

    isPokemonGoUp()
        .then(function (anwser) {
            var currentStatus;
            switch (anwser) {
                case 'Yep. Go outside and catch some!':
                    currentStatus = StatusType.UP;
                    break;
                case 'Yep, but the servers are struggling :-(':
                    currentStatus = StatusType.SLOW;
                    break;
                case 'Nope, servers are down! Go back to work.':
                    currentStatus = StatusType.DOWN;
                    break;
                default:
                    currentStatus = StatusType.UNKNOWN;
                    break;

            }
            Status.count({}, function (err, count) {
                if (count >= 300) {
                    //oldest Status
                    Status.findOne({}, {}, { sort: { 'timestamp': -1 } }, function (err, status) {
                        status.remove(function(err){
                            if(err){
                                console.log("COULD NOT DELETE " + err);
                            } else {
                                console.log('Successfully removed status '+ dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT"));
                            }
                        });
                    });
                }
            });
            var status = new Status({ state: currentStatus });

            status.save(function (err) {
                if (err) {
                    console.log('COULD NOT SAVE :');
                    console.log(err);
                } else {
                    console.log('Successfully saved status :' + currentStatus + ' at: ' + dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT"));
                }
            });
        });

}
updateStatus();
// Every 2 minute
setInterval(updateStatus, 1000 * 60 * 2);
