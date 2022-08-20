import React, { useEffect, useState } from 'react'
import { useSyncState, useEngine, useServer, useClient } from 'hyperfy'

import { blenderVec3 } from './blenderVec3'

import { Scores } from './Scores'
import { PlayerTime } from './PlayerTime'

const ENDPOINT = 'https://api.hyperfy.io/parkour-scores'
// const ENDPOINT = 'http://localhost:4000/api/parkour-scores'

const telepads = [
  {
    // start -> basic
    from: blenderVec3([8.30551, 12.0593, -0.103002]),
    to: blenderVec3([-40.3, 48, 11.9]),
    toRotation: -90,
  },
  {
    // basic -> tunnel
    from: blenderVec3([-17.8945, 48.0593, 11.897]),
    to: blenderVec3([32.0459, 46.9373, 26.836]),
    toRotation: 180,
  },
  {
    // tunnel -> scatter
    from: blenderVec3([32.0688, 23.5237, 26.8708]),
    to: blenderVec3([11.9666, -19.8454, 36.5242]),
    toRotation: 90,
  },
  {
    // scatter -> bonkers
    from: blenderVec3([-12.4178, -34.895, 36.5645]),
    to: blenderVec3([-35.0736, -4.25042, 47.7765]),
    toRotation: 0,
  },
  {
    // bonkers -> jumper
    from: blenderVec3([-35.0077, 11.8685, 47.7883]),
    to: blenderVec3([31.7905, 11.9892, 64.3219]),
    toRotation: 90,
  },
]

export function Logistics() {
  const engine = useEngine()
  const [scores, setScores] = useState({
    names: '',
    times: '',
    timeToBeat: 999999999999,
    emptySlots: 10,
  })
  const [startTime, setStartTime] = useState(null)
  const [time, setTime] = useState(null)

  const [n] = useSyncState(state => state.scoreboard)

  // server listens for new scores then saves it to the db
  // and dispatches a scoreboard refresh
  useServer(() => {
    return engine.onAction(async (action, ...args) => {
      if (action === 'score') {
        const score = args[0]
        console.log('[onAction] saving score', score.name, score.time)
        try {
          await engine.http({
            method: 'POST',
            url: ENDPOINT,
            data: score,
          })
          engine.dispatch('refreshScoreBoard')
          if (scores.emptySlots > 0 || score.time < scores.timeToBeat) {
            engine.dispatch('releaseCake')
          }
          console.log('[onAction] score saved')
        } catch (err) {
          console.error(err)
          console.error('Failed to submit score')
        }
      }
    })
  }, [scores])

  // refresh the scoreboard data whenever
  // the scoreboard value increments
  useEffect(() => {
    async function getData() {
      console.log('loading scores')
      try {
        const scores = await engine.http({
          method: 'GET',
          url: ENDPOINT,
        })
        console.log('scores loaded', scores)
        setScores(scores)
      } catch (err) {
        console.error(err)
        console.error('Failed to load scores')
      }
    }
    getData()
  }, [n])

  return (
    <>
      {telepads.map((telepad, idx) => (
        <trigger
          key={idx}
          size={1}
          position={telepad.from}
          onEnter={avatarId => {
            engine.teleport(avatarId, telepad.to, telepad.toRotation)
            if (idx === 0) {
              // first telepad starts the parkour timer
              setStartTime(performance.now())
              setTime(null)
            }
          }}
        />
      ))}
      <trigger
        size={[200, 10, 200]}
        position={[0, -40, 0]}
        onEnter={avatarId => {
          setStartTime(null) // stop timer
          engine.teleport(avatarId, [-1.881, 0, -12.005], -90)
        }}
      />
      <trigger
        size={[2, 2, 4]}
        position={blenderVec3([10.8174, 11.9794, 71])}
        onEnter={avatarId => {
          if (!startTime) return
          const name = engine.getAvatar(avatarId).name
          const time = (performance.now() - startTime) / 1000
          setStartTime(null)
          setTime(time)
          engine.dispatch('score', { name, time })
          // console.log(`triggerEnd: ${score}s`)
        }}
      />
      <Scores scores={scores} />
      <PlayerTime time={time} scores={scores} />
    </>
  )
}
