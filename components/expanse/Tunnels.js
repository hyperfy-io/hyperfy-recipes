import React, { useRef, useEffect } from 'react'
import { useEngine } from 'hyperfy'

import { blenderVec3 } from './blenderVec3'
import { Tween } from './Tween'

const tunnels = [
  { position: blenderVec3([32.0385, 41.0288, 25.8825]), timeOffset: 0 },
  { position: blenderVec3([32.0385, 37.0059, 25.8825]), timeOffset: 1 },
  { position: blenderVec3([32.0385, 32.8623, 25.8825]), timeOffset: 2 },
  { position: blenderVec3([32.0385, 28.9265, 25.8825]), timeOffset: 3 },
]

const tween = new Tween({ y: 0 })
  .to({ y: -2 }, 3, Tween.QUAD_IN_OUT)
  .to({ y: 0 }, 3, Tween.QUAD_IN_OUT)
  .loop()

export function Tunnels() {
  return tunnels.map((tunnel, idx) => (
    <Tunnel
      key={idx}
      position={tunnel.position}
      timeOffset={tunnel.timeOffset}
    />
  ))
}

function Tunnel({ position, timeOffset }) {
  const ref = useRef()
  const engine = useEngine()

  useEffect(() => {
    const body = ref.current
    return engine.onUpdate(() => {
      const elapsed = engine.getServerTime() + timeOffset
      tween.set(elapsed)
      body.setPositionY(tween.value.y + position[1])
    })
  }, [])

  return (
    <rigidbody ref={ref} type="kinematic" position={position}>
      <model src="tunnel.glb" />
    </rigidbody>
  )
}
