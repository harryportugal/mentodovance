import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TwoRowMarquee from '@/components/TwoRowMarquee';
import { ButtonWithIcon } from '@/components/ui/button-with-icon';
import { BrandLogosMarquee } from '@/components/BrandLogosMarquee';

gsap.registerPlugin(ScrollTrigger);

export const AboutHarrySection = React.forwardRef<HTMLElement>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const header = headerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Header text reveal
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

      // Mentor Cards reveal
      const cards = container.querySelectorAll<HTMLElement>('.mentor-card');
      cards.forEach((card) => {
        const photo = card.querySelector<HTMLElement>('.mentor-photo');
        const textCol = card.querySelector<HTMLElement>('.mentor-text-col');
        const lines = textCol?.querySelectorAll<HTMLElement>('.line-inner');

        if (photo) {
          gsap.fromTo(
            photo,
            { opacity: 0, scale: 0.88, y: 24 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.1,
              ease: 'expo.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }

        if (lines && lines.length) {
          gsap.to(lines, {
            y: '0%',
            duration: 1.0,
            stagger: 0.13,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              once: true,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="about-harry"
      className="w-full bg-white py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-24 selection:bg-black selection:text-white"
    >
      <div ref={containerRef} className="w-full max-w-5xl mx-auto flex flex-col gap-8 sm:gap-16 md:gap-24">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center">
          <div className="overflow-hidden py-1 mb-4">
            <h2
              className="line-inner text-[clamp(1.75rem,3.8vw,3.2rem)] font-normal text-black leading-[1.18] tracking-tight [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Quem vai mudar a forma como você enxerga&nbsp;webdesign.
            </h2>
          </div>

          <div className="overflow-hidden py-1">
            <p
              className="line-inner text-[clamp(1rem,1.8vw,1.25rem)] text-neutral-600 font-normal max-w-2xl mx-auto leading-relaxed [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              <strong className="font-semibold text-black">Dois especialistas</strong>. <strong className="font-semibold text-black">Duas habilidades</strong>. Um único objetivo: transformar você em um <strong className="font-semibold text-black">webdesigner&nbsp;f0da</strong>.
            </p>
          </div>
        </div>

        {/* ── MENTOR CARD 1 (Harry Portugal) ── */}
        <div className="mentor-card grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-16 lg:gap-20 items-center">
          {/* Photo */}
          <div className="flex justify-center md:justify-start">
            <div
              className="mentor-photo relative overflow-hidden max-w-[270px] sm:max-w-[360px]"
              style={{
                borderRadius: '18px',
                width: '100%',
                aspectRatio: '3/4',
                opacity: 0,
                transform: 'scale(0.88) translateY(24px)',
                willChange: 'opacity, transform',
              }}
            >
              <img
                src="/harry.png"
                alt="Harry Portugal — Engenheiro de software e designer"
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>
          </div>

          {/* Text + Button */}
          <div className="mentor-text-col flex flex-col items-center text-center md:items-start md:text-left gap-3 sm:gap-4 w-full">
            <div className="overflow-hidden">
              <h2
                className="line-inner text-[clamp(1.75rem,3.5vw,2.75rem)] font-normal leading-tight tracking-tight text-black text-center md:text-left"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                Harry Portugal
              </h2>
            </div>

            {/* Bullets: Centered container on mobile, left-aligned dot + text internally */}
            <ul className="flex flex-col gap-3 my-1 items-start text-left max-w-[330px] sm:max-w-none mx-auto md:mx-0 w-full">
              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span><strong className="font-semibold text-black">30+ nomeações</strong> no Awwwards</span>
                </div>
              </li>

              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span>Especialista em <strong className="font-semibold text-black">GSAP</strong> e <strong className="font-semibold text-black">Motion Design</strong></span>
                </div>
              </li>

              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span>Desenvolvimento focado em <strong className="font-semibold text-black">experiências de alto ticket</strong></span>
                </div>
              </li>

              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span>Projetos para empresas <strong className="font-semibold text-black">nacionais e internacionais</strong></span>
                </div>
              </li>
            </ul>

            <div className="overflow-hidden mt-2 sm:mt-3 w-full flex justify-center md:justify-start">
              <div
                className="line-inner"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                <ButtonWithIcon
                  text="Consultar portfólio"
                  variant="black"
                  href="https://harryportugal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-md"
                />
              </div>
            </div>

            <div className="overflow-hidden mt-2 sm:mt-3 w-full flex justify-center md:justify-start">
              <div
                className="line-inner w-full"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                <BrandLogosMarquee />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2-ROW MARQUEE CAROUSEL (Edge-to-Edge) ── */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 -my-2 sm:my-4 md:my-8">
          <TwoRowMarquee />
        </div>

        {/* ── MENTOR CARD 2 (Felipe Milhorança) ── */}
        <div className="mentor-card grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-16 lg:gap-20 items-center">
          {/* Photo */}
          <div className="flex justify-center md:justify-start">
            <div
              className="mentor-photo relative overflow-hidden max-w-[270px] sm:max-w-[360px]"
              style={{
                borderRadius: '18px',
                width: '100%',
                aspectRatio: '3/4',
                opacity: 0,
                transform: 'scale(0.88) translateY(24px)',
                willChange: 'opacity, transform',
              }}
            >
              <img
                src="/felipe.jpg"
                alt="Felipe Milhorança — Designer e Especialista em Figma"
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>
          </div>

          {/* Text + Button */}
          <div className="mentor-text-col flex flex-col items-center text-center md:items-start md:text-left gap-3 sm:gap-4 w-full">
            <div className="overflow-hidden">
              <h2
                className="line-inner text-[clamp(1.75rem,3.5vw,2.75rem)] font-normal leading-tight tracking-tight text-black text-center md:text-left"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                Felipe Milhorança
              </h2>
            </div>

            {/* Bullets: Centered container on mobile, left-aligned dot + text internally */}
            <ul className="flex flex-col gap-3 my-1 items-start text-left max-w-[330px] sm:max-w-none mx-auto md:mx-0 w-full">
              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span>Mais de <strong className="font-semibold text-black">R$80.000 faturados</strong> com sites</span>
                </div>
              </li>

              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span>Especialista em <strong className="font-semibold text-black">Figma</strong> e <strong className="font-semibold text-black">Design Systems</strong></span>
                </div>
              </li>

              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span><strong className="font-semibold text-black">Centenas de interfaces</strong> desenvolvidas</span>
                </div>
              </li>

              <li className="overflow-hidden w-full">
                <div
                  className="line-inner flex items-start justify-start gap-2.5 sm:gap-3 text-[clamp(0.95rem,1.8vw,1.25rem)] font-normal leading-snug text-neutral-900 text-left"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0 inline-block mt-2" />
                  <span>Foco em <strong className="font-semibold text-black">posicionamento no topo de mercado</strong> e <strong className="font-semibold text-black">projetos de alto ticket</strong></span>
                </div>
              </li>
            </ul>

            <div className="overflow-hidden mt-2 sm:mt-3 w-full flex justify-center md:justify-start">
              <div
                className="line-inner"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                <ButtonWithIcon
                  text="Consultar portfólio"
                  variant="black"
                  href="https://harryportugal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

AboutHarrySection.displayName = 'AboutHarrySection';
export default AboutHarrySection;
