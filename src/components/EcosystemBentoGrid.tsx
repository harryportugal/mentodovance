import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import gsap from 'gsap';

const chatConversation = [
  { id: 1, initial: 'H', name: 'Harry', text: 'Alguém com disponibilidade pra indicação de projeto e-commerce?', isMentor: false },
  { id: 2, initial: 'V', name: 'Vance Mentor', text: 'Alunos do Módulo 5 com portfólio pronto pra te indicar agora.', isMentor: true },
  { id: 3, initial: 'L', name: 'Lucas', text: 'Fechei um projeto usando a estrutura comercial da mentoria!', isMentor: false },
  { id: 4, initial: 'S', name: 'Sofia', text: 'Os componentes da Vance Lib economizaram 15 horas na entrega.', isMentor: false },
  { id: 5, initial: 'V', name: 'Vance Mentor', text: 'Excelente progresso turma! Mantenham o foco no padrão.', isMentor: true },
];

const pixNotifications = [
  { id: 1, title: 'Transferência recebida', amount: 'R$ 27.626,99', sender: 'PAGSMILE', time: 'agora' },
  { id: 2, title: 'Pix recebido', amount: 'R$ 50.000,00', sender: 'TECH CORP SA', time: 'há 2m' },
  { id: 3, title: 'Pix recebido', amount: 'R$ 10.000,00', sender: 'AGENCIA HIGH TICKET', time: 'há 5m' },
  { id: 4, title: 'Transferência recebida', amount: 'R$ 35.000,00', sender: 'GLOBAL BRANDING INC', time: 'há 12m' },
  { id: 5, title: 'Pix recebido', amount: 'R$ 15.000,00', sender: 'E-COMMERCE LUXURY', time: 'há 18m' },
  { id: 6, title: 'Pix recebido', amount: 'R$ 60.000,00', sender: 'FUNDO DE INVESTIMENTO', time: 'há 25m' },
];

