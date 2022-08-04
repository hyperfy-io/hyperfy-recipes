import React, { useEffect, useState } from 'react'

/**
 
Schema Format
-------------

Schema = {
  id: String          A unique ID to store origins for this dialog flow (eg npc name)
  origin: String      The initial origin view to start the conversation from
  views: {
    [name]: View      A named view, a single screen in a dialog
  }
}

View = {
  text: String          The text to display in the main box (keep in mind limited space)
  event: String         The event to emit when this view is shown (onEvent)
  origin: String        The name of the view to set as the new origin. Player will start from here when they return.
  goto: String          The name of the next view to go to, when clicking the dialog
  options: [...Option]  An array of options to display
}

Option = {
  require: String       Optional key that is needed to show this option. Will call onRequire(key) and expect a truthy response to be visible
  text: String          The text to display as a button (keep in mind limited space)
  event: String         The event to emit when clicking the option
  origin: String        The name of the view to set as the new origin when the option is clicked. Player will start from here when they return.
  goto: String          The name of the next view to go to, when clicking the option
}

*/

const noop = () => {}
const defaults = {
  offset: [-0.9, 1.6, -0.1],
  near: 3,
  far: 5,
  onEvent: noop,
  onRequire: noop,
  onView: noop,
}

const originsById = {
  /* [id]: String */
}

export function Dialog({
  schema,
  position,
  offset = defaults.offset,
  near = defaults.near,
  far = defaults.far,
  onEvent = defaults.onEvent,
  onRequire = defaults.onRequire,
  onView = defaults.onView,
  children,
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) return
    onView(null)
  }, [visible])

  return (
    <group
      position={position}
      onClick={e => {
        if (e.defaultPrevented) return
        setVisible(true)
      }}
    >
      {children}
      <trigger size={near * 2} onEnter={() => setVisible(true)} />
      <trigger size={far * 2} onLeave={() => setVisible(false)} />
      {visible && (
        <Popup
          schema={schema}
          position={offset}
          onView={onView}
          onEvent={onEvent}
          onRequire={onRequire}
          onEnd={() => setVisible(false)}
        />
      )}
    </group>
  )
}

function Popup({ schema, position, onView, onEvent, onRequire, onEnd }) {
  const origin = originsById[schema.id] || schema.origin
  const [viewName, setViewName] = useState(origin)
  const view = schema.views[viewName]
  if (!view) throw new Error(`[Dialog] view not found (${viewName})`)

  useEffect(() => {
    // the following are applied immediately when a view is shown
    const { event, origin } = view
    if (event) onEvent(event, setViewName)
    if (origin) originsById[schema.id] = origin
  }, [view])

  useEffect(() => {
    onView(viewName)
  }, [view])

  function advanceView(view) {
    const { goto } = view
    if (goto) {
      setViewName(goto)
    } else {
      onEnd()
    }
  }

  function selectOption(option) {
    const { event, origin, goto } = option
    if (event) onEvent(event, setViewName)
    if (origin) originsById[schema.id] = origin
    if (goto) {
      setViewName(goto)
    } else {
      onEnd()
    }
  }

  if (!view.text) return null

  let visibleOptions = []
  if (view.options) {
    visibleOptions = view.options.filter(option => {
      if (option.require && !onRequire(option.require)) {
        return false
      }
      return true
    })
  }

  return (
    <billboard axis="y">
      <billboard
        axis="y"
        position={position}
        onClick={e => {
          if (e.defaultPrevented) return
          if (visibleOptions.length) return
          e.preventDefault()
          advanceView(view)
        }}
      >
        <image
          src={view.goto ? 'dialog-text-bg.png' : 'dialog-text-bg-end.png'}
          width={1}
          position={[0, 0, -0.01]}
          lit={false}
        />
        <text
          value={view.text}
          color="white"
          fontSize={0.06}
          maxWidth={0.8}
          anchorX="center"
          anchorY="middle"
        />
        {visibleOptions.map((option, idx) => (
          <group
            key={idx}
            position={[0, -0.35 - idx * 0.13, 0]}
            onClick={e => {
              e.preventDefault()
              selectOption(option)
            }}
          >
            <image
              src="dialog-option-bg.png"
              width={0.9}
              position={[0, 0, -0.01]}
              lit={false}
            />
            <text
              value={option.text}
              color="white"
              fontSize={0.06}
              maxWidth={0.6}
              align="center"
              anchorX={'center'}
              anchorY={'middle'}
            />
          </group>
        ))}
      </billboard>
    </billboard>
  )
}
