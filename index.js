'use strict';

var http = require('http');

var options = {
  host:'api.cloudsightapi.com',
  path: '/image_responses/3aXZwBonqrgb8OGHyzcVQQ',
  headers: {'Authorization': 'CloudSight Y0KnZccC0BCLmyDLSFH8XA'}
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);

  res.on('data', function(chunk){
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
