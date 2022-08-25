import React from 'react'
import { useEngine } from 'hyperfy'

export default function Teleporter() {
  const engine = useEngine()

  return (
    <environment>
      {/* text that teleports when you click */}
      <billboard position={[-2, 1.6, -5]} axis="y">
        <text
          value={'Click to teleport'}
          bgColor="black"
          color="white"
          bgRadius={0.1}
          padding={0.2}
          onClick={e => {
            console.log(e)
            e.avatar.teleport([0, 0, 10])
          }}
        />
      </billboard>

      {/* a trigger box that teleports when you walk on it */}
      <group position={[2, 0, -5]}>
        <box size={[2, 0.1, 2]} />
        <trigger
          size={2}
          onEnter={avatarId => {
            engine.getAvatar(avatarId).teleport([0, 0, 10])
          }}
        />
      </group>

      {/* spawn point & ground */}
      <spawn />
      <rigidbody>
        <box
          color="#1c1d1c"
          size={[1000, 0.1, 1000]}
          position={[0, -0.05, 0]}
        />
      </rigidbody>
    </environment>
  )
}
