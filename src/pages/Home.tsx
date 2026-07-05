import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Sparkles, Send, Flame, Timer, AlertTriangle, 
  Layers, Zap, ShieldAlert, Cpu, ChevronRight, CheckCircle, RefreshCw 
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Stats Counters
  const [gasSaved, setGasSaved] = useState(0);
  const [txSpeed, setTxSpeed] = useState(0);
  const [totalMined, setTotalMined] = useState(0);

  useEffect(() => {
    if (gasSaved < 96) {
      const timer = setTimeout(() => setGasSaved(prev => Math.min(prev + 2, 96)), 30);
      return () => clearTimeout(timer);
    }
  }, [gasSaved]);

  useEffect(() => {
    if (txSpeed < 40) {
      const timer = setTimeout(() => setTxSpeed(prev => Math.min(prev + 1, 40)), 40);
      return () => clearTimeout(timer);
    }
  }, [txSpeed]);

  useEffect(() => {
    if (totalMined < 125000) {
      const timer = setTimeout(() => setTotalMined(prev => Math.min(prev + 2500, 125000)), 20);
      return () => clearTimeout(timer);
    }
  }, [totalMined]);

  const timelineSteps = [
    {
      title: 'Alice sends 0.5 ETH',
      desc: 'Alice initiates a transfer on Ethereum Mainnet to buy a collectible.',
      icon: Send,
      color: 'from-blue-500 to-indigo-500',
      badge: 'Step 1: Initiation',
    },
    {
      title: 'Ethereum gets congested',
      desc: 'Thousands of users compete for limited block space simultaneously.',
      icon: Layers,
      color: 'from-amber-500 to-orange-500',
      badge: 'Step 2: Congestion',
    },
    {
      title: 'Gas fees skyrocket',
      desc: 'Alice must pay an astronomical gas fee ($75+) just to get her transaction processed.',
      icon: Flame,
      color: 'from-rose-500 to-red-500',
      badge: 'Step 3: Fee Surge',
    },
    {
      title: 'Transactions slow down',
      desc: 'Alice refuses to pay high tips, leaving her transaction pending for 45 minutes.',
      icon: Timer,
      color: 'from-purple-500 to-pink-500',
      badge: 'Step 4: Block Latency',
    },
    {
      title: 'Users become frustrated',
      desc: 'The transaction times out. Alice loses her slot, wasting $15 in failed execution fees.',
      icon: AlertTriangle,
      color: 'from-red-600 to-rose-700',
      badge: 'Step 5: Failure',
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % timelineSteps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-700 dark:text-purple-300 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demystifying Ethereum Congestion & Layer 2</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
            >
              Every Transaction <br />
              <span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Has A Journey
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Ethereum is the world’s most secure decentralized computer, but high demand often leads to slow speeds and extreme gas fees. Learn how Arbitrum’s Layer 2 rollups bundle transactions to solve congestion.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                id="hero-cta-explore"
                onClick={() => {
                  const el = document.getElementById('journey-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all cursor-pointer"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-cta-simulator"
                onClick={() => navigate('/simulator')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold transition-all cursor-pointer"
              >
                <span>Mine First Block</span>
                <Cpu className="w-4.5 h-4.5" />
              </button>
            </motion.div>
          </div>

          {/* Large Modern Interactive SVG illustration */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-md aspect-square rounded-3xl bg-slate-900/5 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
            >
              {/* Animated mesh overlay in mockup box */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-cyan-500/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-200/10 dark:border-slate-800/40 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-500">ETHEREUM MAINNET</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/50 text-[10px] font-mono text-slate-400">
                  BLOCK #19283
                </div>
              </div>

              {/* Central interactive illustration */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-6 relative">
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  {/* Outer spinning ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="rgba(147, 51, 234, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="10 15"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Inner spinning ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="32"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Core Cube representing block data */}
                  <polygon points="50,22 75,34 75,64 50,77 25,64 25,34" fill="url(#cube-gradient)" opacity="0.8" />
                  <polyline points="50,22 50,77" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                  <polyline points="50,50 75,34" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                  <polyline points="50,50 25,34" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="cube-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9333ea" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="text-center space-y-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Congestion Level</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
                    <span>Extreme Gas (320 Gwei)</span>
                  </div>
                </div>
              </div>

              {/* Miniature stats footer */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/10 dark:border-slate-800/40 text-center font-mono">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Avg Tx Cost</div>
                  <div className="text-sm font-bold text-rose-500">$64.20</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Speed</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">14 tx/sec</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Second Section: Timeline (Journey of a Transaction) */}
      <section id="journey-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            The Mainnet Bottleneck
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Let’s follow a transaction to see exactly where Ethereum Mainnet gets bogged down. Click on any step below or let the visual simulation guide you automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Interactive Timeline Steps (Left 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {timelineSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  id={`timeline-btn-${idx}`}
                  key={idx}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false); // Pause auto-rotation when user clicks
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 border-purple-500 shadow-lg shadow-purple-500/5'
                      : 'bg-transparent border-slate-200/30 dark:border-slate-800/30 hover:border-slate-300 hover:bg-slate-100/30 dark:hover:bg-slate-800/10'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${step.color} text-white`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                      {step.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {step.title}
                    </h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate-400 shrink-0 self-center transition-transform ${isActive ? 'rotate-90 text-purple-600' : ''}`} />
                  
                  {/* Progress active visual bar inside card */}
                  {isActive && isPlaying && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-purple-500 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4.5, ease: 'linear' }}
                    />
                  )}
                </button>
              );
            })}

            {/* Play Pause Auto rotation panel */}
            <div className="flex items-center justify-between px-2 pt-2 text-xs">
              <span className="text-slate-500 font-medium">Auto-rotating every 4.5 seconds</span>
              <button
                id="timeline-play-toggle"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200"
              >
                <RefreshCw className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} />
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
            </div>
          </div>

          {/* Giant visual panel illustrating current bottleneck step (Right 7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-xl flex flex-col justify-between aspect-video relative overflow-hidden min-h-[360px]"
              >
                {/* Backdrop effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${timelineSteps[activeStep].color} opacity-[0.04] blur-2xl rounded-full`} />

                <div className="flex items-center justify-between border-b border-slate-200/10 dark:border-slate-800/30 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span className="text-xs font-mono font-extrabold text-purple-600 uppercase tracking-widest">
                      {timelineSteps[activeStep].badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-400">
                    STAGE {activeStep + 1} OF 5
                  </div>
                </div>

                {/* Big central graphics representation */}
                <div className="my-8 flex flex-col sm:flex-row gap-6 items-center justify-center">
                  <div className={`p-5 rounded-2xl bg-gradient-to-br ${timelineSteps[activeStep].color} text-white shadow-lg shadow-purple-500/5 flex items-center justify-center`}>
                    {(() => {
                      const Icon = timelineSteps[activeStep].icon;
                      return <Icon className="w-12 h-12" />;
                    })()}
                  </div>
                  
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                      {timelineSteps[activeStep].title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md">
                      {timelineSteps[activeStep].desc}
                    </p>
                  </div>
                </div>

                {/* Simulated Diagnostic Output */}
                <div className="bg-slate-900/5 dark:bg-slate-950/80 rounded-xl p-4 border border-slate-200/40 dark:border-slate-800/40 font-mono text-xs text-slate-500 dark:text-slate-400 space-y-1.5 shadow-inner">
                  <div className="flex justify-between">
                    <span>&gt;_ CONSOLE_STATUS:</span>
                    <span className="text-orange-400 font-bold">WARNING_OVERLOAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&gt;_ PENDING_TX_IN_MEMPOOL:</span>
                    <span className="text-white">162,408 txs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&gt;_ OUTCOME:</span>
                    <span className="text-rose-400 font-semibold">{timelineSteps[activeStep].desc.split(' ').slice(0, 5).join(' ')}...</span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Third Section: Introduce Arbitrum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Why Ethereum needed Layer 2 / What Arbitrum is */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Introducing Layer 2 & Arbitrum</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Scaling Ethereum Securely with Rollups
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed">
              <p>
                <strong>Why Ethereum needed Layer 2:</strong> Mainnet processes transactions sequentially. High usage slows down verification, sparking a bidding war for block inclusion. To scale, Ethereum relies on Layer 2 (L2) companion networks.
              </p>
              <p>
                <strong>What Arbitrum is:</strong> Arbitrum is an <em>Optimistic Rollup</em> L2. It executes thousands of transactions outside of Ethereum Mainnet, aggregates ("rolls") them into a single condensed cryptographic receipt, and posts it back to Layer 1.
              </p>
              <p>
                <strong>How it helps (The Real-World Benefit):</strong> Instead of 100 people paying $50 each to verify 100 individual transfers, Arbitrum rolls all 100 together. The verification fee is shared, slashing gas fees by 95% while keeping the absolute cryptographic security of Ethereum Mainnet.
              </p>
            </div>

            <div className="pt-2">
              <button
                id="cta-go-concepts"
                onClick={() => navigate('/concepts')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-800 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors"
              >
                <span>Compare Web2 vs Web3 Core Concepts</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Layer 2 Rollup Diagram representation */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>Arbitrum Rollup Architecture</span>
              </h3>

              <div className="relative border border-slate-200/30 dark:border-slate-800/30 rounded-2xl p-4 bg-slate-950/20 dark:bg-slate-950/40 space-y-8">
                
                {/* Visual Step 1 */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">Input Txs</span>
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[9px] font-bold text-purple-300">tx</div>
                      <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[9px] font-bold text-purple-300">tx</div>
                      <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-[9px] font-bold text-purple-300">tx</div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs font-bold">💨 processed in 0.25 seconds</div>
                </div>

                {/* Downwards rollup arrow animation */}
                <div className="flex justify-center my-2 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 -translate-y-1/2 z-0" />
                  <div className="relative px-3 py-1 bg-slate-900 text-[10px] font-mono text-cyan-400 font-extrabold rounded-lg border border-slate-800 z-10">
                    OPT_ROLLUP_COMPRESSION (96x)
                  </div>
                </div>

                {/* Visual Step 2 */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-400 font-mono">Aggregated Batch</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2 py-1 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] font-mono text-white font-bold shadow">
                        Batch #1049283
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs font-bold">🔒 secure, fraud-proven</div>
                </div>

                {/* Downwards rollup arrow 2 */}
                <div className="flex justify-center my-2 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-400 -translate-y-1/2 z-0" />
                  <div className="relative px-3 py-1 bg-slate-900 text-[10px] font-mono text-emerald-400 font-extrabold rounded-lg border border-slate-800 z-10">
                    ETH L1 SECURED
                  </div>
                </div>

                {/* Visual Step 3 */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Ethereum Mainnet</span>
                    <div className="flex items-center gap-2 mt-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Consensus Achieved</span>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs font-bold font-mono">0.05% of mainnet fee</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits cards (At least 3 with icons or visuals) */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Arbitrum Core Advantages
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              By separating execution from settlement, Arbitrum resolves Ethereum's bottleneck without compromising decentralization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Benefit 1 */}
            <div className="p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Ultra Low Gas Fees
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Compresses multiple transactions into a single rollup batch, allowing users to save up to 95% on gas compared to Ethereum Layer 1.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 mt-4">&gt;_ AVG FEE: &lt; $0.05</span>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Lightning Fast Speed
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Completes transaction execution sub-second with immediate soft confirmation, eliminating long queue waiting times.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-4">&gt;_ BLOCK TIME: 0.25s</span>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md shadow hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Shared L1 Security
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Unlike independent sidechains, Arbitrum records state proofs directly onto Ethereum Mainnet, backed by its absolute consensus rules.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-4">&gt;_ PROVED: CRYPTOGRAPHICALLY</span>
            </div>

          </div>
        </div>

        {/* Dynamic Statistics counters */}
        <div className="bg-slate-900 dark:bg-[#1E293B]/30 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/10 dark:border-slate-700/50 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle glowing mesh */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="space-y-2 pt-4 md:pt-0">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">Gas Fee Reduction</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400">
                {gasSaved}%
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto">compared to standard Layer 1 transactions</p>
            </div>
            
            <div className="space-y-2 pt-6 md:pt-0">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">Throughput Factor</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-purple-400">
                {txSpeed}x
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto">higher concurrency capability</p>
            </div>

            <div className="space-y-2 pt-6 md:pt-0">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold">Total Batch Submissions</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400">
                {totalMined.toLocaleString()}+
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto">consistently rolled on L1 mainnet</p>
            </div>
          </div>
        </div>

        {/* Bottom Interactive CTA */}
        <div className="text-center py-6">
          <div className="p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Ready to learn how mining works under the hood?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
              Now that you understand rollups, discover how blocks are compiled, secured, and cryptographically verified in our real-time simulator.
            </p>
            <div>
              <button
                id="cta-home-bottom-sim"
                onClick={() => navigate('/simulator')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
              >
                <span>Launch Interactive Block Simulator</span>
                <Cpu className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
