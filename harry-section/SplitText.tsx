import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify' | 'initial' | 'inherit';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete
}: SplitTextProps) => {
  const ref = useRef<HTMLParagraphElement | HTMLHeadingElement | HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useGSAP(
    () => {
      if (!ref.current || !text) return;
      const el = ref.current;

      const targets = el.querySelectorAll(splitType === 'chars' ? '.split-char' : '.split-word');
      if (!targets.length) return;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        tween.kill();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin
      ],
      scope: ref
    }
  );

  const renderTag = () => {
    const Tag = tag;
    const style = {
      textAlign,
      display: tag === 'span' ? 'inline' : ('inline-block' as const),
      whiteSpace: 'normal' as const,
      wordWrap: 'break-word' as const,
      ...(tag !== 'span' && { overflow: 'hidden' as const })
    };

    const words = text.split(' ').filter(w => w !== '');
    
    return (
      <Tag ref={ref as any} style={style} className={`split-parent ${className}`}>
        {words.map((word, wIdx) => {
          if (word === '<br/>' || word === '<br>') {
            return <br key={wIdx} />;
          }
          const chars = word.split('');
          const isLastWord = wIdx === words.length - 1;
          return (
            <span key={wIdx} className="split-word inline-block whitespace-nowrap" style={{ marginRight: isLastWord ? '0px' : '0.25em' }}>
              {splitType === 'chars' ? (
                chars.map((char, cIdx) => (
                  <span key={cIdx} className="split-char inline-block">
                    {char}
                  </span>
                ))
              ) : (
                word
              )}
            </span>
          );
        })}
      </Tag>
    );
  };

  return renderTag();
};

export default SplitText;
