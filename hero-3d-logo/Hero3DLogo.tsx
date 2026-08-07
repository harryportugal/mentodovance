import { useRef, useMemo, useEffect, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Float, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

// Inner component to handle mouse pointer interactions, entry scale, and rotation lerping
function InteractiveMesh({ 
  mouseRef, 
  show3DLogo = true, 
  isMobile = false 
}: { 
  mouseRef: React.MutableRefObject<{ x: number, y: number }>, 
  show3DLogo?: boolean, 
  isMobile?: boolean 
}) {
  const groupRef = useRef<THREE.Group>(null)
  const introScaleRef = useRef(0)

  useFrame(() => {
    if (!groupRef.current) return
    
    // Smooth scale-up entrance animation after headline finishes
    const targetScale = show3DLogo ? 1 : 0
    introScaleRef.current = THREE.MathUtils.lerp(introScaleRef.current, targetScale, 0.03) // 0.03 is extremely smooth and elegant
    groupRef.current.scale.setScalar(introScaleRef.current)

    // Target rotation based on custom global mouseRef position
    const targetX = -mouseRef.current.y * 0.4
    const targetY = mouseRef.current.x * 0.4
    
    // Smooth lerp to the target rotation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.1)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.1)
  })

  // Re-create the Vance logo shape and its asterisk-like hole from the vectorized PNG
  const shape = useMemo(() => {
    const s = new THREE.Shape()

    const c0 = [{"x":-0.4691,"y":1.9725},{"x":-0.4552,"y":1.9535},{"x":-0.4212,"y":1.8659},{"x":-0.388,"y":1.7927},{"x":-0.339,"y":1.7073},{"x":-0.2849,"y":1.6409},{"x":-0.2438,"y":1.602},{"x":-0.1702,"y":1.5438},{"x":-0.1601,"y":1.5314},{"x":-0.1658,"y":1.4893},{"x":-0.2261,"y":1.4146},{"x":-0.2538,"y":1.3659},{"x":-0.2721,"y":1.311},{"x":-0.2721,"y":1.311},{"x":-0.2833,"y":1.2378},{"x":-0.2866,"y":1.1524},{"x":-0.2855,"y":0.0915},{"x":-0.2799,"y":0.0488},{"x":-0.2654,"y":0},{"x":-0.1225,"y":-0.378},{"x":-0.0322,"y":-0.6336},{"x":-0.0211,"y":-0.6581},{"x":-0.0093,"y":-0.6705},{"x":-0.0019,"y":-0.6693},{"x":0.0053,"y":-0.6618},{"x":0.0215,"y":-0.6278},{"x":0.1063,"y":-0.3902},{"x":0.2591,"y":0.0061},{"x":0.2734,"y":0.0549},{"x":0.2792,"y":0.0976},{"x":0.2805,"y":1.0793},{"x":0.2718,"y":1.2561},{"x":0.2624,"y":1.3171},{"x":0.2442,"y":1.372},{"x":0.2158,"y":1.4207},{"x":0.1566,"y":1.4952},{"x":0.1495,"y":1.5144},{"x":0.1518,"y":1.5276},{"x":0.1684,"y":1.5481},{"x":0.2317,"y":1.5969},{"x":0.2674,"y":1.6293},{"x":0.3005,"y":1.6647},{"x":0.3337,"y":1.7073},{"x":0.3852,"y":1.7927},{"x":0.4172,"y":1.8598},{"x":0.455,"y":1.9528},{"x":0.4634,"y":1.9662},{"x":0.4696,"y":1.9696},{"x":0.4779,"y":1.9637},{"x":0.4864,"y":1.9482},{"x":0.5239,"y":1.8537},{"x":0.5546,"y":1.7866},{"x":0.6055,"y":1.7012},{"x":0.6659,"y":1.6297},{"x":0.7073,"y":1.5928},{"x":0.7698,"y":1.5454},{"x":0.7808,"y":1.5334},{"x":0.7863,"y":1.5209},{"x":0.7852,"y":1.5077},{"x":0.778,"y":1.4933},{"x":0.7181,"y":1.4206},{"x":0.6863,"y":1.3659},{"x":0.6682,"y":1.311},{"x":0.6563,"y":1.2317},{"x":0.6524,"y":1.1402},{"x":0.6524,"y":0.1037},{"x":0.6456,"y":0.0305},{"x":0.6259,"y":-0.0244},{"x":0.5152,"y":-0.2561},{"x":0.4043,"y":-0.5122},{"x":0.326,"y":-0.7134},{"x":0.2399,"y":-0.9573},{"x":0.1544,"y":-1.2378},{"x":0.0938,"y":-1.4695},{"x":0.0512,"y":-1.6585},{"x":-0.001,"y":-1.9482},{"x":-0.0076,"y":-1.9696},{"x":-0.014,"y":-1.9482},{"x":-0.0511,"y":-1.7195},{"x":-0.0991,"y":-1.4878},{"x":-0.1615,"y":-1.2378},{"x":-0.2279,"y":-1.0122},{"x":-0.3078,"y":-0.7744},{"x":-0.405,"y":-0.5183},{"x":-0.5394,"y":-0.2134},{"x":-0.6428,"y":-0.0061},{"x":-0.6562,"y":0.0305},{"x":-0.6621,"y":0.061},{"x":-0.6646,"y":0.1159},{"x":-0.6647,"y":1.1768},{"x":-0.6675,"y":1.25},{"x":-0.6782,"y":1.3171},{"x":-0.6969,"y":1.372},{"x":-0.7248,"y":1.4207},{"x":-0.7793,"y":1.4895},{"x":-0.7873,"y":1.5047},{"x":-0.7896,"y":1.519},{"x":-0.7851,"y":1.5324},{"x":-0.7706,"y":1.5493},{"x":-0.7015,"y":1.6034},{"x":-0.661,"y":1.6414},{"x":-0.6022,"y":1.7134},{"x":-0.5515,"y":1.7988},{"x":-0.4851,"y":1.9535},{"x":-0.471,"y":1.9725}]

    s.moveTo(c0[0].x, c0[0].y)
    for (let i = 1; i < c0.length; i++) {
      s.lineTo(c0[i].x, c0[i].y)
    }

    const c1 = [{"x":-0.0519,"y":-0.783},{"x":-0.0658,"y":-0.7807},{"x":-0.08,"y":-0.7836},{"x":-0.0931,"y":-0.7909},{"x":-0.1037,"y":-0.802},{"x":-0.1115,"y":-0.8207},{"x":-0.1155,"y":-0.869},{"x":-0.1221,"y":-0.8767},{"x":-0.1571,"y":-0.8939},{"x":-0.1706,"y":-0.9062},{"x":-0.1782,"y":-0.9282},{"x":-0.1749,"y":-0.9515},{"x":-0.1609,"y":-0.9694},{"x":-0.1172,"y":-0.994},{"x":-0.1136,"y":-1.0037},{"x":-0.1103,"y":-1.0501},{"x":-0.1037,"y":-1.0638},{"x":-0.0888,"y":-1.0773},{"x":-0.0748,"y":-1.0826},{"x":-0.0602,"y":-1.0829},{"x":-0.007,"y":-1.0606},{"x":0.0426,"y":-1.0809},{"x":0.0574,"y":-1.0821},{"x":0.0717,"y":-1.0782},{"x":0.0877,"y":-1.0666},{"x":0.0954,"y":-1.054},{"x":0.0999,"y":-1.0036},{"x":0.1039,"y":-0.9939},{"x":0.1427,"y":-0.9695},{"x":0.1547,"y":-0.9557},{"x":0.1599,"y":-0.9377},{"x":0.1566,"y":-0.9144},{"x":0.1427,"y":-0.8964},{"x":0.1038,"y":-0.8719},{"x":0.0995,"y":-0.8621},{"x":0.0937,"y":-0.8149},{"x":0.0865,"y":-0.8011},{"x":0.0754,"y":-0.7908},{"x":0.0618,"y":-0.7847},{"x":0.0471,"y":-0.7838},{"x":-0.0067,"y":-0.8053},{"x":-0.0172,"y":-0.8028},{"x":-0.0476,"y":-0.7847}]

    const hole = new THREE.Path()
    hole.moveTo(c1[0].x, c1[0].y)
    for (let i = 1; i < c1.length; i++) {
      hole.lineTo(c1[i].x, c1[i].y)
    }
    s.holes.push(hole)

    return s
  }, [])

  // Optimized & Smoothed: bevelSegments 8 for cleaner rounded edges and curveSegments 18
  const extrudeSettings = useMemo(() => ({
    depth: 0.25,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.06,
    bevelSegments: 8,
    curveSegments: 18,
    steps: 1
  }), [])

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.3}>
        <Center>
          <mesh scale={isMobile ? 0.75 : 1.2}>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={1}
              roughness={0.16} // Slightly higher to soften reflections and avoid aliasing
              clearcoat={1.0}
              clearcoatRoughness={0.08} // Softens clearcoat reflections for a more premium finish
              envMapIntensity={3.2}
              reflectivity={1.0}
            />
          </mesh>
        </Center>
      </Float>
    </group>
  )
}