export const EcosystemBentoGrid: React.FC = () => {
  // ── Card 1: Video Timeline Progress Loop ──
  const [progress, setProgress] = useState(20);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? 10 : prev + 1.2));
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // ── Card 2: Ultra Smooth Step-by-Step Typing & Sending Chat Animation ──
  const [visibleCount, setVisibleCount] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      timeoutId = setTimeout(() => {
        setIsTyping(false);
        setVisibleCount((prev) => (prev >= chatConversation.length ? 1 : prev + 1));
      }, 1400);
    } else {
      const delay = visibleCount === 1 ? 2800 : visibleCount === chatConversation.length ? 4800 : 2400;
      timeoutId = setTimeout(() => {
        if (visibleCount >= chatConversation.length) {
          setVisibleCount(1);
        } else {
          setIsTyping(true);
        }
      }, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [visibleCount, isTyping]);

  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.to(chatContainerRef.current, {
        scrollTop: chatContainerRef.current.scrollHeight,
        duration: 0.9,
        ease: 'power3.out',
      });
    }
  }, [visibleCount, isTyping]);

  // ── Card 3: GSAP SVG Cursor & Vector Nodes Canvas ──
  const cursorRef = useRef<SVGSVGElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [activeBlock, setActiveBlock] = useState(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

    const moveTo = (x: number, y: number, blockIdx: number, delay: number) => {
      tl.to([cursor, trail], {
        x,
        y,
        duration: 1.2,
        ease: 'power3.inOut',
        stagger: 0.05,
      })
      .to(cursor, {
        scale: 0.8,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        onComplete: () => {
          setActiveBlock(blockIdx);
        },
      })
      .to({}, { duration: delay });
    };

    moveTo(18, 25, 0, 0.9);
    moveTo(108, 25, 1, 0.9);
    moveTo(198, 25, 2, 1.0);

    tl.to([cursor, trail], {
      x: 0,
      y: 0,
      duration: 1.1,
      ease: 'power3.inOut',
      stagger: 0.05,
    });

    return () => {
      tl.kill();
    };
  }, []);

  // ── Card 4: Notification Carousel Auto-Scroll Loop ──
  const notifFeedRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const notifFeed = notifFeedRef.current;
    if (!notifFeed) return;

    const tween = gsap.to(notifFeed, {
      y: '-50%',
      duration: 18,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  // ── Individual Smooth Transform Entrance Animations (No Fade) ──
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll<HTMLElement>('.bento-card');
      
      cards.forEach((card) => {
        const mockElements = card.querySelectorAll<HTMLElement>('.mock-item-animate');
        if (mockElements.length === 0) return;

        gsap.fromTo(
          mockElements,
          {
            y: 32,
            scale: 0.88,
          },
          {
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.07,
            ease: 'power3.out',
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: 'top 50%',
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={gridRef} className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4 font-sans select-none">
      {/* ── CARD 1: Gravações de todas as aulas ── */}
      <div className="bento-card relative overflow-hidden rounded-3xl p-7 sm:p-9 bg-[#0e0e0e] flex flex-col justify-between gap-8 group">
        {/* Super Minimalist Video Mockup */}
        <div className="bento-mockup relative w-full aspect-[16/10] rounded-2xl bg-[#141414] p-6 flex flex-col justify-between overflow-hidden">
          {/* Play Indicator */}
          <div className="relative flex items-center justify-center my-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="mock-item-animate relative z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white shadow-xl hover:scale-105"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
            </button>
          </div>

          {/* Fluid Progress Bar */}
          <div className="space-y-2">
            <div className="mock-item-animate flex items-center justify-between text-[11px] font-normal text-neutral-400">
              <span>Construção de Layouts</span>
              <span>18:42 / 24:18</span>
            </div>
            <div className="mock-item-animate w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-white rounded-full transition-all duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
            Gravações de todas as aulas
          </h4>
          <p className="text-base sm:text-lg font-normal text-neutral-400 leading-relaxed">
            Assista quando quiser e revise quantas vezes precisar.
          </p>
        </div>
      </div>

      {/* ── CARD 2: Comunidade exclusiva ── */}
      <div className="bento-card relative overflow-hidden rounded-3xl p-7 sm:p-9 bg-[#0e0e0e] flex flex-col justify-between gap-8">
        {/* Super Minimalist Chat Mockup */}
        <div className="bento-mockup relative w-full aspect-[16/10] rounded-2xl bg-[#141414] p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
          {/* Top & Bottom Gradient Masks for Smooth Seamless Fade */}
          <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#141414] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#141414] to-transparent z-10 pointer-events-none" />

          {/* Step-by-Step Interactive Chat Feed */}
          <div
            ref={chatContainerRef}
            className="w-full max-h-full overflow-y-auto flex flex-col my-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {chatConversation.map((msg, index) => {
              const isVisible = index < visibleCount;
              return (
                <div
                  key={msg.id}
                  className={`mock-item-animate rounded-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    msg.isMentor ? 'bg-white/10 ml-4' : 'bg-white/5'
                  } ${
                    isVisible
                      ? 'max-h-32 opacity-100 scale-100 translate-y-0 my-1 p-3'
                      : 'max-h-0 opacity-0 scale-95 translate-y-2 my-0 p-0 overflow-hidden pointer-events-none'
                  }`}
                  style={{
                    transformOrigin: msg.isMentor ? 'bottom right' : 'bottom left',
                    willChange: 'max-height, opacity, transform',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-normal text-neutral-400">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        msg.isMentor ? 'bg-white text-black font-semibold' : 'bg-white/10 text-white'
                      }`}
                    >
                      {msg.initial}
                    </span>
                    <span className={msg.isMentor ? 'text-white font-medium' : 'text-neutral-400'}>
                      {msg.name}
                    </span>
                  </div>
                  <p className={`text-xs font-normal ${msg.isMentor ? 'text-white' : 'text-neutral-200'}`}>
                    {msg.text}
                  </p>
                </div>
              );
            })}

            {/* Animated Typing Indicator Bubble (Seamless Height & Fade Unrolling) */}
            {(() => {
              const activeAuthor = chatConversation[visibleCount];
              return (
                <div
                  className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isTyping && activeAuthor
                      ? 'max-h-16 opacity-100 scale-100 translate-y-0 my-1'
                      : 'max-h-0 opacity-0 scale-95 -translate-y-1.5 my-0 pointer-events-none'
                  }`}
                  style={{ willChange: 'max-height, opacity, transform' }}
                >
                  <div
                    className={`p-2.5 rounded-xl bg-white/10 w-fit flex items-center gap-2 ${
                      activeAuthor?.isMentor ? 'ml-4' : ''
                    }`}
                  >
                    <span className="text-[10px] text-neutral-400 font-normal">
                      {activeAuthor?.name} digitando
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
            Comunidade exclusiva
          </h4>
          <p className="text-base sm:text-lg font-normal text-neutral-400 leading-relaxed">
            Troque feedbacks, faça networking e evolua junto com outros webdesigners.
          </p>
        </div>
      </div>

      {/* ── CARD 3: Projeto para portfólio ── */}
      <div className="bento-card relative overflow-hidden rounded-3xl p-7 sm:p-9 bg-[#0e0e0e] flex flex-col justify-between gap-8">
        {/* Animated Wireframe Studio Mockup */}
        <div className="bento-mockup relative w-full aspect-[16/10] rounded-2xl bg-[#141414] p-6 flex flex-col justify-between">
          {/* Interactive Wireframe Canvas Container */}
          <div className="relative my-auto w-full flex flex-col gap-3">
            {/* Smooth Trailing Glow Dot */}
            <div
              ref={trailRef}
              className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-white/40 blur-[2px] z-20 pointer-events-none"
            />

            {/* Animated SVG Mouse Cursor */}
            <svg
              ref={cursorRef}
              className="absolute top-0 left-0 w-4 h-4 text-white z-30 pointer-events-none drop-shadow-lg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 3l7 18 3-7 7-3L3 3z" />
            </svg>

            <div className="mock-item-animate h-2 w-32 bg-white/80 rounded-sm" />
            <div className="mock-item-animate h-1.5 w-full bg-white/20 rounded-sm" />
            <div className="mock-item-animate h-1.5 w-2/3 bg-white/10 rounded-sm" />

            {/* Interactive Grid Blocks with Animated Vector Corner Nodes */}
            <div className="grid grid-cols-3 gap-2 pt-2 relative">
              {[0, 1, 2].map((idx) => {
                const isActive = activeBlock === idx;
                return (
                  <div
                    key={idx}
                    className={`mock-item-animate relative h-12 rounded-lg transition-all duration-500 flex items-center justify-center ${
                      isActive ? 'bg-white/15 scale-[1.03]' : 'bg-white/5'
                    }`}
                  >
                    {/* Corner Vector Nodes when Selected */}
                    {isActive && (
                      <>
                        <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                        <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                        <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
            Projeto para portfólio
          </h4>
          <p className="text-base sm:text-lg font-normal text-neutral-400 leading-relaxed">
            Ao final da mentoria, você terá um projeto digno de mostrar para qualquer cliente.
          </p>
        </div>
      </div>

      {/* ── CARD 4: Certificação V.A.N.C.E. ── */}
      <div className="bento-card relative overflow-hidden rounded-3xl p-7 sm:p-9 bg-[#0e0e0e] flex flex-col justify-between gap-8">
        {/* Continuous Notification Carousel Mockup (Borderless) */}
        <div className="bento-mockup relative w-full aspect-[16/10] rounded-2xl bg-[#141414] p-4 sm:p-5 flex flex-col justify-between overflow-hidden">
          {/* Top & Bottom Gradient Masks for Smooth Seamless Fade */}
          <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#141414] to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#141414] to-transparent z-10 pointer-events-none" />

          {/* Rolling Notification Carousel */}
          <div className="my-auto overflow-hidden relative w-full h-full flex items-center">
            <div ref={notifFeedRef} className="flex flex-col gap-2.5 py-2 w-full">
              {[...pixNotifications, ...pixNotifications].map((notif, idx) => (
                <div
                  key={idx}
                  className="mock-item-animate bg-white/5 rounded-[16px] p-2.5 sm:p-3 flex items-center gap-2.5 w-full text-left font-sans select-none shrink-0"
                >
                  <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <img
                      src="/logo_vance_2_white.png"
                      alt="Vance"
                      className="w-full h-full object-contain"
                      style={{ filter: 'invert(1)' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 pr-0.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="text-[11px] font-semibold text-white tracking-tight truncate">
                        {notif.title}
                      </span>
                      <span className="text-[9.5px] font-normal text-white/40 shrink-0">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[10.5px] text-white/75 leading-tight mt-0.5 font-normal truncate">
                      Você recebeu uma transferência de <strong className="font-semibold text-white">{notif.amount}</strong> de {notif.sender}.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h4 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
            Certificação V.A.N.C.E.
          </h4>
          <p className="text-base sm:text-lg font-normal text-neutral-400 leading-relaxed">
            Comprove seu domínio do método e fortaleça seu posicionamento profissional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcosystemBentoGrid;
