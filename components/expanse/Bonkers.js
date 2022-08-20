import React, { useRef, useEffect } from 'react'
import { useEngine } from 'hyperfy'

import { blenderVec3 } from './blenderVec3'
import { Tween } from './Tween'

const bonkers = [
  { position: blenderVec3([-37.841, -0.213515, 49.2024]), timeOffset: 0 },
  { position: blenderVec3([-37.841, 3.80986, 49.2024]), timeOffset: 0.3 },
  { position: blenderVec3([-37.841, 7.83008, 49.2024]), timeOffset: 0.6 },
]

const tween = new Tween({ x: 0 })
  .to({ x: 6 }, 1, Tween.QUAD_IN_OUT)
  .to({ x: 0 }, 1, Tween.QUAD_IN_OUT)
  .loop()

export function Bonkers() {
  return bonkers.map((bonker, idx) => (
    <Bonker
      key={idx}
      position={bonker.position}
      timeOffset={bonker.timeOffset}
    />
  ))
}

function Bonker({ position, timeOffset }) {
  const ref = useRef()
  const engine = useEngine()

  useEffect(() => {
    const body = ref.current
    return engine.onUpdate(() => {
      const elapsed = engine.getServerTime() + timeOffset
      tween.set(elapsed)
      body.setPositionX(tween.value.x + position[0])
    })
  }, [])

  return (
    <rigidbody ref={ref} type="kinematic" position={position}>
      <model src="bonker.glb" />
    </rigidbody>
  )
}
