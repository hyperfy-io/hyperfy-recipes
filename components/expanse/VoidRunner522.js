import React, { useRef, useEffect } from 'react'
import { useEngine, DEG2RAD } from 'hyperfy'

const RTT = 500
const OFFSET = 180
const CLOCKWISE = false

export function VoidRunner522() {
  const engine = useEngine()
  const ref = useRef()
  useEffect(() => {
    const model = ref.current
    return engine.onUpdate(() => {
      const cycle = engine.getServerTime() % RTT
      const degrees = (cycle / RTT) * 360 + OFFSET
      const radians = (CLOCKWISE ? -degrees : degrees) * DEG2RAD
      model.setRotationY(radians)
    })
  }, [])

  return <model src="voidrunner-522.glb" ref={ref} />
}