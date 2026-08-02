import { Mail, Plus } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="relative z-10 bg-[#F6E4CF] rounded-t-[25px] py-20 md:py-32 px-6">
      {/* Top Area */}
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <p className="text-[#321C04] text-base md:text-lg leading-relaxed max-w-lg mb-8 font-normal">
          We craft tools that move with your rhythm, not over it. Designed for ease, presence, and flow.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Say Hello Button */}
          <button className="bg-[#321C04] text-[#FFF9F2] rounded-full px-5 py-2.5 flex items-center gap-3 hover:bg-[#1F1003] transition-colors cursor-pointer group">
            <span className="w-7 h-7 rounded-full bg-[#FFF9F2] flex items-center justify-center text-[#321C04]">
              <Mail size={16} />
            </span>
            <span className="uppercase tracking-wide font-medium text-xs sm:text-sm">
              Say hello
            </span>
          </button>

          {/* Stay Informed Button */}
          <button className="bg-[#D9C4AA] text-[#321C04] rounded-full px-5 py-2.5 flex items-center gap-3 hover:bg-[#CEBA9E] transition-colors cursor-pointer group">
            <span className="w-7 h-7 rounded-full bg-[#FFF9F2] flex items-center justify-center text-[#321C04]">
              <Plus size={16} />
            </span>
            <span className="uppercase tracking-wide font-medium text-xs sm:text-sm">
              Stay informed
            </span>
          </button>
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="my-16 md:my-24 flex items-center w-full gap-[2px]">
        <div className="w-2 h-2 rounded-full bg-[#D9C4AA] shrink-0" />
        <div className="flex-1 h-[2px] bg-[#D9C4AA]" />
        <div className="w-2 h-2 rounded-full bg-[#D9C4AA] shrink-0" />
      </div>

      {/* Bottom Area */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16">
        {/* Left Column: Brand Mark */}
        <div className="flex items-start gap-4 md:flex-col md:gap-3 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 256 256"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 256 256 L 178 256 C 150.386 256 128 233.614 128 206 L 128 256 L 0 256 L 0 192 C 0 156.654 28.654 128 64 128 C 99.346 128 128 156.654 128 192 L 128 128 L 256 128 Z M 78 0 C 105.614 0 128 22.386 128 50 L 128 0 L 256 0 L 256 64 C 256 99.346 227.346 128 192 128 C 156.654 128 128 99.346 128 64 L 128 128 L 0 128 L 0 0 Z"
              fill="#321C04"
            />
          </svg>
          <div className="text-xs uppercase tracking-widest font-semibold text-[#321C04] leading-tight">
            CALM /<br />AMPLIFIED
          </div>
        </div>

        {/* Right Column: Statement */}
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-[1.3] font-normal text-[#321C04] max-w-4xl">
          We make AI tools and assistants. But, most importantly, we help you remember what gentle productivity looks like when software moves with you, not over you. We create systems that carry the cognitive weight, so you can attend to what truly counts.
        </p>
      </div>
    </section>
  );
};
