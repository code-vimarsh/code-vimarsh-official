import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Outer pulsing ring
const PulsingRing = ({ radius, speed, phase }: { radius: number; speed: number; phase: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + phase;
      meshRef.current.scale.setScalar(1 + Math.sin(t) * 0.08);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.15 + Math.abs(Math.sin(t)) * 0.25;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.z += 0.003;
    }
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, 0.012, 8, 64]} />
      <meshBasicMaterial color="#ff6a00" transparent opacity={0.2} />
    </mesh>
  );
};

// Orbiting particle dot
const OrbitParticle = ({ radius, speed, offset }: { radius: number; speed: number; offset: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + offset;
      meshRef.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t * 0.7) * radius * 0.5,
        Math.sin(t) * radius
      );
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.abs(Math.sin(t * 1.5)) * 0.6;
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#ff9a40" transparent opacity={0.8} />
    </mesh>
  );
};

// Inner solid glow core
const GlowCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.scale.setScalar(0.85 + Math.sin(t * 1.2) * 0.06);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.abs(Math.sin(t * 0.8)) * 0.07;
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color="#ff6a00" transparent opacity={0.1} side={THREE.BackSide} />
    </mesh>
  );
};

// Main wireframe ball
const WireframeIcosahedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.18;
      meshRef.current.rotation.y += delta * 0.28;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;

      // Pulse opacity
      const t = state.clock.elapsedTime;
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.55 + Math.sin(t * 1.5) * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.12;
      innerRef.current.rotation.y -= delta * 0.15;
      innerRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.15;
    }
  });

  return (
    <group>
      {/* Main wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#ff6a00" wireframe transparent opacity={0.65} />
      </mesh>

      {/* Inner denser wireframe */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.0, 2]} />
        <meshBasicMaterial color="#ff9a40" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Glow core */}
      <GlowCore />

      {/* Pulsing orbit rings */}
      <PulsingRing radius={2.1} speed={0.6} phase={0} />
      <PulsingRing radius={2.45} speed={0.4} phase={Math.PI / 2} />
      <PulsingRing radius={1.8} speed={0.9} phase={Math.PI} />

      {/* Orbiting particles */}
      <OrbitParticle radius={2.0} speed={0.7} offset={0} />
      <OrbitParticle radius={2.2} speed={0.5} offset={2.1} />
      <OrbitParticle radius={1.9} speed={1.0} offset={4.2} />
      <OrbitParticle radius={2.3} speed={0.6} offset={1.0} />
      <OrbitParticle radius={2.0} speed={0.8} offset={3.5} />
    </group>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} color="#ff6a00" intensity={2} />
        <pointLight position={[-5, -5, -5]} color="#ff9a40" intensity={1} />
        <WireframeIcosahedron />
      </Canvas>
    </div>
  );
};

export default Scene3D;