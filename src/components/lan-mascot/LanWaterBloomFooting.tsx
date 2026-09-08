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

function WaterBloom() {
  const ringsRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const petals = useMemo(() => Array.from({ length: 9 }, (_, index) => {
    const angle = (index / 9) * Math.PI * 2;
    const radius = 1.25 + (index % 3) * .16;
    return { angle, radius, scale: .15 + (index % 2) * .04 };
  }), []);

  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    const elapsed = clock.elapsedTime;
    if (ringsRef.current !== null) {
      ringsRef.current.rotation.z += delta * .08;
      ringsRef.current.scale.setScalar(1 + Math.sin(elapsed * 1.25) * .035);
    }
    if (petalsRef.current !== null) {
      petalsRef.current.rotation.z -= delta * .055;
      petalsRef.current.position.y = Math.sin(elapsed * .9) * .035;
    }
  });

  return (
    <>
      <ambientLight intensity={.72} />
      <pointLight color="#74ddff" intensity={8} distance={7} position={[0, 1.2, 2]} />
      <pointLight color="#e9c267" intensity={4} distance={5} position={[-1.6, .3, 1]} />
      <group ref={ringsRef} rotation={[-Math.PI / 2, 0, 0]}>
        {[1.06, 1.52, 1.98].map((radius, index) => (
          <mesh key={radius} scale={[1, .56, 1]}>
            <ringGeometry args={[radius - .035, radius + .035, 72]} />
            <meshStandardMaterial color={index === 1 ? '#e7c66e' : '#7de9ff'} emissive={index === 1 ? '#b38532' : '#1d8ec1'} emissiveIntensity={1.4} transparent opacity={.58 - index * .1} roughness={.3} metalness={.12} />
          </mesh>
        ))}
      </group>
      <group ref={petalsRef} rotation={[-Math.PI / 2, 0, 0]}>
        {petals.map((petal, index) => (
          <mesh key={index} position={[Math.cos(petal.angle) * petal.radius, Math.sin(petal.angle) * petal.radius, .04]} rotation={[0, 0, petal.angle]} scale={[petal.scale * 1.55, petal.scale, 1]}>
            <circleGeometry args={[1, 18]} />
            <meshStandardMaterial color={index % 2 === 0 ? '#f4d79a' : '#b5eff4'} emissive={index % 2 === 0 ? '#b88739' : '#4699bb'} emissiveIntensity={1.2} transparent opacity={.74} roughness={.45} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function LanWaterBloomFooting() {
  return (
    <div className="lan-water-bloom" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} orthographic camera={{ position: [0, 0, 6], zoom: 52 }} gl={{ alpha: true, antialias: true }}>
        <WaterBloom />
      </Canvas>
    </div>
  );
}

export default LanWaterBloomFooting;
