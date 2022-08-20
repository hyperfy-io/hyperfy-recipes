import React, { useMemo } from 'react'
import { DEG2RAD, useEngine, useSyncState, useServer } from 'hyperfy'

const BLOCK_SIZE = 1.5
const BLOCK_GAP = 0.01
const NUM_BLOCKS_X = 12
const NUM_BLOCKS_Z = 12
const BLOCK_SPACE = BLOCK_SIZE + BLOCK_GAP + BLOCK_GAP
const BLOCKS_FULL_WIDTH_X = BLOCK_SPACE * NUM_BLOCKS_X
const BLOCKS_FULL_WIDTH_Z = BLOCK_SPACE * NUM_BLOCKS_Z

const welcomeText = `
Welcome to Lava,

Hit the button when you're ready to teleport into the ring. Break the blocks on the ground to make others fall in.

Last person standing wins!
`

export default function Lava() {
  const { teleport, getAvatars, onLeave } = useEngine()
  const [status, dispatch] = useSyncState(state => state.status)
  const [avatars] = useSyncState(state => state.avatars)

  /**
   * TODO
   *
   * - when starting a game, show an init phase/animation
   * - when only one person remains, after a little while break all the
   *   blocks to drop them in
   * - show the winner name somewhere
   */

  useServer(() => {
    if (status !== 'ready') return
    const avatars = []
    getAvatars().forEach(avatar => {
      avatars.push(avatar.uid)
      avatar.teleport([0, 0, 0], 90)
    })
    dispatch('setAvatars', avatars)
    dispatch('active')
  }, [status])

  useServer(() => {
    if (status !== 'active') return
    if (!avatars.length) dispatch('stop')
  }, [status, avatars])

  useServer(() => {
    return onLeave(avatarUid => dispatch('remove', avatarUid))
  }, [])

  return (
    <environment>
      <hdr src="sky.hdr" />
      <skysphere src="sky.jpg" />
      <text
        value={welcomeText}
        bgColor="white"
        color="black"
        padding={0.2}
        bgRadius={0.1}
        lineHeight={1.4}
        position={[9.3, 3, 0]}
        rotation={[0, DEG2RAD * 90, 0]}
        fontSize={0.1}
        maxWidth={1.8}
      />
      <rigidbody position={[0, 0, 0]}>
        <model src="lava.glb" onClick={() => dispatch('ready')} />
      </rigidbody>
      <spawn position={[12, 0, 0]} rotation={90} />
      <trigger
        size={[18, 1, 18]}
        position={[0, -9, 0]}
        onEnter={avatarUid => {
          dispatch('remove', avatarUid)
          teleport(avatarUid, [12, 0, 0], 90)
        }}
      />
      <Blocks />
    </environment>
  )
}

function Blocks() {
  const [blocks, dispatch] = useSyncState(state => state.blocks)
  const positions = useMemo(() => {
    return blocks.map(block => {
      return [
        block.x * BLOCK_SPACE - BLOCKS_FULL_WIDTH_X / 2 + BLOCK_SPACE / 2,
        block.active ? -BLOCK_SPACE / 2 : -20,
        block.z * BLOCK_SPACE - BLOCKS_FULL_WIDTH_Z / 2 + BLOCK_SPACE / 2,
      ]
    })
  }, [blocks])
  return (
    <rigidbody>
      <boxes
        positions={positions}
        size={BLOCK_SIZE}
        onClick={e => dispatch('pop', e.instanceId)}
      />
    </rigidbody>
  )
}

const blocks = []
for (let x = 0; x < NUM_BLOCKS_X; x++) {
  for (let z = 0; z < NUM_BLOCKS_Z; z++) {
    blocks.push({ x, z, active: true })
  }
}

export const store = {
  state: {
    blocks,
    status: 'idle',
    avatars: [],
  },
  actions: {
    pop(state, blockId) {
      state.blocks[blockId].active = false
    },
    ready(state) {
      if (state.status !== 'idle') return
      state.status = 'ready'
    },
    active(state) {
      if (state.status !== 'ready') return
      state.status = 'active'
    },
    setAvatars(state, avatars) {
      state.avatars = avatars
    },
    remove(state, avatar) {
      state.avatars = state.avatars.filter(id => id !== avatar)
    },
    stop(state) {
      if (state.status !== 'active') return
      state.status = 'idle'
      state.avatars = []
      state.blocks.forEach(block => (block.active = true))
    },
  },
}