// Separate component containing the R3F Canvas and Scene setup
export const Background3DScene = memo(({ 
  mouseRef, 
  show3DLogo = true, 
  canvasActive = true, 
  isMobile = false 
}: { 
  mouseRef: React.MutableRefObject<{ x: number, y: number }>, 
  show3DLogo?: boolean, 
  canvasActive?: boolean, 
  isMobile?: boolean 
}) => {
  return (
    <Canvas 
      camera={{ position: [0, 0, 9.0], fov: 45 }}
      dpr={[1, 2]} // Support high-DPI displays (caps at 2x instead of 1.3x) for razor-sharp edges
      frameloop={canvasActive ? "always" : "demand"}
      gl={{ 
        antialias: true, 
        alpha: true, 
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        stencil: false // Disable stencil buffer to save resources
      }}
      performance={{ min: 0.5 }}
    >
      <ambientLight intensity={1.5} /> {/* Reduced from 2.6 to add reflection contrast and depth */}
      <directionalLight position={[3.2, 5, 5]} intensity={2.0} color="#ffffff" /> {/* Slightly reduced to improve contrast */}
      <directionalLight position={[-3.2, 5, 5]} intensity={2.0} color="#ffffff" />
      <directionalLight position={[0, 5, -2]} intensity={0.8} color="#ffffff" />
      <InteractiveMesh mouseRef={mouseRef} show3DLogo={show3DLogo} isMobile={isMobile} />
      <Environment resolution={1024}> {/* Increased from 512 to get sharp, detailed reflections on the chrome surface */}
        {/* Monochromatic studio lightformers */}
        <Lightformer form="rect" intensity={0.5} position={[0, 0, -10]} scale={[20, 20, 1]} color="white" />
        <Lightformer form="rect" intensity={2.5} position={[-3.2, 5, 5]} scale={[5, 10, 1]} rotation={[0, Math.PI / 4, 0]} color="white" />
        <Lightformer form="rect" intensity={2.5} position={[3.2, 5, 5]} scale={[5, 10, 1]} rotation={[0, -Math.PI / 4, 0]} color="white" />
        <Lightformer form="rect" intensity={1.5} position={[0, 10, 0]} scale={[10, 10, 1]} rotation={[Math.PI / 2, 0, 0]} color="white" />
        {/* Sharp vertical highlight lightformers on the sides for beautiful reflections */}
        <Lightformer form="rect" intensity={3.5} position={[-5.5, 2, 0]} scale={[0.5, 15, 1]} color="white" />
        <Lightformer form="rect" intensity={3.5} position={[5.5, 2, 0]} scale={[0.5, 15, 1]} color="white" />
      </Environment>
    </Canvas>
  )
})

Background3DScene.displayName = 'Background3DScene'

export interface Hero3DLogoProps {
  /** Enables or triggers the 3D logo scale-in animation (defaults to true) */
  show3DLogo?: boolean;
  /** Custom CSS class for the container */
  className?: string;
  /** Custom inline styles for the container */
  style?: React.CSSProperties;
}

/**
 * Standalone Hero 3D Logo Component.
 * Plug & play 3D interactive logo component with realistic chrome reflections, 
 * studio lighting, float motion, and cursor rotation tracking.
 */
export default function Hero3DLogo({ 
  show3DLogo = true, 
  className = '', 
  style = {} 
}: Hero3DLogoProps) {
  const mouseRef = useRef({ x: 0, y: 0 })
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth < 1024 : false)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 1024
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div 
      className={`relative w-full h-full min-h-[400px] pointer-events-none ${className}`}
      style={{
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        ...style
      }}
    >
      <Background3DScene 
        mouseRef={mouseRef} 
        show3DLogo={show3DLogo} 
        canvasActive={true} 
        isMobile={isMobileRef.current} 
      />
    </div>
  )
}
