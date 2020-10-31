export default class MultiTouchVelocity {
  constructor() {
    this.touchA = {
      clientX: 0,
      clientY: 0,
      t: 0,
      velocity: 1,
    }
    this.touchB = {
      clientX: 0,
      clientY: 0,
      t: 0,
      velocity: 1,
    }
  }
  down(touchA, touchB) {
    this.touchA = { clientX: touchA.clientX, clientY: touchA.clientY, t: Date.now(), velocity: 0 }
    this.touchB = { clientX: touchB.clientX, clientY: touchB.clientY, t: Date.now(), veloctiy: 0 }
  }
  calc(touch, ins) {
    var new_x = touch.clientX,
      new_y = touch.clientY,
      new_t = Date.now()

    var x_dist = new_x - ins.clientX,
      y_dist = new_y - ins.clientY,
      interval = new_t - ins.t
    var velocity = Math.sqrt(x_dist * x_dist + y_dist * y_dist) / interval
    ins.velocity = velocity
    // update values:
    ins.clientX = new_x
    ins.clientY = new_y
    ins.t = new_t
  }
  getVelocity(touchA, touchB) {
    this.calc(touchA, this.touchA)
    this.calc(touchB, this.touchB)
    return this.touchA.velocity + this.touchB.velocity
  }
}
