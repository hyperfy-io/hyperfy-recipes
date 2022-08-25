import React, { useEffect, useState } from 'react'
import { useSyncState } from 'hyperfy'

export default function Environment() {

  return (
    <environment>
      <rigidbody position={[0, -0.065, 0]}>
        <box size={[1000, 0.1, 1000]} color={0x313131} />
      </rigidbody>
      <spawn position={[0, 0, 0]} />
      <Panel/>
    </environment>
  )
}

function Panel() {
  const [input, dispatch] = useSyncState(s => s.input)
  const [submission, setSubmission] = useState('')

  useEffect(() => {
    // logs live input
    // all users can see this due to useSyncState
    console.log(input)
  }, [input])

  useEffect(() => {
    // logs submission
    // only the user who submitted the input can see this
    console.log(submission)
  }, [submission])

  function onBtnPush(btn) {
    if (btn.num !== undefined) {
      dispatch('setInput', input + btn.num)
    }
    if (btn.del && input.length > 0) {
      dispatch('setInput', input.slice(0, -1))
    }
  }

  return (
    <panel
      // panel background
      size={[1, 1]}
      canvasSize={[1024, 1024]}
      unitSize={1.066666}
      style={{ bg: 'rgba(0,0,0,.5)', radius: 50 }}
      position={[0, 1.2, -2]}
    >
      {/* input display */}
      <rect
        style={{
          top: 40,
          left: 250,
          right: 250,
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

      {/* numpad */}
      <rect
        style={{
          top: 220,
          left: 290,
          height: 520,
          width: 390,
        }}
      >
        {/* buttons */}
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
      {/* enter button */}
      <rect
        style={{
          top: 800,
          left: 280,
          width: 420,
          height: 120,
          bg: '#3D69DA',
          fontSize: 60,
          radius: 20,
        }}
        onClick={() => {
          setSubmission(input)
        }}
      >
        Enter
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
