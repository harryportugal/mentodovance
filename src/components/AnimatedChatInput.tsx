import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ClaudeChatInput from '@/components/ui/ClaudeChatInput';

gsap.registerPlugin(ScrollTrigger);

export const AnimatedChatInput = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !cardRef.current) return;

    const ctx = gsap.context(() => {
      // Physical slide entrance of Chatbot container
      gsap.fromTo(
        cardRef.current,
        {
          y: 45,
        },
        {
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto mt-6 sm:mt-[80px] md:mt-[120px] px-2 sm:px-4 text-left overflow-visible relative z-30">
      <div ref={cardRef} style={{ transform: 'translateY(45px)' }}>
        <ClaudeChatInput />
      </div>
    </div>
  );
};

export default AnimatedChatInput;
