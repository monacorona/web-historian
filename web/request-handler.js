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

      // var urlTemp = archive.paths.list;
      
      archive.readListOfUrls(function(pathArray) {

        archive.isUrlInList(responseBody.url, function(exists) {
          if (exists) {
            sendResponse(302, res, ''); 
          }
        });

        archive.addUrlToList(responseBody.url, function() {
          sendResponse(302, res, '');
        });
      });

    });

  } else {
    
    // when a get request is sent to /www.google.com
    var url = req.url.substr(1);

    archive.isUrlArchived(url, function(exists) {
      if (exists) {
        // if exists, respond with file data
        fs.readFile(archive.paths.archivedSites + '/' + url, function(err, data) {
          if (err) {
            return console.error(err);
          }

          // return file data
          sendResponse(200, res, data.toString());
        });
      } else {
        sendResponse(404, res, 'Path not found');
      }
    });

    


    // res.end('End');
  }

  // res.end(archive.paths.list);
};
