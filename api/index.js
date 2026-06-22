if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const path = require('path')
const express = require('express')
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args))

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '..')))

const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

app.post('/api/send', async (req, res) => {
	try {
		const { name, phone, service, message } = req.body

		if (!name || !phone) {
			return res.status(400).json({ ok: false })
		}

		const text = `
📩 Новая заявка

👤 Имя: ${name}
📞 Телефон: ${phone}
🛠 Услуга: ${service || 'не указана'}
💬 Сообщение: ${message || 'нет'}
`

		const tg = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				chat_id: CHAT_ID,
				text,
			}),
		})

		const data = await tg.json()
		console.log('TG:', data)

		if (!data.ok) throw new Error('Telegram error')

		res.json({ ok: true })
	} catch (e) {
		console.error('ERROR:', e)
		res.status(500).json({ ok: false })
	}
})

module.exports = app

if (require.main === module) {
	app.listen(3000, () => {
		console.log('🚀 http://localhost:3000')
	})
}
