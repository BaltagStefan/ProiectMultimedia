import { ContactShadows, OrbitControls, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import * as THREE from "three";
import { VehicleZoneId } from "../data/vehicleAssembly";

interface Selection {
  selectedZone: VehicleZoneId;
  selectedComponent: string;
  onSelectComponent: (componentId: string) => void;
}

interface PartProps extends Selection {
  zone: VehicleZoneId;
  component: string;
  color?: string;
  children: ReactNode;
}

const focusByZone: Record<VehicleZoneId, [number, number, number]> = {
  hood: [1.75, 0.95, 0],
  engine: [1.35, 0.85, 0],
  wheels: [0, 0.45, 0],
  brakes: [0, 0.45, 0],
  headlights: [2.55, 0.88, 0],
  trunk: [-2.2, 0.85, 0],
  battery: [1.35, 0.9, -0.55],
  interior: [-0.35, 1.1, 0],
};

function PartMaterial({
  active,
  dimmed,
  color = "#64748b",
  metalness = 0.55,
}: {
  active: boolean;
  dimmed: boolean;
  color?: string;
  metalness?: number;
}) {
  return (
    <meshStandardMaterial
      color={active ? "#57f287" : color}
      emissive={active ? "#22c55e" : "#000000"}
      emissiveIntensity={active ? 2.6 : 0}
      metalness={metalness}
      roughness={active ? 0.2 : 0.42}
      transparent={dimmed}
      opacity={dimmed ? 0.14 : 1}
      depthWrite={!dimmed}
    />
  );
}

function Part({ zone, component, selectedZone, selectedComponent, onSelectComponent, children }: PartProps) {
  const active = selectedZone === zone && selectedComponent === component;
  const pulse = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const scale = active ? 1 + Math.sin(clock.elapsedTime * 4) * 0.018 : 1;
    pulse.current.scale.setScalar(scale);
  });

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelectComponent(component);
  };

  return (
    <group ref={pulse} onClick={select}>
      {children}
    </group>
  );
}

function BoxPart({
  zone,
  component,
  selectedZone,
  selectedComponent,
  onSelectComponent,
  position,
  size,
  rotation,
  color,
  radius = 0.08,
}: Selection & {
  zone: VehicleZoneId;
  component: string;
  position: [number, number, number];
  size: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  radius?: number;
}) {
  const active = selectedZone === zone && selectedComponent === component;
  const dimmed = selectedZone !== zone || selectedComponent !== component;
  return (
    <Part {...{ zone, component, selectedZone, selectedComponent, onSelectComponent }}>
      <RoundedBox position={position} args={size} radius={radius} smoothness={3} rotation={rotation}>
        <PartMaterial active={active} dimmed={dimmed} color={color} />
      </RoundedBox>
    </Part>
  );
}

function CylinderPart({
  zone,
  component,
  selectedZone,
  selectedComponent,
  onSelectComponent,
  position,
  radius,
  length,
  rotation = [Math.PI / 2, 0, 0],
  color,
  segments = 32,
}: Selection & {
  zone: VehicleZoneId;
  component: string;
  position: [number, number, number];
  radius: number;
  length: number;
  rotation?: [number, number, number];
  color?: string;
  segments?: number;
}) {
  const active = selectedZone === zone && selectedComponent === component;
  const dimmed = selectedZone !== zone || selectedComponent !== component;
  return (
    <Part {...{ zone, component, selectedZone, selectedComponent, onSelectComponent }}>
      <mesh position={position} rotation={rotation}>
        <cylinderGeometry args={[radius, radius, length, segments]} />
        <PartMaterial active={active} dimmed={dimmed} color={color} />
      </mesh>
    </Part>
  );
}

function ShellMaterial({ highlighted = false }: { highlighted?: boolean }) {
  return (
    <meshPhysicalMaterial
      color={highlighted ? "#57f287" : "#0ea5e9"}
      emissive={highlighted ? "#22c55e" : "#04263b"}
      emissiveIntensity={highlighted ? 2 : 0.25}
      metalness={0.78}
      roughness={0.2}
      clearcoat={1}
      transparent
      opacity={highlighted ? 0.95 : 0.13}
      depthWrite={highlighted}
      side={THREE.DoubleSide}
    />
  );
}

