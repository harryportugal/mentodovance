import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CopyTextProps {
  children: React.ReactNode;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  startTrigger?: string;
}

export const CopyText = ({
  children,
  delay = 0,
  stagger = 0.15,
  duration = 1.0,
  className = '',
  startTrigger = 'top 65%'
}: CopyTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const lines = containerRef.current.querySelectorAll('.line-inner');
    if (!lines.length) return;

    const ctx = gsap.context(() => {
      gsap.to(lines, {
        y: '0%',
        duration,
        stagger,
        ease: 'power3.out',
        delay,
        force3D: true,
        scrollTrigger: {
          trigger: containerRef.current,
          start: startTrigger,
          once: true,
          fastScrollEnd: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [delay, stagger, duration, startTrigger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default CopyText;
