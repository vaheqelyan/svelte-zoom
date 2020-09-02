function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)

  return { width: srcWidth * ratio, height: srcHeight * ratio, ratio }
}

function getDistance(touchA, touchB) {
  return Math.hypot(touchA.pageX - touchB.pageX, touchA.pageY - touchB.pageY)
}

function isTouchDevice() {
  try {
    document.createEvent("TouchEvent")
    return true
  } catch (e) {
    return false
  }
}

export { calculateAspectRatioFit, getDistance, isTouchDevice }
