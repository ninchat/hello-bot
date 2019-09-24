const ninchatBot = require('ninchat-nodejs/ninchat/bot')

const identity = JSON.parse(process.env.BOT_IDENTITY_JSON)
const transferQueueId = process.env.BOT_TRANSFER_QUEUE_ID
const messageTypes = ['ninchat.com/text', 'ninchat.com/metadata']
const verboseLogging = true

const bot = new ninchatBot.Bot({identity, messageTypes, verboseLogging})

bot.on('queue:closed', (queueId, closed) => {
	if (queueId === transferQueueId) {
		if (closed) {
			console.log('hello-bot: transfer queue is closed')
		} else {
			console.log('hello-bot: transfer queue is open')
		}
	}
})

bot.on('begin', (id, queueId, info) => {
	console.log('hello-bot: new customer on channel', id)

	if ('audienceMetadata' in info) {
		let secure = info.audienceMetadata.secure
		if (secure !== undefined) {
			console.log('hello-bot: secure metadata:', secure)
		}
	}

	bot.sendMessage(id, {text: 'Hello!'})
})

bot.on('resume', id => {
	console.log('hello-bot: existing customer on channel', id)
})

bot.on('messages', (id, textMessages) => {
	textMessages.forEach(content => {
		console.log('hello-bot: received message on channel', id)

		const text = content.text

		setTimeout(() => {
			bot.sendMessage(id, {text: 'You said: ' + text})

			if (text.indexOf('transfer') >= 0) {
				bot.transferAudience(id, transferQueueId)
			}
		}, 250)
	})
})

bot.on('receive', (id, messages) => {
	messages.forEach(message => {
		switch (message.messageType) {
		case 'ninchat.com/text':
			// Already handled via the 'messages' event.
			break

		case 'ninchat.com/metadata':
			console.log('hello-bot: received metadata on channel', id, message.content)
			break
		}
	})
})

bot.on('end', id => {
	console.log('hello-bot: channel', id, 'is gone')
})

bot.on('error', event => {
	console.log('hello-bot: fatal error:', event)
	process.exit(1) // Expect Docker or other service supervisor to restart the bot.
})

bot.on('closed', () => {
	console.log('hello-bot: session closed')
	process.exit(0)
})
