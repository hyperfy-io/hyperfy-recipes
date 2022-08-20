export class Tween {
  static LINEAR = linear
  static QUAD_IN_OUT = quadraticInOut
  static QUAD_OUT = quadraticOut

  constructor(start) {
    this.start = start
    this.value = {}
    this.steps = []
    this.keys = []
    this.loopEnabled = false
    this.duration = 0
  }

  to(value, duration, easing) {
    const prevStep = this.steps[this.steps.length - 1]
    const startsAt = prevStep?.endsAt || 0
    const endsAt = startsAt + duration
    const from = prevStep?.to || this.start
    const step = {
      from,
      to: value,
      startsAt,
      endsAt,
      duration,
      easing,
    }
    this.steps.push(step)
    this.duration += duration
    return this
  }

  wait(duration) {
    const prevStep = this.steps[this.steps.length - 1]
    const startsAt = prevStep?.endsAt || 0
    const endsAt = startsAt + duration
    const value = prevStep?.to || this.start
    const step = {
      from: value,
      to: value,
      startsAt,
      endsAt,
      duration,
      easing: noEasing,
    }
    this.steps.push(step)
    this.duration += duration
    return this
  }

  loop() {
    this.loopEnabled = true
    return this
  }

  set(time) {
    // console.log('---------------')
    // console.log('STEP:', time)
    if (time < 0) time = 0
    if (this.loopEnabled) time = time % this.duration
    let step
    for (const _step of this.steps) {
      if (time >= _step.startsAt) {
        step = _step
      }
    }
    if (!step) {
      return console.warn('no step', time)
    }
    // if startsAt=100 and endsAt=150 and duration=50 and time=125 THEN alpha = 0.5
    let alpha = (time - step.startsAt) / step.duration
    if (alpha > 1) alpha = 1
    // console.log('alpha', alpha)
    const ease = step.easing(alpha)
    // console.log('ease', ease)
    for (const key in step.to) {
      this.value[key] = step.from[key] + ( (step.to[key] - step.from[key]) * ease) // prettier-ignore
    }
    // console.log(this.value)
  }
}

function noEasing() {
  return 1
}

/**
 * These are taken directly from tween.js
 * as we only need the math
 *
 * see: https://github.com/tweenjs/tween.js/blob/master/src/Easing.ts
 */
function quadraticInOut(amount) {
  if ((amount *= 2) < 1) {
    return 0.5 * amount * amount
  }
  return -0.5 * (--amount * (amount - 2) - 1)
}

function quadraticOut(amount) {
  return amount * (2 - amount)
}

function linear(amount) {
  return amount
}

// TEST
// const groundOpenClose = new Tween({ door1Z: 0, door2Z: 0 })
//   .to({ door1Z: 1, door2Z: -1 }, 1, quadraticInOut)
//   .wait(3)
//   .to({ door1Z: 0, door2Z: 0 }, 1, quadraticInOut)
// console.log(groundOpenClose)
// groundOpenClose.set(0.5)
// console.log(groundOpenClose.value, { door1Z: 0.5, door2Z: -0.5 })
// groundOpenClose.set(2)
// console.log(groundOpenClose.value, { door1Z: 1, door2Z: -1 })
// groundOpenClose.set(999)
// console.log(groundOpenClose.value, { door1Z: 0, door2Z: 0 })
// groundOpenClose.set(1)
// console.log(groundOpenClose.value, { door1Z: 1, door2Z: -1 })
