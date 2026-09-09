import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

import './glb-viewer.css';

export interface GlbViewerProps {
  /** Vite imported asset URL or a public URL pointing to a GLB file. */
  modelUrl?: string;
  ariaLabel?: string;
  className?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

type ViewerStatus = 'idle' | 'loading' | 'ready' | 'error';

function disposeMaterial(material: THREE.Material): void {
  material.dispose();

  Object.values(material).forEach((value) => {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });
}

function disposeObject(root: THREE.Object3D | null): void {
  if (root === null) return;

  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.geometry.dispose();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(disposeMaterial);
    } else {
      disposeMaterial(mesh.material);
    }
  });
}

function GlbViewer({
  modelUrl,
  ariaLabel = '三维模型预览，可拖拽旋转',
  className = '',
  autoRotate = false,
  autoRotateSpeed = 0.45,
}: GlbViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ViewerStatus>('idle');

  useEffect(() => {
    const host = hostRef.current;
    if (host === null || !modelUrl) {
      setStatus('idle');
      return undefined;
    }

    let isDisposed = false;
    let animationFrame = 0;
    let isVisible = true;
    let loadedModel: THREE.Object3D | null = null;
    let animationMixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;

    setStatus('loading');

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setStatus('error');
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    renderer.domElement.className = 'glb-viewer__canvas';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.01, 100);
    camera.position.set(0.15, 0.12, 3.2);

    const modelRig = new THREE.Group();
    scene.add(modelRig);

    const ambientLight = new THREE.HemisphereLight(0xe2f2e7, 0x0a2228, 2.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe6b0, 2.4);
    keyLight.position.set(2.5, 3.5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x87cbd1, 1.7);
    rimLight.position.set(-3, 1.5, -2);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 1.7;
    controls.maxDistance = 5.5;
    controls.autoRotate = autoRotate && !reducedMotion;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.target.set(0, 0.05, 0);
    controls.update();

    const resize = (): void => {
      const { width, height } = host.getBoundingClientRect();
      const safeWidth = Math.max(1, width);
      const safeHeight = Math.max(1, height);
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(safeWidth, safeHeight, false);
    };

    const render = (): void => {
      animationFrame = 0;
      if (animationMixer !== null && !reducedMotion) {
        animationMixer.update(Math.min(clock.getDelta(), 0.1));
      }
      controls.update();
      renderer.render(scene, camera);

      if (isVisible && !document.hidden && !reducedMotion) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const startRendering = (): void => {
      if (animationFrame !== 0 || !isVisible || document.hidden) return;
      if (reducedMotion) {
        render();
      } else {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const stopRendering = (): void => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      animationFrame = 0;
    };

    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        stopRendering();
      } else {
        startRendering();
      }
    };

    const handleMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotion = event.matches;
      controls.autoRotate = autoRotate && !reducedMotion;
      stopRendering();
      startRendering();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
      if (isVisible) startRendering();
      else stopRendering();
    });

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    motionQuery.addEventListener('change', handleMotionChange);
    resize();

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) {
          disposeObject(gltf.scene);
          return;
        }

        loadedModel = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(loadedModel);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const largestDimension = Math.max(size.x, size.y, size.z, 0.001);

        loadedModel.position.sub(center);
        loadedModel.scale.setScalar(1.6 / largestDimension);
        modelRig.add(loadedModel);

        if (gltf.animations.length > 0) {
          animationMixer = new THREE.AnimationMixer(loadedModel);
          gltf.animations.forEach((clip) => {
            animationMixer?.clipAction(clip).play();
          });
        }

        setStatus('ready');
        startRendering();
      },
      undefined,
      () => {
        if (!isDisposed) setStatus('error');
      },
    );

    return () => {
      isDisposed = true;
      stopRendering();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener('change', handleMotionChange);
      controls.dispose();
      animationMixer?.stopAllAction();
      animationMixer = null;
      disposeObject(loadedModel);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [autoRotate, autoRotateSpeed, modelUrl]);

  return (
    <div
      ref={hostRef}
      className={`glb-viewer${className ? ` ${className}` : ''}`}
      data-status={status}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="glb-viewer__wash" aria-hidden="true" />
      {status === 'idle' && (
        <p className="glb-viewer__message">
          等待 GLB 资源
          <span>从 WorkBuddy 导出模型后传入 modelUrl</span>
        </p>
      )}
      {status === 'loading' && <p className="glb-viewer__message">正在唤醒水脉模型…</p>}
      {status === 'error' && (
        <p className="glb-viewer__message">
          GLB 暂时无法载入
          <span>请检查模型文件路径或格式</span>
        </p>
      )}
      {status === 'ready' && <span className="glb-viewer__hint">拖拽旋转 · 滚轮缩放</span>}
    </div>
  );
}

export default GlbViewer;
