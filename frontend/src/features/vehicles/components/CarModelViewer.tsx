import { ContactShadows, Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.48, 0.48, 0.28, 32]} />
      <meshStandardMaterial color="#05070a" roughness={0.6} metalness={0.4} />
    </mesh>
  );
}

function CarModel({ selected }: { selected: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });
  const bodyColor = selected === "hood" || selected === "trunk" ? "#22c55e" : "#0ea5e9";
  return (
    <group ref={group} rotation={[0, -0.45, 0]}>
      <mesh position={[0, .58, 0]}>
        <boxGeometry args={[4.6, .58, 1.9]} />
        <meshPhysicalMaterial color={bodyColor} metalness={0.8} roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh position={[-.35, 1.05, 0]}>
        <boxGeometry args={[2.35, .72, 1.65]} />
        <meshPhysicalMaterial color="#0b2033" metalness={0.5} roughness={0.12} transmission={0.16} />
      </mesh>
      <mesh position={[1.82, .66, 0]}>
        <boxGeometry args={[.5, .12, 1.82]} />
        <meshStandardMaterial color={selected === "headlights" ? "#a7f3d0" : "#dbeafe"} emissive="#38bdf8" emissiveIntensity={2} />
      </mesh>
      <mesh position={[.75, .75, 0]}>
        <boxGeometry args={[.8, .12, 1.5]} />
        <meshStandardMaterial color={selected === "engine" || selected === "battery" ? "#22c55e" : "#0c4a6e"} emissive={selected === "engine" ? "#22c55e" : "#000000"} />
      </mesh>
      <Wheel position={[1.35, .28, 1]} /><Wheel position={[1.35, .28, -1]} />
      <Wheel position={[-1.45, .28, 1]} /><Wheel position={[-1.45, .28, -1]} />
      <mesh position={[0, .18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#082f49" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function CarModelViewer({ selected }: { selected: string }) {
  return (
    <Canvas shadows dpr={[1, 1.6]}>
      <PerspectiveCamera makeDefault position={[6.5, 3.4, 6.5]} fov={42} />
      <ambientLight intensity={0.45} />
      <spotLight position={[4, 8, 6]} intensity={45} color="#38bdf8" angle={0.5} castShadow />
      <pointLight position={[-4, 2, -4]} intensity={20} color="#22c55e" />
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.15}>
        <CarModel selected={selected} />
      </Float>
      <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={10} blur={2.5} far={4} color="#0284c7" />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={11} autoRotate={false} />
    </Canvas>
  );
}

