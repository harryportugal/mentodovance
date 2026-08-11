import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CopyText } from '@/components/CopyText';
import { AnimatedChatInput } from '@/components/AnimatedChatInput';
import { ImageMouseTrail } from '@/components/ui/image-mousetrail';

gsap.registerPlugin(ScrollTrigger);

interface PixNotification {
  id: number;
  bank: string;
  logoText: string;
  title: string;
  amount: string;
  sender: string;
  time: string;
}

const pixNotifications: PixNotification[] = [
  { id: 1, bank: 'Nubank', logoText: 'nu', title: 'Transferência recebida', amount: 'R$ 27.626,99', sender: 'PAGSMILE', time: 'agora' },
  { id: 2, bank: 'Nubank', logoText: 'nu', title: 'Pix recebido', amount: 'R$ 50.000,00', sender: 'TECH CORP SA', time: 'há 2m' },
  { id: 3, bank: 'Banco Inter', logoText: 'i', title: 'Pix recebido', amount: 'R$ 10.000,00', sender: 'AGENCIA HIGH TICKET', time: 'há 5m' },
  { id: 4, bank: 'Nubank', logoText: 'nu', title: 'Transferência recebida', amount: 'R$ 35.000,00', sender: 'GLOBAL BRANDING INC', time: 'há 12m' },
  { id: 5, bank: 'C6 Bank', logoText: 'C6', title: 'Pix recebido', amount: 'R$ 15.000,00', sender: 'E-COMMERCE LUXURY', time: 'há 18m' },
  { id: 6, bank: 'XP', logoText: 'XP', title: 'Pix recebido', amount: 'R$ 60.000,00', sender: 'FUNDO DE INVESTIMENTO', time: 'há 25m' },
  { id: 7, bank: 'BTG Pactual', logoText: 'BTG', title: 'Pix recebido', amount: 'R$ 40.000,00', sender: 'CONSULTORIA PREMIUM', time: 'há 35m' },
  { id: 8, bank: 'Nubank', logoText: 'nu', title: 'Transferência recebida', amount: 'R$ 25.000,00', sender: 'STARTUP AI CORP', time: 'há 45m' },
];

