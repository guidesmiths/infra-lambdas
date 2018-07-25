const controller = require('./controller');

module.exports.codepipeline = (event, context) => {
	const text = event;

	return controller.sendNotification({ text }).then(response => console.log(response));
};
