import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { animated, useSpring } from '@react-spring/three';

const AnimatedBrain = ({ isProcessing, position = [0, 0, 0], scale = 1 }) => {
  const brainRef = useRef();
  
  // Create pulsing animation
  const { pulseScale } = useSpring({
    pulseScale: isProcessing ? 1.2 : 1,
    config: { tension: 100, friction: 10 },
  });

  // Rotation animation
  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.005;
      if (isProcessing) {
        brainRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  // Create a simple geometric brain representation using basic shapes
  return (
    <animated.group 
      ref={brainRef} 
      position={position}
      scale={pulseScale.to(s => [scale * s, scale * s, scale * s])}
    >
      {/* Main brain mass */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial 
          color="#00ff87" 
          wireframe={true}
          opacity={0.8}
          transparent={true}
        />
      </mesh>

      {/* Brain details using toruses */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[1.2, 0.1, 16, 100]} />
        <meshPhongMaterial 
          color="#60efff"
          wireframe={true}
          opacity={0.6}
          transparent={true}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.1, 16, 100]} />
        <meshPhongMaterial 
          color="#60efff"
          wireframe={true}
          opacity={0.6}
          transparent={true}
        />
      </mesh>

      {/* Neural connections using small spheres */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh 
          key={i}
          position={[
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshPhongMaterial 
            color="#ffffff"
            opacity={0.3}
            transparent={true}
          />
        </mesh>
      ))}
    </animated.group>
  );
};

export default AnimatedBrain;
