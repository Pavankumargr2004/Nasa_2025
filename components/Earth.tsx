
import React, { useRef, memo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Group } from 'three';

function Model(props: any) {
  const { scene } = useGLTF('https://cdn.glitch.global/e843c0c0-15a2-439c-9c3f-4a699bce8042/earth.glb?v=1716330334032');
  const ref = useRef<Group | null>(null);

  useFrame(() => {
    if (ref.current) {
        ref.current.rotation.y += 0.001;
    }
  });
  
  return <primitive object={scene} ref={ref} scale={2.5} {...props} />;
}

useGLTF.preload('https://cdn.glitch.global/e843c0c0-15a2-439c-9c3f-4a699bce8042/earth.glb?v=1716330334032');

const Earth = memo(function Earth() {
  return (
    <div id="earth-canvas-container">
      <Canvas camera={{ fov: 45, position: [0, 0, 8] }} >
        <Suspense fallback={null}>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} />
            <directionalLight position={[-10, -10, -5]} intensity={1} />
            <Model />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default Earth;