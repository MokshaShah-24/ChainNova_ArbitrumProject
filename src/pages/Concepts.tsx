import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Shield, Database, Key, HelpCircle, ChevronDown, CheckCircle2,
  Lock, AlertTriangle, ArrowRightLeft, Landmark, Cpu 
} from 'lucide-react';
import { ConceptComparison } from '../types';

export default function Concepts() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const concepts: ConceptComparison[] = [
    {
      id: 'web2-web3',
      title: 'Web2 vs. Web3',
      iconName: 'web',
      badge: 'Architecture',
      desc: 'The evolution of control. Moving from corporate-owned platforms to user-owned distributed ecosystems.',
      web2Title: 'Web2 (Centralized Platform)',
      web2Desc: 'Monopolized by tech giants. Companies host your data, target you with ads, and can revoke your account access at any moment.',
      web2Color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-800 dark:text-blue-300',
      web3Title: 'Web3 (Decentralized Network)',
      web3Desc: 'Owned by the users. Data is cryptographically secure on public chains, controlled strictly by your own wallet signatures.',
      web3Color: 'from-purple-500/15 to-cyan-500/15 border-purple-500/30 text-purple-800 dark:text-cyan-300',
      learnMoreText: 'Web3 uses an identity model powered by cryptography. Instead of logging in with a password stored in Google’s database, you sign a cryptographic message with your wallet. No entity can block or freeze your assets without your private key.',
      bullets: [
        'Web2 login: Email & password (owned by server)',
        'Web3 login: Cryptographic wallet signature (owned by you)',
        'Web2 data: Stored in proprietary cloud servers (AWS, GCP)',
        'Web3 data: Stored on global blockchain state ledgers'
      ]
    },
    {
      id: 'eth-btc',
      title: 'Ethereum vs. Bitcoin',
      iconName: 'currency',
      badge: 'Functional Scope',
      desc: 'The difference between digital gold and a decentralized, global smartphone computer.',
      web2Title: 'Bitcoin (Digital Currency)',
      web2Desc: 'Optimized as an immutable peer-to-peer digital ledger. Highly secure but functionally limited to transactions.',
      web2Color: 'from-amber-500/10 to-orange-500/10 border-orange-500/20 text-amber-800 dark:text-orange-300',
      web3Title: 'Ethereum (World Computer)',
      web3Desc: 'A complete operating system. Houses Smart Contracts allowing anyone to write self-executing global applications.',
      web3Color: 'from-purple-500/15 to-cyan-500/15 border-purple-500/30 text-purple-800 dark:text-cyan-300',
      learnMoreText: 'Bitcoin acts as a global decentralized currency. Ethereum takes the blockchain foundation of Bitcoin and integrates the Ethereum Virtual Machine (EVM). This lets developers write self-executing code (Smart Contracts) to build decentralized finance, domain name protocols, and supply chain tracking.',
      bullets: [
        'Bitcoin consensus: Proof of Work (high computing energy)',
        'Ethereum consensus: Proof of Stake (highly eco-friendly)',
        'Bitcoin utility: Native asset transaction only',
        'Ethereum utility: Smart contracts, stablecoins, NFTs, and dApps'
      ]
    },
    {
      id: 'pub-priv',
      title: 'Public Key vs. Private Key',
      iconName: 'key',
      badge: 'Cryptography',
      desc: 'Understanding wallet addressing. One is your public mailbox, the other is the safe-deposit combination key.',
      web2Title: 'Public Key (Wallet Address)',
      web2Desc: 'Your public address (e.g. 0x71C...89). Safe to share with anyone. Used to receive funds and lookup transactions.',
      web2Color: 'from-cyan-500/10 to-teal-500/10 border-cyan-500/20 text-cyan-800 dark:text-cyan-300',
      web3Title: 'Private Key (Ownership Key)',
      web3Desc: 'Your secret password signature. MUST never be shared. Grants absolute access to approve transfers or clear funds.',
      web3Color: 'from-rose-500/15 to-red-500/15 border-rose-500/30 text-rose-800 dark:text-rose-300',
      learnMoreText: 'Your public key is derived from your private key using Elliptic Curve Cryptography. This derivation is a one-way street: you can generate the address from the private key, but it is mathematically impossible to reverse-engineer the private key from your public address.',
      bullets: [
        'Public address: Shared freely (like an IBAN bank routing number)',
        'Private key: Kept offline strictly (like a cash vault safe combination)',
        'Private key loss: Permanent loss of all funds with no password reset',
        'Sharing private keys: Instantly compromises all funds inside'
      ]
    },
    {
      id: 'chain-db',
      title: 'Blockchain vs. Traditional DB',
      iconName: 'database',
      badge: 'Storage Mechanics',
      desc: 'Deciding when to use an immutable global chain versus a highly scalable central database.',
      web2Title: 'Traditional DB (SQL / Cloud)',
      web2Desc: 'Controlled centrally (CRUD: Create, Read, Update, Delete). Fast, cheap storage, but relies entirely on trust in the admin.',
      web2Color: 'from-slate-500/10 to-blue-500/10 border-slate-500/20 text-slate-800 dark:text-slate-300',
      web3Title: 'Blockchain Ledger',
      web3Desc: 'Decentralized and append-only. Transactions are irreversible and audited by thousands of network nodes simultaneously.',
      web3Color: 'from-purple-500/15 to-cyan-500/15 border-purple-500/30 text-purple-800 dark:text-cyan-300',
      learnMoreText: 'Standard databases can be altered instantly by any administrator. Blockchains enforce a mathematical consensus ruleset. Once a block is mined, the cryptographic hash of that block is linked to all future blocks. Altering previous data breaks the hashes of the entire chain.',
      bullets: [
        'Database modification: Full CRUD permissions (records can be deleted)',
        'Blockchain modification: Append-only (records are permanent)',
        'Database hosting: Single cluster (vulnerable to server outages)',
        'Blockchain hosting: Distributed globally (high tolerance for crashes)'
      ]
    }
  ];

  const getIcon = (name: string) => {
    switch (name) {
      case 'web': return <Globe className="w-5 h-5 text-purple-500" />;
      case 'currency': return <Landmark className="w-5 h-5 text-amber-500" />;
      case 'key': return <Key className="w-5 h-5 text-cyan-500" />;
      case 'database': return <Database className="w-5 h-5 text-emerald-500" />;
      default: return <HelpCircle className="w-5 h-5" />;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-700 dark:text-purple-300">
          <Cpu className="w-3.5 h-3.5" />
          <span>Interactive Concept Ledger</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Web3 Fundamentals Explained
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          No textbook dry text. Compare traditional systems (Web2) side-by-side with decentralized equivalents (Web3) to understand the core structural paradigms.
        </p>
      </section>

      {/* Comparisons Stack */}
      <section className="space-y-8" aria-label="Web3 Concept Comparison List">
        {concepts.map((concept) => {
          const isExpanded = expandedId === concept.id;
          return (
            <motion.div
              key={concept.id}
              layout="position"
              className="p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/45 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/10 dark:border-slate-800/30 pb-6">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-center">
                    {getIcon(concept.iconName)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      {concept.badge}
                    </span>
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {concept.title}
                    </h2>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm sm:text-right">
                  {concept.desc}
                </div>
              </div>

              {/* Side-by-Side Comparison Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Left Web2 Card */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${concept.web2Color}`}>
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider">
                      Standard Paradigm
                    </span>
                    <h3 className="text-lg font-bold">
                      {concept.web2Title}
                    </h3>
                    <p className="text-sm opacity-80 leading-relaxed font-medium">
                      {concept.web2Desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold opacity-60">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>CENTRAL TRUST REQUIRED</span>
                  </div>
                </div>

                {/* Right Web3 Card */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 ${concept.web3Color}`}>
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/10 dark:bg-cyan-500/10 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-cyan-400">
                      Decentralized Paradigm
                    </span>
                    <h3 className="text-lg font-bold">
                      {concept.web3Title}
                    </h3>
                    <p className="text-sm opacity-80 leading-relaxed font-medium">
                      {concept.web3Desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-600 dark:text-cyan-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>CRYPTOGRAPHIC PROOF</span>
                  </div>
                </div>
              </div>

              {/* Learn More Expand Action */}
              <div className="pt-2 flex justify-center">
                <button
                  id={`learn-more-btn-${concept.id}`}
                  onClick={() => toggleExpand(concept.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                >
                  <span>{isExpanded ? 'Hide Deep Dive' : 'Explore Deep Dive'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Animated Collapsible Panel */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 pt-6 border-t border-slate-200/10 dark:border-slate-800/30 grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Deep dive paragraph */}
                      <div className="lg:col-span-7 space-y-4">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          Cryptographic Underpinnings
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {concept.learnMoreText}
                        </p>
                      </div>

                      {/* Diagnostic Bullets */}
                      <div className="lg:col-span-5 bg-slate-900/5 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200/30 dark:border-slate-800/40 font-mono text-xs text-slate-500 dark:text-slate-400 space-y-3 shadow-inner">
                        <div className="flex items-center gap-2 border-b border-slate-200/10 dark:border-slate-800/30 pb-2 text-slate-400">
                          <Lock className="w-4 h-4 text-purple-400" />
                          <span className="font-bold">SYSTEM AUDIT METRIC</span>
                        </div>
                        <ul className="space-y-2 font-medium">
                          {concept.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex gap-2">
                              <span className="text-purple-500 dark:text-cyan-400 shrink-0">↳</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}
      </section>

      {/* Floating Action CTA to Block Simulator */}
      <section className="text-center py-8">
        <div className="p-8 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            See these concepts in action!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
            Ready to test hashing, nonces, and chain link integrity with your own keyboard? Launch the simulation.
          </p>
          <button
            id="concepts-cta-sim"
            onClick={() => navigate('/simulator')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold transition-all cursor-pointer"
          >
            <span>Run Block Mining Simulator</span>
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
