window.onload = () => {
    setTimeout(() => {
        document.getElementById('fadein').remove()
    }, 1000)
}

const ctx = canvas.getContext('2d')

// Globals
let spinning = true
let showHelp = false

const FPS = 60
let spinAngle = 0
let moveZ = 1

canvas.width = 400
canvas.height = 400

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
    mousePosition.x = 2 * (event.pageX / window.innerWidth) - 1
    mousePosition.y = 2 * (event.pageY / window.innerHeight) - 1
}

// Event handlers
document.addEventListener('mousemove', updateDisplay)
document.addEventListener('mouseenter', updateDisplay)

document.addEventListener('keydown', (event) => {
    const key = event.key

    if (key === '?') showHelp = !showHelp
    if (key === 'r') spinning = !spinning
})

canvas.addEventListener('wheel', (event) => {
    moveZ += event.deltaY / 1000
})

function drawPoint(p) {
    const size = 20
    ctx.fillStyle = '#00AA00'
    ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size)
}

function projectToScreen({ x, y, z }) {
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

function drawline(p1, p2) {
    ctx.lineWidth = 5
    ctx.strokeStyle = '#00AA00'
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dt = 1 / FPS

    spinAngle += (Math.PI / 4) * dt * spinning

    // Note: mouse position is in range [-1,1]
    const angY = Math.PI * mousePosition.x
    const angX = Math.PI * mousePosition.y

    // for (const vertex of vertices) {
    //     const v = rotationX(angX, rotationY(angY, vertex))
    //     drawPoint(projectToScreen(translateZ(rotationY(spinAngle, v), moveZ)))
    // }

    faces.forEach((face) => {
        for (let i = 0; i < face.length; i++) {
            const a = vertices[face[i]]
            const b = vertices[face[(i + 1) % face.length]]

            const ar = rotationX(angX, rotationY(angY, a))
            const br = rotationX(angX, rotationY(angY, b))

            drawline(
                projectToScreen(translateZ(rotationY(spinAngle, ar), moveZ)),
                projectToScreen(translateZ(rotationY(spinAngle, br), moveZ))
            )
        }
    })
    setTimeout(frame, 1000 / FPS)
}

frame()
