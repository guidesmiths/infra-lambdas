const controller = require('./controller');

module.exports.ecs = (event, context) => {
	const flags = {
		PENDING: 'warning',
		RUNNING: 'good',
		STOPPED: 'danger',
	};

	const fallback = `Task ${event.detail.taskDefinitionArn} Changed to ${event.detail.lastStatus}`;
	const color = flags[event.detail.lastStatus];
	const pretext = 'ECS Task State Change';
	const account = `Account: ${event.account}`;
	const title = 'ECS Task State Change';
	const text = `Task ${event.detail.taskDefinitionArn} has changed to ${event.detail.lastStatus}`;
	const fields = [
		['CURRENT STATUS', event.detail.lastStatus, true],
		['DESIRED STATUS', event.detail.desiredStatus, true],
	];
	const footer = `${event.source} - id: ${event.id} - arn: ${event.detail.taskArn} - version: ${event.detail.version}`;

	return controller
		.sendNotification(
			{ fallback, color, pretext, account, title, text, fields, footer },
			event.detail.taskArn,
			event.detail.lastStatus,
		)
		.then(response => console.log(response));
};
