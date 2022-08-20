import React, { useRef, useEffect } from 'react'
import { useEngine } from 'hyperfy'

import { blenderVec3 } from './blenderVec3'
import { Tween } from './Tween'

const position = blenderVec3([-7.47835, -21.8026, 36.8871])

const tween = new Tween({ y: 0 })
  .to({ y: -0.5 }, 1.5, Tween.QUAD_IN_OUT)
  .to({ y: 0 }, 1.5, Tween.QUAD_IN_OUT)
  .loop()

export function Noun3D() {
  const ref = useRef()
  const engine = useEngine()

  useEffect(() => {
    const body = ref.current
    return engine.onUpdate(() => {
      const elapsed = engine.getServerTime()
      tween.set(elapsed)
      body.setPositionY(tween.value.y + position[1])
    })
  }, [])

  return (
    <billboard axis="y" ref={ref} position={position}>
      <model src="noun3d.glb" />
    </billboard>
  )
}
