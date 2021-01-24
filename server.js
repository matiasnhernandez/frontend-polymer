// Node.js notation for importing packages
var express = require('express');

// Spin up a server
var app = express();

// Serve static files from the main build directory
app.use(express.static(__dirname + '/build/es5-bundled'));

// serve your elements
app.use('/src', express.static('src'));
// serve bower_components
app.use('/bower_components', express.static('bower_components'));

app.use('/images', express.static('images'));
app.use('/data', express.static('data'));
app.use('/node_modules', express.static('node_modules'));

// Render index.html on the main page, specify the root
app.get('/', function(req, res){
  res.sendFile("index.html", {root: '.'});
});

var port = process.env.PORT || 3000;
// Tell the app to listen for requests on port 3000
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});