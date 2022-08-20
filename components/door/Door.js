import React, { useRef, useEffect } from 'react'
import { DEG2RAD, useEngine, useSyncState } from 'hyperfy'

import { Tween } from './Tween'

export function Door({ name, position, startOpen = false }) {
  const bodyRef = useRef()
  const engine = useEngine()
  const [door, dispatch] = useSyncState(state => {
    const door = state.doors[name]
    if (door) {
      return door
    } else {
      return {
        open: startOpen,
        time: -999,
      }
    }
  })

  useEffect(() => {
    const body = bodyRef.current
    const tween = door.open ? openTween : closeTween
    let t = engine.getServerTime() - door.time
    return engine.onUpdate(delta => {
      t += delta
      tween.set(t)
      body.setRotationY(tween.value.rotationY)
    })
  }, [door.time])

  return (
    <rigidbody type="kinematic" position={position}>
      <model
        ref={bodyRef}
        src="door.glb"
        onClick={() =>
          dispatch('setDoor', name, !door.open, engine.getServerTime())
        }
      />
    </rigidbody>
  )
}

export function getInitialDoorState() {
  return {
    doors: {
      /*
      [name]: {
        open: Boolean
        time: Number
      }
      */
    },
  }
}

export function getDoorActions() {
  return {
    setDoor(state, name, open, time) {
      if (state.doors[name]) {
        if (state.doors[name].open !== open) {
          state.doors[name].open = open
          state.doors[name].time = time
        }
      } else {
        state.doors[name] = {
          open,
          time,
        }
      }
    },
  }
}

const openTween = new Tween({ rotationY: 0 }).to(
  { rotationY: 135 * DEG2RAD },
  1,
  Tween.QUAD_IN_OUT
)

const closeTween = new Tween({ rotationY: 135 * DEG2RAD }).to(
  { rotationY: 0 },
  1,
  Tween.QUAD_IN_OUT
)
