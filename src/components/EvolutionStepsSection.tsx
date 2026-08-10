import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EvolutionStep {
  number: string;
  letter: string;
  name: string;
  tagline: string;
  items: string[];
}

const STEPS: EvolutionStep[] = [
  {
    number: '01',
    letter: 'V',
    name: 'ision',
    tagline: 'Aprenda a pensar antes de abrir o Figma.',
    items: ['Briefing', 'Referências', 'Moodboard', 'Direção criativa'],
  },
  {
    number: '02',
    letter: 'A',
    name: 'rchitecture',
    tagline: 'Construa interfaces que parecem internacionais.',
    items: ['Design System', 'Auto Layout', 'Grid', 'Tipografia', 'Componentes'],
  },
  {
    number: '03',
    letter: 'N',
    name: 'avigation',
    tagline: 'Transforme design em código profissional.',
    items: ['HTML', 'CSS', 'Responsividade', 'Performance', 'Organização'],
  },
  {
    number: '04',
    letter: 'C',
    name: 'inematics',
    tagline: 'Faça seus projetos serem inesquecíveis.',
    items: ['GSAP', 'ScrollTrigger', 'Motion Design', 'Microinterações'],
  },
  {
    number: '05',
    letter: 'E',
    name: 'levation',
    tagline: 'Aprenda a transformar habilidade em faturamento.',
    items: ['Portfólio', 'Posicionamento', 'Precificação', 'Propostas', 'Vendas'],
  },
];

export const EvolutionStepsSection = React.forwardRef<HTMLElement>((_, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const timeline = timelineRef.current;
    if (!header && !timeline) return;

    const ctx = gsap.context(() => {
      // Line-inner text entrance reveal
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

      if (timeline) {
        const stepItems = timeline.querySelectorAll<HTMLElement>('.step-item');
        stepItems.forEach((stepItem) => {
          const lines = stepItem.querySelectorAll<HTMLElement>('.line-inner');
          if (lines.length) {
            gsap.to(lines, {
              y: '0%',
              duration: 0.9,
              stagger: 0.1,
              ease: 'power3.out',
              force3D: true,
              scrollTrigger: {
                trigger: stepItem,
                start: 'top 85%',
                once: true,
              },
            });
          }
        });
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
      id="evolution-steps"
      className="w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 selection:bg-black selection:text-white transition-colors"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-16 md:gap-20">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center">
          <div className="overflow-hidden py-1 mb-3">
            <h2
              className="line-inner text-[clamp(1.75rem,3.8vw,3.2rem)] font-normal text-black leading-[1.18] tracking-tight [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Sua evolução em 5&nbsp;etapas
            </h2>
          </div>

          <div className="overflow-hidden py-1 mb-4">
            <h3
              className="line-inner text-[clamp(1.2rem,2.2vw,1.5rem)] font-medium text-neutral-900 leading-tight tracking-tight [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Uma mentoria. Cinco&nbsp;transformações.
            </h3>
          </div>

          <div className="overflow-hidden py-1">
            <p
              className="line-inner text-[clamp(1rem,1.8vw,1.25rem)] text-neutral-800 font-normal max-w-2xl mx-auto leading-relaxed [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Você não vai assistir aulas aleatórias. Vai seguir um método criado para transformar um{' '}
              <strong className="font-semibold">webdesigner comum</strong> em um profissional capaz de entregar{' '}
              <strong className="font-semibold">projetos de alto ticket</strong> e cobrar{' '}
              <strong className="font-semibold">tickets&nbsp;altos</strong>.
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div ref={timelineRef} className="max-w-3xl mx-auto w-full flex flex-col gap-12 md:gap-16">
          {STEPS.map((step) => (
            <div key={step.number} className="step-item flex flex-col items-start">
              {/* Step Number Tag */}
              <div className="overflow-hidden mb-1">
                <span
                  className="line-inner text-xs font-mono font-semibold tracking-widest text-neutral-400 uppercase block"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  Etapa {step.number}
                </span>
              </div>

              {/* Step Title with V.A.N.C.E. Letter Highlight */}
              <div className="overflow-hidden py-0.5">
                <h3
                  className="line-inner text-[clamp(1.4rem,2.5vw,2rem)] font-normal text-black tracking-tight leading-snug"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  <span className="font-bold border-b-2 border-current pb-0.5 mr-0.5">
                    {step.letter}
                  </span>
                  {step.name}
                </h3>
              </div>

              {/* Step Tagline */}
              <div className="overflow-hidden py-0.5 mt-1">
                <p
                  className="line-inner text-neutral-600 font-normal text-base sm:text-lg leading-relaxed"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  {step.tagline}
                </p>
              </div>

              {/* Step Deliverables / Topics List */}
              <div className="overflow-hidden mt-4 w-full">
                <div
                  className="line-inner flex flex-wrap gap-2.5 sm:gap-3"
                  style={{ transform: 'translateY(100%)', willChange: 'transform' }}
                >
                  {step.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-neutral-100 text-neutral-800 text-xs sm:text-sm font-medium border border-neutral-200/60"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

EvolutionStepsSection.displayName = 'EvolutionStepsSection';
export default EvolutionStepsSection;