function WheelAssembly({ id, position, selection }: { id: string; position: [number, number, number]; selection: Selection }) {
  const active = selection.selectedZone === "wheels" && selection.selectedComponent === id;
  const dimmed = selection.selectedZone !== "wheels" || selection.selectedComponent !== id;
  return (
    <Part zone="wheels" component={id} {...selection}>
      <group position={position} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.47, 0.47, 0.3, 40]} />
          <PartMaterial active={active} dimmed={dimmed} color="#06090d" metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.035, 16]} />
          <PartMaterial active={active} dimmed={dimmed} color="#94a3b8" />
        </mesh>
        <mesh position={[0, 0.185, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.04, 20]} />
          <PartMaterial active={active} dimmed={dimmed} color="#1e293b" />
        </mesh>
      </group>
    </Part>
  );
}

function BrakeAssembly({ front, selection }: { front: boolean; selection: Selection }) {
  const x = front ? 1.55 : -1.55;
  const discId = front ? "brake-disc-front" : "brake-disc-rear";
  return (
    <>
      {[-0.94, 0.94].map((z) => (
        <group key={`${discId}-${z}`}>
          <CylinderPart
            zone="brakes"
            component={discId}
            position={[x, 0.48, z]}
            radius={0.29}
            length={0.055}
            color="#9ca3af"
            {...selection}
          />
          <BoxPart
            zone="brakes"
            component="brake-calipers"
            position={[x + 0.1, 0.48, z + (z > 0 ? -0.04 : 0.04)]}
            size={[0.13, 0.25, 0.1]}
            color="#ef4444"
            {...selection}
          />
        </group>
      ))}
    </>
  );
}

