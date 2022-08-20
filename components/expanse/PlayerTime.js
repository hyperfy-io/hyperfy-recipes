import React from 'react'

import { blenderVec3 } from './blenderVec3'

const POSITION = blenderVec3([-0.83861, 12.0365, 73.2238])

export function PlayerTime({ time, scores }) {
  if (!time) return null
  let text = ''
  if (scores.emptySlots > 0) {
    text = `New high score!\nTime: ${time.toFixed(3)}s`
  } else if (time < scores.timeToBeat) {
    text = `New high score!\nTime: ${time.toFixed(3)}s`
  } else {
    text = `Better luck next time!\nTime: ${time.toFixed(3)}s`
  }
  return (
    <billboard position={POSITION} axis="y">
      <text value={text} align="center" color="white" fontSize={1} />
    </billboard>
  )
}
