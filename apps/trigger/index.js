import React, { useRef } from 'react'

/**
 * This recipe shows how to make a video play when you get near it (and stop when you walk away) using a trigger box
 */

export default function App() {
  const videoRef = useRef()
  return (
    <app>
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
          onLeave={() => videoRef.current.pause()}
        />
      </group>
    </app>
  )
}
