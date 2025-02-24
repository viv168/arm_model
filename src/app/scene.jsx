"use client"

import { Canvas } from "@react-three/fiber"
import { Grid } from "@react-three/drei"
import Arm from "./arm"

export default function Scene() {
  return (
    <Canvas
      camera={{
        position: [4, 4, 4],
        fov: 50,
      }}
    >
      <color attach="background" args={["#f5f5f5"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Arm />
      <Grid
        args={[10, 10]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#a0a0a0"
        sectionSize={2}
        fadeDistance={30}
        fadeStrength={1}
      />
    </Canvas>
  )
}

