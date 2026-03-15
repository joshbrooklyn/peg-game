var express = require('express'),
  app = express(),
  port = process.env.PORT || 3001,
  mongoose = require('mongoose'),
  GameResult = require('./api/models'), //created model loading here
  bodyParser = require('body-parser');

//MONGO CONFIG
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB
} = process.env;
  
// mongoose instance connection url connection
//mongoose.Promise = global.Promise;
const url = 'mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin';
const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500, 
  connectTimeoutMS: 10000,
};

mongoose.connect(url, options).then( function() {
	console.log('MongoDB is connected');
}).catch( function(err) {
	console.log(err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var routes = require('./api/routes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Cracker Barrel RESTful API server started on: ' + port);