"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Sphere, Cylinder } from "@react-three/drei"

export default function Arm() {
  useThree()
  const upperArmRef = useRef(null)
  const lowerArmRef = useRef(null)
  const [isDragging, setIsDragging] = useState(null)
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 })

  useFrame((state) => {
    if (isDragging) {
      const { x, y } = state.mouse
      const deltaX = x - previousMousePosition.x
      const deltaY = y - previousMousePosition.y

      if (isDragging === "shoulder" && upperArmRef.current) {
        upperArmRef.current.rotation.y += deltaX * 2
        upperArmRef.current.rotation.x += deltaY * 2
      } else if (isDragging === "elbow" && lowerArmRef.current) {
        lowerArmRef.current.rotation.y += deltaX * 2
        lowerArmRef.current.rotation.x += deltaY * 2
      }

      setPreviousMousePosition({ x, y })
    }
  })

  const handlePointerDown = (joint) => (event) => {
    event.stopPropagation()
    setIsDragging(joint)
    const { x, y } = event.pointer
    setPreviousMousePosition({ x, y })
  }

  const handlePointerUp = () => {
    setIsDragging(null)
  }

  return (
    <group position={[0, -1, 0]}>
      {/* Upper Arm */}
      <group ref={upperArmRef}>
        <Sphere
          args={[0.2, 32, 32]}
          position={[0, 0, 0]}
          onClick={(e) => handlePointerDown("shoulder")(e)}
          onPointerUp={handlePointerUp}
        >
          <meshStandardMaterial color="#0000FF" />
        </Sphere>
        <Cylinder args={[0.1, 0.1, 2]} position={[0, 1, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#808080" />
        </Cylinder>

        {/* Lower Arm */}
        <group ref={lowerArmRef} position={[0, 2, 0]}>
          <Sphere
            args={[0.2, 32, 32]}
            position={[0, 0, 0]}
            onClick={(e) => handlePointerDown("elbow")(e)}
            onPointerUp={handlePointerUp}
          >
            <meshStandardMaterial color="#0000FF" />
          </Sphere>
          <Cylinder args={[0.1, 0.1, 2]} position={[0, 1, 0]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#A9A9A9" />
          </Cylinder>

          {/* Hand */}
          <group position={[0, 2, 0]} rotation={[0, 0, 0]}>
            <Cylinder args={[0.15, 0.08, 0.4]} position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
              <meshStandardMaterial color="#808080" />
            </Cylinder>
            {/* Fingers */}
            {[...Array(3)].map((_, i) => (
              <Cylinder
                key={i}
                args={[0.03, 0.03, 0.3]}
                position={[Math.cos((i * Math.PI) / 3) * 0.1, 0.5, Math.sin((i * Math.PI) / 3) * 0.1]}
                rotation={[Math.PI / 6, 0, 0]}
              >
                <meshStandardMaterial color="#808080" />
              </Cylinder>
            ))}
          </group>
        </group>
      </group>
    </group>
  )
}

