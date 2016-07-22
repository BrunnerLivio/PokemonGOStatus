'use strict';

var fetch = require('node-fetch');
var timeout = require('promise.timeout');
var time = require('promise-time');

var url = 'https://pgorelease.nianticlabs.com/plfe/';

function getfetchPromise() {
  var timePromise = time(fetch)(url);
  return timePromise.then(function () {
    return timePromise.time;
  }).catch(function () {
    return -1;
  });
}

function getTimePromise() {
  return timeout(getfetchPromise, 3500, true)().catch(function () {
    return -1;
  });
}

function isPokemonGoUp() {
  return getTimePromise();
}
module.exports = isPokemonGoUp;
