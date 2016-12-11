var admin = require("firebase-admin");
var express = require('express')
  , bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'elasticsearch:9200',
  log: 'trace'
});


client.ping({
  // ping usually has a 3000ms timeout 
  requestTimeout: Infinity,
 
  // undocumented params are appended to the query string 
  //hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});



 
var app = express()

app.use(bodyParser.json());
var serviceAccount = require("./firebase.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL
});

// Fetch the service account key JSON file contents



var db = admin.database();


app.post('/api/:endpoint', function(request, response){
	var endpoint = request.params.endpoint; 
	var ref = db.ref(endpoint);
	//var payload = {};
	//payload[endpoint] = request.body;
    console.log(request.body);      // your JSON
    response.send(request.body);    // echo the result back
    ref.update(request.body);
});

 
app.get('/api/user/:user_name', function(req, res) {
	var username = req.params.user_name; 


		client.search({
	  index: 'firebase',
	  type: 'user',
	  body: {
	    query: {
	      match: {
	        name: username
	      }
	    }
	  }
	}).then(function (resp) {
	    var hits = resp.hits;
	    res.json(hits);
	}, function (err) {
	    console.trace(err.message);
	});

  
})

app.listen(8080)