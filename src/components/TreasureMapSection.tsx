import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CopyText } from '@/components/CopyText';
import Spiral3DCarousel from '@/components/Spiral3DCarousel';

gsap.registerPlugin(ScrollTrigger);

export const TreasureMapSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mask1Ref = useRef<SVGPathElement>(null);
  const mask2Ref = useRef<SVGPathElement>(null);
  const trail1ContainerRef = useRef<HTMLDivElement>(null);
  const trail2ContainerRef = useRef<HTMLDivElement>(null);
  const node1Ref = useRef<HTMLDivElement>(null);
  const node2Ref = useRef<HTMLDivElement>(null);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !mask1Ref.current || !mask2Ref.current) return;

    const mask1 = mask1Ref.current;
    const mask2 = mask2Ref.current;
    const len1 = mask1.getTotalLength();
    const len2 = mask2.getTotalLength();

    // Hide masks initially
    gsap.set(mask1, { strokeDasharray: len1, strokeDashoffset: len1 });
    gsap.set(mask2, { strokeDasharray: len2, strokeDashoffset: len2 });

    const ctx = gsap.context(() => {
      // 1. Draw Trail Segment 1 (Chatbot -> Stops VERY CLOSE to Text 1)
      gsap.to(mask1, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: trail1ContainerRef.current || sectionRef.current,
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 0.5,
        },
      });

      // 2. Draw Trail Segment 2 (Below Text 1 -> Stops VERY CLOSE to Marquee Select Box)
      gsap.to(mask2, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: trail2ContainerRef.current || node1Ref.current,
          start: 'top 75%',
          end: 'bottom 35%',
          scrub: 0.5,
        },
      });

      // 3. Animate Marquee Drag-Selection Box around Statement 2
      if (selectBoxRef.current && node2Ref.current) {
        gsap.fromTo(
          selectBoxRef.current,
          {
            width: '0%',
            height: '0%',
            opacity: 0,
          },
          {
            width: '100%',
            height: '100%',
            opacity: 1,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: node2Ref.current,
              start: 'top 75%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white text-black pt-0 pb-32 md:pb-48 px-0 overflow-visible selection:bg-black selection:text-white font-sans antialiased -mt-20 md:-mt-28"
    >
      {/* Monochromatic Dot Matrix Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center px-4 md:px-8 z-20">
        {/* -------------------------------------------------------------
            SEGMENT 1 DOTTED TRAIL: Pulled closer to Chatbot bottom
            ------------------------------------------------------------- */}
        <div
          ref={trail1ContainerRef}
          className="w-full flex justify-center h-[450px] sm:h-[580px] md:h-[680px] pointer-events-none pt-0 pb-1"
        >
          <svg
            className="w-full h-full max-w-2xl"
            viewBox="0 0 400 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="dedicated-mask-1" maskUnits="userSpaceOnUse">
                <path
                  ref={mask1Ref}
                  d="M 200 0 C 200 200, 360 400, 200 680"
                  stroke="white"
                  strokeWidth="24"
                  fill="none"
                  strokeLinecap="round"
                />
              </mask>
            </defs>

            {/* Faint Guide line */}
            <path
              d="M 200 0 C 200 200, 360 400, 200 680"
              stroke="rgba(0, 0, 0, 0.07)"
              strokeWidth="2"
              strokeDasharray="4 8"
            />

            {/* Animated Dotted Trail (Ends at y = 680, stopping VERY CLOSE right above Text 1) */}
            <g mask="url(#dedicated-mask-1)">
              <path
                d="M 200 0 C 200 200, 360 400, 200 680"
                stroke="#000000"
                strokeWidth="4"
                strokeDasharray="8 12"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* -------------------------------------------------------------
            STEP 1: POSITIONING & VANCE CLASS (HTML node)
            ------------------------------------------------------------- */}
        <div ref={node1Ref} className="w-full max-w-3xl relative z-10 text-center my-4 md:my-6 pointer-events-auto">
          <CopyText startTrigger="top 85%" stagger={0.15} className="relative py-2 px-4 text-center">
            <div className="overflow-hidden py-1">
              <p className="line-inner text-2xl sm:text-3xl md:text-4xl font-medium text-black leading-relaxed tracking-tight max-w-2xl mx-auto" style={{ transform: 'translateY(110%)' }}>
                A diferença entre um freelancer que cobra{' '}
                <span className="inline-block px-2.5 py-0.5 rounded-lg bg-black/5 text-black/50 font-semibold line-through decoration-black/60 decoration-2">
                  R$650
                </span>{' '}
                e outro que cobra{' '}
                <span className="inline-block px-3 py-0.5 rounded-lg bg-black text-white font-bold">
                  R$10.000
                </span>{' '}
                raramente é técnica.
              </p>
            </div>

            <div className="overflow-hidden py-1 mt-6 pt-6 border-t border-black/10">
              <p className="line-inner text-xl sm:text-2xl md:text-3xl font-normal text-black/85 leading-relaxed tracking-tight max-w-2xl mx-auto" style={{ transform: 'translateY(110%)' }}>
                É <strong className="font-bold text-black">posicionamento</strong>,{' '}
                <strong className="font-bold text-black">portfólio</strong> e{' '}
                <strong className="font-bold text-black">percepção</strong>. E é exatamente isso que você vai construir na{' '}
                <span className="font-bold text-black border-b-2 border-black">
                  Vance Class
                </span>
                .
              </p>
            </div>
          </CopyText>
        </div>

        {/* -------------------------------------------------------------
            SEGMENT 2 DOTTED TRAIL: Balanced Sweet Spot Height (620px),
            approaching VERY CLOSE to Marquee Box (ends at y=630 in 650px viewBox)
            ------------------------------------------------------------- */}
        <div
          ref={trail2ContainerRef}
          className="w-full flex justify-center h-[400px] sm:h-[520px] md:h-[620px] pointer-events-none pt-4 pb-1"
        >
          <svg
            className="w-full h-full max-w-2xl"
            viewBox="0 0 400 650"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="dedicated-mask-2" maskUnits="userSpaceOnUse">
                <path
                  ref={mask2Ref}
                  d="M 200 0 C 140 180, 60 400, 200 630"
                  stroke="white"
                  strokeWidth="24"
                  fill="none"
                  strokeLinecap="round"
                />
              </mask>
            </defs>

            {/* Faint Guide line */}
            <path
              d="M 200 0 C 140 180, 60 400, 200 630"
              stroke="rgba(0, 0, 0, 0.07)"
              strokeWidth="2"
              strokeDasharray="4 8"
            />

            {/* Animated Dotted Trail (Ends at y = 630, stopping VERY CLOSE right above Marquee Box) */}
            <g mask="url(#dedicated-mask-2)">
              <path
                d="M 200 0 C 140 180, 60 400, 200 630"
                stroke="#000000"
                strokeWidth="4"
                strokeDasharray="8 12"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* -------------------------------------------------------------
            STEP 2: MARQUEE DRAG SELECTION BOX (HTML node)
            ------------------------------------------------------------- */}
        <div ref={node2Ref} className="w-full max-w-2xl relative z-10 text-center my-4 md:my-6 pointer-events-auto">
          <div className="relative p-6 sm:p-10 md:p-12 transition-all duration-500">
            {/* Animated Marquee Drag-Selection Rectangle */}
            <div
              ref={selectBoxRef}
              className="absolute top-0 left-0 border-2 border-dashed border-black rounded-none pointer-events-none"
              style={{ opacity: 0, width: '0%', height: '0%' }}
            >
              {/* 4 Corner handles (Design Marquee Nodes) */}
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-black border border-white rounded-none shadow-sm" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-black border border-white rounded-none shadow-sm" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-black border border-white rounded-none shadow-sm" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-black border border-white rounded-none shadow-sm" />

              {/* Animated Pointer Mouse Drag Cursor at bottom-right of selection */}
              <div className="absolute -bottom-3 -right-3 pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] z-20">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.45 0 .67-.53.35-.85L5.85 2.36a.5.5 0 0 0-.35.85z"
                    fill="black"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            {/* High-Ticket Closing Statement Content with Cascading Line Entrance */}
            <CopyText startTrigger="top 80%" stagger={0.15}>
              <div className="overflow-hidden py-1">
                <h3 className="line-inner text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-black relative z-10" style={{ transform: 'translateY(110%)' }}>
                  Isso é o que vende projetos de{' '}
                  <span className="inline-block px-3 py-1 rounded-xl bg-black text-white font-bold shadow-md">
                    R$10.000
                  </span>
                  .
                </h3>
              </div>

              <div className="overflow-hidden py-1 mt-4">
                <p className="line-inner text-black/75 text-sm sm:text-base md:text-lg font-normal max-w-lg mx-auto leading-relaxed relative z-10" style={{ transform: 'translateY(110%)' }}>
                  Sem precisar mendigar cliente, sem leilão de preço e com o portfólio trabalhando por você 24h por dia.
                </p>
              </div>
            </CopyText>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          STEP 2.5 / FOLLOW-UP: 3D SPIRAL IMAGE CAROUSEL
          Placed below Step 2 marquee selection box inside TreasureMapSection
          ------------------------------------------------------------- */}
      <div className="w-full relative z-20 mt-8 md:mt-14 overflow-visible">
        <Spiral3DCarousel />
      </div>
    </section>
  );
};

export default TreasureMapSection;
