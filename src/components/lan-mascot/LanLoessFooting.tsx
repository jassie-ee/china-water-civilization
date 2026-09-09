import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (): void => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}

function LoessWaterBloom() {
  const waterRef = useRef<THREE.Group>(null);
  const sedimentRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const sediment = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const angle = (index / 14) * Math.PI * 2;
    return { angle, radius: 1.05 + (index % 4) * .16, size: .026 + (index % 3) * .009 };
  }), []);

  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    if (waterRef.current !== null) {
      waterRef.current.rotation.z += delta * .06;
      waterRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.1) * .028);
    }
    if (sedimentRef.current !== null) {
      sedimentRef.current.rotation.z -= delta * .08;
      sedimentRef.current.position.y = Math.sin(clock.elapsedTime * .75) * .035;
    }
  });

  return (
    <>
      <ambientLight intensity={.66} />
      <pointLight color="#65d9e8" intensity={6} distance={7} position={[0, 1, 2]} />
      <pointLight color="#e6bd69" intensity={3} distance={5} position={[-1.1, .4, 1]} />
      <group ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
        {[1.05, 1.5, 1.94].map((radius, index) => (
          <mesh key={radius} scale={[1, .56, 1]}>
            <ringGeometry args={[radius - .03, radius + .03, 64]} />
            <meshStandardMaterial color={index === 1 ? '#deb96a' : '#73dce9'} emissive={index === 1 ? '#9a6c28' : '#217e9a'} emissiveIntensity={1.2} transparent opacity={.54 - index * .09} roughness={.4} />
          </mesh>
        ))}
      </group>
      <group ref={sedimentRef} rotation={[-Math.PI / 2, 0, 0]}>
        {sediment.map((particle, index) => (
          <mesh key={index} position={[Math.cos(particle.angle) * particle.radius, Math.sin(particle.angle) * particle.radius, .04]} scale={particle.size}>
            <circleGeometry args={[1, 12]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#cf9d53' : '#e3c67d'} emissive="#9a6528" emissiveIntensity={.8} transparent opacity={.68} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function LanLoessFooting() {
  return (
    <div className="lan-loess-footing" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} orthographic camera={{ position: [0, 0, 6], zoom: 52 }} gl={{ alpha: true, antialias: true }}>
        <LoessWaterBloom />
      </Canvas>
    </div>
  );
}

export default LanLoessFooting;
