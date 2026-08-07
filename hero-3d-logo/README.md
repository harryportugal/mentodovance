# Vance Hero 3D Logo Component (Plug & Play)

Este repositório/pasta contém o **componente 3D do logo Vance** exatamente **idêntico e perfeito ao do site atual**, sem nenhuma alteração no código 3D, materiais, iluminação, extrusão ou física.

---

## 📁 Conteúdo da Pasta `hero-3d-logo`

```
hero-3d-logo/
├── Hero3DLogo.tsx           # Componente React principal com R3F, Three.js, iluminação de estúdio e lerp de cursor
├── logo_points.json         # Coordenadas do vetor original do logo
├── logo_points_smoothed.json # Coordenadas suavizadas do vetor do logo
├── package.json             # Dependências necessárias
├── README.md                # Instruções detalhadas de uso
└── assets/                  # Mídias e logos associados em alta definição
    ├── logo_vance_white.png
    ├── logo_loading.png
    ├── Vance_white.png
    ├── favicon.svg
    └── favicon.png
```

---

## 🛠️ Requisitos e Instalação de Dependências

Em qualquer outro projeto React (Vite, Next.js, Create React App, etc.), instale as dependências executando no terminal:

```bash
npm install three @react-three/fiber @react-three/drei
```

Se o seu projeto utilizar TypeScript, instale também as definições de tipos:

```bash
npm install -D @types/three
```

---

## 🚀 Como Usar em Outro Projeto

### Opção 1: Uso Simples (Plug & Play Completo)

Basta copiar a pasta `hero-3d-logo` para o seu projeto (por exemplo dentro de `src/components/hero-3d-logo`) e importar o componente `<Hero3DLogo />`:

```tsx
import Hero3DLogo from './components/hero-3d-logo/Hero3DLogo'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000000' }}>
      <Hero3DLogo />
    </div>
  )
}
```

---

### Opção 2: Integrando dentro do Canvas / Hero do seu layout

Se você já possui um elemento container no seu hero, pode controlar quando o logo aparece ou ajustar seu estilo usando as props do componente:

```tsx
import Hero3DLogo from './components/hero-3d-logo/Hero3DLogo'

export default function MyHeroSection() {
  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Overlay de texto por cima do logo 3D */}
      <div className="absolute z-10 text-center text-white pointer-events-none">
        <h1 className="text-5xl font-bold tracking-tight">Sua Marca Aqui</h1>
      </div>

      {/* Componente 3D Renderizado no Fundo */}
      <Hero3DLogo 
        show3DLogo={true} 
        className="absolute inset-0 w-full h-full z-0" 
      />
    </section>
  )
}
```

---

### Opção 3: Importando apenas a Cena 3D (`Background3DScene`)

Se você já possui seu próprio gerenciamento de eventos de ponteiro / mouse ou `Canvas` externo:

```tsx
import { useRef, useEffect } from 'react'
import { Background3DScene } from './components/hero-3d-logo/Hero3DLogo'

export default function CustomSceneContainer() {
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Background3DScene 
        mouseRef={mouseRef} 
        show3DLogo={true} 
        canvasActive={true} 
        isMobile={false} 
      />
    </div>
  )
}
```

---

## 🎨 Especificações Técnicas do Componente

- **Forma 3D:** Gerada dinamicamente via `THREE.Shape` a partir de 103 pontos de contorno e furo em formato de estrela/asterisco.
- **Bisel e Curvas:** `bevelSegments: 8`, `curveSegments: 18`, `depth: 0.25`, `bevelThickness: 0.12`, `bevelSize: 0.06`.
- **Material Físico Chrome:** `meshPhysicalMaterial` com `color="#ffffff"`, `metalness={1}`, `roughness={0.16}`, `clearcoat={1.0}`, `clearcoatRoughness={0.08}`, `envMapIntensity={3.2}`.
- **Ambiente de Estúdio:** `<Environment>` com 6 `<Lightformer>`s retangulares de alta precisão que geram os reflexos de luz prateada nos cantos chanfrados.
- **Interação:** Lerp suave (`0.1`) no eixo X e Y respondendo ao movimento do cursor do mouse.
