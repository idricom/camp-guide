// Плавающие иконки для страниц курсов
'use client'

import { Canvas } from '@react-three/fiber'
import { Float, Text3D, Center } from '@react-three/drei'
import { Suspense } from 'react'

function BookIcon({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
      <mesh position={position}>
        <boxGeometry args={[0.6, 0.8, 0.15]} />
        <meshStandardMaterial color="#667eea" metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  )
}

function PencilIcon({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh position={position} rotation={[0, 0, Math.PI / 6]}>
        ylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
        <meshStandardMaterial color="#f5576c" metalness={0.2} roughness={0.6} />
      </mesh>
    </Float>
  )
}

export function FloatingIcons() {
  return (
    <div className="absolute right-0 top-0 w-1/3 h-full pointer-events-none opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          
          <BookIcon position={[-1, 1, 0]} />
          <BookIcon position={[1.5, -0.5, -1]} />
          <PencilIcon position={[0.5, 2, 0]} />
          <PencilIcon position={[-1.2, -1.5, -0.5]} />
        </Suspense>
      </Canvas>
    </div>
  )
}
