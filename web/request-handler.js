var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');

// require more modules/folders here!

var headers = {
  'content-type': 'text/html'
};

var sendResponse = function(statusCode, response, data) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

exports.handleRequest = function (req, res) {
  //checks the url and the request method
  if (req.url === '/' && req.method === 'GET') {
    console.log(req.url);

    fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
      if (err) {
        return console.error(err);
      } 
      sendResponse(200, res, data.toString());
    });

  } else if ( req.method === 'POST' ) {
    // if request is POST
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });

    req.on('end', function() {
      body = body.toString();

      var responseBody = querystring.parse(body);
      
      archive.readListOfUrls(archive.paths.list, function(pathArray) {

        // check if our target is inside
        archive.isUrlInList(responseBody.url, pathArray, function() {
          sendResponse(302, res, '');
        });

        archive.addUrlToList(responseBody.url, archive.paths.list, function() {
          sendResponse(302, res, '');
        });
      });

    });

  } else {
    
    // when a get request is sent to /www.google.com
    var url = req.url.substr(1);

    // check archived folder to see if site exists
    fs.readFile(archive.paths.archivedSites + '/' + url, function(err, data) {
      if (err) {
        sendResponse(404, res, 'Path not found');
        return console.error(err);
      }

      // return file data
      sendResponse(200, res, data.toString());

    });


    // res.end('End');
  }

  // res.end(archive.paths.list);
};



























