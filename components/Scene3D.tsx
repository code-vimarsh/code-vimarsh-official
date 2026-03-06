import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Soft ambient inner glow rendered on the back-face of the sphere shell
const GlowCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.scale.setScalar(0.84 + Math.sin(t * 1.1) * 0.05);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.07 + Math.abs(Math.sin(t * 0.7)) * 0.07;
    }
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color="#ff6a00" transparent opacity={0.1} side={THREE.BackSide} />
    </mesh>
  );
};

// Subtle light particles distributed inside the sphere volume
const InnerParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 90;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * 1.18;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const mix = Math.random();
      colors[i * 3]     = 1.0;
      colors[i * 3 + 1] = 0.38 + mix * 0.28;
      colors[i * 3 + 2] = 0.0;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.elapsedTime;
      (pointsRef.current.material as THREE.PointsMaterial).opacity =
        0.32 + Math.sin(t * 0.85) * 0.18;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.42}
        sizeAttenuation
      />
    </points>
  );
};

// Geometric wireframe sphere - all elements rotate as a unified group
const WireframeIcosahedron = () => {
  const groupRef = useRef<THREE.Group>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.14;
      groupRef.current.rotation.y += delta * 0.22;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.09;
    }
    if (outerRef.current) {
      const t = state.clock.elapsedTime;
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.56 + Math.sin(t * 1.2) * 0.12;
    }
    if (innerRef.current) {
      const t = state.clock.elapsedTime;
      (innerRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.17 + Math.abs(Math.sin(t * 0.85)) * 0.09;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe - primary orange */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#ff6a00" wireframe transparent opacity={0.62} />
      </mesh>

      {/* Inner denser wireframe - amber, for depth */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.0, 2]} />
        <meshBasicMaterial color="#ff9a40" wireframe transparent opacity={0.18} />
      </mesh>

      {/* Back-face ambient glow */}
      <GlowCore />

      {/* Subtle inner particle lights */}
      <InnerParticles />
    </group>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div
      className="w-full h-full min-h-[400px] relative pointer-events-none"
      style={{ willChange: 'transform', isolation: 'isolate' }}
    >
      {/* Camera closer since outer rings removed - sphere fits comfortably at z=5 fov=48 */}
      <Canvas camera={{ position: [0, 0, 5.0], fov: 48 }}>
        <ambientLight intensity={0.25} />
        <pointLight position={[4, 4, 4]} color="#ff6a00" intensity={2.5} />
        <pointLight position={[-4, -3, -4]} color="#ff9a40" intensity={1.2} />
        <WireframeIcosahedron />
      </Canvas>
    </div>
  );
};

export default Scene3D;