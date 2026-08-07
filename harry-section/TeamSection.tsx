// ============================================================
// TeamSection.tsx - codigo 100% IDENTICO ao App.tsx do portfolio
//
// DEPENDENCIAS:
//   npm install gsap @gsap/react
//
// OUTROS ARQUIVOS:
//   SplitText.tsx  -> copie para src/SplitText.tsx
//   Imagem         -> copie harry_p_perfil_opt.png para /public/
//
// USO:
//   <TeamSection lang='pt' />
// ============================================================

import { useState, useRef, useEffect, createContext, useContext } from 'react'
import SplitText from './SplitText'

export const LanguageContext = createContext<{
  lang: 'pt' | 'en' | 'es'
  setLang: (lang: 'pt' | 'en' | 'es') => void
} | null>(null)

export const t = {
  pt: {
    aboutText1: 'Harry Portugal \u00e9 um engenheiro de software e designer. \u201cEu crio produtos e experi\u00eancias digitais, ',
    aboutText2: 'do conceito \u00e0 produ\u00e7\u00e3o.\u201d',
    teamCTA: 'Falar sobre o projeto',
  },
  en: {
    aboutText1: 'Harry Portugal is a software engineer and designer. \u201cI create digital products and experiences, ',
    aboutText2: 'from concept to production.\u201d',
    teamCTA: 'Talk to Me',
  },
  es: {
    aboutText1: 'Harry Portugal es un ingeniero de software y dise\u00f1ador. \u201cYo creo productos y experiencias digitales, ',
    aboutText2: 'del concepto a la producci\u00f3n.\u201d',
    teamCTA: 'Hable Conmigo',
  },
} as const

function AnimateOnScroll({
  children,
  staggerDelay = 0,
  className = 'w-full h-full',
  fadeOnly = false,
}: {
  children: React.ReactNode | ((inView: boolean) => React.ReactNode)
  staggerDelay?: number
  className?: string
  fadeOnly?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [mountedInView, setMountedInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (alreadyVisible) {
      setInView(true)
      setMountedInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: fadeOnly ? undefined : (inView ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 40px, 0) scale(0.96)'),
        transition: mountedInView ? 'none' : fadeOnly
          ? 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)'
          : 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), transform 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: mountedInView ? '0ms' : ${staggerDelay}ms,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        contain: 'layout style paint'
      }}
      className={className}
    >
      {typeof children === 'function' ? children(inView) : children}
    </div>
  )
}

// Codigo EXATO do App.tsx original - linhas 1556-1623
export default function TeamSection() {
  const context = useContext(LanguageContext)
  const lang = context ? context.lang : 'pt'

  return (
    <div id='about' className='relative'>
      <div className='max-w-[1440px] mx-auto px-6 min-[1600px]:px-10'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center'>

          {/* Left Column - Portrait */}
          <div className='w-full max-w-[320px] mx-auto lg:mx-0 lg:col-start-3 lg:col-span-3 group'>
            <AnimateOnScroll staggerDelay={100}>
              <div className='relative w-full aspect-[4/5] rounded-xl overflow-hidden'>
                <img
                  src='/harry_p_perfil_opt.png'
                  alt='Harry Portugal'
                  className='w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'
                  loading='lazy'
                />
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right Column - Text and CTA */}
          <div className='lg:col-start-7 lg:col-span-5 flex flex-col justify-center items-start lg:pl-0'>
            <h2 className='text-[28px] md:text-[38px] lg:text-[42px] font-medium tracking-tight leading-[1.2] text-left mb-8'>
              <SplitText
                key={bout1-}
                text={t[lang].aboutText1}
                className='about-title text-white'
                delay={15}
                duration={0.8}
                ease='power3.out'
                splitType='words'
                tag='span'
                textAlign='left'
              />
              {' '}
              <SplitText
                key={bout2-}
                text={t[lang].aboutText2}
                className='about-muted text-white/35'
                delay={15}
                duration={0.8}
                ease='power3.out'
                splitType='words'
                tag='span'
                textAlign='left'
              />
            </h2>

            <div className='flex justify-start'>
              <a
                href='#contact'
                className='about-btn inline-flex items-center justify-center bg-white hover:opacity-90 transition-all rounded-lg px-8 py-3.5 text-black text-[13px] font-medium tracking-wide shadow-sm hover:scale-[1.02] duration-300'
              >
                {t[lang].teamCTA}
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
