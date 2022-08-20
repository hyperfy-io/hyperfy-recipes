import React from 'react'

import { Logistics } from './Logistics'
import { Tunnels } from './Tunnels'
import { Bonkers } from './Bonkers'
import { Noun3D } from './Noun3D'
import { VoidRunner1233 } from './VoidRunner1233'
import { Cake } from './Cake'
import { VoidRunner522 } from './VoidRunner522'
import { VoidRunner613 } from './VoidRunner613'

export default function Expanse() {
  return (
    <environment>
      <hdr src="sky.hdr" />
      <background color={0x10141d} />
      <sun position={[100, 300, -200]} />
      <skysphere
        src="purple-space.jpg"
        encoding="srgb"
        rotation={[0, 0.7853981633974483, 0.6981317007977318]}
      />
      <climbing />
      <gliding />
      {/* <flying /> */}
      <rigidbody>
        <model src="expanse.glb" />
      </rigidbody>
      <spawn position={[0.03, -0.087, -2.438]} />
      <spawn position={[1.323, -0.087, -1.208]} />
      <spawn position={[-1.28, -0.087, -1.621]} />
      <Noun3D />
      <Logistics />
      <Tunnels />
      <Bonkers />
      <VoidRunner1233 />
      <VoidRunner522 />
      <VoidRunner613 />

      <Cake />
    </environment>
  )
}

const DefaultState = {
  scoreboard: 0,
  cakeSlices: [0, 0, 0, 0, 0, 0],
}

export function getStore(state = DefaultState) {
  return {
    state,
    actions: {
      refreshScoreBoard(state) {
        state.scoreboard++
      },
      eatCakeSlice(state, idx) {
        state.cakeSlices[idx] = 0
      },
      releaseCake(state) {
        state.cakeSlices = [1, 1, 1, 1, 1, 1]
      },
    },
  }
}
