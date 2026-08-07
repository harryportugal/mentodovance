import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, MessageCircle, Check } from 'lucide-react';
import { ButtonWithIcon } from '@/components/ui/button-with-icon';

gsap.registerPlugin(ScrollTrigger);

interface StepOption {
  title: string;
  description?: React.ReactNode;
  score?: number;
}

interface Step {
  id: number;
  question: string;
  subtitle?: React.ReactNode;
  options?: StepOption[];
  isTextarea?: boolean;
}

const STEPS: Step[] = [
  {
    id: 1,
    question: 'Onde você está hoje?',
    subtitle: <>Qual dessas opções melhor descreve seu <strong className="font-semibold text-white">momento atual como webdesigner</strong>?</>,
    options: [
      { title: 'Estou começando', description: <>Ainda estou aprendendo e montando meus <strong className="font-semibold text-white">primeiros projetos</strong>.</>, score: 1 },
      { title: 'Já faço sites', description: <>Já tenho alguma experiência e <strong className="font-semibold text-white">alguns projetos no ar</strong>.</>, score: 2 },
      { title: 'Já vivo de webdesign', description: <>Tenho clientes ativos e quero <strong className="font-semibold text-white">subir meu nível de ticket</strong>.</>, score: 3 },
      { title: 'Já sou avançado', description: <>Tenho experiência sólida, bons clientes e <strong className="font-semibold text-white">quero escalar</strong>.</>, score: 4 },
    ],
  },
  {
    id: 2,
    question: 'Quanto você fatura com webdesign hoje?',
    options: [
      { title: 'Ainda não faturo', score: 1 },
      { title: 'Até R$ 2.000 / mês', score: 1 },
      { title: 'R$ 2.000 – 5.000 / mês', score: 2 },
      { title: 'R$ 5.000 – 10.000 / mês', score: 3 },
      { title: 'R$ 10.000 – 20.000 / mês', score: 4 },
      { title: 'R$ 20.000+ / mês', score: 4 },
    ],
  },
  {
    id: 3,
    question: 'Quantos projetos você já entregou?',
    options: [
      { title: '0 projetos', score: 1 },
      { title: '1 – 3 projetos', score: 1 },
      { title: '4 – 10 projetos', score: 2 },
      { title: '10 – 30 projetos', score: 3 },
      { title: '30+ projetos', score: 4 },
    ],
  },
  {
    id: 4,
    question: 'Quanto você cobra normalmente por um site?',
    options: [
      { title: 'Ainda não cobro', score: 1 },
      { title: 'Até R$ 1.000', score: 1 },
      { title: 'R$ 1.000 – 3.000', score: 2 },
      { title: 'R$ 3.000 – 5.000', score: 3 },
      { title: 'R$ 5.000 – 10.000', score: 4 },
      { title: 'R$ 10.000+', score: 4 },
    ],
  },
  {
    id: 5,
    question: 'Qual é seu maior gargalo hoje?',
    options: [
      { title: 'Design', description: <>Meus sites não parecem <strong className="font-semibold text-white">suficientemente premium</strong>.</> },
      { title: 'Desenvolvimento', description: <>Não consigo transformar meus designs em <strong className="font-semibold text-white">sites profissionais</strong>.</> },
      { title: 'Animações', description: <>Meus projetos ainda são <strong className="font-semibold text-white">muito estáticos</strong>.</> },
      { title: 'Vendas', description: <>Tenho dificuldade para <strong className="font-semibold text-white">fechar contratos</strong>.</> },
      { title: 'Precificação', description: <>Não consigo cobrar o que <strong className="font-semibold text-white">meu trabalho realmente vale</strong>.</> },
      { title: 'Posicionamento', description: <>Não consigo atrair <strong className="font-semibold text-white">clientes de alto valor</strong>.</> },
    ],
  },
  {
    id: 6,
    question: 'O que você mais quer conquistar nos próximos 12 meses?',
    options: [
      { title: 'Começar a trabalhar com webdesign' },
      { title: 'Conseguir meus primeiros clientes' },
      { title: 'Cobrar mais por projeto' },
      { title: 'Criar um portfólio premium' },
      { title: 'Chegar a R$ 10K / mês' },
      { title: 'Chegar a R$ 20K+ / mês' },
      { title: 'Escalar minha operação / agência' },
    ],
  },
  {
    id: 7,
    question: 'Se encontrasse um método que pudesse acelerar esse resultado, quanto faria sentido investir hoje?',
    options: [
      { title: 'Até R$ 100', score: 1 },
      { title: 'R$ 100 – 500', score: 1 },
      { title: 'R$ 500 – 1.500', score: 2 },
      { title: 'R$ 1.500 – 3.000', score: 3 },
      { title: 'R$ 3.000 – 10.000', score: 4 },
      { title: 'Acima de R$ 10.000', score: 4 },
    ],
  },
  {
    id: 8,
    question: 'Por que você quer mudar seu nível como webdesigner?',
    subtitle: <>Conte um pouco sobre onde você <strong className="font-semibold text-white">está hoje</strong> e onde gostaria de <strong className="font-semibold text-white">chegar nos próximos meses</strong>.</>,
    isTextarea: true,
  },
];

