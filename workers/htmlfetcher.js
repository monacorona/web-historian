#!/usr/env node

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.


var archive = require('/Users/student/Codes/web-historian/helpers/archive-helpers');
var fs = require('fs');
var CronJob = require('cron').CronJob;

exports.download = archive.downloadUrls;

var job = new CronJob('* * * * *', function() {
  console.log('HELLO CRON');
  exports.download();
  fs.appendFile('/Users/student/Codes/web-historian/log.txt', 'cron happened\n', function(err) {

  });

});

job.start();


