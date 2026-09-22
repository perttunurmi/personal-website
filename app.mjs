import { startDisplay } from './modules/display.mjs'

const main = function () {
    const canvas = document.getElementById('canvas')
    startDisplay(canvas)
}

try {
    main()
} catch (e) {
    console.log(e)
}
