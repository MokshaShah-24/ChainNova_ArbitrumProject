import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hammer, Link as LinkIcon, Link2Off, RefreshCw, Info, HelpCircle, 
  CheckCircle2, AlertTriangle, Play, ChevronRight, Cpu, Zap, Sparkles 
} from 'lucide-react';

interface Block {
  index: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  isValid: boolean;
  isMining: boolean;
  miningTime: number; // in ms
}

// SHA-256 native converter helper
async function calculateSHA256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function Simulator() {
  const [block1, setBlock1] = useState<Block>({
    index: 1,
    data: 'Alice sends Bob 0.25 ETH',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    nonce: 83,
    hash: '',
    isValid: false,
    isMining: false,
    miningTime: 0
  });

  const [block2, setBlock2] = useState<Block>({
    index: 2,
    data: 'Bob transfers 0.10 ETH to Charlie',
    previousHash: '', // Will be bound to block1.hash
    nonce: 145,
    hash: '',
    isValid: false,
    isMining: false,
    miningTime: 0
  });

  const [isChainValid, setIsChainValid] = useState(false);

  // Synchronize Block 2's previousHash with Block 1's actual hash
  useEffect(() => {
    setBlock2(prev => ({
      ...prev,
      previousHash: block1.hash
    }));
  }, [block1.hash]);

  // Recalculate Block 1 hash on change
  useEffect(() => {
    let active = true;
    const rehash = async () => {
      const payload = `${block1.index}${block1.nonce}${block1.previousHash}${block1.data}`;
      const newHash = await calculateSHA256(payload);
      if (active) {
        setBlock1(prev => ({
          ...prev,
          hash: newHash,
          isValid: newHash.startsWith('00')
        }));
      }
    };
    rehash();
    return () => { active = false; };
  }, [block1.data, block1.nonce, block1.previousHash]);

  // Recalculate Block 2 hash on change
  useEffect(() => {
    let active = true;
    const rehash = async () => {
      const payload = `${block2.index}${block2.nonce}${block2.previousHash}${block2.data}`;
      const newHash = await calculateSHA256(payload);
      if (active) {
        setBlock2(prev => ({
          ...prev,
          hash: newHash,
          isValid: newHash.startsWith('00') && block1.isValid // block 2 is only valid if block 1 is also valid!
        }));
      }
    };
    rehash();
    return () => { active = false; };
  }, [block2.data, block2.nonce, block2.previousHash, block1.isValid]);

  // Determine overall chain validation
  useEffect(() => {
    setIsChainValid(block1.isValid && block2.isValid && (block2.previousHash === block1.hash));
  }, [block1.isValid, block2.isValid, block2.previousHash, block1.hash]);

  // Proof of Work Miner for Block 1
  const mineBlock1 = async () => {
    if (block1.isMining) return;
    setBlock1(prev => ({ ...prev, isMining: true }));
    
    const startTime = performance.now();
    let currentNonce = 0;
    let found = false;
    let foundHash = '';

    while (!found && currentNonce < 10000) {
      const payload = `${block1.index}${currentNonce}${block1.previousHash}${block1.data}`;
      const hash = await calculateSHA256(payload);
      if (hash.startsWith('00')) {
        found = true;
        foundHash = hash;
        break;
      }
      currentNonce++;
    }

    const duration = performance.now() - startTime;

    setBlock1(prev => ({
      ...prev,
      nonce: found ? currentNonce : prev.nonce,
      hash: found ? foundHash : prev.hash,
      isValid: found,
      isMining: false,
      miningTime: Math.round(duration)
    }));
  };

  // Proof of Work Miner for Block 2
  const mineBlock2 = async () => {
    if (block2.isMining) return;
    setBlock2(prev => ({ ...prev, isMining: true }));
    
    const startTime = performance.now();
    let currentNonce = 0;
    let found = false;
    let foundHash = '';

    while (!found && currentNonce < 10000) {
      const payload = `${block2.index}${currentNonce}${block2.previousHash}${block2.data}`;
      const hash = await calculateSHA256(payload);
      if (hash.startsWith('00')) {
        found = true;
        foundHash = hash;
        break;
      }
      currentNonce++;
    }

    const duration = performance.now() - startTime;

    setBlock2(prev => ({
      ...prev,
      nonce: found ? currentNonce : prev.nonce,
      hash: found ? foundHash : prev.hash,
      isValid: found && block1.isValid,
      isMining: false,
      miningTime: Math.round(duration)
    }));
  };

  // Reset demo back to baseline valid hashes
  const handleReset = async () => {
    // Mine Block 1 baseline
    let b1Nonce = 0;
    let b1Hash = '';
    while (b1Nonce < 10000) {
      const payload = `1${b1Nonce}0000000000000000000000000000000000000000000000000000000000000000Alice sends Bob 0.25 ETH`;
      const hash = await calculateSHA256(payload);
      if (hash.startsWith('00')) {
        b1Hash = hash;
        break;
      }
      b1Nonce++;
    }

    // Mine Block 2 baseline using the mined block 1 hash
    let b2Nonce = 0;
    let b2Hash = '';
    while (b2Nonce < 10000) {
      const payload = `2${b2Nonce}${b1Hash}Bob transfers 0.10 ETH to Charlie`;
      const hash = await calculateSHA256(payload);
      if (hash.startsWith('00')) {
        b2Hash = hash;
        break;
      }
      b2Nonce++;
    }

    setBlock1({
      index: 1,
      data: 'Alice sends Bob 0.25 ETH',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      nonce: b1Nonce,
      hash: b1Hash,
      isValid: true,
      isMining: false,
      miningTime: 12
    });

    setBlock2({
      index: 2,
      data: 'Bob transfers 0.10 ETH to Charlie',
      previousHash: b1Hash,
      nonce: b2Nonce,
      hash: b2Hash,
      isValid: true,
      isMining: false,
      miningTime: 18
    });
  };

  // Auto-init baseline on load
  useEffect(() => {
    handleReset();
  }, []);

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-700 dark:text-purple-300">
          <Hammer className="w-3.5 h-3.5 text-purple-500 animate-spin" />
          <span>Proof-of-Work Playbox</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Block Mining Simulator
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Tamper with the data inputs to witness the immediate cascading breakdown of blockchain links. Discover how nonces, SHA-256 hashes, and Proof-of-Work solidify data permanence.
        </p>
      </section>

      {/* Global Chain Status Indicator bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/45 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl flex items-center justify-center ${
            isChainValid 
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
          }`}>
            {isChainValid ? <LinkIcon className="w-5 h-5" /> : <Link2Off className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Blockchain Integrity</h2>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>Status:</span>
              <span className={isChainValid ? 'text-emerald-500' : 'text-rose-500'}>
                {isChainValid ? 'SECURED & IMMUTABLE' : 'BROKEN & INVALIDATED'}
              </span>
            </p>
          </div>
        </div>

        <button
          id="reset-chain-btn"
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Valid Chain</span>
        </button>
      </section>

      {/* Visual Block Stack with Interlocking Connection */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
        
        {/* Block 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Ledger Entry #1</span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg ${
              block1.isValid 
                ? 'text-emerald-600 bg-emerald-500/10' 
                : 'text-rose-600 bg-rose-500/10'
            }`}>
              {block1.isValid ? 'Valid Block' : 'Tampered / Invalid'}
            </span>
          </div>

          <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 bg-white/45 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-xl ${
            block1.isValid 
              ? 'border-slate-200/50 dark:border-slate-700/50' 
              : 'border-rose-500/40 shadow-rose-500/5'
          }`}>
            
            {/* Input elements */}
            <div className="space-y-5">
              
              {/* Block Index & Nonce Display */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Block Index</label>
                  <input
                    type="text"
                    disabled
                    value={`Block #${block1.index}`}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 text-slate-500 font-mono text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nonce</label>
                  <input
                    id="block1-nonce"
                    type="number"
                    value={block1.nonce}
                    onChange={(e) => setBlock1(prev => ({ ...prev, nonce: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 font-mono text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Transaction Data */}
              <div>
                <label htmlFor="block1-data" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Block Data (Transactions)</label>
                <textarea
                  id="block1-data"
                  rows={2}
                  value={block1.data}
                  onChange={(e) => setBlock1(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 font-sans text-sm font-semibold focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Cryptographic Hashes */}
              <div className="space-y-4 font-mono text-xs">
                
                {/* Previous Hash */}
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Previous Hash</span>
                  <div className="w-full px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/20 text-slate-400 select-all truncate">
                    {block1.previousHash}
                  </div>
                </div>

                {/* Current Hash */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current SHA-256 Hash</span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${block1.isValid ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {block1.isValid ? 'Starts with 00 (Valid)' : 'Needs "00" prefix'}
                    </span>
                  </div>
                  <div className={`w-full px-3 py-2 rounded-xl border select-all truncate font-bold ${
                    block1.isValid 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-500'
                  }`}>
                    {block1.hash || 'CALCULATING_HASH_ERROR'}
                  </div>
                </div>

              </div>

              {/* Action Mining button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  id="mine-block1-btn"
                  disabled={block1.isMining}
                  onClick={mineBlock1}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {block1.isMining ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mining PoW...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Mine Block 1</span>
                    </>
                  )}
                </button>

                <div className="text-right">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Mining Duration</span>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                    {block1.miningTime > 0 ? `${block1.miningTime} ms` : 'N/A'}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Animated Intersecting Link Arrow (Centered or broken on mobile) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center z-10 pointer-events-none">
          <div className={`p-2.5 rounded-full border shadow backdrop-blur-md transition-all duration-300 ${
            isChainValid 
              ? 'bg-emerald-500/25 border-emerald-500 text-emerald-500' 
              : 'bg-rose-500/25 border-rose-500 text-rose-500 rotate-95'
          }`}>
            {isChainValid ? <LinkIcon className="w-6 h-6" /> : <Link2Off className="w-6 h-6" />}
          </div>
          <ChevronRight className={`w-8 h-8 text-slate-400 transition-colors ${isChainValid ? 'text-emerald-500' : 'text-rose-500'}`} />
        </div>

        {/* Block 2 */}
        <div className="space-y-4 pt-12 lg:pt-0">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Ledger Entry #2</span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg ${
              block2.isValid 
                ? 'text-emerald-600 bg-emerald-500/10' 
                : 'text-rose-600 bg-rose-500/10'
            }`}>
              {block2.isValid ? 'Valid Block' : 'Tampered / Invalid'}
            </span>
          </div>

          <div className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 bg-white/45 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-xl ${
            block2.isValid 
              ? 'border-slate-200/50 dark:border-slate-700/50' 
              : 'border-rose-500/40 shadow-rose-500/5'
          }`}>
            
            {/* Input elements */}
            <div className="space-y-5">
              
              {/* Block Index & Nonce Display */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Block Index</label>
                  <input
                    type="text"
                    disabled
                    value={`Block #${block2.index}`}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/20 dark:border-slate-800/20 text-slate-500 font-mono text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nonce</label>
                  <input
                    id="block2-nonce"
                    type="number"
                    value={block2.nonce}
                    onChange={(e) => setBlock2(prev => ({ ...prev, nonce: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 font-mono text-xs font-semibold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Transaction Data */}
              <div>
                <label htmlFor="block2-data" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Block Data (Transactions)</label>
                <textarea
                  id="block2-data"
                  rows={2}
                  value={block2.data}
                  onChange={(e) => setBlock2(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 font-sans text-sm font-semibold focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              {/* Cryptographic Hashes */}
              <div className="space-y-4 font-mono text-xs">
                
                {/* Previous Hash */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Previous Hash</span>
                    <span className="text-[9px] uppercase font-bold text-cyan-500 font-sans">Derived from Block 1</span>
                  </div>
                  <div className={`w-full px-3 py-2 rounded-xl select-all truncate font-bold border ${
                    block2.previousHash === block1.hash && block1.isValid
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-500'
                  }`}>
                    {block2.previousHash}
                  </div>
                </div>

                {/* Current Hash */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current SHA-256 Hash</span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${block2.isValid ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {block2.isValid ? 'Starts with 00 (Valid)' : 'Needs "00" prefix'}
                    </span>
                  </div>
                  <div className={`w-full px-3 py-2 rounded-xl border select-all truncate font-bold ${
                    block2.isValid 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/5 border-rose-500/20 text-rose-500'
                  }`}>
                    {block2.hash || 'CALCULATING_HASH_ERROR'}
                  </div>
                </div>

              </div>

              {/* Action Mining button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  id="mine-block2-btn"
                  disabled={block2.isMining}
                  onClick={mineBlock2}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {block2.isMining ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mining PoW...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Mine Block 2</span>
                    </>
                  )}
                </button>

                <div className="text-right">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Mining Duration</span>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                    {block2.miningTime > 0 ? `${block2.miningTime} ms` : 'N/A'}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Tampered Chain Warning Panel - Conditional */}
      <AnimatePresence>
        {!isChainValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 text-rose-800 dark:text-rose-400 text-sm font-semibold flex flex-col sm:flex-row items-center gap-4 shadow-md max-w-4xl mx-auto"
          >
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shrink-0">
              <Link2Off className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h4 className="font-extrabold text-base">Chain Link Severed!</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Notice how modifying Block 1's text instantly changed its hash. Since Block 2's "Previous Hash" relies on Block 1, Block 2's input variables altered automatically. The Proof of Work was broken! Click "Reset Valid Chain" or mine each block in order to restore integrity.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comprehensive Educational Explanation Panel */}
      <section className="p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/45 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-xl max-w-4xl mx-auto space-y-6">
        
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-purple-500" />
          <span>How Cryptographic Links Guarantee Immutability</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-300">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>The Hash Connection</span>
            </h4>
            <p>
              In a blockchain database, blocks are not stored in random folders. Each block incorporates the cryptographic hash of the <strong>preceding block</strong> directly into its payload. This creates an interlocking mathematical chain.
            </p>
            <p>
              If a bad actor attempts to change a transaction inside Block 1 (e.g. changing 0.25 ETH to 250 ETH), Block 1's resulting SHA-256 hash changes completely. Since Block 2 references Block 1's hash, Block 2's calculation is disrupted, invalidating the entire subsequent sequence.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Simulating Proof of Work</span>
            </h4>
            <p>
              How do we make block alterations expensive? Network protocols enforce a difficulty requirement. Under our Proof of Work simulator, a block is only deemed legitimate if its resulting hash starts with the characters <strong>"00"</strong>.
            </p>
            <p>
              Since the transaction text is fixed, the miner must vary a random placeholder number called the <strong>Nonce</strong> (Number used once) repeatedly. Finding a winning nonce takes computational effort, meaning blocks cannot be forged arbitrarily.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
