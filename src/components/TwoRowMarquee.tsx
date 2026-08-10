import React from 'react';

const ROW_1_IMAGES = [
  '/espiral/Captura%20de%20tela%202026-08-03%20093350.png',
  '/espiral/atelier.png',
  '/espiral/rcem.png',
  '/espiral/nike.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20094556.png',
];

const ROW_2_IMAGES = [
  '/espiral/ovni.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20093426.png',
  '/espiral/sylvaara.png',
  '/espiral/Captura%20de%20tela%202026-08-03%20094306.png',
  '/espiral/atelier.png',
];

export const TwoRowMarquee: React.FC<{ className?: string }> = ({ className = '' }) => {
  const row1List = [...ROW_1_IMAGES, ...ROW_1_IMAGES, ...ROW_1_IMAGES, ...ROW_1_IMAGES];
  const row2List = [...ROW_2_IMAGES, ...ROW_2_IMAGES, ...ROW_2_IMAGES, ...ROW_2_IMAGES];

  return (
    <div className={`w-full overflow-hidden relative py-3 sm:py-4 my-3 sm:my-6 select-none ${className}`}>
      {/* Side gradient fade masks */}
      <div className="absolute top-0 left-0 bottom-0 w-10 sm:w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-10 sm:w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
        {/* Row 1 — Scroll Left */}
        <div className="w-full overflow-hidden flex">
          <div className="flex gap-3 sm:gap-4 md:gap-5 shrink-0 animate-marquee-left">
            {row1List.map((src, idx) => (
              <div
                key={`r1-${idx}`}
                className="relative overflow-hidden rounded-lg md:rounded-2xl shadow-sm w-[240px] sm:w-[320px] md:w-[380px] aspect-[16/9] shrink-0 bg-neutral-100 group"
              >
                <img
                  src={src}
                  alt={`Portfolio preview row 1 item ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — Scroll Right */}
        <div className="w-full overflow-hidden flex">
          <div className="flex gap-3 sm:gap-4 md:gap-5 shrink-0 animate-marquee-right">
            {row2List.map((src, idx) => (
              <div
                key={`r2-${idx}`}
                className="relative overflow-hidden rounded-lg md:rounded-2xl shadow-sm w-[240px] sm:w-[320px] md:w-[380px] aspect-[16/9] shrink-0 bg-neutral-100 group"
              >
                <img
                  src={src}
                  alt={`Portfolio preview row 2 item ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoRowMarquee;
