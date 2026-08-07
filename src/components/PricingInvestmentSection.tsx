import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { ButtonWithIcon } from '@/components/ui/button-with-icon';

gsap.registerPlugin(ScrollTrigger);

const INCLUDED_FEATURES: React.ReactNode[] = [
  <><strong className="font-semibold text-white">5 encontros intensivos</strong> de mentoria ao vivo</>,
  <><strong className="font-semibold text-white">Método V.A.N.C.E. completo</strong> de engenharia visual</>,
  <><strong className="font-semibold text-white">Vance Lib vitalícia</strong> (+300 componentes e animações)</>,
  <>Mais de <strong className="font-semibold text-white">1.000 Prompts</strong> de Engenharia Visual e UI/UX</>,
  <>Acesso e análise de <strong className="font-semibold text-white">projetos nomeados no Awwwards</strong></>,
  <><strong className="font-semibold text-white">Módulo Elevation</strong>: Propostas de R$ 10.000 e vendas</>,
  <><strong className="font-semibold text-white">Comunidade fechada</strong> para networking e indicações</>,
  <>Gravações completas das aulas em <strong className="font-semibold text-white">Full HD</strong></>,
  <><strong className="font-semibold text-white">Projeto de nível internacional</strong> para compor seu portfólio</>,
  <><strong className="font-semibold text-white">Certificação oficial</strong> V.A.N.C.E. Certified</>,
];

const QUICK_HIGHLIGHTS = [
  '5 encontros',
  '+1.000 prompts',
  'Projetos Awwwards',
  'Acesso vitalício',
];

export const PricingInvestmentSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pricingCardRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);

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

      // Pricing card entrance
      if (pricingCardRef.current) {
        gsap.fromTo(
          pricingCardRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: pricingCardRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      }

      // Statement below card text reveal
      if (statementRef.current) {
        const lines = statementRef.current.querySelectorAll<HTMLElement>('.line-inner');
        gsap.to(lines, {
          y: '0%',
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const scrollToCTA = () => {
    const el = document.getElementById('perspective-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="investment"
      className="w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-black text-white font-sans select-none"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-14 md:gap-18">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <div className="overflow-hidden py-1">
            <h2
              className="line-inner text-[clamp(2rem,3.8vw,3.2rem)] font-normal text-white leading-[1.18] tracking-tight"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Quanto custa parar de disputar leilão de preço?
            </h2>
          </div>
          <div className="overflow-hidden py-1">
            <p
              className="line-inner text-base sm:text-lg text-white font-normal max-w-2xl mx-auto leading-relaxed"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              <strong className="font-semibold text-white">5 encontros intensivos</strong> para esmagar o amadorismo e transformar radicalmente a forma como você <strong className="font-semibold text-white">constrói, entrega e vende projetos de R$ 10.000+</strong>.
            </p>
          </div>
        </div>

        {/* ── Central Premium Pricing Card ── */}
        <div
          ref={pricingCardRef}
          className="w-full bg-[#0e0e0e] rounded-3xl p-7 sm:p-12 flex flex-col gap-8"
        >
          {/* Card Top Row: Title & Price + Quick Highlights Grid */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono font-semibold tracking-widest text-white uppercase">
                VANCE CLASS
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl md:text-6xl font-normal text-white tracking-tight leading-none">
                  R$ 3.000
                </span>
              </div>
            </div>

            {/* Quick Highlights Pills */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
              {QUICK_HIGHLIGHTS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-normal text-white flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-white/10 my-1" />

          {/* Included Features Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Você recebe:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {INCLUDED_FEATURES.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm sm:text-base text-white font-normal">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Statement Below Card & Final CTA Button ── */}
        <div ref={statementRef} className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="overflow-hidden py-1">
            <p
              className="line-inner text-base sm:text-lg md:text-xl text-white font-normal leading-relaxed text-balance"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Um único projeto fechado a <strong className="font-semibold text-white">R$ 10.000</strong> já paga este investimento <strong className="font-semibold text-white">mais de 3 vezes</strong> — e transforma permanentemente o seu valor de mercado.
            </p>
          </div>

          <ButtonWithIcon
            text="Quero entrar na Vance Class"
            onClick={scrollToCTA}
          />
        </div>
      </div>
    </section>
  );
};

export default PricingInvestmentSection;
