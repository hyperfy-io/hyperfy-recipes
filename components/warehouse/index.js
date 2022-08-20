import React from 'react'
import { blenderVec3 } from './blenderVec3'
import { Web3 } from './Web3'

export default function Warehouse() {
  return (
    <environment>
      <hdr src="sky.hdr" />
      <skysphere src="sky.png" encoding="srgb" />
      <climbing />
      {/* <gliding /> */}
      {/* <flying /> */}
      <rigidbody>
        {/* <model src="warehouse.glb" /> */}
        <model src="warehouse-2048.glb" />
        <Web3 />
      </rigidbody>
      <spawn position={[0, 0, 5]} />
      {/* <screen
        id="main"
        label="Main"
        size={[16 / 2, 9 / 2]}
        position={blenderVec3([0, 19.6856, 3.24227])}
      /> */}
    </environment>
  )
}
