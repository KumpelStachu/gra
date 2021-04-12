const heightInput = document.querySelector('input#height')
const widthInput = document.querySelector('input#width')
const container = document.querySelector('.container')
const controls = document.querySelector('.controls')
const resetBtn = document.querySelector('.reset')
const root = document.documentElement

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const randomRGB = () => [0, 0, 0].map(() => Math.floor(Math.random() * 256))
const rgb = (rgb, a = 1) => `rgb(${rgb.join(',')},${a})`

let width, height

document.querySelector('button.start').onclick = async () => {
	height = heightInput.value
	width = widthInput.value

	root.style.setProperty('--height', height)
	root.style.setProperty('--width', width)

	container.classList.remove('hidden')
	controls.classList.add('hidden')

	for (let i = 0; i < height * width; i++) {
		const child = document.createElement('div')

		child.classList.add('hidden', 'glow')
		container.append(child)

		await delay(Math.max(50, 250 / (width + height)))

		child.classList.remove('hidden')

		const colors = randomRGB()
		child.style.color = rgb(colors, 0.5)
		child.style.backgroundColor = rgb(colors)
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

	controls.classList.remove('hidden')
}
