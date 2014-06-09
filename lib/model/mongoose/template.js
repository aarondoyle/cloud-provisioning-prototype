/**
 * Mongoose schema for our template model.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var templateSchema = new Schema({
	name: {type: String, required: 'Template name is required.' },
	version: {type: String, required: 'Template version is required.' },
	description: String,
	cfTemplate: {type: {}, required: 'Template cfTemplate is required.' },
	application: String
});

// Unique index on name and version
templateSchema.index({name: 1, version: 1}, {unique: true});

var Template = module.exports = mongoose.model('Template', templateSchema);

// Custom methods to hide the mongoose stuff from rest of app
module.exports.insertTemplate = function(reqBody, callback) {
	var template = new Template(reqBody);
	template.save(callback);
};

module.exports.updateTemplate = function(id, reqBody, callback) {
	var template = new Template(reqBody);
	Template.findOne({_id: id}, function(err, foundTemplate) {
		if (err) {
			callback(err, null);
		} else if (foundTemplate) {
			foundTemplate.description = template.description;
			foundTemplate.cfTemplate = template.cfTemplate;
			foundTemplate.application = template.application;
			foundTemplate.save(function(err, savedTemplate) {
				if (err) {
					callback(err, null);
				} else {
					callback(null, savedTemplate);
				}
			});
		} else {
			callback(null, null);
		}
	});
};

module.exports.deleteTemplate = function(id, callback) {
	Template.findOne({_id: id}, function(err, foundTemplate) {
		if (err) {
			callback(err, null);
		} else if (foundTemplate) {
			foundTemplate.remove(callback, foundTemplate);
		} else {
			callback(null, null);
		}
	});
};

function _find(conditions, callback) {
	Template.find(conditions, function(err, templates) {
		if (err) {
			callback(err, null);
		} else if (templates) {
			callback(null, templates);
		} else {
			callback(null, null);
		}
	});
}

module.exports.findTemplates = function(reqBody, callback) {
	var conditions;
	if (reqBody.name) {
		conditions = {name: reqBody.name};
		_find(conditions, callback);
	} else if (reqBody.application) {
		conditions = {application: reqBody.application};
		_find(conditions, callback);
	} else {
		callback(new Error("Can only find templates by name or application."), null);
	}
};