interface ProfileRecommendation {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  description: React.ReactNode;
  deliverables: string[];
  primaryCtaText: string;
  primaryCtaHref?: string;
  isWhatsappPrimary?: boolean;
}

const PROFILES: Record<number, ProfileRecommendation> = {
  1: {
    id: 1,
    badge: 'Perfil 1 — Iniciante',
    title: 'Seu próximo passo: Vance Lib',
    subtitle: 'Construção de base e repertório visual',
    description: <>Você ainda está construindo sua base. Antes de investir em uma mentoria avançada, o melhor caminho é <strong className="font-semibold text-white">desenvolver repertório</strong>, acelerar sua produção e construir seus <strong className="font-semibold text-white">primeiros projetos de impacto</strong>.</>,
    deliverables: [
      '300+ componentes prontos para uso',
      'Animações cinematográficas prontas',
      'Prompts de engenharia visual',
      'Assets, ícones e templates de alta conversão',
    ],
    primaryCtaText: 'Conhecer a Vance Lib',
    primaryCtaHref: 'https://vancelib.vercel.app',
  },
  2: {
    id: 2,
    badge: 'Perfil 2 — Freelancer em Desenvolvimento',
    title: 'Seu próximo passo: Kit Freelancer Premium',
    subtitle: 'Profissionalização e estruturação comercial',
    description: <>Você já sabe criar sites. Agora precisa transformar isso em um <strong className="font-semibold text-white">negócio estruturado</strong> com <strong className="font-semibold text-white">propostas comerciais irrecusáveis</strong>, área do cliente, CRM e contratos blindados.</>,
    deliverables: [
      'Proposta comercial de alto valor',
      'Área do cliente & CRM no Notion',
      'Modelos de contratos profissionais',
      'Templates de apresentação e onboarding',
    ],
    primaryCtaText: 'Conhecer o Kit Freelancer',
  },
  3: {
    id: 3,
    badge: 'Perfil 3 — Webdesigner Intermediário',
    title: 'Seu próximo passo: Vance Class',
    subtitle: 'Projetos de R$ 10.000+ e portfólio de elite',
    description: <>Você já tem base suficiente. O que falta agora é subir o nível da sua entrega técnica, construir um <strong className="font-semibold text-white">portfólio de padrão internacional</strong> e aprender a fechar contratos de <strong className="font-semibold text-white">R$ 10.000+</strong>.</>,
    deliverables: [
      '5 encontros ao vivo de mentoria',
      'Método V.A.N.C.E. de engenharia visual',
      'Vance Lib vitalícia (+300 assets)',
      'Módulo Elevation: Propostas de R$ 10K e vendas',
    ],
    primaryCtaText: 'Quero conhecer a Vance Class',
  },
  4: {
    id: 4,
    badge: 'Perfil 4 — Avançado',
    title: 'Seu próximo passo: Mentoria Premium',
    subtitle: 'Escala de operação e alta performance',
    description: <>Você já domina a parte técnica. Seu próximo gargalo não é aprender a fazer sites — é transformar sua experiência em uma <strong className="font-semibold text-white">operação de escala</strong>, posicionamento e <strong className="font-semibold text-white">alto ticket</strong>.</>,
    deliverables: [
      'Estratégia individual de negócios',
      'Revisão completa de portfólio e posicionamento',
      'Networking fechado de alto nível',
      'Acompanhamento e suporte direto',
    ],
    primaryCtaText: 'Falar com a equipe no WhatsApp',
    isWhatsappPrimary: true,
  },
};

