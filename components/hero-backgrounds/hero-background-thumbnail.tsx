'use client';

import { cn } from '@/lib/utils';
import { Suspense, lazy, memo } from 'react';

const heroBackgroundComponents: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  'aurora-curtain': lazy(() =>
    import('./aurora-curtain-hero').then(m => ({
      default: m.AuroraCurtainHero,
    })),
  ),
  'aurora-sweep': lazy(() =>
    import('./aurora-sweep-hero').then(m => ({ default: m.AuroraSweepHero })),
  ),
  'aurora-waves': lazy(() =>
    import('./aurora-waves-hero').then(m => ({ default: m.AuroraWavesHero })),
  ),
  'binary-rain': lazy(() =>
    import('./binary-rain-hero').then(m => ({ default: m.BinaryRainHero })),
  ),
  'blob-morph': lazy(() =>
    import('./blob-morph-hero').then(m => ({ default: m.BlobMorphHero })),
  ),
  bubbles: lazy(() =>
    import('./bubbles-hero').then(m => ({ default: m.BubblesHero })),
  ),
  'circuit-board': lazy(() =>
    import('./circuit-board-hero').then(m => ({ default: m.CircuitBoardHero })),
  ),
  'circuit-trace': lazy(() =>
    import('./circuit-trace-hero').then(m => ({ default: m.CircuitTraceHero })),
  ),
  constellation: lazy(() =>
    import('./constellation-hero').then(m => ({
      default: m.ConstellationHero,
    })),
  ),
  'corner-glow': lazy(() =>
    import('./corner-glow-hero').then(m => ({ default: m.CornerGlowHero })),
  ),
  'crystal-shards': lazy(() =>
    import('./crystal-shards-hero').then(m => ({
      default: m.CrystalShardsHero,
    })),
  ),
  'cyber-grid': lazy(() =>
    import('./cyber-grid-hero').then(m => ({ default: m.CyberGridHero })),
  ),
  'depth-layers': lazy(() =>
    import('./depth-layers-hero').then(m => ({ default: m.DepthLayersHero })),
  ),
  'diagonal-lines': lazy(() =>
    import('./diagonal-lines-hero').then(m => ({
      default: m.DiagonalLinesHero,
    })),
  ),
  'diamond-grid': lazy(() =>
    import('./diamond-grid-hero').then(m => ({ default: m.DiamondGridHero })),
  ),
  'dna-helix': lazy(() =>
    import('./dna-helix-hero').then(m => ({ default: m.DnaHelixHero })),
  ),
  'dot-grid': lazy(() =>
    import('./dot-grid-hero').then(m => ({ default: m.DotGridHero })),
  ),
  'dust-particles': lazy(() =>
    import('./dust-particles-hero').then(m => ({
      default: m.DustParticlesHero,
    })),
  ),
  'electric-arc': lazy(() =>
    import('./electric-arc-hero').then(m => ({ default: m.ElectricArcHero })),
  ),
  'electric-field': lazy(() =>
    import('./electric-field-hero').then(m => ({
      default: m.ElectricFieldHero,
    })),
  ),
  'falling-leaves': lazy(() =>
    import('./falling-leaves-hero').then(m => ({
      default: m.FallingLeavesHero,
    })),
  ),
  'fire-embers': lazy(() =>
    import('./fire-embers-hero').then(m => ({ default: m.FireEmbersHero })),
  ),
  'floating-shapes': lazy(() =>
    import('./floating-shapes-hero').then(m => ({
      default: m.FloatingShapesHero,
    })),
  ),
  'flowing-lines': lazy(() =>
    import('./flowing-lines-hero').then(m => ({ default: m.FlowingLinesHero })),
  ),
  'fog-mist': lazy(() =>
    import('./fog-mist-hero').then(m => ({ default: m.FogMistHero })),
  ),
  'fractal-tree': lazy(() =>
    import('./fractal-tree-hero').then(m => ({ default: m.FractalTreeHero })),
  ),
  'galaxy-spiral': lazy(() =>
    import('./galaxy-spiral-hero').then(m => ({ default: m.GalaxySpiralHero })),
  ),
  'geometric-explosion': lazy(() =>
    import('./geometric-explosion-hero').then(m => ({
      default: m.GeometricExplosionHero,
    })),
  ),
  'geometric-float': lazy(() =>
    import('./geometric-float-hero').then(m => ({
      default: m.GeometricFloatHero,
    })),
  ),
  'glitch-matrix': lazy(() =>
    import('./glitch-matrix-hero').then(m => ({ default: m.GlitchMatrixHero })),
  ),
  'glowing-lines': lazy(() =>
    import('./glowing-lines-hero').then(m => ({ default: m.GlowingLinesHero })),
  ),
  'gradient-mesh': lazy(() =>
    import('./gradient-mesh-hero').then(m => ({ default: m.GradientMeshHero })),
  ),
  'gradient-sweep': lazy(() =>
    import('./gradient-sweep-hero').then(m => ({
      default: m.GradientSweepHero,
    })),
  ),
  'gravity-particles': lazy(() =>
    import('./gravity-particles-hero').then(m => ({
      default: m.GravityParticlesHero,
    })),
  ),
  'hexagon-mesh': lazy(() =>
    import('./hexagon-mesh-hero').then(m => ({ default: m.HexagonMeshHero })),
  ),
  holographic: lazy(() =>
    import('./holographic-hero').then(m => ({ default: m.HolographicHero })),
  ),
  honeycomb: lazy(() =>
    import('./honeycomb-hero').then(m => ({ default: m.HoneycombHero })),
  ),
  'ink-spread': lazy(() =>
    import('./ink-spread-hero').then(m => ({ default: m.InkSpreadHero })),
  ),
  'light-rays': lazy(() =>
    import('./light-rays-hero').then(m => ({ default: m.LightRaysHero })),
  ),
  'lightning-storm': lazy(() =>
    import('./lightning-storm-hero').then(m => ({
      default: m.LightningStormHero,
    })),
  ),
  'liquid-gradient': lazy(() =>
    import('./liquid-gradient-hero').then(m => ({
      default: m.LiquidGradientHero,
    })),
  ),
  'liquid-metal': lazy(() =>
    import('./liquid-metal-hero').then(m => ({ default: m.LiquidMetalHero })),
  ),
  'meteor-shower': lazy(() =>
    import('./meteor-shower-hero').then(m => ({ default: m.MeteorShowerHero })),
  ),
  'morphing-rings': lazy(() =>
    import('./morphing-rings-hero').then(m => ({
      default: m.MorphingRingsHero,
    })),
  ),
  'mountain-layers': lazy(() =>
    import('./mountain-layers-hero').then(m => ({
      default: m.MountainLayersHero,
    })),
  ),
  'nebula-cloud': lazy(() =>
    import('./nebula-cloud-hero').then(m => ({ default: m.NebulaCloudHero })),
  ),
  'neon-rain': lazy(() =>
    import('./neon-rain-hero').then(m => ({ default: m.NeonRainHero })),
  ),
  'neural-network': lazy(() =>
    import('./neural-network-hero').then(m => ({
      default: m.NeuralNetworkHero,
    })),
  ),
  'noise-gradient': lazy(() =>
    import('./noise-gradient-hero').then(m => ({
      default: m.NoiseGradientHero,
    })),
  ),
  'northern-lights': lazy(() =>
    import('./northern-lights-hero').then(m => ({
      default: m.NorthernLightsHero,
    })),
  ),
  'ocean-waves': lazy(() =>
    import('./ocean-waves-hero').then(m => ({ default: m.OceanWavesHero })),
  ),
  'orb-cluster': lazy(() =>
    import('./orb-cluster-hero').then(m => ({ default: m.OrbClusterHero })),
  ),
  'parallax-stars': lazy(() =>
    import('./parallax-stars-hero').then(m => ({
      default: m.ParallaxStarsHero,
    })),
  ),
  'particle-constellation': lazy(() =>
    import('./particle-constellation-hero').then(m => ({
      default: m.ParticleConstellationHero,
    })),
  ),
  'particle-swarm': lazy(() =>
    import('./particle-swarm-hero').then(m => ({
      default: m.ParticleSwarmHero,
    })),
  ),
  'plasma-waves': lazy(() =>
    import('./plasma-waves-hero').then(m => ({ default: m.PlasmaWavesHero })),
  ),
  'prism-light': lazy(() =>
    import('./prism-light-hero').then(m => ({ default: m.PrismLightHero })),
  ),
  'pulse-rings': lazy(() =>
    import('./pulse-rings-hero').then(m => ({ default: m.PulseRingsHero })),
  ),
  'radial-burst': lazy(() =>
    import('./radial-burst-hero').then(m => ({ default: m.RadialBurstHero })),
  ),
  'retro-sun': lazy(() =>
    import('./retro-sun-hero').then(m => ({ default: m.RetroSunHero })),
  ),
  'ripple-effect': lazy(() =>
    import('./ripple-effect-hero').then(m => ({ default: m.RippleEffectHero })),
  ),
  'shimmer-wave': lazy(() =>
    import('./shimmer-wave-hero').then(m => ({ default: m.ShimmerWaveHero })),
  ),
  'smoke-wisps': lazy(() =>
    import('./smoke-wisps-hero').then(m => ({ default: m.SmokeWispsHero })),
  ),
  'snow-fall': lazy(() =>
    import('./snow-fall-hero').then(m => ({ default: m.SnowFallHero })),
  ),
  'soft-particles': lazy(() =>
    import('./soft-particles-hero').then(m => ({
      default: m.SoftParticlesHero,
    })),
  ),
  'sound-visualizer': lazy(() =>
    import('./sound-visualizer-hero').then(m => ({
      default: m.SoundVisualizerHero,
    })),
  ),
  'spotlight-glow': lazy(() =>
    import('./spotlight-glow-hero').then(m => ({
      default: m.SpotlightGlowHero,
    })),
  ),
  topography: lazy(() =>
    import('./topography-hero').then(m => ({ default: m.TopographyHero })),
  ),
  'vortex-spiral': lazy(() =>
    import('./vortex-spiral-hero').then(m => ({ default: m.VortexSpiralHero })),
  ),
  'warp-tunnel': lazy(() =>
    import('./warp-tunnel-hero').then(m => ({ default: m.WarpTunnelHero })),
  ),
  'wave-divider': lazy(() =>
    import('./wave-divider-hero').then(m => ({ default: m.WaveDividerHero })),
  ),
  'wave-mesh': lazy(() =>
    import('./wave-mesh-hero').then(m => ({ default: m.WaveMeshHero })),
  ),
  'aurora-shimmer': lazy(() =>
    import('./aurora-shimmer-hero').then(m => ({
      default: m.AuroraShimmerHero,
    })),
  ),
  'bamboo-wind': lazy(() =>
    import('./bamboo-wind-hero').then(m => ({ default: m.BambooWindHero })),
  ),
  'candle-flicker': lazy(() =>
    import('./candle-flicker-hero').then(m => ({
      default: m.CandleFlickerHero,
    })),
  ),
  'canopy-light': lazy(() =>
    import('./canopy-light-hero').then(m => ({ default: m.CanopyLightHero })),
  ),
  'cherry-blossom': lazy(() =>
    import('./cherry-blossom-hero').then(m => ({
      default: m.CherryBlossomHero,
    })),
  ),
  'cloud-drift': lazy(() =>
    import('./cloud-drift-hero').then(m => ({ default: m.CloudDriftHero })),
  ),
  'comet-trail': lazy(() =>
    import('./comet-trail-hero').then(m => ({ default: m.CometTrailHero })),
  ),
  dewdrop: lazy(() =>
    import('./dewdrop-hero').then(m => ({ default: m.DewdropHero })),
  ),
  'dot-wave': lazy(() =>
    import('./dot-wave-hero').then(m => ({ default: m.DotWaveHero })),
  ),
  'feather-float': lazy(() =>
    import('./feather-float-hero').then(m => ({ default: m.FeatherFloatHero })),
  ),
  'firefly-dance': lazy(() =>
    import('./firefly-dance-hero').then(m => ({ default: m.FireflyDanceHero })),
  ),
  'gentle-breeze': lazy(() =>
    import('./gentle-breeze-hero').then(m => ({ default: m.GentleBreezeHero })),
  ),
  'gradient-orbs': lazy(() =>
    import('./gradient-orbs-hero').then(m => ({ default: m.GradientOrbsHero })),
  ),
  'grass-sway': lazy(() =>
    import('./grass-sway-hero').then(m => ({ default: m.GrassSwayHero })),
  ),
  'horizon-glow': lazy(() =>
    import('./horizon-glow-hero').then(m => ({ default: m.HorizonGlowHero })),
  ),
  'ink-wash': lazy(() =>
    import('./ink-wash-hero').then(m => ({ default: m.InkWashHero })),
  ),
  'koi-pond': lazy(() =>
    import('./koi-pond-hero').then(m => ({ default: m.KoiPondHero })),
  ),
  'leaf-spiral': lazy(() =>
    import('./leaf-spiral-hero').then(m => ({ default: m.LeafSpiralHero })),
  ),
  'line-weave': lazy(() =>
    import('./line-weave-hero').then(m => ({ default: m.LineWeaveHero })),
  ),
  'lotus-bloom': lazy(() =>
    import('./lotus-bloom-hero').then(m => ({ default: m.LotusBloomHero })),
  ),
  'magnetic-field': lazy(() =>
    import('./magnetic-field-hero').then(m => ({
      default: m.MagneticFieldHero,
    })),
  ),
  'moon-glow': lazy(() =>
    import('./moon-glow-hero').then(m => ({ default: m.MoonGlowHero })),
  ),
  'moon-phases': lazy(() =>
    import('./moon-phases-hero').then(m => ({ default: m.MoonPhasesHero })),
  ),
  'morning-mist': lazy(() =>
    import('./morning-mist-hero').then(m => ({ default: m.MorningMistHero })),
  ),
  'moss-growth': lazy(() =>
    import('./moss-growth-hero').then(m => ({ default: m.MossGrowthHero })),
  ),
  'orbit-trail': lazy(() =>
    import('./orbit-trail-hero').then(m => ({ default: m.OrbitTrailHero })),
  ),
  'paper-fold': lazy(() =>
    import('./paper-fold-hero').then(m => ({ default: m.PaperFoldHero })),
  ),
  'paper-lantern': lazy(() =>
    import('./paper-lantern-hero').then(m => ({ default: m.PaperLanternHero })),
  ),
  'pebble-ripple': lazy(() =>
    import('./pebble-ripple-hero').then(m => ({ default: m.PebbleRippleHero })),
  ),
  'pendulum-wave': lazy(() =>
    import('./pendulum-wave-hero').then(m => ({ default: m.PendulumWaveHero })),
  ),
  'petal-fall': lazy(() =>
    import('./petal-fall-hero').then(m => ({ default: m.PetalFallHero })),
  ),
  'pixel-dissolve': lazy(() =>
    import('./pixel-dissolve-hero').then(m => ({
      default: m.PixelDissolveHero,
    })),
  ),
  'pulse-grid': lazy(() =>
    import('./pulse-grid-hero').then(m => ({ default: m.PulseGridHero })),
  ),
  'quantum-dots': lazy(() =>
    import('./quantum-dots-hero').then(m => ({ default: m.QuantumDotsHero })),
  ),
  'rain-glass': lazy(() =>
    import('./rain-glass-hero').then(m => ({ default: m.RainGlassHero })),
  ),
  'river-flow': lazy(() =>
    import('./river-flow-hero').then(m => ({ default: m.RiverFlowHero })),
  ),
  'sand-dunes': lazy(() =>
    import('./sand-dunes-hero').then(m => ({ default: m.SandDunesHero })),
  ),
  'silk-threads': lazy(() =>
    import('./silk-threads-hero').then(m => ({ default: m.SilkThreadsHero })),
  ),
  'smoke-ring': lazy(() =>
    import('./smoke-ring-hero').then(m => ({ default: m.SmokeRingHero })),
  ),
  'soap-bubble': lazy(() =>
    import('./soap-bubble-hero').then(m => ({ default: m.SoapBubbleHero })),
  ),
  'soundwave-pulse': lazy(() =>
    import('./soundwave-pulse-hero').then(m => ({
      default: m.SoundwavePulseHero,
    })),
  ),
  'spiral-galaxy': lazy(() =>
    import('./spiral-galaxy-hero').then(m => ({ default: m.SpiralGalaxyHero })),
  ),
  'star-trail': lazy(() =>
    import('./star-trail-hero').then(m => ({ default: m.StarTrailHero })),
  ),
  'stone-stack': lazy(() =>
    import('./stone-stack-hero').then(m => ({ default: m.StoneStackHero })),
  ),
  'string-wave': lazy(() =>
    import('./string-wave-hero').then(m => ({ default: m.StringWaveHero })),
  ),
  sunbeam: lazy(() =>
    import('./sunbeam-hero').then(m => ({ default: m.SunbeamHero })),
  ),
  'tide-pool': lazy(() =>
    import('./tide-pool-hero').then(m => ({ default: m.TidePoolHero })),
  ),
  'water-drop': lazy(() =>
    import('./water-drop-hero').then(m => ({ default: m.WaterDropHero })),
  ),
  'wind-chimes': lazy(() =>
    import('./wind-chimes-hero').then(m => ({ default: m.WindChimesHero })),
  ),
  'zen-garden': lazy(() =>
    import('./zen-garden-hero').then(m => ({ default: m.ZenGardenHero })),
  ),
  'zen-ripple': lazy(() =>
    import('./zen-ripple-hero').then(m => ({ default: m.ZenRippleHero })),
  ),
};

