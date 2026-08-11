import React, { useRef, useMemo } from 'react';
import gsap from 'gsap';

const spiralImages = [
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

interface ImageMouseTrailProps {
  children?: React.ReactNode;
  className?: string;
  images?: string[];
}

export function ImageMouseTrail({
  children,
  className = '',
  images = spiralImages,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Triple the pool size so older tail images complete their full exit animation naturally
  const poolImages = useMemo(() => [...images, ...images, ...images], [images]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const globalIndex = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const zIndexCounter = useRef(50);

  const activateImage = (img: HTMLImageElement, clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;

    // Reset any active GSAP tweens on this image
    gsap.killTweensOf(img);

    // Update position and z-index instantly without animation
    zIndexCounter.current += 1;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.zIndex = zIndexCounter.current.toString();

    const randomRotation = (Math.random() - 0.5) * 12; // -6deg to +6deg

    // Pure scale animation WITHOUT FADE (opacity 1.0 throughout)
    const tl = gsap.timeline({ defaults: { force3D: true } });

    tl.fromTo(
      img,
      {
        scale: 0,
        opacity: 1,
        rotation: randomRotation * 1.4,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: randomRotation,
        duration: 0.32,
        ease: 'power3.out',
      }
    ).to(img, {
      scale: 0,
      opacity: 1,
      rotation: randomRotation * 0.4,
      duration: 0.35,
      delay: 0.38,
      ease: 'power3.in',
      onComplete: () => {
        gsap.set(img, { opacity: 0 });
      },
    });

    lastPos.current = { x: clientX, y: clientY };
  };

  const handleOnMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Disable mouse trail effect on mobile screens and touch devices
    if (
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0)
    ) {
      return;
    }

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const dist = Math.hypot(clientX - lastPos.current.x, clientY - lastPos.current.y);

    // Spawn threshold distance
    if (dist > 65) {
      const idx = globalIndex.current % poolImages.length;
      const imgEl = imageRefs.current[idx];

      if (imgEl) {
        activateImage(imgEl, clientX, clientY);
        globalIndex.current++;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleOnMove}
      onTouchMove={handleOnMove}
      className={`relative w-full overflow-visible ${className}`}
    >
      {poolImages.map((url, index) => (
        <img
          key={`${url}-${index}`}
          ref={(el) => {
            imageRefs.current[index] = el;
          }}
          src={url}
          alt={`trail-${index}`}
          className="absolute opacity-0 scale-0 w-52 sm:w-64 aspect-video object-cover rounded-xl shadow-2xl border border-black/10 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        />
      ))}
      {children}
    </div>
  );
}

export default ImageMouseTrail;
