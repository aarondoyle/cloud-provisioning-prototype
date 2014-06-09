/**
 * Controller for CRUD templates.
 */
var rek = require('rekuire');

var Template = rek('lib/model/mongoose/template');

// Custom Errors



// Handlers
function insertTemplate(req, res, next) {
	Template.insertTemplate(req.body, function(err, savedTemplate) {
		if (err) {
			res.send(500, {error: err});
		} else if (savedTemplate) {
			res.send(201, savedTemplate);
		} else {
			res.send(200, "Nothing happened...");
		}
		next();
	});
}

function deleteTemplate(req, res, next) {
	Template.deleteTemplate(req.params.id, function(err, deletedTemplate) {
		if (err) {
			res.send(500, {error: err});
		} else if (deletedTemplate) {
			res.send(200, deletedTemplate);
		} else {
			res.send(200, "Nothing happened...");
		}
		next();
	});
}

function updateTemplate(req, res, next) {
	Template.updateTemplate(req.params.id, req.body, function(err, updatedTemplate) {
		if (err) {
			res.send(500, {error: err});
		} else if (updatedTemplate) {
			res.send(200, updatedTemplate);
		} else {
			res.send(200, "Nothing happened...");
		}
		next();
	});
}

function findTemplates(req, res, next) {
	Template.findTemplates(req.body, function(err, templates) {
		if (err) {
			res.send(500, {error: err});
		} else if (templates) {
			res.send(200, templates);
		} else {
			res.send(200, "Nothing happened...");
		}
		next();
	});
}

function getTemplate(req, res, next) {
	Template.findById(req.params.id, function(err, template) {
		if (err) {
			res.send(500, {error: err});
		} else if (template) {
			res.send(200, template);
		} else {
			res.send(200, "Didn't find anything.");
		}
		next();
	});
}


// Setup Routes -> Handlers
function init(server) {
	server.post({
		path: '/templates/find',
		contentType: 'application/json'
	}, findTemplates);
	
	server.get('/templates/:id', getTemplate);
	
	server.post({
		path: '/templates',
		contentType: 'application/json'
	}, insertTemplate);
	
	server.put({
		path: '/templates/:id',
		contentType: 'application/json'
	}, updateTemplate);
	
	server.del('/templates/:id', deleteTemplate);
}

// Export init method
module.exports = {
	init: init
};