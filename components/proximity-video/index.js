import React, { useRef } from 'react'

/**
 * This recipe shows how to make a video play when you get near it (and stop when you walk away) using a trigger box
 */

export default function ProximityVideo() {
  const videoRef = useRef()
  return (
    <environment>
      <spawn />

      <group position={[0, 1.5, -10]}>
        <video
          height={2}
          ref={videoRef}
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          autoplay={false}
        />
        <trigger
          size={10}
          onEnter={() => videoRef.current.play()}
          onLeave={() => videoRef.current.stop()}
        />
      </group>

      <rigidbody>
        // the floor
        <box
          color="#1c1d1c"
          size={[1000, 0.1, 1000]}
          position={[0, -0.05, 0]}
        />
      </rigidbody>
    </environment>
  )
}
