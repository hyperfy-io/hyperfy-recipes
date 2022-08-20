import React from 'react'
import { DEG2RAD } from 'hyperfy'

import { blenderVec3 } from './blenderVec3'

const TEXT_POSITION = blenderVec3([-7.02625, 12.0086, 3.89337])

export function Scores({ scores }) {
  return (
    <group position={TEXT_POSITION} rotation={[0, 90 * DEG2RAD, 0]}>
      <text
        position={[-1.5, 0, 0]}
        value={scores.names}
        color="white"
        fontSize={0.2}
        align="left"
        anchorX="left"
        anchorY="top"
      />
      <text
        position={[1.5, 0, 0]}
        value={scores.times}
        color="white"
        fontSize={0.2}
        align="right"
        anchorX="right"
        anchorY="top"
      />
    </group>
  )
}
