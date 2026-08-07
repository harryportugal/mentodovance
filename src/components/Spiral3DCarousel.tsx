import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InteractiveMesh } from '@/components/Hero3DLogo';

gsap.registerPlugin(ScrollTrigger);

export interface Spiral3DCarouselProps {
  images?: string[];
  className?: string;
  /** Called once when the spiral scroll reaches the end */
  onScrollEnd?: () => void;
}

// Exactly 9 curated high-resolution 16:9 images
const NINE_IMAGES = [
  '/espiral/Captura%20de%20tela%202026-08-03%20093350.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20093426.png',
  '/espiral/rcem.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20094306.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20094556.png',
  '/espiral/atelier.png',
  '/espiral/nike.png',
  '/espiral/ovni.png',
  '/espiral/sylvaara.png',
];

// Studio Lighting & Lightformers — Identical to Hero3DLogo.tsx
function StudioEnvironment() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3.2, 5, 5]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[-3.2, 5, 5]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[0, 5, -2]} intensity={0.8} color="#ffffff" />
      <Environment resolution={1024} blur={0.03}>
        <Lightformer form="rect" intensity={0.5} position={[0, 0, -10]} scale={[20, 20, 1]} color="white" />
        <Lightformer form="rect" intensity={2.5} position={[-3.2, 5, 5]} scale={[5, 10, 1]} rotation={[0, Math.PI / 4, 0]} color="white" />
        <Lightformer form="rect" intensity={2.5} position={[3.2, 5, 5]} scale={[5, 10, 1]} rotation={[0, -Math.PI / 4, 0]} color="white" />
        <Lightformer form="rect" intensity={1.5} position={[0, 10, 0]} scale={[10, 10, 1]} rotation={[Math.PI / 2, 0, 0]} color="white" />
        <Lightformer form="rect" intensity={3.5} position={[-5.5, 2, 0]} scale={[0.5, 15, 1]} color="white" />
        <Lightformer form="rect" intensity={3.5} position={[5.5, 2, 0]} scale={[0.5, 15, 1]} color="white" />
      </Environment>
    </>
  );
}

