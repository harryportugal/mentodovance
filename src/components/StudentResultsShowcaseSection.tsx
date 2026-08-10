import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StudentMetric {
  value: string;
  label: string;
}

const METRICS: StudentMetric[] = [
  { value: 'R$ 50.000+', label: 'faturamento acumulado' },
  { value: 'R$ 10.000', label: 'projeto fechado' },
  { value: '3 meses', label: 'na área' },
  { value: '+400%', label: 'aumento de ticket' },
];

interface ComparisonItem {
  id: number;
  studentName: string;
  studentRole: string;
  beforeTitle: string;
  beforePrice: string;
  beforeDesc: React.ReactNode;
  afterTitle: string;
  afterPrice: string;
  afterDesc: React.ReactNode;
}

const COMPARISONS: ComparisonItem[] = [
  {
    id: 1,
    studentName: 'Lucas Vance',
    studentRole: 'UI/UX Designer',
    beforeTitle: 'Site Institucional Básico',
    beforePrice: 'R$ 600',
    beforeDesc: <>Layout genérico <strong className="font-semibold text-white">sem hierarquia visual</strong> e sem direção de arte.</>,
    afterTitle: 'Landing Page Cinematográfica',
    afterPrice: 'R$ 10.000',
    afterDesc: <>Experiência imersiva <strong className="font-semibold text-white">3D com GSAP</strong>, <strong className="font-semibold text-white">microinterações</strong> e <strong className="font-semibold text-white">alta conversão</strong>.</>,
  },
  {
    id: 2,
    studentName: 'Beatriz Lima',
    studentRole: 'Webdesigner Freelancer',
    beforeTitle: 'Template Pronto',
    beforePrice: 'R$ 800',
    beforeDesc: <>Propostas disputadas em <strong className="font-semibold text-white">leilão de preço</strong> no mercado comum.</>,
    afterTitle: 'Plataforma High-Ticket Vance',
    afterPrice: 'R$ 12.000',
    afterDesc: <><strong className="font-semibold text-white">Posicionamento internacional</strong> onde o próprio <strong className="font-semibold text-white">portfólio vende o projeto</strong>.</>,
  },
];

export const StudentResultsShowcaseSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const showcaseCardRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const comparisonHeaderRef = useRef<HTMLDivElement>(null);
  const comparisonGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header line-inner text reveal
      if (headerRef.current) {
        const lines = headerRef.current.querySelectorAll<HTMLElement>('.line-inner');
        gsap.to(lines, {
          y: '0%',
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      // Showcase card entrance
      if (showcaseCardRef.current) {
        gsap.fromTo(
          showcaseCardRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: showcaseCardRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Metrics strip entrance
      if (metricsRef.current) {
        const items = metricsRef.current.querySelectorAll<HTMLElement>('.metric-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: metricsRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Comparison section text reveal
      if (comparisonHeaderRef.current) {
        const lines = comparisonHeaderRef.current.querySelectorAll<HTMLElement>('.line-inner');
        gsap.to(lines, {
          y: '0%',
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: comparisonHeaderRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }

      // Comparison grid cards entrance
      if (comparisonGridRef.current) {
        const cards = comparisonGridRef.current.querySelectorAll<HTMLElement>('.comparison-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: comparisonGridRef.current,
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
      ref={sectionRef}
      id="student-results"
      className="w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-24 bg-black text-white font-sans select-none"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-16 md:gap-24">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <div className="overflow-hidden py-1">
            <h2
              className="line-inner text-[clamp(1.75rem,3.8vw,3.2rem)] font-normal text-white leading-[1.18] tracking-tight [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Não acredite na gente. Veja quem já passou por&nbsp;aqui.
            </h2>
          </div>
        </div>

        {/* ── Showcase Testimonial Feature (Monocromático, Cor Sólida, Sem Pill, Sem Contorno/Degradê/Verde) ── */}
        <div
          ref={showcaseCardRef}
          className="w-full bg-[#0e0e0e] rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col gap-6 sm:gap-8"
        >
          {/* Quote & Student Information */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <blockquote className="text-xl sm:text-3xl lg:text-4xl font-normal text-white leading-relaxed tracking-tight [text-wrap:balance]">
              “Antes eu cobrava <strong className="font-semibold text-white">R$ 600 por projeto</strong>. Hoje fecho contratos de <strong className="font-semibold text-white">R$ 10.000</strong> sem que o cliente questione o&nbsp;preço.”
            </blockquote>

            <div className="flex items-center gap-3.5 sm:gap-4 pt-1 sm:pt-2">
              <img
                src="/favicon.svg"
                alt="Lucas Vance"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain shrink-0 bg-white/10 p-2 sm:p-2.5"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-semibold text-white tracking-tight">
                  Lucas Vance
                </span>
                <span className="text-sm text-white font-normal">
                  @lucaswebdesign • Aluno Vance Class
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Faixa de 4 Resultados Fortes (Metrics Strip) ── */}
        <div ref={metricsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
          {METRICS.map((metric, idx) => (
            <div
              key={idx}
              className="metric-item bg-[#0e0e0e] rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6 min-h-[140px]"
            >
              <span className="text-2xl sm:text-3xl lg:text-[34px] font-normal text-white tracking-tight whitespace-nowrap leading-none">
                {metric.value}
              </span>
              <span className="text-xs sm:text-sm text-white font-normal leading-snug">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Before -> After Grid (Do primeiro projeto ao portfólio premium) ── */}
        <div className="flex flex-col gap-12">
          {/* Subtitle Header */}
          <div ref={comparisonHeaderRef} className="max-w-3xl mx-auto text-center flex flex-col gap-3">
            <div className="overflow-hidden py-1">
              <h3
                className="line-inner text-[clamp(1.8rem,3.2vw,2.6rem)] font-normal text-white leading-tight tracking-tight [text-wrap:balance]"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                Do primeiro projeto ao portfólio de alto&nbsp;ticket.
              </h3>
            </div>
            <div className="overflow-hidden py-1">
              <p
                className="line-inner text-base sm:text-lg text-white font-normal max-w-xl mx-auto leading-relaxed [text-wrap:balance]"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                A evolução prática que transforma <strong className="font-semibold text-white">trabalhos simples</strong> em <strong className="font-semibold text-white">produções de alto&nbsp;valor</strong>.
              </p>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div ref={comparisonGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
            {COMPARISONS.map((comp) => (
              <div
                key={comp.id}
                className="comparison-card bg-[#0e0e0e] rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6"
              >
                {/* Author Banner */}
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm font-semibold text-white tracking-tight">
                    {comp.studentName}
                  </span>
                  <span className="text-xs text-white font-normal">
                    {comp.studentRole}
                  </span>
                </div>

                {/* Before vs After Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Box */}
                  <div className="bg-[#141414] rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span>Antes</span>
                      <span className="font-semibold text-white">{comp.beforePrice}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-medium text-white tracking-tight">
                        {comp.beforeTitle}
                      </h4>
                      <p className="text-xs text-white leading-relaxed font-normal">
                        {comp.beforeDesc}
                      </p>
                    </div>
                  </div>

                  {/* After Box */}
                  <div className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between text-xs text-white font-medium">
                      <span>Depois (Vance)</span>
                      <span className="font-semibold text-white">{comp.afterPrice}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold text-white tracking-tight">
                        {comp.afterTitle}
                      </h4>
                      <p className="text-xs text-white leading-relaxed font-normal">
                        {comp.afterDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default StudentResultsShowcaseSection;
