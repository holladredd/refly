import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch, FiFolder, FiCpu, FiFileText } from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <Head>
        <title>Refly - AI Creator Research Platform</title>
        <meta name="description" content="Scout references, media resources, and ideas for your next creative project using AI." />
      </Head>

      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-gray-900">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Refly Logo"
            width={36}
            height={36}
            className="rounded-lg object-contain"
          />
          <span className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Refly
          </span>
        </div>
        <nav className="flex items-center gap-6">
          {user ? (
            <Link
              href="/chat"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-105"
            >
              Start Researching <FiArrowRight />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-105"
              >
                Get Started <FiArrowRight />
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-full py-1.5 px-4 text-xs font-semibold text-blue-400 mb-8 uppercase tracking-wider">
            🚀 Introducing Refly v1.0
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            The AI Research Engine for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Creators
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Scout references, cinematic stock media, and audio resources instantly. Chat with multiple AI models to plan and organize your next viral project.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/chat"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10 text-lg hover:scale-105"
            >
              Start Researching <FiArrowRight className="text-xl" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto bg-gray-900 border border-gray-800 hover:bg-gray-850 text-gray-300 hover:text-white font-semibold py-4 px-8 rounded-xl transition-colors text-lg"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="bg-gray-900/50 border-t border-gray-900 py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Engineered for Creative Minds</h2>
            <p className="text-gray-400">Everything you need to conceptualize and package your ideas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-950 border border-gray-900 p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 text-xl border border-blue-500/20">
                <FiSearch />
              </div>
              <h3 className="text-xl font-semibold">Instant Media Discovery</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Describe the shot you want, and Refly automatically finds cinematic drone footage, vector icons, and templates across free libraries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-950 border border-gray-900 p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 text-xl border border-purple-500/20">
                <FiCpu />
              </div>
              <h3 className="text-xl font-semibold">Multiple AI Providers</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Toggle seamlessly between OpenAI models and Grok to find the best partner for outline structuring or creative storytelling.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-950 border border-gray-900 p-8 rounded-2xl flex flex-col gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 text-xl border border-emerald-500/20">
                <FiFolder />
              </div>
              <h3 className="text-xl font-semibold">Organized Research</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Save media resources, copy direct source links, or download audio assets directly to compile your project's moodboard instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Refly AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
