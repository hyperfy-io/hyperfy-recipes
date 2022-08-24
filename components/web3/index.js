import React from 'react'
import { blenderVec3 } from './blenderVec3'
import { Web3 } from './Web3'

export default function Warehouse() {
  return (
    <environment>
      <rigidbody>
        <box
          color="#1c1d1c"
          size={[1000, 0.1, 1000]}
          position={[0, -0.05, 0]}
        />
        <Web3 />
      </rigidbody>
      <spawn position={[0, 0, 5]} />
    </environment>
  )
}
