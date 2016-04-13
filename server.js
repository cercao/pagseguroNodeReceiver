// Server APIs
var express = require('express');
var app = express();
var port = process.env.PORT || 80;

// POST APIs
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()); // support json encoded bodies

// mongo APIs
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/pagseguro';

var insertPost = function(db, post, callback) {
  db.collection('posts').insertOne( post, function(err, result) {
    assert.equal(err, null);
    console.log("Inseriu um post: " + JSON.stringify(post, null, 2));
    callback();
  });
};

var insertGet = function(db, id, callback) {
  db.collection('gets').insertOne( {"transacao" : id}, function(err, result) {
    assert.equal(err, null);
    console.log("Inseriu um get, id: " + id);
    callback();
  });
};

// routes will go here
app.get('/pagseguro', function(req, res) {
  var transaction_id = req.param('transaction_id'); 

	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insertGet(db, transaction_id, function() {
           db.close();
		   res.send(transaction_id);		   
        });
	});
});

app.post('/pagseguro', function(req, res) {
	
	res.setHeader('Content-Type', 'text/plain')
    res.write('you posted:\n')
  
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		insertPost(db, req.body, function() {
           db.close();
		   res.end()
        });
	});
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);