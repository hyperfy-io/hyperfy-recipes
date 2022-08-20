import React, { useRef, useEffect } from 'react'
import { useEngine, DEG2RAD } from 'hyperfy'

const RTT = 36
const OFFSET = 0
const CLOCKWISE = true

export function VoidRunner1233() {
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

  return <model src="voidrunner-1233.glb" ref={ref} />
}
