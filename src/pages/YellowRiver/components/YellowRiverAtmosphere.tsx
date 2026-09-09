import { Canvas } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

type YellowRiverNarrativeId = 'sediment' | 'system' | 'delta';

interface YellowRiverAtmosphereProps {
  activeNarrativeId: YellowRiverNarrativeId;
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

function YellowRiverAtmosphere(props: YellowRiverAtmosphereProps) {
  return (
    <div className="yellow-river-chronicle__atmosphere" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 46 }} gl={{ alpha: true, antialias: true }}>
        <AmbientFlow {...props} />
      </Canvas>
    </div>
  );
}

export type { YellowRiverNarrativeId };
export default YellowRiverAtmosphere;
