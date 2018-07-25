const slack = require('../libs/slack/index');

module.exports.sendNotification = attachments => slack.postMessage(attachments, slack.router(''));
