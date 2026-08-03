import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface Spiral3DCarouselProps {
  images?: string[];
  className?: string;
}

// Exactly 9 curated high-resolution 16:9 images
const NINE_IMAGES = [
  '/espiral/Captura%20de%20tela%202026-08-03%20093350.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20093426.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20093726.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20094306.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20094556.png',
  '/espiral/atelier.png',
  '/espiral/nike.png',
  '/espiral/ovni.png',
  '/espiral/sylvaara.png',
];

export const Spiral3DCarousel: React.FC<Spiral3DCarouselProps> = ({
  images = NINE_IMAGES,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Take exactly 9 images for 16:9 continuous ribbon spiral
  const displayImages = images.slice(0, 9);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let animFrameId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let tiltGroup: THREE.Group;
    let scrollTriggerInstance: ScrollTrigger | null = null;
    let fadeTriggerInstance: ScrollTrigger | null = null;

    const meshes: THREE.Mesh[] = [];
    const geometries: THREE.PlaneGeometry[] = [];
    const materials: THREE.MeshBasicMaterial[] = [];
    const basePositions: Float32Array[] = [];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    const targetHover = new Array(9).fill(0);
    const currentHover = new Array(9).fill(0);

    let targetOffset = -1.5;
    let currentOffset = -1.5;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragRotation = { x: 0, z: 0 };
    let baseRotation = { x: 0.22, z: -0.06 };

    const numberOfImages = displayImages.length;
    const ASPECT_16_10 = 16 / 10;
    const trackMultiplier = 3.0;

    // Configuração imponente: Imagens muito maiores e elevação harmoniosa
    const targetConfig = {
      imageHeight: 9.5,    // Imagens gigantescas e de alto impacto visual!
      curvature: 0.0,      // Imagens retangulares intactas 16:9
      gapRatio: 0.15,      // Espaçamento entre imagens
      spiralRadius: 8.8,   // Raio amplo para acomodar os grandes quadros
      spiralTurns: 1.25,   // 1.25 voltas helicoidais elegantes
      spiralHeight: 16.5,  // Altura proporcional
      centerX: 0,
      centerY: 0,
      centerZ: 0,
    };

    // Cria 9 texturas menores e independentes (sem limite de 8192px)
    const createIndependentTextures = (): Promise<THREE.CanvasTexture[]> => {
      return new Promise((resolve) => {
        let loaded = 0;
        const textures: THREE.CanvasTexture[] = [];

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

              // Bordas arredondadas independentes
              ctx.beginPath();
              ctx.roundRect(0, 0, 1280, 800, 36);
              ctx.clip();

              const imgRatio = img.naturalWidth / img.naturalHeight;
              let srcX = 0, srcY = 0, srcW = img.naturalWidth, srcH = img.naturalHeight;
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
              tex.encoding = 3001; // THREE.sRGBEncoding
            }
            textures[idx] = tex;

            loaded++;
            if (loaded === numberOfImages) resolve(textures);
          };
          img.onerror = () => {
            textures[idx] = new THREE.CanvasTexture(document.createElement('canvas'));
            loaded++;
            if (loaded === numberOfImages) resolve(textures);
          };
          img.src = url;
        });
      });
    };

    // Dobra as 9 malhas no espaço matemático 3D
    const updateMeshesMorphing = () => {
      if (meshes.length === 0) return;

      const totalSlots = numberOfImages * trackMultiplier;
      const slotWidth3D = (ASPECT_16_10 + targetConfig.gapRatio) * targetConfig.imageHeight;
      const totalWidth = slotWidth3D * totalSlots;
      const cardWidth3D = ASPECT_16_10 * targetConfig.imageHeight;

      meshes.forEach((_mesh, idx) => {
        const geo = geometries[idx];
        const positions = geo.attributes.position;
        const basePos = basePositions[idx];
        const hoverScale = 1.0 + 0.05 * currentHover[idx];

        for (let i = 0; i < positions.count; i++) {
          const bx = basePos[i * 3];
          const by = basePos[i * 3 + 1];

          // Escala hover APLICADA ANTES DA DOBRA (Cresce independente sem cortes!)
          const lx = bx * hoverScale;
          const ly = by * hoverScale;

          // A imagem 0 do array deve ser a primeira a subir (topo do grupo no trilho 3D)
          const physicalIdx = 8 - idx;

          // 1. Calcula o centro exato deste card no trilho
          let globalCenterX = -totalWidth / 2 + (physicalIdx * slotWidth3D) + (cardWidth3D / 2);
          globalCenterX += currentOffset * slotWidth3D;

          let tCenter = (globalCenterX + totalWidth / 2) / totalWidth;
          tCenter = Math.max(0, Math.min(1, tCenter));

          // 2. Calcula o raio e o ângulo base do centro do card
          const angleCenter = (tCenter - 0.5) * Math.PI * 2 * (targetConfig.spiralTurns * trackMultiplier);
          const currentRad = targetConfig.spiralRadius * (1 - (tCenter - 0.5) * 0.1);

          // 3. Adiciona o deslocamento local (lx) transformado em arco (para não esticar/achatar a imagem)
          const angleOffset = lx / currentRad;
          const angle = angleCenter + angleOffset;

          const px = Math.sin(angle) * currentRad;
          const pz = Math.cos(angle) * currentRad;

          // 4. Adiciona a inclinação vertical (slope) para que as bordas das imagens se alinhem perfeitamente
          const totalAngle = Math.PI * 2 * (targetConfig.spiralTurns * trackMultiplier);
          const totalHeight = targetConfig.spiralHeight * trackMultiplier;
          const slope = totalHeight / totalAngle;
          const pyOffset = angleOffset * slope;

          // ly sem multiplicar por 0.35 para manter o aspect ratio real
          const py = (tCenter - 0.5) * totalHeight + pyOffset + ly + 1.8;

          positions.setXYZ(i, px, py, pz);
        }

        // Sem computeVertexNormals pois usamos MeshBasicMaterial (não tem luz)
        // Sem computeBoundingSphere todo frame, usaremos frustumCulled = false e bounds estáticos
        positions.needsUpdate = true;
      });
    };

    const onResize = () => {
      if (!containerRef.current || !canvasRef.current || !renderer || !camera) return;
      const width = containerRef.current.clientWidth;
      const height = canvasRef.current.parentElement?.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (width < 600) {
        targetConfig.imageHeight = 2.8;
        targetConfig.spiralHeight = 13.0;
        camera.position.set(0, 0, 15.0);
      } else if (width < 1000) {
        targetConfig.imageHeight = 3.8;
        targetConfig.spiralHeight = 15.0;
        camera.position.set(0, 0, 17.0);
      } else {
        targetConfig.imageHeight = 4.5;
        targetConfig.spiralHeight = 16.5;
        camera.position.set(0, 0, 19.5);
      }

      const slotWidth3D = (ASPECT_16_10 + targetConfig.gapRatio) * targetConfig.imageHeight;
      // Calcula o raio matematicamente perfeito para que as imagens se curvem sem achatar
      targetConfig.spiralRadius = (slotWidth3D * 27) / (3.75 * 2 * Math.PI);
      // Recria as geometrias base com o novo tamanho
      if (geometries.length > 0) {
        const cardWidth3D = ASPECT_16_10 * targetConfig.imageHeight;
        geometries.forEach((_geo, idx) => {
          const newGeo = new THREE.PlaneGeometry(cardWidth3D, targetConfig.imageHeight, 32, 8);
          basePositions[idx] = new Float32Array(newGeo.attributes.position.array);
        });
        updateMeshesMorphing();
      }
    };

    // Main Init
    const init = async () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const width = container.clientWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
      camera.position.set(0, 0, 19.5);

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);

      const ambient = new THREE.AmbientLight(0xffffff, 0.95);
      scene.add(ambient);

      const mainLight = new THREE.DirectionalLight(0xffffff, 0.85);
      mainLight.position.set(5, 8, 5);
      scene.add(mainLight);

      tiltGroup = new THREE.Group();
      tiltGroup.rotation.x = baseRotation.x;
      tiltGroup.rotation.z = baseRotation.z;
      scene.add(tiltGroup);

      const textures = await createIndependentTextures();
      const cardWidth3D = ASPECT_16_10 * targetConfig.imageHeight;

      textures.forEach((tex, _idx) => {
        const geo = new THREE.PlaneGeometry(cardWidth3D, targetConfig.imageHeight, 32, 8);
        geometries.push(geo);
        basePositions.push(new Float32Array(geo.attributes.position.array));

        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide,
        });

        // Injeta lógica para não deixar as imagens invertidas (espelhadas) na parte de trás
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

        materials.push(mat);

        const mesh = new THREE.Mesh(geo, mat);

        // Desativa frustum culled para poupar a CPU de recalcular limites 3D a cada frame
        mesh.frustumCulled = false;
        // Bounding sphere gigante fixo apenas para garantir que o Raycaster sempre detecte
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100);

        meshes.push(mesh);
        tiltGroup.add(mesh);
      });

      onResize();
      setIsLoading(false);

      // GSAP ScrollTrigger para o fade-in suave do vídeo de fundo (0 a 0.2)
      fadeTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: 'top bottom', // Quando o topo do container entra na tela por baixo
        end: 'top top',      // Quando trava no topo
        scrub: true,
        onUpdate: (self) => {
          if (videoRef.current) {
            videoRef.current.style.opacity = (self.progress * 0.2).toString();
          }
        },
      });

      // GSAP ScrollTrigger usando position: sticky nativo para evitar solavancos (sem pin do GSAP)
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Scrub suave
        onUpdate: (self) => {
          const p = self.progress;
          // Inicia colado na borda inferior (-1.5) e sobe até vazar no topo (20.0)
          targetOffset = -1.5 + p * 21.5;
        },
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    init();

    // Arraste com o mouse para inclinar a visualização 3D
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }

      if (!isDragging) return;
      const dx = e.clientX - previousMousePosition.x;
      const dy = e.clientY - previousMousePosition.y;

      dragRotation.z += dx * 0.002;
      dragRotation.x -= dy * 0.002;
      dragRotation.x = Math.max(-0.35, Math.min(0.35, dragRotation.x));
      dragRotation.z = Math.max(-0.35, Math.min(0.35, dragRotation.z));

      if (tiltGroup) {
        tiltGroup.rotation.x = baseRotation.x + dragRotation.x;
        tiltGroup.rotation.z = baseRotation.z + dragRotation.z;
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
      if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Loop de animação com interpolação LERP ultra-suave
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      if (meshes.length > 0) {
        // Interpolação LERP de inércia líquida
        currentOffset += (targetOffset - currentOffset) * 0.07;

        // Atualiza a dobra das 9 malhas em tempo real (JS Vertex Morphing)
        updateMeshesMorphing();

        // Raycaster Hover Logic
        if (camera) {
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(meshes);
          let hoveredIndex = -1;

          if (intersects.length > 0) {
            // Como são 9 malhas independentes, basta ver qual mesh foi atingida
            const hitMesh = intersects[0].object as THREE.Mesh;
            hoveredIndex = meshes.indexOf(hitMesh);
          }

          for (let i = 0; i < 9; i++) {
            targetHover[i] = (i === hoveredIndex) ? 1.0 : 0.0;
            const diff = targetHover[i] - currentHover[i];
            if (Math.abs(diff) > 0.001) {
              currentHover[i] += diff * 0.08; // Smooth hover
            } else if (currentHover[i] !== targetHover[i]) {
              currentHover[i] = targetHover[i];
            }
          }
        }
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', onResize);

      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
      if (fadeTriggerInstance) {
        fadeTriggerInstance.kill();
      }

      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      geometries.forEach(geo => geo.dispose());
      materials.forEach(mat => {
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [displayImages]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[350vh] bg-transparent ${className}`}
    >
      <div className="sticky top-0 left-0 w-full h-screen min-h-[920px] overflow-hidden cursor-grab select-none">
        {/* Background Video que faz fade in durante a chegada */}
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
        {/* Fade suave no topo do vídeo para não ficar cortado */}
        <div className="absolute top-0 left-0 w-full h-[55%] pointer-events-none -z-10" style={{ background: 'linear-gradient(to bottom, white 0%, white 20%, transparent 100%)' }} />

        {/* 3D WebGL Canvas com fita contínua 3D, imagens gigantes em HD 16:9 e rolagem LERP ultra-suave */}
        <canvas ref={canvasRef} className="relative w-full h-full block outline-none pointer-events-auto z-10" />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-20 transition-opacity duration-500 pointer-events-none">
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
