import React from 'react'
import { useSyncState, DEG2RAD } from 'hyperfy'

import { blenderVec3 } from './blenderVec3'

const position = blenderVec3([0.1, 20.2, 0.560731])

export function Cake() {
  const [cakeSlices, dispatch] = useSyncState(state => state.cakeSlices)

  return cakeSlices.map((active, idx) => (
    <CakeSlice
      key={idx}
      idx={idx}
      active={active}
      onClick={() => {
        dispatch('eatCakeSlice', idx)
      }}
    />
  ))
}
function CakeSlice({ idx, active, onClick }) {
  if (!active) return null
  return (
    <model
      src="cake-slice.glb"
      position={position}
      rotation={[0, 60 * idx * DEG2RAD, 0]}
      onClick={onClick}
    />
  )
}
