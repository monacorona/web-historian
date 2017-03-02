// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var async = require('async');


// // check for items in sites.txt
// fs.readFile(archive.path.list, function(err, data) {
//   if (err) {
//     return console.error(err);
//   }
//   // form an array of sites to download
//   var sitesArray = data.toString().split('\n');

//   // iterate through these sites and download them
//   archive.downloadUrls(sitesArray);
  
// });
exports.download = archive.downloadUrls;


  // not in our archives
    // download array of URLs
    

    // if successful,
      // remote from sites.txt