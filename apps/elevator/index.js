import React, { useRef, useEffect } from 'react'
import { useWorld, DEG2RAD } from 'hyperfy'

import { Tween } from './Tween'

const anim = new Tween({ y: 0, r: 0 })
  .wait(1)
  .to({ y: 6, r: 360 }, 3, Tween.QUAD_IN_OUT)
  .wait(1)
  .to({ y: 0, r: 0 }, 3, Tween.QUAD_IN_OUT)
  .loop()

export default function App() {
  const bodyRef = useRef()
  const world = useWorld()

  useEffect(() => {
    const body = bodyRef.current
    return world.onUpdate(() => {
      anim.set(world.getServerTime())
      body.setPositionX(anim.value.y)
      body.setRotationY(anim.value.r * DEG2RAD)
    })
  }, [])

  return (
    <app>
      <rigidbody ref={bodyRef} type="kinematic" position={[0, 0, -5]}>
        <box size={[3, 0.1, 3]} color="blue" />
      </rigidbody>
    </app>
  )
}