function StandardCar({ selection }: { selection: Selection }) {
  const hoodActive = selection.selectedZone === "hood" && selection.selectedComponent === "hood-panel";
  const trunkActive = selection.selectedZone === "trunk" && selection.selectedComponent === "trunk-lid";
  return (
    <group rotation={[0, -0.32, 0]} position={[0, 0.02, 0]}>
      {/* Transparent standard hatchback body shell */}
      <RoundedBox position={[0, 0.68, 0]} args={[5.25, 0.55, 1.82]} radius={0.22} smoothness={5}>
        <ShellMaterial />
      </RoundedBox>
      <RoundedBox position={[-0.3, 1.2, 0]} args={[2.9, 0.82, 1.64]} radius={0.3} smoothness={5}>
        <meshPhysicalMaterial color="#082f49" transparent opacity={0.1} roughness={0.08} transmission={0.65} depthWrite={false} />
      </RoundedBox>
      <RoundedBox position={[-0.35, 1.66, 0]} args={[2.18, 0.12, 1.52]} radius={0.08} smoothness={3}>
        <ShellMaterial />
      </RoundedBox>
      <RoundedBox position={[2.52, 0.63, 0]} args={[0.23, 0.4, 1.7]} radius={0.08} smoothness={3}>
        <ShellMaterial />
      </RoundedBox>
      <RoundedBox position={[-2.52, 0.64, 0]} args={[0.23, 0.42, 1.7]} radius={0.08} smoothness={3}>
        <ShellMaterial />
      </RoundedBox>

      {/* Hood and fittings */}
      <Part zone="hood" component="hood-panel" {...selection}>
        <RoundedBox position={[1.55, 1.01, 0]} args={[1.7, 0.1, 1.68]} radius={0.08} smoothness={4} rotation={[0, 0, -0.045]}>
          <ShellMaterial highlighted={hoodActive} />
        </RoundedBox>
      </Part>
      <BoxPart zone="hood" component="hood-latch" position={[2.22, 0.92, 0]} size={[0.16, 0.12, 0.26]} color="#cbd5e1" {...selection} />
      {[-0.62, 0.62].map((z) => (
        <BoxPart key={z} zone="hood" component="hood-hinges" position={[0.76, 0.98, z]} size={[0.2, 0.09, 0.12]} color="#94a3b8" {...selection} />
      ))}
      <BoxPart zone="hood" component="hood-insulation" position={[1.5, 0.96, 0]} size={[1.35, 0.04, 1.35]} color="#263238" {...selection} />

      {/* Engine bay */}
      <BoxPart zone="engine" component="engine-block" position={[1.15, 0.68, 0]} size={[0.92, 0.58, 0.9]} color="#374151" {...selection} />
      <BoxPart zone="engine" component="cylinder-head" position={[1.12, 1.03, 0]} size={[0.9, 0.2, 0.72]} color="#64748b" {...selection} />
      <BoxPart zone="engine" component="intake-manifold" position={[1.05, 1.12, 0.35]} size={[0.7, 0.12, 0.18]} color="#111827" {...selection} />
      <CylinderPart zone="engine" component="turbocharger" position={[1.62, 0.78, -0.38]} radius={0.23} length={0.24} color="#9ca3af" {...selection} />
      <BoxPart zone="engine" component="radiator" position={[2.08, 0.72, 0]} size={[0.12, 0.68, 1.2]} color="#64748b" {...selection} />
      <CylinderPart zone="engine" component="alternator" position={[1.52, 0.63, 0.48]} radius={0.19} length={0.25} color="#cbd5e1" {...selection} />
      <BoxPart zone="engine" component="air-filter" position={[1.35, 0.92, 0.6]} size={[0.5, 0.25, 0.35]} color="#111827" {...selection} />

      {/* Battery and high-current components */}
      <BoxPart zone="battery" component="main-battery" position={[1.45, 0.73, -0.62]} size={[0.58, 0.42, 0.38]} color="#172554" {...selection} />
      {[-0.14, 0.14].map((xOffset) => (
        <CylinderPart
          key={xOffset}
          zone="battery"
          component="battery-terminals"
          position={[1.45 + xOffset, 0.97, -0.62]}
          radius={0.045}
          length={0.08}
          rotation={[0, 0, 0]}
          color={xOffset > 0 ? "#ef4444" : "#94a3b8"}
          {...selection}
        />
      ))}
      <BoxPart zone="battery" component="fuse-box" position={[1.72, 0.78, -0.35]} size={[0.3, 0.22, 0.28]} color="#0f172a" {...selection} />
      <CylinderPart zone="battery" component="starter-motor" position={[0.78, 0.54, -0.38]} radius={0.16} length={0.38} color="#475569" {...selection} />

      {/* Wheels, brakes and suspension */}
      <WheelAssembly id="wheel-fl" position={[1.55, 0.48, 0.98]} selection={selection} />
      <WheelAssembly id="wheel-fr" position={[1.55, 0.48, -0.98]} selection={selection} />
      <WheelAssembly id="wheel-rl" position={[-1.55, 0.48, 0.98]} selection={selection} />
      <WheelAssembly id="wheel-rr" position={[-1.55, 0.48, -0.98]} selection={selection} />
      <BrakeAssembly front selection={selection} />
      <BrakeAssembly front={false} selection={selection} />
      {[1.55, -1.55].flatMap((x) => [-0.78, 0.78].map((z) => (
        <CylinderPart key={`${x}-${z}`} zone="wheels" component="suspension" position={[x, 0.82, z]} radius={0.06} length={0.48} rotation={[0, 0, 0]} color="#eab308" {...selection} />
      )))}
      <BoxPart zone="brakes" component="abs-module" position={[1.35, 0.83, 0.35]} size={[0.32, 0.3, 0.3]} color="#94a3b8" {...selection} />

      {/* Lighting */}
      {[-0.56, 0.56].map((z, index) => (
        <BoxPart
          key={z}
          zone="headlights"
          component={index === 0 ? "headlight-right" : "headlight-left"}
          position={[2.57, 0.91, z]}
          size={[0.16, 0.25, 0.54]}
          color="#e0f2fe"
          {...selection}
        />
      ))}
      <BoxPart zone="headlights" component="led-modules" position={[2.38, 0.87, 0]} size={[0.2, 0.18, 0.45]} color="#38bdf8" {...selection} />
      {[-0.62, 0.62].map((z) => (
        <CylinderPart key={z} zone="headlights" component="fog-lights" position={[2.65, 0.5, z]} radius={0.11} length={0.08} rotation={[0, 0, Math.PI / 2]} color="#f8fafc" {...selection} />
      ))}

      {/* Cabin */}
      {[[-0.15, 0.88, 0.47], [-0.15, 0.88, -0.47]].map((position, index) => (
        <group key={index}>
          <BoxPart zone="interior" component="front-seats" position={position as [number, number, number]} size={[0.55, 0.22, 0.42]} color="#334155" {...selection} />
          <BoxPart zone="interior" component="front-seats" position={[position[0] - 0.18, 1.2, position[2]]} size={[0.18, 0.65, 0.42]} rotation={[0, 0, -0.15]} color="#334155" {...selection} />
        </group>
      ))}
      <BoxPart zone="interior" component="rear-bench" position={[-1.02, 0.91, 0]} size={[0.62, 0.26, 1.26]} color="#334155" {...selection} />
      <BoxPart zone="interior" component="rear-bench" position={[-1.2, 1.2, 0]} size={[0.18, 0.62, 1.26]} rotation={[0, 0, -0.12]} color="#334155" {...selection} />
      <BoxPart zone="interior" component="dashboard" position={[0.47, 1.12, 0]} size={[0.35, 0.32, 1.38]} color="#111827" {...selection} />
      <CylinderPart zone="interior" component="steering-wheel" position={[0.25, 1.27, 0.48]} radius={0.19} length={0.045} rotation={[Math.PI / 2, 0.25, 0]} color="#0f172a" {...selection} />
      <BoxPart zone="interior" component="center-console" position={[-0.05, 0.94, 0]} size={[0.82, 0.22, 0.22]} color="#1e293b" {...selection} />

      {/* Trunk */}
      <Part zone="trunk" component="trunk-lid" {...selection}>
        <RoundedBox position={[-2.07, 1.02, 0]} args={[0.86, 0.12, 1.66]} radius={0.08} smoothness={4} rotation={[0, 0, 0.06]}>
          <ShellMaterial highlighted={trunkActive} />
        </RoundedBox>
      </Part>
      <CylinderPart zone="trunk" component="spare-wheel" position={[-1.93, 0.55, 0]} radius={0.34} length={0.16} rotation={[0, 0, 0]} color="#111827" {...selection} />
      <BoxPart zone="trunk" component="cargo-floor" position={[-1.82, 0.72, 0]} size={[0.92, 0.08, 1.45]} color="#475569" {...selection} />
      {[-0.58, 0.58].map((z) => (
        <BoxPart key={z} zone="trunk" component="rear-lights" position={[-2.58, 0.94, z]} size={[0.13, 0.28, 0.42]} color="#ef4444" {...selection} />
      ))}

      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#082f49" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function CarModelViewer({
  selectedZone,
  selectedComponent,
  onSelectComponent,
}: {
  selectedZone: VehicleZoneId;
  selectedComponent: string;
  onSelectComponent: (componentId: string) => void;
}) {
  const selection = { selectedZone, selectedComponent, onSelectComponent };
  return (
    <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true }}>
      <PerspectiveCamera makeDefault position={[6.8, 3.4, 6.8]} fov={40} />
      <ambientLight intensity={0.75} />
      <hemisphereLight intensity={0.8} color="#dbeafe" groundColor="#020617" />
      <spotLight position={[4, 8, 6]} intensity={55} color="#38bdf8" angle={0.5} castShadow />
      <pointLight position={[-4, 2, -4]} intensity={24} color="#22c55e" />
      <StandardCar selection={selection} />
      <ContactShadows position={[0, 0.18, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#0284c7" />
      <OrbitControls
        target={focusByZone[selectedZone]}
        enablePan={false}
        minDistance={4.5}
        maxDistance={11}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </Canvas>
  );
}
