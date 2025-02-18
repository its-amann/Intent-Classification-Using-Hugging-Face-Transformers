import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial } from '@react-three/drei';

function AnimatedCharacter() {
  const mesh = useRef();

  // Rotate the character continuously
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      // Add movement away from the mouse
      const { x, y } = mesh.current.position;
      mesh.current.position.x = x + (Math.random() - 0.5) * 0.01;
      mesh.current.position.y = y + (Math.random() - 0.5) * 0.01;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshWobbleMaterial
        color="#ff4081"
        speed={1}
        factor={0.6}
      />
    </mesh>
  );
}

export default AnimatedCharacter;
