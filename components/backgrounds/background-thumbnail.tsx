'use client';

import { Sparkles } from 'lucide-react';
import React, {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// Default mouse position for interactive backgrounds
const defaultMouse = { x: 0.5, y: 0.5 };

// Helper to wrap components that require mouse prop
function withDefaultMouse<P extends { mouse: { x: number; y: number } }>(
  Component: React.ComponentType<P>,
): React.FC<Omit<P, 'mouse'>> {
  return function WrappedComponent(props: Omit<P, 'mouse'>) {
    return <Component {...(props as P)} mouse={defaultMouse} />;
  };
}

// Lazy load all background components
// Components that require mouse prop are wrapped with default values
const backgroundComponents = {
  aurora: lazy(() =>
    import('./aurora-background').then(m => ({ default: m.AuroraBackground })),
  ),
  bokeh: lazy(() =>
    import('./bokeh-background').then(m => ({ default: m.BokehBackground })),
  ),
  cells: lazy(() =>
    import('./cells-background').then(m => ({
      default: withDefaultMouse(m.HeroCellsCanvas),
    })),
  ),
  circuits: lazy(() =>
    import('./circuits-background').then(m => ({
      default: withDefaultMouse(m.HeroCircuitsCanvas),
    })),
  ),
  confetti: lazy(() =>
    import('./confetti-background').then(m => ({
      default: m.ConfettiBackground,
    })),
  ),
  constellation: lazy(() =>
    import('./constellation-background').then(m => ({
      default: withDefaultMouse(m.HeroConstellationCanvas),
    })),
  ),
  crystal: lazy(() =>
    import('./crystal-background').then(m => ({
      default: withDefaultMouse(m.HeroCrystalCanvas),
    })),
  ),
  dunes: lazy(() =>
    import('./dunes-background').then(m => ({
      default: withDefaultMouse(m.HeroDunesCanvas),
    })),
  ),
  embers: lazy(() =>
    import('./embers-background').then(m => ({
      default: withDefaultMouse(m.HeroEmbersCanvas),
    })),
  ),
  fireflies: lazy(() =>
    import('./fireflies-background').then(m => ({
      default: withDefaultMouse(m.HeroFirefliesCanvas),
    })),
  ),
  glitch: lazy(() =>
    import('./glitch-background').then(m => ({
      default: withDefaultMouse(m.HeroGlitchCanvas),
    })),
  ),
  'gradient-mesh': lazy(() =>
    import('./gradient-mesh-background').then(m => ({
      default: m.GradientMeshBackground,
    })),
  ),
  grid: lazy(() =>
    import('./grid-background').then(m => ({
      default: withDefaultMouse(m.HeroGridCanvas),
    })),
  ),
  hex: lazy(() =>
    import('./hex-background').then(m => ({
      default: withDefaultMouse(m.HeroHexCanvas),
    })),
  ),
  holographic: lazy(() =>
    import('./holographic-background').then(m => ({
      default: m.HolographicBackground,
    })),
  ),
  hyperdrive: lazy(() =>
    import('./hyperdrive-background').then(m => ({
      default: withDefaultMouse(m.HeroHyperdriveCanvas),
    })),
  ),
  ink: lazy(() =>
    import('./ink-background').then(m => ({
      default: withDefaultMouse(m.HeroInkCanvas),
    })),
  ),
  lava: lazy(() =>
    import('./lava-background').then(m => ({
      default: withDefaultMouse(m.HeroLavaCanvas),
    })),
  ),
  matrix: lazy(() =>
    import('./matrix-background').then(m => ({ default: m.MatrixBackground })),
  ),
  'matrix-rain': lazy(() =>
    import('./matrix-background').then(m => ({ default: m.MatrixBackground })),
  ),
  metaballs: lazy(() =>
    import('./metaballs-background').then(m => ({
      default: withDefaultMouse(m.HeroMetaballsCanvas),
    })),
  ),
  moire: lazy(() =>
    import('./moire-background').then(m => ({
      default: withDefaultMouse(m.HeroMoireCanvas),
    })),
  ),
  nebula: lazy(() =>
    import('./nebula-background').then(m => ({
      default: withDefaultMouse(m.HeroNebulaCanvas),
    })),
  ),
  'neural-network': lazy(() =>
    import('./neural-network-background').then(m => ({
      default: m.NeuralNetworkBackground,
    })),
  ),
  noise: lazy(() =>
    import('./noise-background').then(m => ({
      default: withDefaultMouse(m.HeroNoiseCanvas),
    })),
  ),
  orbit: lazy(() =>
    import('./orbit-background').then(m => ({
      default: withDefaultMouse(m.HeroOrbitCanvas),
    })),
  ),
  particles: lazy(() =>
    import('./particle-background').then(m => ({
      default: m.ParticleBackground,
    })),
  ),
  plasma: lazy(() =>
    import('./plasma-background').then(m => ({
      default: withDefaultMouse(m.HeroPlasmaCanvas),
    })),
  ),
  prism: lazy(() =>
    import('./prism-background').then(m => ({
      default: withDefaultMouse(m.HeroPrismCanvas),
    })),
  ),
  radar: lazy(() =>
    import('./radar-background').then(m => ({
      default: withDefaultMouse(m.HeroRadarCanvas),
    })),
  ),
  rain: lazy(() =>
    import('./rain-background').then(m => ({ default: m.RainBackground })),
  ),
  ribbons: lazy(() =>
    import('./ribbons-background').then(m => ({
      default: withDefaultMouse(m.HeroRibbonsCanvas),
    })),
  ),
  rings: lazy(() =>
    import('./rings-background').then(m => ({
      default: withDefaultMouse(m.HeroRingsCanvas),
    })),
  ),
  shards: lazy(() =>
    import('./shards-background').then(m => ({
      default: withDefaultMouse(m.HeroShardsCanvas),
    })),
  ),
  silk: lazy(() =>
    import('./silk-background').then(m => ({
      default: withDefaultMouse(m.HeroSilkCanvas),
    })),
  ),
  smoke: lazy(() =>
    import('./smoke-background').then(m => ({ default: m.SmokeBackground })),
  ),
  spiral: lazy(() =>
    import('./spiral-background').then(m => ({
      default: withDefaultMouse(m.HeroSpiralCanvas),
    })),
  ),
  starfield: lazy(() =>
    import('./starfield-background').then(m => ({
      default: m.StarfieldBackground,
    })),
  ),
  topo: lazy(() =>
    import('./topo-background').then(m => ({
      default: withDefaultMouse(m.HeroTopoCanvas),
    })),
  ),
  voronoi: lazy(() =>
    import('./voronoi-background').then(m => ({
      default: withDefaultMouse(m.HeroVoronoiCanvas),
    })),
  ),
  warp: lazy(() =>
    import('./warp-background').then(m => ({
      default: withDefaultMouse(m.HeroWarpCanvas),
    })),
  ),
  'wave-lines': lazy(() =>
    import('./wave-lines-background').then(m => ({
      default: m.WaveLinesBackground,
    })),
  ),
  waves: lazy(() =>
    import('./waves-background').then(m => ({
      default: withDefaultMouse(m.HeroWavesCanvas),
    })),
  ),
  'dna-helix': lazy(() =>
    import('./dna-helix-background').then(m => ({
      default: m.DnaHelixBackground,
    })),
  ),
  fireworks: lazy(() =>
    import('./fireworks-background').then(m => ({
      default: m.FireworksBackground,
    })),
  ),
  watercolor: lazy(() =>
    import('./watercolor-background').then(m => ({
      default: m.WatercolorBackground,
    })),
  ),
  sakura: lazy(() =>
    import('./sakura-background').then(m => ({ default: m.SakuraBackground })),
  ),
  'retro-sun': lazy(() =>
    import('./retro-sun-background').then(m => ({
      default: m.RetroSunBackground,
    })),
  ),
  'geometric-shapes': lazy(() =>
    import('./geometric-shapes-background').then(m => ({
      default: m.GeometricShapesBackground,
    })),
  ),
  'pixel-rain': lazy(() =>
    import('./pixel-rain-background').then(m => ({
      default: m.PixelRainBackground,
    })),
  ),
  'meteor-shower': lazy(() =>
    import('./meteor-shower-background').then(m => ({
      default: m.MeteorShowerBackground,
    })),
  ),
  soundwave: lazy(() =>
    import('./soundwave-background').then(m => ({
      default: m.SoundwaveBackground,
    })),
  ),
  'falling-leaves': lazy(() =>
    import('./falling-leaves-background').then(m => ({
      default: m.FallingLeavesBackground,
    })),
  ),
  'neon-rings': lazy(() =>
    import('./neon-rings-background').then(m => ({
      default: m.NeonRingsBackground,
    })),
  ),
  'cosmic-dust': lazy(() =>
    import('./cosmic-dust-background').then(m => ({
      default: m.CosmicDustBackground,
    })),
  ),
  'wave-gradient': lazy(() =>
    import('./wave-gradient-background').then(m => ({
      default: m.WaveGradientBackground,
    })),
  ),
  'clock-gears': lazy(() =>
    import('./clock-gears-background').then(m => ({
      default: m.ClockGearsBackground,
    })),
  ),
  'rain-drops': lazy(() =>
    import('./rain-drops-background').then(m => ({
      default: m.RainDropsBackground,
    })),
  ),
  'sand-particles': lazy(() =>
    import('./sand-particles-background').then(m => ({
      default: m.SandParticlesBackground,
    })),
  ),
  'breathing-circles': lazy(() =>
    import('./breathing-circles-background').then(m => ({
      default: m.BreathingCirclesBackground,
    })),
  ),
  'lightning-bugs': lazy(() =>
    import('./lightning-bugs-background').then(m => ({
      default: m.LightningBugsBackground,
    })),
  ),
  pinwheel: lazy(() =>
    import('./pinwheel-background').then(m => ({
      default: m.PinwheelBackground,
    })),
  ),
  'ripple-pond': lazy(() =>
    import('./ripple-pond-background').then(m => ({
      default: m.RipplePondBackground,
    })),
  ),
  'floating-diamonds': lazy(() =>
    import('./floating-diamonds-background').then(m => ({
      default: m.FloatingDiamondsBackground,
    })),
  ),
  'sound-bars': lazy(() =>
    import('./sound-bars-background').then(m => ({
      default: m.SoundBarsBackground,
    })),
  ),
  'neon-pulse': lazy(() =>
    import('./neon-pulse-background').then(m => ({
      default: m.NeonPulseBackground,
    })),
  ),
  'hexagon-grid': lazy(() =>
    import('./hexagon-grid-background').then(m => ({
      default: m.HexagonGridBackground,
    })),
  ),
  'circuit-flow': lazy(() =>
    import('./circuit-flow-background').then(m => ({
      default: m.CircuitFlowBackground,
    })),
  ),
  'morphing-shapes': lazy(() =>
    import('./morphing-shapes-background').then(m => ({
      default: m.MorphingShapesBackground,
    })),
  ),
  'dandelion-seeds': lazy(() =>
    import('./dandelion-seeds-background').then(m => ({
      default: m.DandelionSeedsBackground,
    })),
  ),
} as const;

// Fallback gradients for each background type
const fallbackStyles: Record<string, string> = {
  'gradient-mesh': 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',
  particles: 'bg-gradient-to-br from-slate-900 to-slate-800',
  'wave-lines': 'bg-gradient-to-b from-indigo-950 to-black',
  aurora: 'bg-gradient-to-tr from-green-400 via-blue-500 to-purple-600',
  matrix: 'bg-black',
  'matrix-rain': 'bg-black',
  starfield: 'bg-black',
  'neural-network': 'bg-gradient-to-br from-slate-900 to-slate-800',
  holographic: 'bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500',
  hyperdrive: 'bg-gradient-to-br from-indigo-950 to-purple-950',
  bokeh: 'bg-gradient-to-br from-indigo-900 to-purple-900',
  confetti: 'bg-gradient-to-br from-pink-500 to-orange-400',
  rain: 'bg-gradient-to-b from-slate-800 to-slate-900',
  smoke: 'bg-gradient-to-br from-gray-800 to-gray-900',
  nebula: 'bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900',
  plasma: 'bg-gradient-to-br from-orange-600 via-red-600 to-purple-700',
  lava: 'bg-gradient-to-b from-red-900 via-orange-800 to-yellow-600',
  cells: 'bg-gradient-to-br from-emerald-900 to-teal-800',
  circuits: 'bg-gradient-to-br from-slate-900 to-cyan-900',
  constellation: 'bg-black',
  crystal: 'bg-gradient-to-br from-cyan-400 to-blue-600',
  dunes: 'bg-gradient-to-br from-amber-700 to-orange-900',
  embers: 'bg-gradient-to-b from-red-950 to-orange-950',
  fireflies: 'bg-gradient-to-b from-slate-950 to-emerald-950',
  'geometric-grid': 'bg-gradient-to-br from-slate-900 to-slate-800',
  glitch: 'bg-black',
  grid: 'bg-gradient-to-br from-slate-900 to-slate-800',
  hex: 'bg-gradient-to-br from-violet-900 to-purple-800',
  ink: 'bg-gradient-to-br from-slate-900 to-slate-950',
  metaballs: 'bg-gradient-to-br from-fuchsia-600 to-purple-700',
  moire: 'bg-gradient-to-br from-slate-900 to-slate-800',
  noise: 'bg-gradient-to-br from-slate-800 to-slate-900',
  orbit: 'bg-black',
  prism: 'bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500',
  radar: 'bg-gradient-to-br from-slate-950 to-emerald-950',
  ribbons: 'bg-gradient-to-br from-indigo-600 to-purple-600',
  rings: 'bg-black',
  shards: 'bg-gradient-to-br from-slate-800 to-slate-900',
  silk: 'bg-gradient-to-br from-rose-400 via-purple-400 to-cyan-400',
  spiral: 'bg-gradient-to-br from-violet-900 to-indigo-900',
  topo: 'bg-gradient-to-br from-slate-800 to-slate-900',
  voronoi: 'bg-gradient-to-br from-slate-900 to-slate-800',
  warp: 'bg-gradient-to-br from-blue-900 to-purple-900',
  waves: 'bg-gradient-to-b from-blue-600 to-cyan-500',
  // Seeded backgrounds fallbacks
  'waves-ocean': 'bg-gradient-to-b from-blue-600 to-cyan-700',
  bubbles: 'bg-gradient-to-br from-sky-400 to-blue-600',
  ripple: 'bg-gradient-to-br from-cyan-600 to-blue-800',
  'dots-wave': 'bg-gradient-to-br from-slate-800 to-slate-900',
  terrain: 'bg-gradient-to-b from-emerald-800 to-slate-900',
  snow: 'bg-gradient-to-b from-slate-700 to-slate-900',
  'northern-lights':
    'bg-gradient-to-tr from-green-500 via-blue-500 to-purple-600',
  cubefield: 'bg-gradient-to-br from-slate-900 to-indigo-950',
  liquid: 'bg-gradient-to-br from-cyan-500 to-purple-600',
  'particles-attract': 'bg-gradient-to-br from-slate-900 to-slate-800',
  clouds: 'bg-gradient-to-b from-sky-400 to-blue-200',
  'electric-field': 'bg-gradient-to-br from-blue-900 to-purple-900',
  'morphing-blobs':
    'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500',
  'geometric-tunnel': 'bg-gradient-to-br from-slate-900 to-indigo-900',
  'neon-lines': 'bg-gradient-to-br from-pink-600 to-purple-800',
  galaxy: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black',
  'pulse-grid': 'bg-gradient-to-br from-slate-900 to-cyan-950',
  sunburst: 'bg-gradient-to-br from-orange-500 to-yellow-400',
  ascii: 'bg-black',
  'fluid-sim': 'bg-gradient-to-br from-cyan-600 to-purple-700',
  vortex: 'bg-gradient-to-br from-purple-900 to-indigo-950',
  pixelate: 'bg-gradient-to-br from-pink-600 to-purple-700',
  caustics: 'bg-gradient-to-b from-cyan-600 to-blue-800',
  'mesh-gradient': 'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500',
  starburst: 'bg-gradient-to-br from-yellow-500 to-orange-600',
  synthwave: 'bg-gradient-to-b from-purple-900 via-pink-800 to-cyan-600',
  firewall: 'bg-gradient-to-br from-red-900 to-orange-800',
  leaves: 'bg-gradient-to-b from-amber-600 to-orange-800',
  'network-graph': 'bg-gradient-to-br from-slate-900 to-cyan-900',
  diamonds: 'bg-gradient-to-br from-cyan-400 to-blue-600',
  'dna-helix': 'bg-gradient-to-b from-slate-950 to-indigo-950',
  fireworks: 'bg-black',
  watercolor: 'bg-gradient-to-br from-amber-50 to-pink-100',
  sakura: 'bg-gradient-to-b from-pink-200 to-pink-400',
  'ocean-waves': 'bg-gradient-to-b from-blue-400 to-blue-800',
  'retro-sun': 'bg-gradient-to-b from-purple-900 via-pink-700 to-orange-500',
  'geometric-shapes': 'bg-gradient-to-br from-slate-900 to-indigo-950',
  'galaxy-spiral': 'bg-black',
  'electric-storm': 'bg-gradient-to-b from-slate-950 to-indigo-950',
  'pixel-rain': 'bg-black',
  'neon-city': 'bg-gradient-to-b from-slate-950 to-purple-950',
  'binary-rain': 'bg-black',
  'aurora-waves': 'bg-gradient-to-b from-slate-950 to-purple-950',
  'laser-grid': 'bg-gradient-to-b from-black to-purple-950',
  'meteor-shower': 'bg-gradient-to-b from-slate-950 to-indigo-950',
  'waves-3d': 'bg-gradient-to-b from-slate-900 to-blue-950',
  'hexagon-pulse': 'bg-slate-950',
  'color-burst': 'bg-black',
  'tunnel-warp': 'bg-black',
  soundwave: 'bg-slate-950',
  'falling-leaves': 'bg-gradient-to-b from-sky-400 to-sky-200',
  'geometric-rain': 'bg-gradient-to-b from-slate-900 to-indigo-950',
  'neon-rings': 'bg-slate-950',
  'code-matrix': 'bg-gradient-to-b from-slate-950 to-cyan-950',
  'cosmic-dust': 'bg-gradient-to-b from-slate-950 to-purple-950',
  'electric-arc': 'bg-gradient-to-b from-slate-950 to-indigo-950',
  'wave-gradient': 'bg-gradient-to-br from-blue-600 to-purple-600',
  'clock-gears': 'bg-gradient-to-b from-amber-900 to-stone-900',
  'rain-drops': 'bg-gradient-to-b from-slate-800 to-cyan-950',
  'sand-particles': 'bg-gradient-to-b from-amber-600 to-amber-800',
  'breathing-circles': 'bg-slate-950',
  'lightning-bugs': 'bg-gradient-to-b from-slate-900 to-slate-950',
  pinwheel: 'bg-slate-950',
  'ripple-pond': 'bg-gradient-to-b from-blue-900 to-blue-950',
  'floating-diamonds': 'bg-gradient-to-b from-slate-900 to-indigo-950',
  'sound-bars': 'bg-gradient-to-b from-slate-950 to-indigo-950',
  'neon-pulse': 'bg-slate-950',
  'hexagon-grid': 'bg-gradient-to-b from-slate-900 to-cyan-950',
  'circuit-flow': 'bg-gradient-to-b from-slate-900 to-cyan-950',
  'morphing-shapes': 'bg-gradient-to-b from-slate-900 to-purple-950',
  'dandelion-seeds': 'bg-gradient-to-b from-sky-300 to-sky-500',
};

interface BackgroundThumbnailProps {
  slug: string;
  className?: string;
}

function LoadingFallback({ slug }: { slug: string }) {
  const style =
    fallbackStyles[slug] || 'bg-gradient-to-br from-gray-800 to-gray-900';
  return (
    <div
      className={`absolute inset-0 ${style} flex items-center justify-center`}
    >
      <Sparkles className="w-6 h-6 text-white/30 animate-pulse" />
    </div>
  );
}

export function BackgroundThumbnail({
  slug,
  className = '',
}: BackgroundThumbnailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track if component has ever been visible (for lazy loading)
  useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isVisible, hasLoaded]);

  // Use IntersectionObserver for lazy loading AND animation control
  // Track visibility continuously to pause animations when out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '50px', threshold: 0 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const BackgroundComponent = useMemo(() => {
    return backgroundComponents[slug as keyof typeof backgroundComponents];
  }, [slug]);

  const fallbackStyle =
    fallbackStyles[slug] || 'bg-gradient-to-br from-gray-800 to-gray-900';

  // If no component found or error, show fallback
  if (!BackgroundComponent || hasError) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
      >
        <div
          className={`absolute inset-0 ${fallbackStyle} flex items-center justify-center`}
        >
          <Sparkles className="w-6 h-6 text-white/30" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Scaled container - renders a larger viewport and shows center portion */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          // Scale down the full-screen background to fit in thumbnail
          transform: 'scale(0.25)',
          transformOrigin: 'center center',
          width: '400%',
          height: '400%',
          left: '-150%',
          top: '-150%',
        }}
      >
        {hasLoaded ? (
          isVisible ? (
            <Suspense fallback={<LoadingFallback slug={slug} />}>
              <div className="w-full h-full relative">
                <ErrorBoundary
                  fallback={<LoadingFallback slug={slug} />}
                  onError={() => setHasError(true)}
                >
                  <BackgroundComponent />
                </ErrorBoundary>
              </div>
            </Suspense>
          ) : (
            // Show static fallback when scrolled out of view to save CPU
            <LoadingFallback slug={slug} />
          )
        ) : (
          <LoadingFallback slug={slug} />
        )}
      </div>

      {/* Subtle overlay to soften the preview */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback: React.ReactNode;
    onError?: () => void;
  },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
