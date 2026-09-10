import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

type YellowRiverNarrativeId = 'sediment' | 'system' | 'delta';

interface YellowRiverAtmosphereProps {
  activeNarrativeId: YellowRiverNarrativeId;
  deltaSectionId?: string;
  reducedMotion: boolean;
}

const themeColors: Record<YellowRiverNarrativeId, string> = {
  sediment: '#b88c50',
  system: '#61b8c3',
  delta: '#8bc7a2',
};

function AmbientFlow({ activeNarrativeId, reducedMotion }: YellowRiverAtmosphereProps) {
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(72 * 3);
    for (let index = 0; index < 72; index += 1) {
      const offset = index * 3;
      positions[offset] = -6 + (index % 12) * 1.05 + ((index * 17) % 10) * .035;
      positions[offset + 1] = -2.65 + Math.floor(index / 12) * .82 + ((index * 13) % 7) * .045;
      positions[offset + 2] = 0;
    }
    return positions;
  }, []);
  const curvePoints = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6.4, -1.9, 0),
    new THREE.Vector3(-3.7, -.6, 0),
    new THREE.Vector3(-.4, -1.1, 0),
    new THREE.Vector3(2.2, .4, 0),
    new THREE.Vector3(6.3, -.3, 0),
  ]).getPoints(90), []);
  const ribbon = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineDashedMaterial({
      color: themeColors[activeNarrativeId],
      dashSize: .22,
      gapSize: .48,
      transparent: true,
      opacity: .48,
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return line;
  }, [activeNarrativeId, curvePoints]);

  useEffect(() => {
    return () => {
      ribbon.geometry.dispose();
      ribbon.material.dispose();
    };
  }, [ribbon]);

  return (
    <group>
      <points position={[0, .3, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={themeColors[activeNarrativeId]} size={.035} sizeAttenuation transparent opacity={reducedMotion ? .35 : .55} depthWrite={false} />
      </points>
      <primitive object={ribbon} />
    </group>
  );
}

function DeltaWetlandFlow({ reducedMotion }: Pick<YellowRiverAtmosphereProps, 'reducedMotion'>) {
  const reflectionRef = useRef<THREE.Points>(null);
  const rippleRefs = useRef<Array<THREE.Mesh | null>>([]);
  const startTimeRef = useRef<number | null>(null);
  const wetlandParticles = useMemo(() => {
    const positions = new Float32Array(42 * 3);
    for (let index = 0; index < 42; index += 1) {
      const offset = index * 3;
      positions[offset] = -5.9 + ((index * 29) % 120) / 10;
      positions[offset + 1] = -2.25 + ((index * 17) % 42) / 10;
      positions[offset + 2] = .16 + (index % 4) * .025;
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const now = clock.getElapsedTime();
    if (startTimeRef.current === null) startTimeRef.current = now;

    if (reflectionRef.current) {
      reflectionRef.current.position.y = Math.sin(now * .28) * .06;
      reflectionRef.current.rotation.z = Math.sin(now * .16) * .008;
    }

    const elapsed = now - startTimeRef.current;
    rippleRefs.current.forEach((ripple, index) => {
      if (!ripple) return;
      const delayedProgress = Math.max(0, Math.min((elapsed - index * .09) / .68, 1));
      const scale = .16 + delayedProgress * 1.12;
      ripple.scale.set(scale * 1.48, scale * .58, 1);
      const material = ripple.material as THREE.MeshBasicMaterial;
      material.opacity = delayedProgress > 0 ? .32 * (1 - delayedProgress) : 0;
    });
  });

  return (
    <group position={[0, -.1, .1]}>
      <points ref={reflectionRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[wetlandParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#edf1e6" size={.038} sizeAttenuation transparent opacity={reducedMotion ? .24 : .42} depthWrite={false} />
      </points>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(node) => { rippleRefs.current[index] = node; }}
          position={[.9, -.8, .08]}
          rotation={[0, 0, -.08]}
          scale={reducedMotion ? [1.05, .44, 1] : [.16, .09, 1]}
        >
          <ringGeometry args={[.82, .86, 56]} />
          <meshBasicMaterial color={index === 1 ? '#d8bd76' : '#7fc6c2'} transparent opacity={reducedMotion ? .13 : 0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function YellowRiverAtmosphere(props: YellowRiverAtmosphereProps) {
  return (
    <div className="yellow-river-chronicle__atmosphere" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 46 }} gl={{ alpha: true, antialias: true }}>
        <AmbientFlow {...props} />
        {props.activeNarrativeId === 'delta' && <DeltaWetlandFlow key={props.deltaSectionId} reducedMotion={props.reducedMotion} />}
      </Canvas>
    </div>
  );
}

export type { YellowRiverNarrativeId };
export default YellowRiverAtmosphere;