const HangingNote = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imgRef.current) return;

    const ctx = gsap.context(() => {
      // Set pivot at top center of string
      gsap.set(imgRef.current, { transformOrigin: '50% 0%' });

      // 1. Initial Descent Animation
      gsap.fromTo(
        imgRef.current,
        {
          y: '-150%',
          opacity: 0,
          rotate: -4,
        },
        {
          y: '0%',
          opacity: 1,
          rotate: 3.5,
          duration: 2.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 50%',
            once: true,
          },
          onComplete: () => {
            // 2. Continuous Pendulum Sway around top pivot
            gsap.to(imgRef.current, {
              rotate: -3.5,
              duration: 2.6,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center items-center overflow-visible"
    >
      <div
        className="relative flex justify-center items-center"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 14%, black 100%)',
        }}
      >
        <img
          ref={imgRef}
          src="/nota.png"
          alt="Nota no gancho"
          className="h-[200px] sm:h-[460px] md:h-[560px] w-auto object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.18)]"
          style={{ transform: 'translateY(-150%)', opacity: 0, transformOrigin: '50% 0%' }}
        />
      </div>
    </div>
  );
};

export const PerspectiveGridSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridWrapRef = useRef<HTMLDivElement>(null);

  const itemRandoms = useMemo(() => {
    return pixNotifications.map((_, i) => ({
      zStart: -250 - i * 120,
      yEnd: -420 + i * 40,
    }));
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    const gridWrap = gridWrapRef.current;
    const container = containerRef.current;
    const whiteOverlay = whiteOverlayRef.current;
    if (!grid || !gridWrap || !container || !whiteOverlay) return;

    const gridItems = gridWrap.querySelectorAll<HTMLDivElement>('.perspective-grid-item');
    if (!gridItems.length) return;

    grid.style.setProperty('--grid-width', '100%');
    grid.style.setProperty('--perspective', '1400px');
    grid.style.setProperty('--grid-columns', '1');
    grid.style.setProperty('--grid-gap', '0.75rem');

    gsap.set(gridWrap, { force3D: true, willChange: 'transform' });
    gsap.set(whiteOverlay, { opacity: 0, willChange: 'opacity' });

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none', force3D: true },
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=160%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      gridItems.forEach((item, index) => {
        const rand = itemRandoms[index];
        gsap.set(item, {
          transformOrigin: '50% 50%',
          z: rand.zStart,
          xPercent: 0,
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          opacity: 1,
          force3D: true,
        });
      });

      gridItems.forEach((item, index) => {
        const rand = itemRandoms[index];
        timeline.to(item, {
          yPercent: rand.yEnd,
          opacity: 1,
          force3D: true,
        }, 0);
      });

      timeline.to(gridWrap, {
        z: 3200,
        scale: 1.05,
        force3D: true,
      }, 0);

      timeline.to(whiteOverlay, {
        opacity: 1,
        duration: 0.2,
        ease: 'power1.out',
      }, 0.35);
    }, container);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
      gsap.set(gridWrap, { willChange: 'auto' });
      gsap.set(gridItems, { willChange: 'auto' });
      gsap.set(whiteOverlay, { willChange: 'auto' });
    };
  }, [itemRandoms]);

  return (
    <section
      ref={containerRef}
      className="relative z-30 min-h-screen bg-black text-white pt-4 md:pt-8 pb-32 flex flex-col items-center justify-start overflow-visible"
    >
      <div
        ref={whiteOverlayRef}
        className="absolute inset-0 bg-white pointer-events-none z-0"
        style={{ opacity: 0, willChange: 'opacity', transform: 'translateZ(0)' }}
      />

      <div className="relative w-full z-10">
        <CopyText startTrigger="top 90%" delay={0.1} className="relative pt-2 md:pt-4 z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 pointer-events-auto">
          <h2 className="text-2xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.15] text-white [text-wrap:balance]">
            <span className="block overflow-hidden py-1">
              <span className="line-inner block">
                Projetos de <span className="font-semibold underline decoration-current underline-offset-8">R$&nbsp;10.000</span> exigem posicionamento visual&nbsp;cinematográfico.
              </span>
            </span>
          </h2>
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto mt-4 font-normal leading-relaxed [text-wrap:balance]">
            <span className="block overflow-hidden py-1">
              <span className="line-inner block">
                Enquanto outros disputam trocados, seu portfólio gera notificações diárias de pagamentos de&nbsp;alto&nbsp;valor.
              </span>
            </span>
          </p>
        </CopyText>
      </div>

      <div
        ref={gridRef}
        className="perspective-grid relative w-full overflow-visible z-30 mt-4 md:mt-6 max-w-[360px] mx-auto"
      >
        <div
          ref={gridWrapRef}
          className="perspective-grid-wrap w-full pointer-events-auto overflow-visible"
        >
          {pixNotifications.map((notif) => (
            <div
              key={notif.id}
              className="perspective-grid-item bg-[#0c0c0e] border border-white/12 rounded-[16px] p-2.5 sm:p-3 flex items-center gap-2.5 w-full max-w-[330px] mx-auto text-left font-sans select-none !opacity-100 z-30"
            >
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden p-1">
                <img
                  src="/logo_vance_2_white.png"
                  alt="Vance"
                  className="w-full h-full object-contain"
                  style={{ filter: 'invert(1)' }}
                />
              </div>
              <div className="flex-1 min-w-0 pr-0.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[11.5px] sm:text-[12px] font-semibold text-white tracking-tight truncate">
                    {notif.title}
                  </span>
                  <span className="text-[10px] font-normal text-white/40 shrink-0">
                    {notif.time}
                  </span>
                </div>
                <p className="text-[10.5px] sm:text-[11px] text-white/75 leading-tight mt-0.5 font-normal truncate">
                  Você recebeu uma transferência de <strong className="font-semibold text-white">{notif.amount}</strong> de {notif.sender}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageMouseTrail className="relative z-40 w-full overflow-visible">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-36 md:mt-48 pb-24 pointer-events-auto">
          <CopyText startTrigger="top 75%" stagger={0.25} delay={0.1} className="text-center mb-8 md:mb-14">
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-normal tracking-tight text-black leading-[1.15] [text-wrap:balance]">
              <span className="block overflow-hidden py-1">
                <span className="line-inner block">
                  Você não está perdendo clientes. <span className="font-semibold text-black">Você está parecendo&nbsp;barato.</span>
                </span>
              </span>
            </h2>
          </CopyText>

          <div className="relative w-full h-[460px] sm:h-[700px] md:h-[800px] max-w-5xl mx-auto my-2 sm:my-8">
            <HangingNote />

            {[
              <>Seu portfólio parece <strong className="font-semibold text-black">igual ao de todo mundo</strong>.</>,
              <>Você vive <strong className="font-semibold text-black">prospectando</strong>.</>,
              <>Seu cliente <strong className="font-semibold text-black">negocia preço</strong>.</>,
              <>Você <strong className="font-semibold text-black">trabalha muito</strong> e ganha pouco.</>,
              <>Enquanto isso, outros <strong className="font-semibold text-black">cobram 10x mais</strong>.</>,
              <>Seu portfólio parece <strong className="font-semibold text-black">igual ao de todo mundo</strong>.</>,
              <>Você vive <strong className="font-semibold text-black">prospectando</strong>.</>,
              <>Seu cliente <strong className="font-semibold text-black">negocia preço</strong>.</>,
            ].map((phrase, idx, arr) => {
              const total = arr.length;
              const angleDeg = -90 + (idx * 360) / total;
              const angleRad = (angleDeg * Math.PI) / 180;
              const rx = 34;
              const ry = 36;

              const left = 50 + rx * Math.cos(angleRad);
              const top = 50 + ry * Math.sin(angleRad);
              const delay = 0.15 + idx * 0.09;

              let alignClass = 'text-center';
              if (left > 55) alignClass = 'text-left';
              else if (left < 45) alignClass = 'text-right';

              return (
                <div
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-[115px] sm:w-[220px] md:w-[260px] z-10"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <CopyText startTrigger="top 85%" delay={delay} className={alignClass}>
                    <p className="overflow-hidden py-0.5 text-[10.5px] sm:text-base md:text-lg font-normal text-black/85 leading-tight sm:leading-snug">
                      <span className="line-inner block">{phrase}</span>
                    </p>
                  </CopyText>
                </div>
              );
            })}
          </div>

          <div className="pt-8 sm:pt-0">
            <CopyText startTrigger="top 85%" delay={0.9} className="text-center mt-12 md:mt-16">
              <div className="overflow-hidden py-1">
                <h3 className="line-inner text-5xl sm:text-8xl md:text-[7.5rem] lg:text-[9rem] font-semibold text-black tracking-tight drop-shadow-sm leading-tight md:leading-none flex flex-wrap items-center justify-center">
                  <span>Por quê?</span>
                  <span className="block sm:inline-block font-normal text-transparent bg-clip-text bg-gradient-to-r from-black via-zinc-600 to-zinc-400 text-3xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] ml-0 sm:ml-4 mt-1 sm:mt-0">
                    Você hoje:
                  </span>
                </h3>
              </div>
            </CopyText>

            {/* Animated AI Chat Input Component */}
            <div className="mt-8 md:mt-12">
              <AnimatedChatInput />
            </div>
          </div>
        </div>
      </ImageMouseTrail>
    </section>
  );
};

export default PerspectiveGridSection;