// 3D Scene Content: Spiral Ribbon + 3D Logo sharing the exact same WebGL depth buffer
function SpiralSceneContent({
  displayImages,
  mouseRef,
  targetOffsetRef,
  dragRotationRef,
  baseRotation,
  setIsLoading,
  isPinnedRef,
}: {
  displayImages: string[];
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  targetOffsetRef: React.MutableRefObject<number>;
  dragRotationRef: React.MutableRefObject<{ x: number; z: number }>;
  baseRotation: { x: number; z: number };
  setIsLoading: (val: boolean) => void;
  isPinnedRef: React.MutableRefObject<boolean>;
}) {
  const tiltGroupRef = useRef<THREE.Group>(null);
  const currentOffsetRef = useRef(-1.5);

  const numberOfImages = displayImages.length;
  const ASPECT_16_10 = 16 / 10;
  const trackMultiplier = 3.0;

  const targetConfig = useMemo(
    () => ({
      imageHeight: 4.5,
      gapRatio: 0.15,
      spiralRadius: 8.8,
      spiralTurns: 1.25,
      spiralHeight: 16.5,
    }),
    []
  );

  const [textures, setTextures] = useState<THREE.CanvasTexture[]>([]);
  const geometries = useMemo(() => {
    const cardWidth3D = ASPECT_16_10 * targetConfig.imageHeight;
    return displayImages.map(() => new THREE.PlaneGeometry(cardWidth3D, targetConfig.imageHeight, 32, 8));
  }, [displayImages, ASPECT_16_10, targetConfig.imageHeight]);

  const basePositions = useMemo(() => {
    return geometries.map((geo) => new Float32Array(geo.attributes.position.array));
  }, [geometries]);

  const materials = useMemo(() => {
    return textures.map((tex) => {
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        side: THREE.DoubleSide,
      });

      mat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          `#include <map_fragment>`,
          `
          #ifdef USE_MAP
            vec2 flippedUv = vMapUv;
            if (!gl_FrontFacing) {
              flippedUv.x = 1.0 - flippedUv.x;
            }
            vec4 sampledDiffuseColor = texture2D( map, flippedUv );
            diffuseColor *= sampledDiffuseColor;
          #endif
          `
        );
      };
      return mat;
    });
  }, [textures]);

  useEffect(() => {
    let loaded = 0;
    const texArray: THREE.CanvasTexture[] = [];

    displayImages.forEach((url, idx) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 1280, 800);
          ctx.beginPath();
          ctx.roundRect(0, 0, 1280, 800, 36);
          ctx.clip();

          const imgRatio = img.naturalWidth / img.naturalHeight;
          let srcX = 0,
            srcY = 0,
            srcW = img.naturalWidth,
            srcH = img.naturalHeight;
          if (imgRatio > ASPECT_16_10) {
            srcW = img.naturalHeight * ASPECT_16_10;
            srcX = (img.naturalWidth - srcW) / 2;
          } else {
            srcH = img.naturalWidth / ASPECT_16_10;
            srcY = (img.naturalHeight - srcH) / 2;
          }
          ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 1280, 800);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        if ('colorSpace' in tex) {
          tex.colorSpace = THREE.SRGBColorSpace;
        } else {
          // @ts-ignore
          tex.encoding = 3001;
        }
        texArray[idx] = tex;
        loaded++;
        if (loaded === numberOfImages) {
          setTextures(texArray);
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        texArray[idx] = new THREE.CanvasTexture(document.createElement('canvas'));
        loaded++;
        if (loaded === numberOfImages) {
          setTextures(texArray);
          setIsLoading(false);
        }
      };
      img.src = url;
    });
  }, [displayImages, numberOfImages, ASPECT_16_10, setIsLoading]);

  useFrame(() => {
    if (tiltGroupRef.current) {
      tiltGroupRef.current.rotation.x = baseRotation.x + dragRotationRef.current.x;
      tiltGroupRef.current.rotation.z = baseRotation.z + dragRotationRef.current.z;
    }

    currentOffsetRef.current += (targetOffsetRef.current - currentOffsetRef.current) * 0.07;
    const currentOffset = currentOffsetRef.current;

    const totalSlots = numberOfImages * trackMultiplier;
    const slotWidth3D = (ASPECT_16_10 + targetConfig.gapRatio) * targetConfig.imageHeight;
    const totalWidth = slotWidth3D * totalSlots;
    const cardWidth3D = ASPECT_16_10 * targetConfig.imageHeight;

    geometries.forEach((geo, idx) => {
      const positions = geo.attributes.position;
      const basePos = basePositions[idx];

      for (let i = 0; i < positions.count; i++) {
        const bx = basePos[i * 3];
        const by = basePos[i * 3 + 1];

        const physicalIdx = 8 - idx;

        let globalCenterX = -totalWidth / 2 + physicalIdx * slotWidth3D + cardWidth3D / 2;
        globalCenterX += currentOffset * slotWidth3D;

        let tCenter = (globalCenterX + totalWidth / 2) / totalWidth;
        tCenter = Math.max(0, Math.min(1, tCenter));

        const angleCenter = (tCenter - 0.5) * Math.PI * 2 * (targetConfig.spiralTurns * trackMultiplier);
        const currentRad = targetConfig.spiralRadius * (1 - (tCenter - 0.5) * 0.1);

        const angleOffset = bx / currentRad;
        const angle = angleCenter + angleOffset;

        const px = Math.sin(angle) * currentRad;
        const pz = Math.cos(angle) * currentRad;

        const totalAngle = Math.PI * 2 * (targetConfig.spiralTurns * trackMultiplier);
        const totalHeight = targetConfig.spiralHeight * trackMultiplier;
        const slope = totalHeight / totalAngle;
        const pyOffset = angleOffset * slope;

        const py = (tCenter - 0.5) * totalHeight + pyOffset + by + 1.8;

        positions.setXYZ(i, px, py, pz);
      }
      positions.needsUpdate = true;
    });
  });

  return (
    <group ref={tiltGroupRef}>
      {/* 3D Chrome Logo — hidden until carousel pins, then smooth scale-up entrance */}
      <InteractiveMesh
        mouseRef={mouseRef}
        isPinnedRef={isPinnedRef}
        scaleMultiplier={1.6}
        scrollOffsetRef={currentOffsetRef}
      />

      {/* 9 Spiral Image Planes sharing the exact same WebGL depth buffer */}
      {geometries.map((geo, idx) => {
        if (!materials[idx]) return null;
        return (
          <mesh
            key={idx}
            geometry={geo}
            material={materials[idx]}
            frustumCulled={false}
          />
        );
      })}
    </group>
  );
}

