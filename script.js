const heightInput = document.querySelector('input#height')
const widthInput = document.querySelector('input#width')
const container = document.querySelector('.container')
const controls = document.querySelector('.controls')
const dropdown = document.querySelector('.dropdown')
const resetBtn = document.querySelector('.reset')
const root = document.documentElement

let width, height, colors, board

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const randomRGB = () => [...Array(3)].map(() => Math.floor(Math.random() * 256))
const randomColors = () => [...Array(Math.min(width, height))].map(() => randomRGB())
const randomColor = () => colors[Math.floor(Math.random() * colors.length)]
const rgb = (rgb, a = 1) => `rgb(${rgb.join(',')},${a})`

document.querySelector('button.start').onclick = async () => {
	height = heightInput.value
	width = widthInput.value
	colors = randomColors()

	colors.forEach(color => {
		const element = document.createElement('div')
		element.style.backgroundColor = rgb(color)
		element.style.color = rgb(color, 0.5)
		element.dataset.color = color
		element.classList.add('glow')
		dropdown.append(element)
	})

	root.style.setProperty('--height', height)
	root.style.setProperty('--width', width)

	container.classList.remove('hidden')
	controls.classList.add('hidden')

	for (let i = 0; i < height * width; i++) {
		const child = document.createElement('div')

		child.onclick = handleClick
		child.classList.add('hidden', 'glow')
		container.append(child)

		const color = randomColor()
		child.style.color = rgb(color, 0.5)
		child.style.backgroundColor = rgb(color)
		child.dataset.color = color
		child.dataset.x = child.x = i % height
		child.dataset.y = child.y = (i - child.x) / width

		await delay(Math.max(50, 250 / (width + height)))
		child.classList.remove('hidden')
	}

	resetBtn.classList.remove('hidden')
}

resetBtn.onclick = async () => {
	resetBtn.classList.add('hidden')

	for (let i = container.children.length; i > 0; i--) {
		container.children[i - 1].classList.add('hidden')

		await delay(Math.max(50, 250 / (width + height)))

		if (i < 5) {
			container.classList.add('hidden')
		}
	}

	await delay(250)
	container.innerHTML = ''
	dropdown.innerHTML = 'Kolory'

	controls.classList.remove('hidden')
}

dropdown.onmouseover = ({ target }) => {
	if (target.classList.contains('white')) return

	container.querySelectorAll('.dark').forEach(e => e.classList.remove('dark'))
	container.querySelectorAll(`div:not([data-color="${target.dataset.color}"])`).forEach(e => e.classList.add('dark'))

	if (target.classList.contains('dropdown')) {
		container.querySelectorAll('.dark').forEach(e => e.classList.remove('dark'))
	}
}

function handleClick({ target }) {
	if (target.classList.contains('white')) return

	const active = container.querySelector('.active')
	if (!active) return target.classList.add('active')

	if (active !== target && (((target.x === active.x - 1 || target.x === active.x + 1) && target.y === active.y) !== ((target.y === active.y - 1 || target.y === active.y + 1) && target.x === active.x)) && target.dataset.color === active.dataset.color) {
		active.classList.add('remove')
		target.classList.add('remove')
		update()
	}

	return active.classList.remove('active')
}

function update() {
	const [p1, p2] = container.querySelectorAll('.remove')

	//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
	if (p1.x === p2.x) {
		for (let i = Math.max(p1.y, p2.y); i > 1; i--) {
			const t = container.querySelector(`div[data-y="${i - 2}"][data-x="${p1.x}"]`)
			const b = container.querySelector(`div[data-y="${i}"][data-x="${p1.x}"]`)

			b.dataset.color = t.dataset.color
			if (t.classList.contains('white')) {
				b.classList.add('white')
			} else {
				b.style.backgroundColor = t.style.backgroundColor
				b.style.color = t.style.color
			}
		}
	} else {
		//eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
		for (let i = p1.y; i > 0; i--) {
			const t = container.querySelector(`div[data-y="${i - 1}"][data-x="${p1.x}"]`)
			const b = container.querySelector(`div[data-y="${i}"][data-x="${p1.x}"]`)

			b.dataset.color = t.dataset.color
			if (t.classList.contains('white')) {
				b.classList.add('white')
			} else {
				b.style.backgroundColor = t.style.backgroundColor
				b.style.color = t.style.color
			}
		}
		//yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
		for (let i = p2.y; i > 0; i--) {
			const t = container.querySelector(`div[data-y="${i - 1}"][data-x="${p2.x}"]`)
			const b = container.querySelector(`div[data-y="${i}"][data-x="${p2.x}"]`)

			b.dataset.color = t.dataset.color
			if (t.classList.contains('white')) {
				b.classList.add('white')
			} else {
				b.style.backgroundColor = t.style.backgroundColor
				b.style.color = t.style.color
			}
		}
	}

	container.querySelectorAll(`div[data-y="0"][data-x="${p1.x}"],div[data-y="${1 * (p1.x === p2.x)}"][data-x="${p2.x}"]`).forEach(e => {
		e.classList.add('white')
		e.dataset.color = ''
	})

	p1.classList.remove('remove')
	p2.classList.remove('remove')
}
