import React from 'react';

const LOGO_ITEMS = [
  {
    name: 'Google',
    src: '/logos/google.svg',
    className: 'h-6 sm:h-7 md:h-7.5',
    isMonochrome: true,
  },
  {
    name: 'Claude',
    src: '/logos/claude.png',
    className: 'h-6.5 sm:h-7.5 md:h-8',
    isMonochrome: true,
  },
  {
    name: 'Meta',
    src: '/logos/meta.svg',
    className: 'h-6 sm:h-7 md:h-7.5',
    isMonochrome: true,
  },
  {
    name: 'Amazon',
    src: '/logos/amazon.svg',
    className: 'h-6 sm:h-7 md:h-7.5',
    isMonochrome: true,
  },
  {
    name: 'Spotify',
    src: '/logos/spotify.svg',
    className: 'h-6.5 sm:h-7.5 md:h-8',
    isMonochrome: true,
  },
];

export const BrandLogosMarquee: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 py-3 select-none ${className}`}>
      {/* Label Text - Pure Black */}
      <span className="text-xs sm:text-sm font-semibold text-black shrink-0 tracking-tight whitespace-nowrap">
        Projetos para marcas de destaque
      </span>

      {/* Marquee Container - Wider Horizontal Area */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Side gradient fade masks */}
        <div className="absolute top-0 left-0 bottom-0 w-10 sm:w-14 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-10 sm:w-14 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Truly Infinite Seamless Linear Rolling Marquee */}
        <div
          className="flex w-max shrink-0 animate-marquee-left"
          style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
        >
          {/* Group 1 */}
          <div className="flex gap-8 sm:gap-11 items-center shrink-0 pr-8 sm:pr-11">
            {LOGO_ITEMS.map((item, idx) => (
              <div
                key={`g1-${item.name}-${idx}`}
                className="shrink-0 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
                title={item.name}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`${item.className} w-auto object-contain shrink-0 ${item.isMonochrome ? 'filter brightness-0' : ''}`}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Group 2 */}
          <div className="flex gap-8 sm:gap-11 items-center shrink-0 pr-8 sm:pr-11">
            {LOGO_ITEMS.map((item, idx) => (
              <div
                key={`g2-${item.name}-${idx}`}
                className="shrink-0 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
                title={item.name}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`${item.className} w-auto object-contain shrink-0 ${item.isMonochrome ? 'filter brightness-0' : ''}`}
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

export default BrandLogosMarquee;
