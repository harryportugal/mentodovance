import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, CheckCircle2 } from 'lucide-react';

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
    afterTitle: 'Plataforma Premium Vance',
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
      className="w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-black text-white font-sans select-none"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-16 md:gap-24">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <div className="overflow-hidden py-1">
            <h2
              className="line-inner text-[clamp(2rem,3.8vw,3.2rem)] font-normal text-white leading-[1.18] tracking-tight"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Não acredite na gente. Veja quem já passou por aqui.
            </h2>
          </div>
        </div>

        {/* ── Showcase Testimonial Feature (Vídeo / Print Grande) ── */}
        <div
          ref={showcaseCardRef}
          className="w-full bg-[#0e0e0e] rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          {/* Video / Showcase Media Mockup Container */}
          <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl bg-[#141414] p-6 relative overflow-hidden flex flex-col justify-between group">
            {/* Play Button Center Overlay */}
            <div className="relative z-10 my-auto flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white shadow-2xl backdrop-blur-sm cursor-pointer hover:scale-105">
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              </div>
            </div>

            {/* Inner Video Mockup Details */}
            <div className="relative z-10 flex items-center justify-between text-xs text-white/90 font-normal">
              <span>Showcase de Aluno</span>
              <span className="flex items-center gap-1 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Verificado
              </span>
            </div>
          </div>

          {/* Quote & Student Information */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-6">
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-normal text-white leading-snug tracking-tight">
              “Antes eu cobrava <strong className="font-semibold text-white">R$ 600 por projeto</strong>. Hoje fecho contratos de <strong className="font-semibold text-white">R$ 10.000</strong> sem que o cliente questione o preço.”
            </blockquote>

            <div className="flex items-center gap-3.5 pt-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-base shrink-0">
                LV
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-white tracking-tight">
                  Lucas Vance
                </span>
                <span className="text-xs text-white/90 font-normal">
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
              <span className="text-xs sm:text-sm text-white/90 font-normal leading-snug">
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
                className="line-inner text-[clamp(1.8rem,3.2vw,2.6rem)] font-normal text-white leading-tight tracking-tight"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                Do primeiro projeto ao portfólio premium.
              </h3>
            </div>
            <div className="overflow-hidden py-1">
              <p
                className="line-inner text-base sm:text-lg text-white/90 font-normal max-w-xl mx-auto leading-relaxed"
                style={{ transform: 'translateY(100%)', willChange: 'transform' }}
              >
                A evolução prática que transforma <strong className="font-semibold text-white">trabalhos simples</strong> em <strong className="font-semibold text-white">produções de alto valor</strong>.
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
                  <span className="text-xs text-white/80 font-normal">
                    {comp.studentRole}
                  </span>
                </div>

                {/* Before vs After Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before Box */}
                  <div className="bg-[#141414] rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>Antes</span>
                      <span className="font-semibold text-white">{comp.beforePrice}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-medium text-white tracking-tight">
                        {comp.beforeTitle}
                      </h4>
                      <p className="text-xs text-white/80 leading-relaxed font-normal">
                        {comp.beforeDesc}
                      </p>
                    </div>
                  </div>

                  {/* After Box */}
                  <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between text-xs text-white font-medium">
                      <span>Depois (Vance)</span>
                      <span className="font-semibold text-white">{comp.afterPrice}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold text-white tracking-tight">
                        {comp.afterTitle}
                      </h4>
                      <p className="text-xs text-white/90 leading-relaxed font-normal">
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
