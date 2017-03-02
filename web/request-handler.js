var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var querystring = require('querystring');
var htmlfetcher = require('../workers/htmlfetcher');
var _ = require('underscore');

// require more modules/folders here!

var headers = {
  'content-type': 'text/html'
};

var sendResponse = function(statusCode, response, data, additionalHeaders) {
  statusCode = statusCode || 200;
  additionalHeaders = additionalHeaders || {};
  headers = _.extend(headers, additionalHeaders);
  response.writeHead(statusCode, headers);
  response.end(data);
};

exports.handleRequest = function (req, res) {
  //checks the url and the request method
  if (req.url === '/' && req.method === 'GET') {

    fs.readFile(archive.paths.siteAssets + '/index.html', function(err, data) {
      if (err) {
        return console.error(err);
      } 
      sendResponse(200, res, data.toString());
    });

  } else if ( req.method === 'POST' ) {

    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });

    req.on('end', function() {
      body = body.toString();

      var responseBody = querystring.parse(body);
      
      archive.readListOfUrls(function(pathArray) {

        archive.isUrlArchived(responseBody.url, function(exists) {
          if (exists) {
            console.log('URL Archive: ', exists);
            
            fs.readFile(archive.paths.archivedSites + '/' + responseBody.url, function(err, data) {
              if (err) {
                return console.error(err);
              }

              sendResponse(302, res, '', {'Location': 'http://127.0.0.1:8080/' + responseBody.url});
              
            });


          } else {
            console.log('URL Archive: Doesn\'t exist.');

            archive.isUrlInList(responseBody.url, function(exists) {

              if (!exists) {
                archive.addUrlToList(responseBody.url, function() {
                  // do nothing
                });
              }

              fs.readFile(archive.paths.siteAssets + '/loading.html', function(err, data) {
                if (err) {
                  return console.error(err);
                }

                sendResponse(302, res, data.toString());              
              });
            });
          }
        });

      });

    });

  } else if (req.url === '/test' && req.method === 'GET') {
    htmlfetcher.download();
    sendResponse(201, res, 'testing!');
  } else {
    
    // when a get request is sent to /www.domain.com
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
