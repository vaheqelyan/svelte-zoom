<style>
  .c-svelteZoom {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-origin: 0 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    -webkit-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    will-change: transform;
    touch-action: none;
  }

  .c-svelteZoom--contain {
    object-fit: contain;
  }

  .c-svelteZoom--no-contain {
    object-fit: contain;
  }

  .c-svelteZoom--transition {
    transition: transform 0.2s;
  }
</style>

<img
  {alt}
  class="c-svelteZoom"
  class:c-svelteZoom--contain={contain}
  class:c-svelteZoom--no-contain={!contain}
  class:c-svelteZoom--transition={smooth}
  bind:this={img}
  on:mousedown={mousedown}
  on:touchstart={touchstart}
  on:load={onLoad}
  {...$$props} />

<script>
  export let alt
  import Matrix from "./matrix"
  import MultiTouchVelocity from "./velocity"

  import { calculateAspectRatioFit, getDistance } from "./other"

  import { onMount } from "svelte"

  let smooth = true
  let touchScreen = false

  let xY = {
    initX: 0,
    initY: 0,
    newX: 0,
    newY: 0,
  }

  let ratio, contain, img

  let matrix

  let velocity = new MultiTouchVelocity()

  let lastTap = {
    time: 0,
    x: 0,
  }

  let scale = {
    scaling: false,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0,
    lastHypo: 0,
    originX: 0,
    originY: 0,
    value: 1,
    max: 1,
  }

  const isTouch = isTouchDevice()

  function fireDown(x, y) {
    xY.initX = x
    xY.initY = y

    matrix.x = matrix.vtm.e
    matrix.y = matrix.vtm.f
  }

  function fireMove(x, y) {
    if (scale.scaling) return
    let in_x = (window.innerWidth - ratio.width * matrix.vtm.a) / 2
    let in_y = (window.innerHeight - ratio.height * matrix.vtm.a) / 2

    xY.newX = xY.initX - x
    xY.newY = xY.initY - y
    const mat = matrix.move(in_x >= 0 ? 0 : xY.newX, in_y >= 0 ? 0 : xY.newY, in_x, in_y, ratio)

    img.style.transform = `matrix(${mat.a},${mat.b},${mat.c},${mat.d},${mat.e}, ${mat.f})`
  }

  function fireUp() {
    matrix.x -= xY.newX
    matrix.y -= xY.newY

    scale.scaling = false
    scale.lastHypo = 0
    smooth = true
  }

  function fireScale(touchA, touchB) {
    const xTouch = [Math.min(touchA.pageX, touchB.pageX), Math.max(touchA.pageX, touchB.pageX)]

    const yTouch = [Math.min(touchA.pageY, touchB.pageY), Math.max(touchA.pageY, touchB.pageY)]

    const W = xTouch[1] - xTouch[0]
    const centerX = W / 2 + xTouch[0]

    const H = yTouch[1] - yTouch[0]
    const centerY = H / 2 + yTouch[0]

    scale.originX = centerX
    scale.originY = centerY
    scale.lastHypo = Math.trunc(getDistance(touchA, touchB))
    smooth = false
  }

  function fireTapScale(x, y) {
    let scaleVtm = matrix.vtm.a
    let scale_value = scaleVtm > 1 ? scaleVtm - 1 : scale.max / 2.5
    let scale_factor = scaleVtm > 1 ? -1 : 1

    const xFactor = 1 + scale_value * scale_factor
    const yFactor = (xFactor * window.innerHeight) / window.innerWidth

    let in_x = (window.innerWidth - ratio.width * Math.max(xFactor * scaleVtm, 1)) / 2
    let in_y = (window.innerHeight - ratio.height * Math.max(xFactor * scaleVtm, 1)) / 2

    const origin = {
      x: in_x > 0 ? window.innerWidth / 2 : x,
      y: in_y > 0 ? window.innerHeight / 2 : y,
    }

    const mat = matrix.scale(xFactor, yFactor, origin, in_x, in_y, ratio, scale.max, scale.value * xFactor, scale_factor)

    scale.value = mat.d
    img.style.transform = `translate(${mat.e}px, ${mat.f}px) scale(${mat.d})`
  }

  function fireScaleMove(touchA, touchB, e) {
    const hypo = getDistance(touchA, touchB)

    let f = hypo / scale.lastHypo

    f = f >= 1 ? 1 : -1

    const ff = velocity.getVelocity(touchA, touchB)

    const xFactor = 1 + 0.1 * ff * f

    const yFactor = (xFactor * window.innerHeight) / window.innerWidth

    let in_x = (window.innerWidth - ratio.width * matrix.vtm.a) / 2
    let in_y = (window.innerHeight - ratio.height * matrix.vtm.a) / 2

    const origin = {
      x: in_x > 0 ? window.innerWidth / 2 : scale.originX,
      y: in_y > 0 ? window.innerHeight / 2 : scale.originY,
    }

    const mat = matrix.scale(xFactor, yFactor, origin, in_x, in_y, ratio, scale.max, scale.value * xFactor, f)

    img.style.transform = `translate(${mat.e}px, ${mat.f}px) scale(${mat.d})`

    scale.value = mat.d

    scale.lastHypo = hypo
    scale.scaling = true
  }

  function fireManualZoom(dir) {
    const xFactor = 1 + 0.2 * dir
    const yFactor = (xFactor * window.innerHeight) / window.innerWidth

    let in_x = (window.innerWidth - ratio.width * matrix.vtm.a) / 2
    let in_y = (window.innerHeight - ratio.height * matrix.vtm.a) / 2

    const origin = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }

    const mat = matrix.scale(xFactor, yFactor, origin, in_x, in_y, ratio, scale.max, scale.value * xFactor, dir)
    img.style.transform = `translate(${mat.e}px,${mat.f}px) scale(${mat.d})`
    scale.value = mat.d
  }

  export const zoomIn = () => fireManualZoom(1)

  export const zoomOut = () => fireManualZoom(-1)

  function onResize() {
    onLoad()
    fireDown(0, 0)
    fireMove(0, 0)
    fireUp()
  }

  function onWheel(e) {
    e.preventDefault()
    const dir = e.deltaY < 0 ? 1 : -1

    const xFactor = 1 + 0.1 * dir
    const yFactor = (xFactor * window.innerHeight) / window.innerWidth

    let in_x = (window.innerWidth - ratio.width * matrix.vtm.a) / 2
    let in_y = (window.innerHeight - ratio.height * matrix.vtm.a) / 2

    const origin = {
      x: in_x > 0 ? window.innerWidth / 2 : e.pageX,
      y: in_y > 0 ? window.innerHeight / 2 : e.pageY,
    }

    const mat = matrix.scale(xFactor, yFactor, origin, in_x, in_y, ratio, scale.max, scale.value * xFactor, dir)
    img.style.transform = `translate(${mat.e}px,${mat.f}px) scale(${mat.d})`
    scale.value = mat.d
  }

  function onLoad() {
    const { naturalWidth, naturalHeight } = img

    if (naturalWidth > window.innerWidth || naturalHeight > window.innerHeight) {
      contain = true
    }

    scale.max = Math.max(naturalWidth / window.innerWidth, 1)
    ratio = calculateAspectRatioFit(naturalWidth, naturalHeight, window.innerWidth, window.innerHeight)
  }

  onMount(() => {
    matrix = new Matrix()
    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("resize", onResize)
  })

  function onTouchStart(e) {
    touchScreen = true
    const isMultiTouch = e.touches.length === 2
    const [touchA, touchB] = e.touches

    scale.scaling = isMultiTouch

    smooth = false
    if (isMultiTouch) {
      fireScale(touchA, touchB)

      velocity.down(touchA, touchB)
    } else {
      var now = new Date().getTime()
      if (now - lastTap.time < 250 && Math.abs(lastTap.x - touchA.pageX) <= 20) {
        smooth = true
        fireTapScale(touchA.pageX, touchA.pageY)
      }

      lastTap.time = new Date().getTime()
      lastTap.x = touchA.pageX

      fireDown(touchA.pageX, touchA.pageY)
    }

    window.removeEventListener("touchmove", onTouchMove)
    window.removeEventListener("touchend", onTouchEnd)
    window.addEventListener("touchmove", onTouchMove)
    window.addEventListener("touchend", onTouchEnd)
  }

  function onTouchMove(e) {
    if (scale.scaling) {
      const [touchA, touchB] = e.touches
      fireScaleMove(touchA, touchB)
    } else {
      fireMove(e.touches[0].pageX, e.touches[0].pageY)
    }
  }

  function onTouchEnd(e) {
    fireUp()
    window.removeEventListener("touchmove", onTouchMove)
    window.removeEventListener("touchend", onTouchEnd)
    window.removeEventListener("touchcancel", onTouchEnd)
  }

  function onMouseDown({ clientX, clientY }) {
    if (touchScreen) return
    fireDown(clientX, clientY)

    smooth = false

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  function onMouseMove({ clientX, clientY }) {
    fireMove(clientX, clientY)
  }

  function onMouseUp() {
    window.removeEventListener("mousemove", onMouseMove)
    fireUp()
  }

  const mousedown = onMouseDown
  const touchstart = onTouchStart
</script>
