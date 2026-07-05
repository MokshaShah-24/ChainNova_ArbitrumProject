import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  theme: 'light' | 'dark';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate constant-seeded random particles to avoid hydration mismatches
    const colors = theme === 'dark' 
      ? ['rgba(147, 51, 234, 0.15)', 'rgba(6, 182, 212, 0.15)', 'rgba(16, 185, 129, 0.15)'] 
      : ['rgba(147, 51, 234, 0.08)', 'rgba(6, 182, 212, 0.08)', 'rgba(249, 115, 22, 0.08)'];
    
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: (i * 37) % 100, // deterministic positions
      y: (i * 73) % 100,
      size: (i % 4) * 3 + 4, // 4px to 13px
      duration: 15 + (i % 5) * 5, // 15s to 35s
      delay: -(i % 3) * 4,
      color: colors[i % colors.length],
    }));
    setParticles(newParticles);
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none transition-colors duration-700">
      {/* Dynamic gradients */}
      {theme === 'dark' ? (
        <div className="absolute inset-0 bg-[#0F172A]">
          {/* Glowing cosmic orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[130px] pointer-events-none animate-pulse duration-[10000ms]" />
          <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-950/15 blur-[120px] pointer-events-none" />
          
          {/* Soft Grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#f8fafc]">
          {/* Soft light glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-200/40 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-100/40 blur-[110px] pointer-events-none" />
          <div className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-orange-100/30 blur-[90px] pointer-events-none" />
          
          {/* Soft Grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>
      )}

      {/* Interactive Mesh lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
        <defs>
          <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M -100 200 C 300 400, 500 -100, 1200 300 C 1900 700, 1500 1200, 2200 900"
          fill="none"
          stroke="url(#grid-grad)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <path
          d="M -50 800 C 600 600, 400 1100, 1300 700 C 2200 300, 1900 1400, 2400 1100"
          fill="none"
          stroke="url(#grid-grad)"
          strokeWidth="1.5"
          strokeDasharray="2 4"
        />
      </svg>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: theme === 'dark' ? `0 0 ${p.size}px ${p.color}` : 'none',
          }}
          animate={{
            y: ['0%', '-100%', '0%'],
            x: ['0%', `${(p.id % 3) * 10 - 15}%`, '0%'],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
