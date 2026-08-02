import { useState } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Floating Navbar Pill */}
      <nav className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center justify-between gap-10 min-w-[220px] border border-black/5">
        <a href="#" className="text-lg font-bold tracking-tight text-black select-none">
          Drift.
        </a>

        {/* Animated Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-6 h-6 flex flex-col justify-center items-center gap-[6px] focus:outline-none group cursor-pointer"
          aria-label="Toggle Menu"
        >
          <span
            className={`w-5 h-[2px] bg-black rounded-full transition-transform duration-300 origin-center ${
              isOpen ? 'rotate-45 translate-y-[4px]' : ''
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
          />
          <span
            className={`w-5 h-[2px] bg-black rounded-full transition-transform duration-300 origin-center ${
              isOpen ? '-rotate-45 -translate-y-[4px]' : ''
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)' }}
          />
        </button>
      </nav>

      {/* Dropdown Menu */}
      <div
        className={`mt-2 w-48 bg-white rounded-2xl shadow-xl p-3 flex flex-col gap-1 border border-black/5 transition-all duration-300 origin-top ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <a
          href="#features"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100/80 rounded-xl transition-colors text-center"
        >
          Features
        </a>
        <a
          href="#about"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100/80 rounded-xl transition-colors text-center"
        >
          Drift AI
        </a>
        <a
          href="#about"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100/80 rounded-xl transition-colors text-center"
        >
          FAQ
        </a>
      </div>
    </div>
  );
};
