import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VanceLibPlayer } from './VanceLibPlayer';
import { EcosystemBentoGrid } from './EcosystemBentoGrid';
import { ButtonWithIcon } from './ui/button-with-icon';

gsap.registerPlugin(ScrollTrigger);

export const EcosystemSection = React.forwardRef<HTMLElement>((_, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const playerContainer = playerContainerRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Trigger fires ONLY when reaching EcosystemSection (#ecosystem / Benefícios)
      // Animates BOTH EcosystemSection AND EvolutionStepsSection (#evolution-steps / Método) together!
      const stepsSection = document.getElementById('evolution-steps');
      const targetSections = stepsSection ? [section, stepsSection] : [section];

      const colorTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 20%',
          scrub: 0.5,
        },
      });

      // Animate background color of BOTH sections to BLACK together
      colorTl.to(targetSections, { backgroundColor: '#000000', color: '#ffffff' }, 0);

      // Animate text, headers in EcosystemSection
      const ecoTitles = section.querySelectorAll<HTMLElement>('h2, h3, h4');
      ecoTitles.forEach((t) => colorTl.to(t, { color: '#ffffff' }, 0));

      const ecoLogos = section.querySelectorAll<HTMLElement>('.eco-vance-logo');
      ecoLogos.forEach((logo) => colorTl.to(logo, { filter: 'invert(0)' }, 0));

      const ecoParas = section.querySelectorAll<HTMLElement>('p');
      ecoParas.forEach((dp) => {
        colorTl.to(dp, { color: '#ffffff' }, 0);
        const bolds = dp.querySelectorAll<HTMLElement>('strong');
        bolds.forEach((b) => colorTl.to(b, { color: '#ffffff' }, 0));
      });



      // Animate text, headers, and pills in EvolutionStepsSection (Método) simultaneously
      if (stepsSection) {
        const stepTitles = stepsSection.querySelectorAll<HTMLElement>('h2, h3');
        stepTitles.forEach((t) => colorTl.to(t, { color: '#ffffff', borderColor: '#ffffff' }, 0));

        const stepSubTitles = stepsSection.querySelectorAll<HTMLElement>('h3.font-medium');
        stepSubTitles.forEach((st) => colorTl.to(st, { color: '#e5e5e5' }, 0));

        const stepTags = stepsSection.querySelectorAll<HTMLElement>('span.uppercase');
        stepTags.forEach((st) => colorTl.to(st, { color: '#737373' }, 0));

        const stepParas = stepsSection.querySelectorAll<HTMLElement>('p');
        stepParas.forEach((dp) => {
          colorTl.to(dp, { color: '#a3a3a3' }, 0);
        });

        const stepBolds = stepsSection.querySelectorAll<HTMLElement>('strong, .font-bold, .font-semibold');
        stepBolds.forEach((b) => colorTl.to(b, { color: '#ffffff', borderColor: '#ffffff' }, 0));

        const stepPills = stepsSection.querySelectorAll<HTMLElement>('.inline-flex');
        stepPills.forEach((pill) => {
          colorTl.to(pill, { backgroundColor: '#141414', color: '#e5e5e5', borderColor: '#262626' }, 0);
          const dot = pill.querySelector<HTMLElement>('span.rounded-full');
          if (dot) colorTl.to(dot, { backgroundColor: '#ffffff' }, 0);
        });
      }

      // Line-inner text entrance reveal animation for EcosystemSection
      if (header) {
        const headerLines = header.querySelectorAll<HTMLElement>('.line-inner');
        gsap.to(headerLines, {
          y: '0%',
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            once: true,
          },
        });
      }

      // Player entrance animation
      if (playerContainer) {
        gsap.fromTo(
          playerContainer,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: playerContainer,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Bento cards entrance animation
      const bentoCards = section.querySelectorAll<HTMLElement>('.bento-card');
      if (bentoCards.length) {
        gsap.fromTo(
          bentoCards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: bentoCards[0],
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={(node) => {
        (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }}
      id="ecosystem"
      className="w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-24 selection:bg-white selection:text-black transition-colors"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-14 md:gap-16">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center flex flex-col gap-4">
          <div className="overflow-hidden py-1">
            <h2
              className="line-inner text-[clamp(1.75rem,3.8vw,3.2rem)] font-normal text-black leading-[1.18] tracking-tight [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Tudo o que gostaríamos de ter quando&nbsp;começamos.
            </h2>
          </div>

          <div className="overflow-hidden py-1">
            <p
              className="line-inner text-[clamp(1rem,1.8vw,1.25rem)] text-neutral-800 font-normal max-w-2xl mx-auto leading-relaxed [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              A Vance Class não é só uma mentoria. Você entra para um{' '}
              <strong className="font-semibold text-black">ecossistema criado para acelerar</strong> a sua evolução como&nbsp;webdesigner.
            </p>
          </div>
        </div>

        {/* Vance Lib Custom Video Player */}
        <div ref={playerContainerRef} className="w-full flex flex-col items-center gap-8">
          <VanceLibPlayer src="/lib.mp4" />

          {/* Title & Description Below Player */}
          <div className="flex flex-col items-center gap-3 text-center pt-6">
            <img
              src="/logo_vance_2_white.png"
              alt="Vance Logo"
              className="eco-vance-logo h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain shrink-0 mb-1"
              style={{ filter: 'invert(1)' }}
            />
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-black">
              Vance Lib
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-neutral-800 font-normal max-w-3xl leading-relaxed mt-1">
              Mais de <strong className="font-semibold text-black">300 componentes</strong>, animações, prompts, templates, assets e seções prontas para acelerar seus projetos.
            </p>
            <div className="pt-4">
              <ButtonWithIcon
                text="Olhar a library"
                href="https://vancelib.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>
        </div>

        {/* Bento Grid Cards for Main Mentorship Benefits */}
        <EcosystemBentoGrid />
      </div>
    </section>
  );
});

EcosystemSection.displayName = 'EcosystemSection';
export default EcosystemSection;
