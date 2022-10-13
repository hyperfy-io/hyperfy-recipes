import React from 'react'
import { useWorld } from 'hyperfy'

export default function App() {
  const world = useWorld()

  return (
    <app>
      {/* a place up in the sky to be teleported to */}
      <place label="up-high" position={[0, 10, 0]} />
      <place label="far-away" position={[0, 0, 10]} rotationY={0} />

      {/* text that teleports when you click */}
      <billboard position={[-2, 1.6, -5]} axis="y">
        <text
          value={'Click to teleport'}
          bgColor="black"
          color="white"
          bgRadius={0.1}
          padding={0.2}
          onClick={() => {
            world.teleport(null, 'up-high')
          }}
        />
      </billboard>

      {/* a trigger box that teleports when you walk on it */}
      <group position={[2, 0, -5]}>
        <box size={[2, 0.1, 2]} />
        <trigger
          size={2}
          onEnter={() => {
            world.teleport(null, 'far-away')
          }}
        />
      </group>
    </app>
  )
}
