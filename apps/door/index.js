import React from 'react'

import { Door, getInitialDoorState, getDoorActions } from './Door'

/**
 * To use this in your own project:
 *
 * - Copy over `Tween.js`, `Door.js` and `assets/door.glb`
 * - Add store helpers to the initial state and actions in your `index.js`
 * - Now you can use the `<Door />` component wherever you like
 *
 * When using your own custom door.glb, make sure the origin is
 * on the floor below the hinge.
 *
 */

export default function App() {
  return (
    <app>
      <Door name="left" position={[-2, 0, -5]} />
      <Door name="right" position={[2, 0, -5]} startOpen />
    </app>
  )
}

const initialState = {
  ...getInitialDoorState(),
}

export function getStore(state = initialState) {
  return {
    state,
    actions: {
      ...getDoorActions(),
    },
  }
}