export const ApplicationFormSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { title: string; score?: number }>>({});
  const [textareaValue, setTextareaValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recommendedProfileId, setRecommendedProfileId] = useState<number>(3);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const lines = headerRef.current.querySelectorAll<HTMLElement>('.line-inner');
        gsap.to(lines, {
          y: '0%',
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const calculateProfile = (updatedAnswers: Record<number, { title: string; score?: number }>) => {
    const scores = Object.values(updatedAnswers)
      .map((item) => item.score)
      .filter((score): score is number => typeof score === 'number');

    if (scores.length === 0) return 3;

    const average = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;

    if (average < 1.7) return 1;
    if (average < 2.6) return 2;
    if (average < 3.5) return 3;
    return 4;
  };

  const animateStepTransition = (nextStepIndex: number) => {
    if (!stepContainerRef.current) {
      setCurrentStep(nextStepIndex);
      return;
    }

    gsap.to(stepContainerRef.current, {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentStep(nextStepIndex);
        gsap.fromTo(
          stepContainerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      },
    });
  };

  const handleSelectOption = (option: StepOption) => {
    const updated = { ...answers, [currentStep]: { title: option.title, score: option.score } };
    setAnswers(updated);

    if (currentStep < STEPS.length - 1) {
      animateStepTransition(currentStep + 1);
    }
  };

  const handleTextareaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textareaValue.trim()) return;

    const updated = { ...answers, [currentStep]: { title: textareaValue } };
    setAnswers(updated);
    
    const matchedProfile = calculateProfile(updated);
    setRecommendedProfileId(matchedProfile);
    setIsSubmitted(true);
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      animateStepTransition(currentStep - 1);
    }
  };

  const getWhatsappUrl = (profileId: number) => {
    const messages: Record<number, string> = {
      1: 'Olá! Fiz o diagnóstico na Vance Class e meu resultado foi Perfil 1 (Vance Lib). Gostaria de tirar dúvidas e entender como acessar a Vance Lib!',
      2: 'Olá! Fiz o diagnóstico na Vance Class e meu resultado foi Perfil 2 (Kit Freelancer Premium). Gostaria de entender mais sobre o Kit e como estruturar meus projetos!',
      3: 'Olá! Fiz o diagnóstico na Vance Class e meu resultado foi Perfil 3 (Vance Class). Quero entender como participar da mentoria e fechar projetos de R$ 10.000+!',
      4: 'Olá! Fiz o diagnóstico na Vance Class e meu resultado foi Perfil 4 (Mentoria Premium). Gostaria de falar com a equipe sobre a mentoria individual de alta performance!',
    };
    const text = encodeURIComponent(messages[profileId] || messages[3]);
    return `https://api.whatsapp.com/send?phone=5571992383038&text=${text}`;
  };

  const stepData = STEPS[currentStep];
  const profile = PROFILES[recommendedProfileId];

  return (
    <section
      ref={sectionRef}
      id="application"
      className="w-full py-20 md:py-28 px-6 md:px-16 lg:px-24 bg-black text-white font-sans select-none"
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* ── Section Header ── */}
        <div ref={headerRef} className="max-w-2xl mx-auto text-center flex flex-col gap-3">
          <div className="overflow-hidden py-1">
            <h2
              className="line-inner text-[clamp(2rem,3.8vw,3.2rem)] font-normal text-white leading-[1.18] tracking-tight"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              Agora queremos conhecer você.
            </h2>
          </div>
          <div className="overflow-hidden py-1">
            <p
              className="line-inner text-base sm:text-lg text-white font-normal leading-relaxed"
              style={{ transform: 'translateY(100%)', willChange: 'transform' }}
            >
              A Vance Class não é para qualquer webdesigner. Responda algumas perguntas e receba um <strong className="font-semibold text-white">diagnóstico personalizado</strong> para o seu momento.
            </p>
          </div>
        </div>

        {/* ── Multi-Step Form Container ── */}
        {!isSubmitted ? (
          <div ref={stepContainerRef} className="w-full flex flex-col gap-8">
            {/* Step Header Counter & Back Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-semibold tracking-widest text-white uppercase">
                0{stepData.id} / 0{STEPS.length}
              </span>

              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-1.5 text-xs text-white hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              )}
            </div>

            {/* Question Title & Subtitle */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-normal text-white tracking-tight">
                {stepData.question}
              </h3>
              {stepData.subtitle && (
                <p className="text-sm sm:text-base text-white font-normal">
                  {stepData.subtitle}
                </p>
              )}
            </div>

            {/* Step Options or Textarea */}
            {!stepData.isTextarea ? (
              <div className="flex flex-col gap-3.5">
                {stepData.options?.map((option, optionIdx) => {
                  const isSelected = answers[currentStep]?.title === option.title;
                  return (
                    <button
                      key={optionIdx}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left bg-[#0e0e0e] hover:bg-[#141414] rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col gap-1.5 cursor-pointer ${
                        isSelected ? 'bg-[#141414] ring-1 ring-white/20' : ''
                      }`}
                    >
                      <span className="text-base sm:text-lg font-medium text-white tracking-tight">
                        {option.title}
                      </span>
                      {option.description && (
                        <span className="text-xs sm:text-sm text-white font-normal">
                          {option.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={handleTextareaSubmit} className="flex flex-col gap-6">
                <textarea
                  rows={4}
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  placeholder="Escreva aqui onde você está hoje e onde gostaria de chegar..."
                  className="w-full bg-[#0e0e0e] text-white p-5 rounded-2xl focus:outline-none border-none placeholder:text-white/40 text-base font-normal leading-relaxed resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!textareaValue.trim()}
                    className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Ver meu resultado →
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ── Intelligent Recommendation Screen ── */
          <div className="w-full bg-[#0e0e0e] rounded-3xl p-7 sm:p-12 flex flex-col gap-8 text-left">
            {/* Header Badge & Title */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono font-semibold tracking-widest text-white uppercase">
                {profile.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight">
                {profile.title}
              </h3>
              <p className="text-sm sm:text-base text-white font-normal leading-relaxed">
                {profile.description}
              </p>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Recommended Deliverables */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight">
                O que você recebe no seu plano recomendado:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-white font-normal">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3 h-3 text-white stroke-[2.5]" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* CTAs (All CTAs lead to WhatsApp 5571992383038 with result-specific text) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <ButtonWithIcon
                text={profile.primaryCtaText}
                href={getWhatsappUrl(recommendedProfileId)}
                target="_blank"
                rel="noopener noreferrer"
              />

              <a
                href={getWhatsappUrl(recommendedProfileId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-white hover:text-white/80 transition-colors flex items-center gap-1.5 py-2 cursor-pointer font-normal"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar com um especialista no WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApplicationFormSection;