export const Spiral3DCarousel: React.FC<Spiral3DCarouselProps> = ({
  images = NINE_IMAGES,
  className = '',
  onScrollEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef(-1.5);
  const dragRotationRef = useRef({ x: 0, z: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const baseRotation = useMemo(() => ({ x: 0.22, z: -0.06 }), []);
  const isPinnedRef = useRef(false);
  const scrollEndFiredRef = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const displayImages = useMemo(() => images.slice(0, 9), [images]);

  const handleScrollEnd = useCallback(() => {
    if (scrollEndFiredRef.current || !onScrollEnd) return;
    scrollEndFiredRef.current = true;
    onScrollEnd();
  }, [onScrollEnd]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fade video as section enters viewport
    const fadeTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        if (videoRef.current) {
          videoRef.current.style.opacity = (self.progress * 0.2).toString();
        }
      },
    });

    // Main scroll-driven animation — bidirectional (scrub handles forward & backward)
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onEnter: () => {
        isPinnedRef.current = true;
        scrollEndFiredRef.current = false; // allow re-fire when scrolling back in
      },
      onLeaveBack: () => {
        isPinnedRef.current = false;
        scrollEndFiredRef.current = false;
      },
      onLeave: () => {
        isPinnedRef.current = false;
        handleScrollEnd();
      },
      onUpdate: (self) => {
        targetOffsetRef.current = -1.5 + self.progress * 21.5;
      },
    });

    const handleMouseMoveGlobal = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (!isDraggingRef.current) return;
      const dx = event.clientX - previousMousePositionRef.current.x;
      const dy = event.clientY - previousMousePositionRef.current.y;

      dragRotationRef.current.z += dx * 0.002;
      dragRotationRef.current.x -= dy * 0.002;
      dragRotationRef.current.x = Math.max(-0.35, Math.min(0.35, dragRotationRef.current.x));
      dragRotationRef.current.z = Math.max(-0.35, Math.min(0.35, dragRotationRef.current.z));

      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMoveGlobal);

    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      scrollTrigger.kill();
      fadeTrigger.kill();
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
    };
  }, [handleScrollEnd]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[350vh] bg-transparent ${className}`}
    >
      {/*
        Bottom fade on the OUTER container — not inside the sticky.
        The sticky element (h-screen, overflow-hidden) completely covers the
        viewport during the pinned scroll phase, so this gradient is invisible
        while the carousel is active. It only becomes visible in the last ~100px
        of scroll travel, when the sticky un-pins and the section exits — giving
        a smooth white fade into the next section instead of a hard cut.
      */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none z-10"
        style={{
          height: '22vh',
          background: 'linear-gradient(to top, white 0%, transparent 100%)',
        }}
      />

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden cursor-grab select-none">
        {/* Background Video */}
        <video
          ref={videoRef}
          src="/back.mp4"
          poster="/back 2.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10"
          style={{ opacity: 0 }}
        />

        {/* Top fade only — blends into section above */}
        <div
          className="absolute top-0 left-0 w-full h-[25%] pointer-events-none z-20"
          style={{ background: 'linear-gradient(to bottom, white 0%, white 5%, transparent 100%)' }}
        />

        <Canvas
          camera={{ position: [0, 0, 19.5], fov: 46 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            stencil: false,
          }}
          className="relative w-full h-full block outline-none pointer-events-auto z-10"
        >
          <StudioEnvironment />
          <SpiralSceneContent
            displayImages={displayImages}
            mouseRef={mouseRef}
            targetOffsetRef={targetOffsetRef}
            dragRotationRef={dragRotationRef}
            baseRotation={baseRotation}
            setIsLoading={setIsLoading}
            isPinnedRef={isPinnedRef}
          />
        </Canvas>

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-20 pointer-events-none">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mb-3" />
            <span className="text-black/60 text-xs font-mono tracking-widest uppercase">
              Carregando Espiral 3D 16:9...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spiral3DCarousel;
