'use client';

import { Button } from '@summoniq/applab-ui';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Brain,
  ChevronDown,
  Code,
  Copy,
  Eye,
  Heart,
  Mail,
  MessageSquare,
  Palette,
  RockingChair,
  Settings,
  Sparkles,
  Star,
  Type,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { HeroBackground } from './_components/hero-background';
import { ThemeHeader } from './_components/theme-header';
import './maczen.css';

export default function ZenThemePage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header with back button and theme name */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/themes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <span className="rounded-lg bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 p-1.5">
          <RockingChair className="h-4 w-4 text-white" />
        </span>
        <div className="flex flex-col">
          <span className="font-semibold leading-tight">Zen Theme</span>
          <span className="text-xs text-muted-foreground">
            Purple/Fuchsia/Pink gradient with glass morphism
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Theme Preview Container */}
        <div className="maczen-app min-h-screen bg-white">
          {/* Theme Header */}
          <ThemeHeader themeName="Zen" />

          {/* Hero Section */}
          <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-white to-sky-50/25 pt-16">
            <HeroBackground />
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border-x border-x-white/10 border-t border-t-white/70 bg-white/35 pl-3 pr-3.5 py-1.5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.06)] backdrop-blur-lg">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 shadow-sm shadow-purple-500/20">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="font-medium text-gray-900">
                    Zen Theme Preview
                  </span>
                </div>

                <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                  Beautiful{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                    Gradients
                  </span>{' '}
                  Meet{' '}
                  <span className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                    Glass
                  </span>
                </h1>

                <p className="mb-10 text-xl text-gray-600 sm:text-2xl">
                  A modern design system featuring purple-fuchsia-pink
                  gradients, frosted glass effects, and smooth animations for
                  elevated UX.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border-t border-t-white/70 border-b border-b-black/10 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_28px_-16px_rgba(0,0,0,0.55),0_22px_74px_-34px_rgba(124,58,237,0.65)] transition-all duration-300 hover:-translate-y-[1px] hover:scale-[1.02]">
                    <span className="relative z-10">Primary Action</span>
                    <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-black/45 bg-white/70 px-7 py-3.5 text-base font-semibold text-gray-900 shadow-sm backdrop-blur-md transition-all hover:border-black/55 hover:bg-white/80">
                    <span className="relative z-10">Secondary Action</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-bounce pb-8">
              <ChevronDown className="h-8 w-8 text-gray-400" />
            </div>
          </section>

          {/* Color Palette */}
          <section id="colors" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                    Color Palette
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                  Theme Colors
                </h2>
                <p className="text-lg text-gray-600">
                  The Zen palette combines vibrant purples and pinks with
                  neutral grays
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
                {[
                  {
                    name: 'Purple 600',
                    hex: '#9333ea',
                    class: 'bg-purple-600',
                  },
                  {
                    name: 'Fuchsia 600',
                    hex: '#c026d3',
                    class: 'bg-fuchsia-600',
                  },
                  { name: 'Pink 600', hex: '#db2777', class: 'bg-pink-600' },
                  { name: 'Gray 900', hex: '#111827', class: 'bg-gray-900' },
                ].map((color, i) => (
                  <div key={i} className="group">
                    <div
                      className={`${color.class} h-24 rounded-xl shadow-lg transition-transform group-hover:scale-105`}
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {color.name}
                      </span>
                      <code className="text-sm text-gray-500">{color.hex}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 max-w-3xl mx-auto">
                <p className="text-center text-white font-medium">
                  Primary Gradient: from-purple-600 via-fuchsia-600 to-pink-600
                </p>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section
            id="typography"
            className="py-20 bg-gradient-to-b from-white to-fuchsia-50/30"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Type className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                    Typography
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                  Type Scale
                </h2>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="text-xs text-gray-500 mb-2">
                    Display / 7xl
                  </div>
                  <p className="text-7xl font-bold tracking-tight text-gray-900">
                    Heading One
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="text-xs text-gray-500 mb-2">H1 / 5xl</div>
                  <p className="text-5xl font-bold tracking-tight text-gray-900">
                    Heading Two
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="text-xs text-gray-500 mb-2">H2 / 4xl</div>
                  <p className="text-4xl font-bold text-gray-900">
                    Heading Three
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="text-xs text-gray-500 mb-2">H3 / 2xl</div>
                  <p className="text-2xl font-semibold text-gray-900">
                    Heading Four
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="text-xs text-gray-500 mb-2">Body / xl</div>
                  <p className="text-xl text-gray-600">
                    Body text for larger paragraphs and introductions. The quick
                    brown fox jumps over the lazy dog.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="text-xs text-gray-500 mb-2">Body / base</div>
                  <p className="text-base text-gray-600">
                    Standard body text for general content. The quick brown fox
                    jumps over the lazy dog. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit.
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                  <div className="text-xs text-gray-500 mb-2">
                    Gradient Text
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                    Beautiful Gradient Headlines
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section id="buttons" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                    Buttons
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                  Button Styles
                </h2>
              </div>

              <div className="max-w-4xl mx-auto space-y-12">
                {/* Primary Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Primary (Gradient)
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
                      Large Button
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg">
                      Medium Button
                    </button>
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition-all hover:shadow-md">
                      Small
                    </button>
                  </div>
                </div>

                {/* Secondary Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Secondary (Glass)
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full border border-black/45 bg-white/70 px-6 py-3 text-base font-semibold text-gray-900 shadow-sm backdrop-blur-md transition-all hover:bg-white/90">
                      Large Button
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-full border border-black/45 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm backdrop-blur-md transition-all hover:bg-white/90">
                      Medium Button
                    </button>
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-full border border-black/45 bg-white/70 px-3 py-1.5 text-xs font-semibold text-gray-900 backdrop-blur-md transition-all hover:bg-white/90">
                      Small
                    </button>
                  </div>
                </div>

                {/* Solid Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Solid
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-purple-700">
                      Purple
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-fuchsia-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-fuchsia-700">
                      Fuchsia
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-pink-700">
                      Pink
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-gray-800">
                      Dark
                    </button>
                  </div>
                </div>

                {/* Icon Buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    With Icons
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg">
                      <Mail className="h-5 w-5" />
                      Send Email
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 transition-all hover:border-purple-300">
                      <Copy className="h-5 w-5" />
                      Copy
                    </button>
                    <button className="inline-flex items-center justify-center rounded-full bg-purple-100 p-3 text-purple-600 transition-all hover:bg-purple-200">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 p-3 text-white shadow-lg">
                      <Bell className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cards */}
          <section
            id="cards"
            className="py-20 bg-gradient-to-b from-fuchsia-50/30 to-white"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Code className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                    Components
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                  Card Styles
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {/* Feature Card */}
                <div className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-purple-300 hover:shadow-lg">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Brain className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Feature Card
                  </h3>
                  <p className="text-gray-600">
                    Standard feature card with icon, hover border, and shadow
                    effects.
                  </p>
                </div>

                {/* Glass Card */}
                <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 p-8 shadow-lg">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Glass Card
                  </h3>
                  <p className="text-gray-600">
                    Frosted glass effect with backdrop blur for modern
                    aesthetics.
                  </p>
                </div>

                {/* Gradient Border Card */}
                <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600">
                  <div className="rounded-[14px] bg-white p-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-fuchsia-100">
                      <Sparkles className="h-6 w-6 text-fuchsia-600" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      Gradient Border
                    </h3>
                    <p className="text-gray-600">
                      Card with gradient border effect using pseudo-element
                      technique.
                    </p>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-2xl font-bold text-white">
                    JD
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Jane Doe
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Product Designer</p>
                  <div className="flex justify-center gap-2">
                    <button className="rounded-full bg-purple-100 p-2 text-purple-600 hover:bg-purple-200">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="rounded-full bg-purple-100 p-2 text-purple-600 hover:bg-purple-200">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Testimonial Card */}
                <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-gray-900">
                    &quot;This theme is absolutely beautiful. The gradients and
                    glass effects create such a premium feel.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-sm font-semibold text-white">
                      AK
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Alex Kim
                      </div>
                      <div className="text-sm text-gray-600">CEO, TechCorp</div>
                    </div>
                  </div>
                </div>

                {/* Stats Card */}
                <div className="rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 p-8 text-white">
                  <div className="text-5xl font-bold mb-2">99.9%</div>
                  <div className="text-white/80 mb-4">Uptime guaranteed</div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <div className="font-bold">24/7</div>
                      <div className="text-white/70">Support</div>
                    </div>
                    <div>
                      <div className="font-bold">150+</div>
                      <div className="text-white/70">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Elements */}
          <section id="forms" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600 uppercase tracking-wider">
                    Forms
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                  Form Elements
                </h2>
              </div>

              <div className="max-w-xl mx-auto space-y-6 p-8 rounded-2xl border border-gray-200 bg-white">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="johndoe"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Type your message..."
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the terms and conditions
                  </label>
                </div>

                <button className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl">
                  Submit Form
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Badges & Pills */}
          <section className="py-20 bg-gradient-to-b from-fuchsia-50/30 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                  Badges & Pills
                </h2>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 px-3 py-1 text-sm font-medium text-fuchsia-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-600" />
                    In Progress
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
                    Review
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    Draft
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-3 py-1 text-sm font-medium text-white">
                    New
                  </span>
                  <span className="inline-flex items-center rounded-full border border-purple-300 bg-white px-3 py-1 text-sm font-medium text-purple-700">
                    Outline
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-24 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to use the Zen theme?
                </h2>
                <p className="text-xl mb-10 text-white/90">
                  Apply this theme to your project and create beautiful, modern
                  interfaces with stunning gradients and glass effects.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-purple-700 shadow-lg transition-all hover:bg-white/90">
                    Apply Theme
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/50 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10">
                    View Code
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
