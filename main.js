/**
 * Entry point into the cloud provisioning application.
 * 
 * Creates a new restify server and starts a listener on each cpu (#cpus - 2)
 * port 3000.
 */

var bunyan = require('bunyan');
var restify = require('restify');
var cluster = require('cluster');

var rek = require('rekuire');
var mongodb = rek('lib/mongo');
var myserver = rek('lib/server');

var NAME = 'cloud-provisioning-prototype';

// send debug messages to stderr, everything else to stdout
var LOG = bunyan.createLogger({
	name : NAME,
	streams : [ {
		level : (process.env.LOG_LEVEL || 'info'),
		stream : process.stdout
	}, {
		// From: example todo project by mcavage:
		// This ensures that if we get a WARN or above all debug records
		// related to that request are spewed to stderr - makes it nice
		// filter out debug messages in prod, but still dump on user
		// errors so you can debug problems
		level : 'warn',
		type : 'raw',
		stream : new restify.bunyan.RequestCaptureStream({
			level : bunyan.DEBUG,
			maxRecords : 100,
			maxRequestIds : 1000,
			stream : process.stderr
		})
	} ],
	serializers : restify.bunyan.serializers
});

/*
 * Main method
 */
(function main() {
	var numCPUs = require('os').cpus().length;
	var numWorkers = numCPUs - 2;
	LOG.info("We have %s cpus", numCPUs);

	if (cluster.isMaster) {
		// Fork workers.
		for (var i = 0; i < numWorkers; i++) {
			cluster.fork();
		}

		cluster.on('exit', function(worker, code, signal) {
			LOG.info('worker ' + worker.process.pid + ' died');
			LOG.info('starting a new worker...');
			cluster.fork();
		});

		cluster.on('listening', function(worker, address) {
			LOG.info("A worker is now connected to " + address.address + ":" + address.port);
			
			// uncomment for demonstration purposes.
//			setTimeout(function() {
//				worker.disconnect();
//			}, 5000);

		});
	} else {
		var options = {};

		var server = myserver.createServer({
			log : LOG,
			name : "cloud-services-prototype",
			version : "0.0.0"
		});

		// At last, let's rock and roll
		server.listen((options.port || 3000), function onListening() {
			LOG.info('cluster on cpu %s listening at %s', cluster.worker.id,
					server.url);
		});
	}

})();