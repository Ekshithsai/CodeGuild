import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <primitive ref={ref} object={scene} scale={1.5} position={[0, -1, 0]} />
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FF6B00" wireframe />
    </mesh>
  );
}

export default function ModelViewer({ modelPath, height = "400px" }) {
  return (
    <div style={{ width: "100%", height, borderRadius: "16px", overflow: "hidden" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#FF6B00" />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#FF9500" />
        <Suspense fallback={<LoadingFallback />}>
          <Model url={modelPath} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
