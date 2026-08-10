import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ButtonWithIcon } from '@/components/ui/button-with-icon';

gsap.registerPlugin(ScrollTrigger);

export const FinalHeroCtaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const whatsappUrl = `https://api.whatsapp.com/send?phone=5571992383038&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Vance%20Class!`;

  return (
    <section
      ref={sectionRef}
      id="final-hero-cta"
      className="w-full relative min-h-[85vh] py-24 sm:py-32 px-6 flex flex-col justify-center items-center text-center bg-black overflow-hidden select-none"
    >
      {/* Background Video with Higher Opacity */}
      <video
        src="/back.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Dark Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Main Content Container */}
      <div
        ref={contentRef}
        className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-4 w-full"
      >
        {/* Vance Logo */}
        <img
          src="/logo_vance_2_white.png"
          alt="Vance"
          decoding="async"
          className="h-16 sm:h-20 md:h-24 w-auto object-contain opacity-95"
        />

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal text-white leading-[1.15] md:leading-[1.1] tracking-tight [text-wrap:balance]">
          Chega de cobrar barato. É hora de fechar contratos de <span className="font-semibold text-white">R$&nbsp;10.000</span>.
        </h2>

        {/* Subtitle */}
        <p className="text-white text-xs sm:text-base md:text-lg font-normal max-w-[640px] mx-auto mt-3 leading-relaxed [text-wrap:balance]">
          Você acabou de ver os resultados reais, a estrutura e o ecossistema. Continuar aceitando <strong className="font-semibold text-white">leilão de R$&nbsp;600 por site</strong> é uma escolha. Se você quer <strong className="font-semibold text-white">esmagar o amadorismo e dominar o mercado high-ticket</strong>, a sua decisão é&nbsp;agora.
        </p>

        {/* Centralized CTA Button */}
        <ButtonWithIcon
          text="Garantir minha vaga na Vance Class"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 sm:mt-8"
        />
      </div>
    </section>
  );
};

export default FinalHeroCtaSection;
