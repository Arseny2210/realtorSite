// reveal animation
const revealEls = document.querySelectorAll('.reveal')

const reveal = () => {
	revealEls.forEach(el => {
		const rect = el.getBoundingClientRect()
		if (rect.top < window.innerHeight - 100) {
			el.classList.add('show')
		}
	})
}

window.addEventListener('scroll', reveal)
window.addEventListener('load', reveal)

// counters
const counters = document.querySelectorAll('.case')
let started = false

window.addEventListener('scroll', () => {
	if (!started && counters.length) {
		const rect = counters[0].getBoundingClientRect()
		if (rect.top < window.innerHeight) {
			started = true

			counters.forEach(el => {
				const target = +el.dataset.target
				let count = 0
				const step = target / 50

				const update = () => {
					count += step
					if (count < target) {
						el.innerText = Math.floor(count)
						requestAnimationFrame(update)
					} else {
						el.innerText = target
					}
				}

				update()
			})
		}
	}
})

// form
const form = document.getElementById('formEl')
const nameEl = document.getElementById('name')
const phoneEl = document.getElementById('phone')
const serviceEl = document.getElementById('service')
const messageEl = document.getElementById('message')
const statusEl = document.getElementById('status')
const submitBtn = document.getElementById('submitBtn')

form.addEventListener('submit', async e => {
	e.preventDefault()

	const name = nameEl.value.trim()
	const phone = phoneEl.value.trim()
	const service = serviceEl.value
	const message = messageEl.value.trim()

	if (!name || !phone) {
		statusEl.textContent = 'Заполните имя и телефон'
		return
	}

	if (phone.length < 6) {
		statusEl.textContent = 'Введите корректный телефон'
		return
	}

	try {
		submitBtn.disabled = true
		submitBtn.textContent = 'Отправка...'
		statusEl.textContent = 'Отправляем...'

		const res = await fetch('/api/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				phone,
				service,
				message,
			}),
		})

		const data = await res.json()

		if (!data.ok) throw new Error()

		statusEl.textContent = 'Заявка отправлена ✅'
		form.reset()
	} catch (e) {
		console.error(e)
		statusEl.textContent = 'Ошибка отправки ❌'
	} finally {
		submitBtn.disabled = false
		submitBtn.textContent = 'Отправить заявку'
	}
})
