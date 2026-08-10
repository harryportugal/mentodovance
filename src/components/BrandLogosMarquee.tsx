import React from 'react';

const LOGO_ITEMS = [
  {
    name: 'Google',
    src: '/logos/google.svg',
    className: 'h-7 sm:h-7 md:h-7.5',
    isMonochrome: true,
  },
  {
    name: 'Claude',
    src: '/logos/claude.png',
    className: 'h-7.5 sm:h-7.5 md:h-8',
    isMonochrome: true,
  },
  {
    name: 'Meta',
    src: '/logos/meta.svg',
    className: 'h-7 sm:h-7 md:h-7.5',
    isMonochrome: true,
  },
  {
    name: 'Amazon',
    src: '/logos/amazon.svg',
    className: 'h-7 sm:h-7 md:h-7.5',
    isMonochrome: true,
  },
  {
    name: 'Spotify',
    src: '/logos/spotify.svg',
    className: 'h-7.5 sm:h-7.5 md:h-8',
    isMonochrome: true,
  },
];

export const BrandLogosMarquee: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-5 py-1 sm:py-2.5 select-none text-center sm:text-left ${className}`}>
      {/* Label Text - Pure Black */}
      <span className="text-xs sm:text-sm font-semibold text-black shrink-0 tracking-tight whitespace-nowrap text-center sm:text-left">
        Projetos para marcas de destaque
      </span>

      {/* Marquee Container - Wider Horizontal Area */}
      <div className="relative flex-1 w-full overflow-hidden h-9 sm:h-8 max-h-9 sm:max-h-8 pt-[5px] sm:pt-0">
        {/* Side gradient fade masks */}
        <div className="absolute top-0 left-0 bottom-0 w-8 sm:w-14 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-8 sm:w-14 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Truly Infinite Seamless Linear Rolling Marquee */}
        <div
          className="flex w-max shrink-0 items-center animate-marquee-left h-full"
          style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
        >
          {/* Group 1 */}
          <div className="flex gap-7 sm:gap-11 items-center shrink-0 pr-7 sm:pr-11 h-full">
            {LOGO_ITEMS.map((item, idx) => (
              <div
                key={`g1-${item.name}-${idx}`}
                className="shrink-0 h-8 max-h-8 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
                title={item.name}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`${item.className} w-auto max-w-[110px] sm:max-w-[120px] object-contain shrink-0 ${item.isMonochrome ? 'filter brightness-0' : ''}`}
                  style={{ height: '33px', maxHeight: '33px', width: 'auto' }}
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Group 2 */}
          <div className="flex gap-7 sm:gap-11 items-center shrink-0 pr-7 sm:pr-11 h-full">
            {LOGO_ITEMS.map((item, idx) => (
              <div
                key={`g2-${item.name}-${idx}`}
                className="shrink-0 h-8 max-h-8 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity duration-300"
                title={item.name}
              >
                <img
                  src={item.src}
                  alt={item.name}
                  className={`${item.className} w-auto max-w-[110px] sm:max-w-[120px] object-contain shrink-0 ${item.isMonochrome ? 'filter brightness-0' : ''}`}
                  style={{ height: '33px', maxHeight: '33px', width: 'auto' }}
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
