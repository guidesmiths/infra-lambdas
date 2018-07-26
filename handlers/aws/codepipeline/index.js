const controller = require('./controller');

module.exports.codepipeline = (event, context) => {
	const text = JSON.stringify(event);
	console.log(event);

	return controller.sendNotification({ text }).then(response => console.log(response));
};
