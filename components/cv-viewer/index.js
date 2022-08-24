import React, { useState, useRef, useEffect, useMemo } from 'react'
import { DEG2RAD, Euler, useEngine, useSyncState, useServer } from 'hyperfy'

// 39: Orange Bitcoin
// 44: Black AFrame House, needs default textures
// 117: Nice house
// 26: Lion
// 308: Trees
// 702: pillars https://www.cryptovoxels.com/play?coords=W@91E,247S,0.5U

const parcels = []
let i = 0
while (i < 200) {
  parcels.push(++i)
}

export default function CVViewer() {
  // const { teleport } = useEngine()
  const parcelRef = useRef()
  const [view] = useSyncState(s => s.view)

  return (
    <environment>
      <hdr src="sky.hdr" />
      <skysphere src="sky.png" encoding="srgb" />
      <flying />
      <rigidbody position={[0, -0.065, 0]}>
        <box size={[1000, 0.1, 1000]} color={0x313131} />
      </rigidbody>
      <spawn position={[0, 0, 0]} />

      {/* {parcels.map(parcel => (
        <cvparcel key={parcel} parcel={parcel} alignToGrid />
      ))}
      <trigger
        size={1}
        position={[2, 0, 0]}
        onEnter={avatarUid => {
          teleport(avatarUid, [0, 200, 0])
        }}
      />
      <box size={1} position={[2, 0, 0]} /> */}

      {view && (
        <cvparcel
          ref={parcelRef}
          parcel={view}
          position={[10, -2, -10]}
          rotation={[0, -90 * DEG2RAD, 0]}
        />
      )}

      <Panel onDownload={() => parcelRef.current?.download()} />
    </environment>
  )
}

function Panel({ onDownload }) {
  const [input, dispatch] = useSyncState(s => s.input)

  function onBtnPush(btn) {
    if (btn.num !== undefined) {
      dispatch('setInput', input + btn.num)
    }
    if (btn.del && input.length > 0) {
      dispatch('setInput', input.slice(0, -1))
    }
  }

  function prev() {
    if (!input) return
    const val = parseInt(input) - 1 + ''
    if (val <= 0) return
    dispatch('setInput', val)
    dispatch('setView', val)
  }

  function next() {
    if (!input) return
    const val = parseInt(input) + 1 + ''
    dispatch('setInput', val)
    dispatch('setView', val)
  }

  return (
    <panel
      size={[2, 2]}
      canvasSize={[1024, 1024]}
      unitSize={1.066666}
      style={{ bg: 'rgba(0,0,0,.5)', radius: 50 }}
      position={[0, 1.2, -2]}
    >
      <rect
        style={{
          top: 40,
          left: 40,
          height: 120,
          width: 120,
          bg: '#3D69DA',
          fontSize: 80,
          radius: 20,
        }}
        onClick={prev}
      >
        {'<'}
      </rect>
      <rect
        style={{
          top: 40,
          left: 190,
          right: 190,
          height: 120,
          color: 'white',
          bg: 'black',
          fontSize: 80,
          vAlign: 'center',
          radius: 20,
        }}
      >
        {input}
      </rect>
      <rect
        style={{
          top: 40,
          right: 40,
          height: 120,
          width: 120,
          bg: '#3D69DA',
          fontSize: 80,
          radius: 20,
        }}
        onClick={next}
      >
        {'>'}
      </rect>
      <rect
        style={{
          top: 220,
          left: 290,
          height: 520,
          width: 390,
          // bg: 'blue',
        }}
      >
        {buttons.map((btn, idx) => (
          <rect
            key={idx}
            style={{
              width: 120 * btn.width,
              height: 120 * btn.height,
              left: 120 * btn.left,
              top: 120 * btn.top,
              bg: 'white',
              radius: 40,
              fontSize: 60,
            }}
            onClick={() => onBtnPush(btn)}
          >
            {btn.text}
          </rect>
        ))}
      </rect>
      <rect
        style={{
          top: 800,
          left: 40,
          width: 420,
          height: 120,
          bg: '#3D69DA',
          fontSize: 60,
          radius: 20,
        }}
        onClick={() => {
          console.log('setView', input)
          dispatch('setView', input)
        }}
      >
        View
      </rect>
      <rect
        style={{
          top: 800,
          right: 40,
          width: 420,
          height: 120,
          bg: '#3D69DA',
          fontSize: 60,
          radius: 20,
        }}
        onClick={onDownload}
      >
        Download
      </rect>
    </panel>
  )
}

const buttons = [
  { width: 1, height: 1, left: 0, top: 0, num: 1, text: '1' },
  { width: 1, height: 1, left: 1.1, top: 0, num: 2, text: '2' },
  { width: 1, height: 1, left: 2.2, top: 0, num: 3, text: '3' },
  { width: 1, height: 1, left: 0, top: 1.1, num: 4, text: '4' },
  { width: 1, height: 1, left: 1.1, top: 1.1, num: 5, text: '5' },
  { width: 1, height: 1, left: 2.2, top: 1.1, num: 6, text: '6' },
  { width: 1, height: 1, left: 0, top: 2.2, num: 7, text: '7' },
  { width: 1, height: 1, left: 1.1, top: 2.2, num: 8, text: '8' },
  { width: 1, height: 1, left: 2.2, top: 2.2, num: 9, text: '9' },
  { width: 1, height: 1, left: 0, top: 3.3 },
  { width: 1, height: 1, left: 1.1, top: 3.3, num: 0, text: '0' },
  { width: 1, height: 1, left: 2.2, top: 3.3, del: true, text: '<' },
]

export const store = {
  state: {
    input: '7',
    view: '7',
  },
  actions: {
    setInput(state, value) {
      state.input = value
    },
    setView(state, value) {
      state.view = value
    },
  },
}
