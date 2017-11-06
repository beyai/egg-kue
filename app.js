'use strict';

module.exports = app => {
	if (app.config.kue.app) require("./lib/kue.js")(app);
};
