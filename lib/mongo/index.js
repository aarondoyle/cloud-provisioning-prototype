/**
 * The mongo module manages all connectivity to mongo using mongoose. Handlers
 * error, pooling, and reconnects.
 * 
 */
var rek = require('rekuire');
var env = process.env.NODE_ENV || 'development';
var config = rek('config.' + env);

var mongoose = require('mongoose');

var options = {
	db : {
		native_parser : true
	},
	server : {
		poolSize : 6
	}
};
//var uri = process.ENV.MONGODB_URI;
//var uri = "mongodb://10.0.0.3:27017/templates'";
var uri = "mongodb://" + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db;

mongoose.connect(uri, options);

mongoose.connection.on('error', function(err) {
	console.log('Error while connecting to mongo: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected, attempting to reconnect.');
	mongoose.connect(uri, options);
});

process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongoose connection being terminated due to app termination.');
	});
});