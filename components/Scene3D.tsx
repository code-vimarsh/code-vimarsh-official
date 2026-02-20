import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WireframeIcosahedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Gentle floating effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial 
        color="#ff6a00" 
        wireframe={true} 
        transparent={true} 
        opacity={0.6}
      />
    </mesh>
  );
};

const Scene3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] relative pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <WireframeIcosahedron />
      </Canvas>
    </div>
  );
};

export default Scene3D;