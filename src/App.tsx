import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ButtonWithIcon } from '@/components/ui/button-with-icon';
import PerspectiveGridSection from '@/components/PerspectiveGridSection';
import TreasureMapSection from '@/components/TreasureMapSection';

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
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.4,
      infinite: false,
    });

    // Stable function ref so gsap.ticker.remove actually finds and removes it
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick); // correctly removes the same reference
      lenis.destroy();
    };
  }, []);

  const scrollToNextSection = () => {
    const el = document.getElementById('perspective-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-white/20 selection:text-white">
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
        <div className="relative z-20 h-full max-w-4xl mx-auto flex flex-col justify-end items-center text-center pb-10 md:pb-14 px-6 w-full">
          {/* Vance Logo */}
          <img
            src="/logo_vance_2_white.png"
            alt="Vance"
            decoding="async"
            fetchPriority="high"
            className="animate-blur-1 h-16 sm:h-20 md:h-24 w-auto object-contain mb-0 opacity-95 drop-shadow-[0_2px_16px_rgba(255,255,255,0.2)]"
            style={{ transform: 'translateZ(0)' }}
          />

          {/* Main Heading */}
          <h1 className="animate-blur-1 text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            <div>Seu próximo site</div>
            <div>
              vale <span className="font-semibold text-white [text-shadow:_0_0_40px_rgba(255,255,255,0.25),_0_0_80px_rgba(255,255,255,0.12)]">R$10.000</span>.
            </div>
          </h1>

          {/* Subtitle */}
          <p className="animate-blur-2 text-white/90 text-xs sm:text-sm md:text-base font-normal max-w-[580px] mx-auto mt-3 md:mt-5 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Enquanto você disputa <strong className="font-semibold text-white">clientes de R$650</strong>, outros webdesigners estão fechando <strong className="font-semibold text-white">projetos de R$5K, R$10K</strong> e construindo uma carreira onde <strong className="font-semibold text-white">o portfólio vende por eles</strong>.
          </p>

          {/* CTA Button */}
          <div className="animate-blur-3">
            <ButtonWithIcon
              text="Descubra como"
              onClick={scrollToNextSection}
              className="mt-5 md:mt-7"
            />
          </div>
        </div>
      </section>

      {/* 3D PERSPECTIVE SCROLL SECTION */}
      <div id="perspective-section" className="bg-black text-white relative z-30">
        <PerspectiveGridSection />
        <TreasureMapSection />
      </div>
    </div>
  );
}

export default App;
