const unleashLogger = require('unleash-server/lib/logger');
const request = require('request');
const consoleLoggerProvider = name => ({
	debug: console.log,
	info: console.log,
	warn: console.log,
	error: console.error,
});
unleashLogger.setLoggerProvider(consoleLoggerProvider);
const unleash = require('unleash-server');

let toggleServer;

const getToggleServer = () => {
	if (toggleServer) return Promise.resolve(toggleServer);
	return unleash
		.start({
			databaseUrl: 'postgres://node:node@localhost:5432/unleash',
			enableLegacyRoutes: false,
			port: 3000,
			adminAuthentication: 'none',
			preHook: app => {
				app.use((req, res, next) => {
					console.log('making request...');
					next();
				});
			},
		})
		.then(unleashServer => {
			toggleServer = unleashServer;
			console.log(`Unleash started on http://localhost:${unleashServer.app.get('port')}`);
			return Promise.resolve();
		});
};

module.exports.server = (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const response = {
		statusCode: 200,
		body: JSON.stringify({ enabled: true }),
	};
	return getToggleServer().then(() => response);
};

module.exports.app = (event, context) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const response = {
		statusCode: 200,
		body: JSON.stringify({ enabled: true }),
	};
	return getToggleServer().then(() => response);
};