const fallbackStyles: Record<string, string> = {
  'aurora-curtain': 'bg-[#0a0a14]',
  'aurora-sweep': 'bg-[#0a0a14]',
  'aurora-waves': 'bg-[#0a0a14]',
  'binary-rain': 'bg-[#0a0f14]',
  'blob-morph': 'bg-[#0a0a12]',
  bubbles: 'bg-[#080810]',
  'circuit-board': 'bg-[#0a0c10]',
  'circuit-trace': 'bg-[#0a0c10]',
  constellation: 'bg-[#06080c]',
  'corner-glow': 'bg-[#0a0a12]',
  'crystal-shards': 'bg-[#08080f]',
  'cyber-grid': 'bg-[#080810]',
  'depth-layers': 'bg-[#0a0a12]',
  'diagonal-lines': 'bg-[#0a0a12]',
  'diamond-grid': 'bg-[#0a0a12]',
  'dna-helix': 'bg-[#0a0e14]',
  'dot-grid': 'bg-[#0a0a12]',
  'dust-particles': 'bg-[#0c0a08]',
  'electric-arc': 'bg-[#08080e]',
  'electric-field': 'bg-[#08080e]',
  'falling-leaves': 'bg-[#0a0c08]',
  'fire-embers': 'bg-[#0f0a0a]',
  'floating-shapes': 'bg-[#0a0a12]',
  'flowing-lines': 'bg-[#0a0a12]',
  'fog-mist': 'bg-[#0a0a0e]',
  'fractal-tree': 'bg-[#080c10]',
  'galaxy-spiral': 'bg-[#06060a]',
  'geometric-explosion': 'bg-[#08080f]',
  'geometric-float': 'bg-[#0a0a12]',
  'glitch-matrix': 'bg-[#050805]',
  'glowing-lines': 'bg-[#0a0a12]',
  'gradient-mesh': 'bg-[#0a0a12]',
  'gradient-sweep': 'bg-[#0a0a12]',
  'gravity-particles': 'bg-[#0a080e]',
  'hexagon-mesh': 'bg-[#080a10]',
  holographic: 'bg-[#0a0a12]',
  honeycomb: 'bg-[#0a0a12]',
  'ink-spread': 'bg-[#0a0a0f]',
  'light-rays': 'bg-[#0a0a10]',
  'lightning-storm': 'bg-[#0a0a12]',
  'liquid-gradient': 'bg-[#0a0a12]',
  'liquid-metal': 'bg-[#0a0a10]',
  'meteor-shower': 'bg-[#060608]',
  'morphing-rings': 'bg-[#0a0a12]',
  'mountain-layers': 'bg-[#0a0c14]',
  'nebula-cloud': 'bg-[#0a0a12]',
  'neon-rain': 'bg-[#08080e]',
  'neural-network': 'bg-[#080810]',
  'noise-gradient': 'bg-[#0a0a12]',
  'northern-lights': 'bg-[#060810]',
  'ocean-waves': 'bg-[#0a1420]',
  'orb-cluster': 'bg-[#0a0a12]',
  'parallax-stars': 'bg-[#060608]',
  'particle-constellation': 'bg-[#0a0a12]',
  'particle-swarm': 'bg-[#080a10]',
  'plasma-waves': 'bg-[#0a0a12]',
  'prism-light': 'bg-[#0a0a12]',
  'pulse-rings': 'bg-[#0a0a12]',
  'radial-burst': 'bg-[#0a0a12]',
  'retro-sun': 'bg-[#12081a]',
  'ripple-effect': 'bg-[#0a0a12]',
  'shimmer-wave': 'bg-[#0a0a12]',
  'smoke-wisps': 'bg-[#0a0a0e]',
  'snow-fall': 'bg-[#0a0c12]',
  'soft-particles': 'bg-[#0a0a12]',
  'sound-visualizer': 'bg-[#08080c]',
  'spotlight-glow': 'bg-[#0a0a12]',
  topography: 'bg-[#0a0a12]',
  'vortex-spiral': 'bg-[#08081a]',
  'warp-tunnel': 'bg-[#060608]',
  'wave-divider': 'bg-[#0a0a12]',
  'wave-mesh': 'bg-[#0a0a12]',
  'aurora-shimmer': 'bg-[#0a0a0f]',
  'bamboo-wind': 'bg-[#0a0a0f]',
  'candle-flicker': 'bg-[#0a0a0f]',
  'canopy-light': 'bg-[#0a0a0f]',
  'cherry-blossom': 'bg-[#0a0a0f]',
  'cloud-drift': 'bg-[#0a0a12]',
  'comet-trail': 'bg-[#0a0a0f]',
  dewdrop: 'bg-[#0a0a0f]',
  'dot-wave': 'bg-[#0a0a0f]',
  'feather-float': 'bg-[#0a0a0f]',
  'firefly-dance': 'bg-[#0a0a0f]',
  'gentle-breeze': 'bg-[#0a0a0f]',
  'gradient-orbs': 'bg-[#0a0a0f]',
  'grass-sway': 'bg-[#0a0a0f]',
  'horizon-glow': 'bg-[#0a0a0f]',
  'ink-wash': 'bg-[#0a0a0f]',
  'koi-pond': 'bg-[#0a0a12]',
  'leaf-spiral': 'bg-[#0a0a0f]',
  'line-weave': 'bg-[#0a0a0f]',
  'lotus-bloom': 'bg-[#0a0a0f]',
  'magnetic-field': 'bg-[#0a0a0f]',
  'moon-glow': 'bg-[#0a0a0f]',
  'moon-phases': 'bg-[#0a0a0f]',
  'morning-mist': 'bg-[#0a0a12]',
  'moss-growth': 'bg-[#0a0a0f]',
  'orbit-trail': 'bg-[#0a0a0f]',
  'paper-fold': 'bg-[#0a0a0f]',
  'paper-lantern': 'bg-[#0a0a0f]',
  'pebble-ripple': 'bg-[#0a0a12]',
  'pendulum-wave': 'bg-[#0a0a0f]',
  'petal-fall': 'bg-[#0a0a0f]',
  'pixel-dissolve': 'bg-[#0a0a0f]',
  'pulse-grid': 'bg-[#0a0a0f]',
  'quantum-dots': 'bg-[#0a0a0f]',
  'rain-glass': 'bg-[#0a0a0f]',
  'river-flow': 'bg-[#0a0a12]',
  'sand-dunes': 'bg-[#0a0a0f]',
  'silk-threads': 'bg-[#0a0a0f]',
  'smoke-ring': 'bg-[#0a0a0f]',
  'soap-bubble': 'bg-[#0a0a0f]',
  'soundwave-pulse': 'bg-[#0a0a0f]',
  'spiral-galaxy': 'bg-[#0a0a0f]',
  'star-trail': 'bg-[#0a0a0f]',
  'stone-stack': 'bg-[#0a0a0f]',
  'string-wave': 'bg-[#0a0a0f]',
  sunbeam: 'bg-[#0a0a0f]',
  'tide-pool': 'bg-[#0a0a12]',
  'water-drop': 'bg-[#0a0a12]',
  'wind-chimes': 'bg-[#0a0a0f]',
  'zen-garden': 'bg-[#0a0a0f]',
  'zen-ripple': 'bg-[#0a0a0f]',
};

interface HeroBackgroundThumbnailProps {
  slug: string;
  className?: string;
  showHeroText?: boolean;
}

export const HeroBackgroundThumbnail = memo(function HeroBackgroundThumbnail({
  slug,
  className,
  showHeroText = false,
}: HeroBackgroundThumbnailProps) {
  const Component = heroBackgroundComponents[slug];
  const fallback = fallbackStyles[slug] || 'bg-slate-900';

  return (
    <div className={cn('relative overflow-hidden', fallback, className)}>
      {Component ? (
        <Suspense fallback={<div className="absolute inset-0" />}>
          <Component />
        </Suspense>
      ) : (
        <div className="absolute inset-0" />
      )}

      {showHeroText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10">
          <h2 className="text-white text-lg font-bold tracking-tight drop-shadow-lg">
            Your Hero Title
          </h2>
          <p className="text-white/70 text-xs mt-1 max-w-[80%] drop-shadow">
            Compelling subtitle text here
          </p>
        </div>
      )}
    </div>
  );
});
