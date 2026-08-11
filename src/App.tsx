import { useEffect, useState, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ButtonWithIcon } from '@/components/ui/button-with-icon';
import PerspectiveGridSection from '@/components/PerspectiveGridSection';
import TreasureMapSection from '@/components/TreasureMapSection';
import IntroLoader from '@/components/IntroLoader';

gsap.registerPlugin(ScrollTrigger);

// Global GSAP performance config
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});
gsap.defaults({
  overwrite: 'auto',
});

export function App() {
  const [showBodySections, setShowBodySections] = useState(false);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      infinite: false,
    });

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  // Staggered cinematic entrance animation for Hero elements
  const animateHeroElements = useCallback(() => {
    if (!heroContentRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.05 });

      // Initial state: hidden + blurred + offset down
      gsap.set(['.hero-logo', '.hero-title', '.hero-subtitle', '.hero-cta'], {
        opacity: 0,
        y: 40,
        filter: 'blur(16px)',
        force3D: true,
      });

      // Staggered reveal
      tl.to('.hero-logo', {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
      })
      .to(
        '.hero-title',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.0,
          ease: 'power3.out',
        },
        '-=0.6'
      )
      .to(
        '.hero-subtitle',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.7'
      )
      .to(
        '.hero-cta',
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'back.out(1.4)',
        },
        '-=0.6'
      );
    }, heroContentRef);

    return () => ctx.revert();
  }, []);

  // Called ONLY when IntroLoader has completely finished fading out
  const handleIntroComplete = useCallback(() => {
    setShowBodySections(true);
    animateHeroElements();
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
  }, [animateHeroElements]);

  const scrollToNextSection = () => {
    const el = document.getElementById('perspective-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-white/20 selection:text-white">
      {/* INTRO LOADER ANIMATION */}
      <IntroLoader onComplete={handleIntroComplete} />

      {/* HERO SECTION */}
      <section className="relative h-screen overflow-hidden contain-strict">
        {/* Background Video — GPU composited layer */}
        <video
          src="/back.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        />

        {/* Gradient overlays — composited, no repaint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

        {/* Hero Content */}
        <div
          ref={heroContentRef}
          className="relative z-20 h-full max-w-4xl mx-auto flex flex-col justify-end items-center text-center pb-24 sm:pb-10 md:pb-14 px-4 sm:px-6 w-full"
        >
          {/* Vance Logo */}
          <img
            src="/logo_vance_2_white.png"
            alt="Vance"
            decoding="async"
            fetchPriority="high"
            className="hero-logo h-12 sm:h-16 md:h-24 w-auto object-contain mb-0 drop-shadow-[0_2px_16px_rgba(255,255,255,0.2)]"
            style={{ opacity: 0, transform: 'translateZ(0)' }}
          />

          {/* Main Heading */}
          <h1
            className="hero-title text-2xl sm:text-4xl md:text-6xl lg:text-[68px] font-normal text-white leading-[1.15] md:leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] [text-wrap:balance]"
            style={{ opacity: 0 }}
          >
            Seu próximo site vale <span className="font-semibold text-white [text-shadow:_0_0_40px_rgba(255,255,255,0.25),_0_0_80px_rgba(255,255,255,0.12)]">R$&nbsp;10.000</span>.
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle text-white/90 text-xs sm:text-sm md:text-base font-normal max-w-[580px] mx-auto mt-2.5 sm:mt-3 md:mt-5 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] [text-wrap:balance]"
            style={{ opacity: 0 }}
          >
            Enquanto você disputa <strong className="font-semibold text-white">clientes de R$650</strong>, outros webdesigners estão fechando <strong className="font-semibold text-white">projetos de R$5K, R$10K</strong> e construindo uma carreira onde <strong className="font-semibold text-white">o portfólio vende por&nbsp;eles</strong>.
          </p>

          {/* CTA Button */}
          <div className="hero-cta min-h-[44px] flex items-center justify-center" style={{ opacity: 0 }}>
            <ButtonWithIcon
              text="Descubra como"
              onClick={scrollToNextSection}
              className="mt-4 sm:mt-5 md:mt-7"
            />
          </div>
        </div>
      </section>

      {/* 3D PERSPECTIVE SCROLL SECTION (Mounted ONLY after intro loader completes) */}
      {showBodySections && (
        <div id="perspective-section" className="bg-black text-white relative z-30">
          <PerspectiveGridSection />
          <TreasureMapSection />
        </div>
      )}
    </div>
  );
}

export default App;
