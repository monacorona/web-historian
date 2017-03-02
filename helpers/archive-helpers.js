var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var async = require('async');
var http = require('http');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {

  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      return console.error(err);
    }
    callback(data.toString().split('\n'));
  });
};

// @list - array of url strings in sites.txt
exports.isUrlInList = function(url, callback) {

  exports.readListOfUrls(function(list) {

    var exists = list.indexOf(url) >= 0 ? true : false;

    callback(exists);

  });

};

// @listPath - path to sites.txt
exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err) {
    console.log(url + '\n');
    if (err) {
      return console.error(err);
    }

    callback();
  });
};

exports.isUrlArchived = function(url, callback) {

  fs.readFile(exports.paths.archivedSites + '/' + url, function(err, data) {

    var exists = err ? false : true;

    callback(exists);

  });
};

exports.downloadUrls = function(urls) {
  console.log('download!!!!!!');
  // get the list of urls from sites.txt
  exports.readListOfUrls(function(list) {
    // download it by creating a folder with the url'
    async.each(list, function(file, callback) {
      // download the HTML from the site
      request.get('http://' + file, function(error, res, body) {
        fs.writeFile(exports.paths.archivedSites + '/' + file, body, function(err) {
          if (err) {
            console.error(err);
          }
          // remove successful written file from the URLs array
          list.splice(list.indexOf(file), 1);

          fs.writeFile(exports.paths.list, list.join('\n'), function(err) {
            if (err) {
              console.error(err);
            }
          });

        });
      });
    }, function(err) {
      if (err) {
        console.log(err);
      }      
    });
  });
};























