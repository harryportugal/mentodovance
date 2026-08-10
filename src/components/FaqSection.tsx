import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: 'Preciso saber programar?',
    answer: (
      <>
        Não. A mentoria foi desenhada tanto para quem está começando quanto para quem deseja dominar a construção visual e o desenvolvimento de interfaces de alto nível. Você aprenderá a estrutura <strong className="font-semibold text-white">do zero até a entrega final</strong>.
      </>
    ),
  },
  {
    question: 'A mentoria é ao vivo?',
    answer: (
      <>
        Os encontros principais acontecem ao vivo com acompanhamento direto, além de acesso às <strong className="font-semibold text-white">gravações completas em Full HD</strong> de todas as aulas para você rever quando quiser.
      </>
    ),
  },
  {
    question: 'Tenho pouca experiência. Posso participar?',
    answer: (
      <>
        Sim. O método V.A.N.C.E. foi estruturado passo a passo, desde o alinhamento de visão e arquitetura até a execução de <strong className="font-semibold text-white">projetos cinematográficos</strong>.
      </>
    ),
  },
  {
    question: 'Vou sair com um projeto para o portfólio?',
    answer: (
      <>
        Sim — o desenvolvimento e a finalização de um <strong className="font-semibold text-white">projeto completo de alto valor</strong> fazem parte da estrutura oficial da mentoria para compor o seu portfólio.
      </>
    ),
  },
  {
    question: 'Tenho acesso à Vance Lib?',
    answer: (
      <>
        Sim — você terá acesso exclusivo à biblioteca com <strong className="font-semibold text-white">300+ componentes e animações</strong> prontas para acelerar drasticamente suas entregas.
      </>
    ),
  },
  {
    question: 'Por quanto tempo tenho acesso aos materiais?',
    answer: (
      <>
        Você terá acesso completo às gravações e materiais da mentoria por <strong className="font-semibold text-white">1 ano</strong>, permitindo revisar cada etapa conforme evolui na carreira.
      </>
    ),
  },
  {
    question: 'A mentoria me ensina a conseguir clientes?',
    answer: (
      <>
        Sim — através do módulo <strong className="font-semibold text-white">Elevation</strong>, você aprenderá estratégias reais de posicionamento premium, propostas comerciais de alto ticket, precificação e vendas.
      </>
    ),
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const faqContainerRef = useRef<HTMLDivElement>(null);

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

      // FAQ accordion items entrance
      if (faqContainerRef.current) {
        const items = faqContainerRef.current.querySelectorAll<HTMLElement>('.faq-item');
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: faqContainerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-16 lg:px-24 bg-black text-white font-sans select-none"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-14 md:gap-18">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center flex flex-col gap-3">
          <div className="overflow-hidden py-1">
            <h2
              className="line-inner text-[clamp(1.75rem,3.8vw,3.2rem)] font-normal text-white leading-[1.18] tracking-tight [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Ainda ficou alguma&nbsp;dúvida?
            </h2>
          </div>
          <div className="overflow-hidden py-1">
            <p
              className="line-inner text-base sm:text-lg text-white/90 font-normal max-w-xl mx-auto leading-relaxed [text-wrap:balance]"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Respostas diretas para as <strong className="font-semibold text-white">perguntas mais comuns</strong> sobre a Vance&nbsp;Class.
            </p>
          </div>
        </div>

        {/* ── FAQ Accordion List ── */}
        <div ref={faqContainerRef} className="w-full flex flex-col gap-4">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="faq-item bg-[#0e0e0e] rounded-2xl p-6 sm:p-7 transition-all duration-300 cursor-pointer"
                onClick={() => toggleItem(idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg sm:text-xl font-normal text-white tracking-tight [text-wrap:balance]">
                    {faq.question}
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-white/20' : ''
                    }`}
                  >
                    <ChevronDown className="w-4.5 h-4.5 text-white" />
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'max-h-60 opacity-100 mt-4 pt-4 border-t border-white/10' : 'max-h-0 opacity-0 mt-0 pt-0'
                  }`}
                >
                  <p className="text-sm sm:text-base text-white/90 font-normal leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
