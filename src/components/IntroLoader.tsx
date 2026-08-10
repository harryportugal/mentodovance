import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroLoaderProps {
  onComplete?: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFinished, setIsFinished] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let isCancelled = false;

    const ctx = gsap.context(() => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Initial GPU positions
      gsap.set('.c-odd .intro-item', { yPercent: 120, force3D: true });
      gsap.set('.c-even .intro-item', { yPercent: -120, force3D: true });

      const tl = gsap.timeline({
        delay: 0.05,
        onComplete: () => {
          if (isCancelled) return;
          document.body.style.overflow = originalOverflow;
          setIsFinished(true);
          if (onComplete) onComplete();
        },
      });

      timelineRef.current = tl;

      // 1. Slide items into view smoothly
      tl.to('.c-odd .intro-item', {
        yPercent: 0,
        stagger: 0.07,
        duration: 1.5,
        ease: 'power4.inOut',
        force3D: true,
      });

      tl.to(
        '.c-even .intro-item',
        {
          yPercent: 0,
          stagger: 0.07,
          duration: 1.5,
          ease: 'power4.inOut',
          force3D: true,
        },
        '<0.05'
      );

      // 2. Zoom into central video item smoothly
      tl.to(
        containerRef.current,
        {
          scale: 6.5,
          duration: 1.9,
          ease: 'power4.inOut',
          force3D: true,
        },
        '-=0.8'
      );

      // 3. Fade out loader overlay
      tl.to(
        wrapperRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true,
        },
        '-=0.3'
      );
    }, wrapperRef);

    return () => {
      isCancelled = true;
      document.body.style.overflow = originalOverflow;
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ctx.revert();
    };
  }, []);

  if (isFinished) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[99999] bg-[#141414] overflow-hidden pointer-events-auto select-none"
      style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full flex gap-2.5 sm:gap-3.5 origin-center"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >
        {/* Column 1 (Odd: slides up) */}
        <div className="intro-col c-odd relative flex-1 w-full flex flex-col gap-2.5 sm:gap-3.5 h-full">
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img1.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img2.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img3.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img4.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img5.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
        </div>

        {/* Column 2 (Even: slides down) */}
        <div className="intro-col c-even relative flex-1 w-full flex flex-col gap-2.5 sm:gap-3.5 h-full">
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img6.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img7.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img8.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img9.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img10.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
        </div>

        {/* Column 3 (CENTER COLUMN - Item 3 is Hero Video) */}
        <div className="intro-col c-odd relative flex-1 w-full flex flex-col gap-2.5 sm:gap-3.5 h-full">
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img11.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img12.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>

          {/* 🌟 CENTRAL ITEM: HERO VIDEO (/back.mp4) 🌟 */}
          <div className="intro-item relative flex-1 w-full bg-black overflow-hidden rounded-sm">
            <video
              src="/back.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img13.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img15.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
        </div>

        {/* Column 4 (Even: slides down) */}
        <div className="intro-col c-even relative flex-1 w-full flex flex-col gap-2.5 sm:gap-3.5 h-full">
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img1.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img2.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img3.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img4.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img5.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
        </div>

        {/* Column 5 (Odd: slides up) */}
        <div className="intro-col c-odd relative flex-1 w-full flex flex-col gap-2.5 sm:gap-3.5 h-full">
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img6.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img7.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img8.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img9.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
          <div className="intro-item relative flex-1 w-full bg-[#1a1a1a] overflow-hidden rounded-sm">
            <img src="/intro_img/img10.jpg" alt="" className="w-full h-full object-cover grayscale" decoding="async" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroLoader;
