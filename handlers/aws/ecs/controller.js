const slack = require('../../libs/slack/index');

module.exports.sendNotification = (attachments, changeArn, status) =>
	slack.sendNotification(attachments, changeArn, status);
