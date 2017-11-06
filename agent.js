'use strict';

module.exports = agent => {
	if (agent.config.kue.agent) require("./lib/kue.js")(agent);
};
