const ninchatBot = require('ninchat-nodejs/ninchat/bot')

const debugMessages = true
const verboseLogging = true
const identity = JSON.parse(process.env.BOT_IDENTITY_JSON)
const transferQueueId = process.env.BOT_TRANSFER_QUEUE_ID

const bot = new ninchatBot.Bot({identity, debugMessages, verboseLogging})

bot.on('queue:closed', (queueId, closed) => {
	if (queueId === transferQueueId) {
		if (closed) {
			console.log('hello-bot: transfer queue is closed')
		} else {
			console.log('hello-bot: transfer queue is open')
		}
	}
})

bot.on('begin', id => {
	console.log('hello-bot: new customer on channel', id)

	bot.sendMessage(id, {text: 'Hello!'})
})

bot.on('resume', id => {
	console.log('hello-bot: existing customer on channel', id)
})

bot.on('messages', (id, messages) => {
	if (messages.length > 1) {
		console.log('hello-bot: received', messages.length, 'messages at once')
	}

	messages.forEach(content => {
		console.log('hello-bot: received message on channel', id)

		const text = content.text

		setTimeout(() => {
			bot.sendMessage(id, {text: 'You said: ' + text})
		})
	})
})

bot.on('end', id => {
	console.log('hello-bot: channel', id, 'is gone')
})
