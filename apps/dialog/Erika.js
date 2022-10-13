import React, { useState } from 'react'

import { Dialog } from './Dialog'

/**
 *
 * The dialog "schema" is a simple format that lets you write all of the dialog flow.
 * A "view" is an individual dialog box with text. Each view has a number of other fields
 * that can be used to create side effects like changing the npc animation, making blockchain
 * contract calls, http requests etc.
 *
 * See `Dialog.js` for full schema overview
 *
 */
const schema = {
  id: 'erika',
  origin: 'intro',
  views: {
    intro: {
      text: "Oh... hey...\nI'm kind of a bit sad right now...",
      goto: 'questAsk',
    },
    questAsk: {
      text: 'I seem to have misplaced my teddy bear somewhere. I swear its around here somewhere. Will you help me find it?',
      origin: 'questAsk',
      options: [
        { text: "Sure, I'll find it!", goto: 'questAccept' },
        { text: 'Maybe later', goto: 'questReject' },
      ],
    },
    questReject: {
      text: '*Sniff* *Sniff*\n\nOkay... no worries...',
    },
    questAccept: {
      text: 'Oh gosh really? Thank you so much! Please return soon!',
      origin: 'questActive',
    },
    questActive: {
      text: 'Welcome back. Any luck finding my teddy bear?',
      options: [
        { text: 'Yep, here you go!', require: 'teddy', goto: 'questComplete' },
        { text: 'Sorry, not yet', goto: 'questNotYet' },
      ],
    },
    questNotYet: {
      text: 'I really hope you can find him for me!',
    },
    questComplete: {
      text: 'Oh for realsies!?!? You found him! Thank you so much sir!',
      origin: 'loved',
      event: 'complete',
    },
    loved: {
      text: "I don't know what I would have done if you didn't find my teddy for me.",
    },
  },
}

export function Erika({ position, teddyPosition }) {
  const [view, setView] = useState(false)
  const [hasTeddy, setHasTeddy] = useState(false)
  const [givenTeddy, setGivenTeddy] = useState(false)

  // Erika is sad until she gets her teddy.
  let animation = givenTeddy ? 'Happy' : 'Sad'
  // If you're talking to her:-
  if (view) {
    if (view === 'questComplete') {
      // She's excited when you give her the teddy!
      animation = 'Excited'
    } else {
      // Otherwise she just talks to you
      animation = 'Talk'
    }
  }

  return (
    <>
      <Dialog
        position={position}
        schema={schema}
        onRequire={name => {
          if (name === 'teddy') return hasTeddy
        }}
        onView={setView}
        onEvent={(event, setView) => {
          if (event === 'complete') {
            setGivenTeddy(true)
          }
          // If you wanted to you could run async stuff like checking a wallet
          // here in response to an event, and then call setView(String) to continue
          // the conversation.
        }}
      >
        <model src="erika.glb" animate={animation} />
      </Dialog>
      {!hasTeddy && (
        <model
          src="teddy.glb"
          position={teddyPosition}
          onClick={() => setHasTeddy(true)}
        />
      )}
    </>
  )
}
