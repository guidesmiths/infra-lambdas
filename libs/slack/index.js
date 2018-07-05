const request = require('request-promise-native');

const SLACK_POST_MESSAGE_URL = 'https://slack.com/api/chat.postMessage';
const SLACK_UPDATE_MESSAGE_URL = 'https://slack.com/api/chat.update';
const SLACK_GET_HISTORY_URL = 'https://slack.com/api/conversations.history';
const CHANNEL = process.env.CHANNEL;
const SLACK_TOKEN = process.env.SLACK_TOKEN;

module.exports.sendNotification = (attachments, changeArn, status) =>
	getHistory().then(messages => {
		messages = messages.filter(
			message => message.attachments && message.attachments[0].footer.indexOf(changeArn) != -1,
		);
		return messages.length > 0 ? updateMessage(attachments, status, messages) : postMessage(createMessage(attachments));
	});

const postMessage = attachments =>
	request.post(SLACK_POST_MESSAGE_URL, {
		form: { token: SLACK_TOKEN, channel: CHANNEL, attachments: JSON.stringify(attachments) },
	});

const updateMessage = (attachments, status, messages) => {
	attachments.fields.push(createFlowField(messages, status));
	attachments = createMessage(attachments);
	return request.post(SLACK_UPDATE_MESSAGE_URL, {
		form: { token: SLACK_TOKEN, channel: CHANNEL, attachments: JSON.stringify(attachments), ts: messages[0].ts },
	});
};

const createMessage = ({ fallback, color, pretext, account, title, text, fields, footer }) => [
	{
		fallback,
		color,
		pretext,
		author_name: account,
		title,
		text,
		fields: fields.map(createField),
		footer,
	},
];

const createFlowField = (messages, status) => {
	const flow =
		messages[0].attachments[0].fields.filter(field => field.title === 'STATUS FLOW').map(field => field.value)[0] ||
		messages[0].attachments[0].fields.filter(field => field.title === 'CURRENT STATUS').map(field => field.value)[0];

	return ['STATUS FLOW', `${flow} > ${status}`, false];
};

const getHistory = () =>
	request
		.post(SLACK_GET_HISTORY_URL, { form: { token: SLACK_TOKEN, channel: CHANNEL } })
		.then(response => JSON.parse(response).messages);

const createField = ([title, value, short]) => ({
	title,
	value,
	short,
});
