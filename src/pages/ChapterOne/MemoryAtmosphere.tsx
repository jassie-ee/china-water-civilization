import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type MemoryId = 1 | 2 | 3;

interface MemoryAtmosphereProps {
  hoveredMemoryId: MemoryId | null;
  selectedMemoryId: MemoryId;
  completedMemoryIds: MemoryId[];
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (): void => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function MemoryPulse({ active, completed, position, reducedMotion }: {
  active: boolean;
  completed: boolean;
  position: [number, number, number];
  reducedMotion: boolean;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }, delta) => {
    if (reducedMotion || !ring.current || !material.current) return;
    const targetScale = active ? 1.28 : completed ? .86 : .68;
    const currentScale = ring.current.scale.x;
    const nextScale = THREE.MathUtils.damp(currentScale, targetScale, 4.2, delta);
    ring.current.scale.setScalar(nextScale + (active ? Math.sin(clock.elapsedTime * 1.6) * .025 : 0));
    material.current.opacity = THREE.MathUtils.damp(
      material.current.opacity,
      active ? .42 : completed ? .2 : .07,
      4.5,
      delta,
    );
  });

  return (
    <mesh ref={ring} position={position} rotation={[0, 0, -.13]} scale={active ? 1.28 : completed ? .86 : .68}>
      <ringGeometry args={[.72, .75, 96]} />
      <meshBasicMaterial
        ref={material}
        color={active || completed ? '#e9c66d' : '#80cfd0'}
        opacity={active ? .42 : completed ? .2 : .07}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function AtmosphereScene({ hoveredMemoryId, selectedMemoryId, completedMemoryIds, reducedMotion }: MemoryAtmosphereProps & { reducedMotion: boolean }) {
  const particles = useRef<THREE.Points>(null);
  const glow = useRef<THREE.Mesh>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const particlePositions = useMemo(() => {
    const values = new Float32Array(54 * 3);
    for (let index = 0; index < 54; index += 1) {
      values[index * 3] = -5.3 + ((index * 47) % 100) / 9.3;
      values[index * 3 + 1] = -2.5 + ((index * 31) % 100) / 19;
      values[index * 3 + 2] = -1 + (index % 7) * .12;
    }
    return values;
  }, []);

  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    if (particles.current) {
      particles.current.rotation.z += delta * .009;
      particles.current.position.y = Math.sin(clock.elapsedTime * .22) * .08;
    }
    if (glow.current && glowMaterial.current) {
      glow.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * .42) * .035);
      glowMaterial.current.opacity = .055 + Math.sin(clock.elapsedTime * .42) * .012;
    }
  });

  const reactiveMemoryId = hoveredMemoryId ?? selectedMemoryId;
  const pulsePositions: Record<MemoryId, [number, number, number]> = {
    1: [-2.9, -.15, 0],
    2: [-1.25, .05, 0],
    3: [.35, .2, 0],
  };

  return (
    <>
      <mesh ref={glow} position={[-1.45, 0, -1]} scale={1}>
        <circleGeometry args={[3.1, 72]} />
        <meshBasicMaterial
          ref={glowMaterial}
          color="#8adadd"
          opacity={.055}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#f2d88a"
          size={.035}
          opacity={.42}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      {([1, 2, 3] as MemoryId[]).map((memoryId) => (
        <MemoryPulse
          key={memoryId}
          active={reactiveMemoryId === memoryId}
          completed={completedMemoryIds.includes(memoryId)}
          position={pulsePositions[memoryId]}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}

export default function MemoryAtmosphere(props: MemoryAtmosphereProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="chapter-one__three-atmosphere" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={reducedMotion ? 'demand' : 'always'}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        orthographic
        camera={{ position: [0, 0, 8], zoom: 82 }}
      >
        <AtmosphereScene {...props} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
