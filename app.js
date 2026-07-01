const canvas = document.getElementById('canvas')
const textAreaContent = `\
    const vertices = [
        { x: 0.25, y: 0.25, z: -0.25 },
        { x: 0.25, y: -0.25, z: -0.25 },
        { x: -0.25, y: -0.25, z: -0.25 },
        { x: -0.25, y: 0.25, z: -0.25 },
        { x: 0.25, y: 0.25, z: 0.25 },
        { x: 0.25, y: -0.25, z: 0.25 },
        { x: -0.25, y: -0.25, z: 0.25 },
        { x: -0.25, y: 0.25, z: 0.25 },
    ]

    const faces = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
    ]
`

const main = document.querySelector('main')

const keybinds = [
    { key: '?', desc: 'Press ? to toggle help' },
    { key: 'r', desc: 'Press r to toggle spinning' },
    { key: 'c', desc: 'Press c to rotate colors' },
    { key: 'm', desc: 'Press m to toggle mouse control' },
    // { key: 'p', desc: 'Press p to play a game' },
]

const colors = ['#00AA00', '#AA0000', '#0000AA']

const ctx = canvas.getContext('2d')

// Globals
let spinning = true
let showHelp = false
let mouseUpdate = false

const FPS = 240
let spinAngle = 0
let moveZ = 1

let colorIndex = 0

canvas.width = 600
canvas.height = 600

const vertices = [
    { x: 0.25, y: 0.25, z: -0.25 },
    { x: 0.25, y: -0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x: -0.25, y: 0.25, z: -0.25 },

    { x: 0.25, y: 0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: 0.25 },
    { x: -0.25, y: -0.25, z: 0.25 },
    { x: -0.25, y: 0.25, z: 0.25 },
]

const faces = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

const mousePosition = {
    x: 0,
    y: 0,
}

function updateDisplay(event) {
    if (mouseUpdate) {
        mousePosition.x = 2 * (event.pageX / window.innerWidth) - 1
        mousePosition.y = 2 * (event.pageY / window.innerHeight) - 1
    }
}

// Event handlers
document.addEventListener('mousemove', updateDisplay)
document.addEventListener('mouseenter', updateDisplay)

document.addEventListener('keydown', (event) => {
    const key = event.key

    if (key === '?') showHelp = !showHelp
    if (key === 'r') spinning = !spinning
    if (key === 'm') mouseUpdate = !mouseUpdate
    if (key === 'c') colorIndex = (colorIndex + 1) % 3
    // if (key === '`') handleTextAreaDisplay()
})

canvas.addEventListener('wheel', (event) => {
    event.preventDefault()
    moveZ += event.deltaY / 1000
})

function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let dt = 1 / FPS

    spinAngle += (Math.PI / 4) * dt * spinning

    // Note: mouse position is in range [-1,1]
    const angY = Math.PI * mousePosition.x
    const angX = Math.PI * mousePosition.y

    for (const vertex of vertices) {
        const v = rotationX(angX, rotationY(angY, vertex))
        drawPoint(ToScreen(translateZ(rotationY(spinAngle, v), moveZ)))
    }

    faces.forEach((face) => {
        for (let i = 0; i < face.length; i++) {
            const a = vertices[face[i]]
            const b = vertices[face[(i + 1) % face.length]]

            const ar = rotationX(angX, rotationY(angY, a))
            const br = rotationX(angX, rotationY(angY, b))

            drawline(
                ToScreen(translateZ(rotationY(spinAngle, ar), moveZ)),
                ToScreen(translateZ(rotationY(spinAngle, br), moveZ))
            )
        }
    })

    if (showHelp) {
        drawHelp()
    } else {
        ctx.fillStyle = '#ffffff'
        ctx.font = '24px monospace'
        ctx.fillText('Press ? for help', 10, 24)
    }

    setTimeout(frame, 1000 / FPS)
}

frame()

function drawPoint(p) {
    const size = 20
    ctx.fillStyle = colors[colorIndex]
    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
}

function drawline(p1, p2) {
    ctx.lineWidth = 5
    ctx.strokeStyle = colors[colorIndex]
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

function drawHelp() {
    ctx.fillStyle = '#ffff00'
    ctx.font = '24px monospace'

    keybinds.forEach((keybind, index) => {
        ctx.fillText(keybind.desc, 10, (index + 1) * 24)
    })
}

function ToScreen({ x, y, z }) {
    return {
        x: ((x / z + 1) / 2) * canvas.width,
        y: ((y / z + 1) / 2) * canvas.height,
    }
}

function rotationX(angle, { x, y, z }) {
    return {
        x: x,
        y: z * Math.cos(angle) - y * Math.sin(angle),
        z: z * Math.sin(angle) + y * Math.cos(angle),
    }
}

function rotationY(angle, { x, y, z }) {
    return {
        x: x * Math.cos(angle) - z * Math.sin(angle),
        y: y,
        z: x * Math.sin(angle) + z * Math.cos(angle),
    }
}

function translateZ({ x, y, z }, dz) {
    return {
        x: x,
        y: y,
        z: z + dz,
    }
}
