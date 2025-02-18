import React, { useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from '@react-three/drei';

function AnimatedObject() {
  const mesh = useRef();
  const { mouse } = useThree();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;

      // Move the mesh away from the mouse
      mesh.current.position.x += (mouse.x * 5 - mesh.current.position.x) * 0.02;
      mesh.current.position.y += (-mouse.y * 5 - mesh.current.position.y) * 0.02;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={'#ff6347'} metalness={0.5} roughness={0.1} />
    </mesh>
  );
}

export default AnimatedObject;
