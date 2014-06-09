/**
 * Index for provisioning all controllers.
 */

var templatesController = require('./templates.controller');

function initAll(server) {
	templatesController.init(server);
}

module.exports = {
	init: initAll
};