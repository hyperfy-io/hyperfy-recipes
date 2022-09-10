import React, { useRef, useEffect } from 'react'
import { useEngine } from 'hyperfy'

import { Tween } from './tween'

const anim = new Tween({ y: 0 })
  .wait(3)
  .to({ y: 3 }, 3, Tween.QUAD_IN_OUT)
  .wait(3)
  .to({ y: 0 }, 3, Tween.QUAD_IN_OUT)
  .loop()

export default function Elevator() {
  const bodyRef = useRef()
  const engine = useEngine()

  useEffect(() => {
    const body = bodyRef.current
    return engine.onUpdate(() => {
      anim.set(engine.getServerTime())
      body.setPositionY(anim.value.y)
    })
  }, [])

  return (
    <environment>
      {/* elevator */}
      <rigidbody ref={bodyRef} type="kinematic" position={[0, 0, -5]}>
        <box size={[3, 0.1, 3]} color="blue" />
      </rigidbody>

      {/* random blocks for environment reference */}
      <box position={[-5, 0.5, -5]} />
      <box position={[5, 0.5, -5]} />

      {/* spawn point & ground */}
      <spawn />
      <rigidbody>
        <box color="#1c1d1c" size={[1000, 0.1, 1000]} position={[0, -0.1, 0]} />
      </rigidbody>
    </environment>
  )
}
