'use strict';

var http = require('http');
var fs = require('fs');
var rest = require('restler');
var util = require('util');

function sendImage(filepath) {
  var stats = fs.statSync(filepath);
  //console.log(fs.statSync(filepath).size);

  console.log('Sending file ' + filepath + ' of ' + stats.size + ' bytes');

  rest.post('http://api.cloudsightapi.com/image_requests', {
    headers: {'Authorization': 'CloudSight Y0KnZccC0BCLmyDLSFH8XA'},
    multipart: true,
    data: {
      'image_request[locale]': 'es',
      'image_request[image]': rest.file(filepath, null, stats.size, null, null)
    }
  }).on('complete', function(data) {
    console.log('token: ' + data.token);
    getImage(data.token);
  }).on('error', function(err, response) {
    console.log('Error sending the image:' + err);
  });
}

function getImage(token) {
  rest.get('http://api.cloudsightapi.com/image_responses/' + token, {
    headers: {'Authorization': 'CloudSight Y0KnZccC0BCLmyDLSFH8XA'}
  }).on('complete', function(data) {
    if (data.status == 'not completed') {
        process.stdout.write(".");
        setTimeout(function(){
          getImage(token);
        }, 1000);
    } else if (data.status == 'completed') {
      console.log('name: ' + data.name);
      getCategory(data.name);
    } else {
      console.log(data);
    }
  }).on('error', function(err, response) {
    console.log('Error obtaining the image response:' + err);
  });
}

function getCategory(searchTerm) {
  rest.get('http://api-v2.olx.com/items?location=www.olx.com&searchTerm=' + searchTerm
  ).on('complete', function(response) {
    if(response.data.length != 0) {
      console.log('category: ' + response.data[0].category.id);
    } else {
      console.log("no category found");
    }
  }).on('error', function(err, response) {
    console.log('Error obtaining the category:' + err);
  });
}

if(process.argv.length < 3) {
  console.log('Provide the PATH of a file to upload or a TOKEN');
  process.exit(1);
} else {
  var params = process.argv[2].split('=');
  if(params[0] == 'PATH')
    sendImage(params[1]);
  else if (params[0] == 'TOKEN')
    getImage(params[1]);
  else {
    console.log('Wrong method provided: ' + params[0]);
  }
}
