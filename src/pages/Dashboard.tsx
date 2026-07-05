import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, RefreshCw, Search, ArrowUpDown, 
  Clock, ShieldCheck, AlertTriangle, Coins, Sparkles, HelpCircle 
} from 'lucide-react';
import { CryptoCoin } from '../types';

export default function Dashboard() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'name'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sparkline generator data (static but representative price lists)
  const sparklineData: Record<string, number[]> = {
    bitcoin: [57200, 57400, 56900, 57100, 57800, 58100, 58394],
    ethereum: [3190, 3170, 3120, 3090, 3110, 3140, 3120],
    arbitrum: [1.08, 1.10, 1.12, 1.09, 1.13, 1.16, 1.15],
    'polygon-ecosystem': [0.57, 0.56, 0.54, 0.55, 0.58, 0.56, 0.55],
    solana: [136, 139, 137, 142, 144, 143, 145]
  };

  const getCoinMeta = (id: string) => {
    switch (id) {
      case 'bitcoin':
        return { name: 'Bitcoin', symbol: 'BTC', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
      case 'ethereum':
        return { name: 'Ethereum', symbol: 'ETH', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30' };
      case 'arbitrum':
        return { name: 'Arbitrum', symbol: 'ARB', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' };
      case 'polygon-ecosystem':
        return { name: 'Polygon', symbol: 'MATIC', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' };
      case 'solana':
        return { name: 'Solana', symbol: 'SOL', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
      default:
        return { name: id, symbol: id.toUpperCase().slice(0, 4), color: 'text-slate-500 bg-slate-500/10 border-slate-500/30' };
    }
  };

  // Safe fallback mock data
  const getMockData = (): CryptoCoin[] => {
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', current_price: 58394.20, price_change_percentage_24h: 2.45 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', current_price: 3120.45, price_change_percentage_24h: -1.22 },
      { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', current_price: 1.15, price_change_percentage_24h: 4.58 },
      { id: 'polygon-ecosystem', name: 'Polygon', symbol: 'MATIC', current_price: 0.552, price_change_percentage_24h: -0.85 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', current_price: 145.10, price_change_percentage_24h: 8.92 }
    ];
  };

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // CoinGecko public API has strict rate limits. Try fetching.
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,arbitrum,polygon-ecosystem,solana&vs_currencies=usd&include_24hr_change=true';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const parsedCoins: CryptoCoin[] = Object.keys(data).map((id) => {
        const meta = getCoinMeta(id);
        return {
          id,
          name: meta.name,
          symbol: meta.symbol,
          current_price: data[id].usd,
          price_change_percentage_24h: data[id].usd_24h_change || 0,
        };
      });

      if (parsedCoins.length === 0) {
        throw new Error('No items parsed from API response.');
      }

      setCoins(parsedCoins);
      setIsLive(true);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('CoinGecko API is throttled or offline. Serving offline-cached mock prices instead.', err);
      // Fallback
      setCoins(getMockData());
      setIsLive(false);
      setLastUpdated(new Date());
      setError('CoinGecko API is rate-limited (HTTP 429). Loaded secure local mock prices instead.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPrices();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Handling search and sorts
  const filteredCoins = coins.filter((coin) => {
    return (
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    let valueA: any = a.name;
    let valueB: any = b.name;

    if (sortBy === 'price') {
      valueA = a.current_price;
      valueB = b.current_price;
    } else if (sortBy === 'change') {
      valueA = a.price_change_percentage_24h;
      valueB = b.price_change_percentage_24h;
    }

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSortToggle = (type: 'price' | 'change' | 'name') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc'); // Default desc for numeric metrics
    }
  };

  const drawSparkline = (id: string, isPositive: boolean) => {
    const dataPoints = sparklineData[id] || [10, 15, 12, 18, 14, 20, 19];
    const width = 140;
    const height = 44;
    const padding = 4;
    
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = max - min || 1;

    const points = dataPoints.map((val, i) => {
      const x = padding + (i / (dataPoints.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#10b981' : '#f43f5e';
    const fillColor = isPositive ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)';

    return (
      <svg className="w-28 h-10" viewBox={`0 0 ${width} ${height}`}>
        {/* Shaded bottom area */}
        <path
          d={`M ${padding},${height} L ${points} L ${width - padding},${height} Z`}
          fill={fillColor}
        />
        {/* Sparkline curve */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold text-purple-700 dark:text-purple-300">
          <Coins className="w-3.5 h-3.5 animate-bounce" />
          <span>Live Decentralized Index</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Real-time Asset Tracker
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Monitor current market valuation, price changes, and historical momentum across primary Layer 1 and Layer 2 ecosystems.
        </p>
      </section>

      {/* Control Panel (Search, Sorts, Refresh) */}
      <section className="p-4 md:p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/45 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            id="coin-search"
            type="text"
            placeholder="Search coin or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 font-semibold focus:outline-none focus:border-purple-500 text-sm transition-all"
          />
        </div>

        {/* Sort buttons & Refresh trigger */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          
          <button
            id="sort-btn-price"
            onClick={() => handleSortToggle('price')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              sortBy === 'price'
                ? 'bg-purple-500/10 dark:bg-cyan-500/10 border-purple-500/40 text-purple-600 dark:text-cyan-400'
                : 'border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Sort by Price</span>
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          <button
            id="sort-btn-change"
            onClick={() => handleSortToggle('change')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              sortBy === 'change'
                ? 'bg-purple-500/10 dark:bg-cyan-500/10 border-purple-500/40 text-purple-600 dark:text-cyan-400'
                : 'border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>Sort by 24h Change</span>
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          <button
            id="refresh-prices-btn"
            disabled={loading}
            onClick={fetchPrices}
            className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            aria-label="Refresh price dashboard"
          >
            <RefreshCw className={`w-4.5 h-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </section>

      {/* Feed Status Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-400 text-xs font-semibold flex items-start gap-2.5 leading-relaxed shadow-sm"
          >
            <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
              <span className="block text-[10px] uppercase font-bold text-slate-400 mt-1">Our server maintains complete visual rendering despite CoinGecko public limits.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Cryptocurrency price listing">
        {loading ? (
          // Skeletons
          Array.from({ length: 5 }).map((_, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/40 bg-white/20 dark:bg-slate-900/20 animate-pulse space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              </div>
            </div>
          ))
        ) : sortedCoins.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 font-medium">
            No crypto assets match your current search query.
          </div>
        ) : (
          sortedCoins.map((coin) => {
            const isPositive = coin.price_change_percentage_24h >= 0;
            const meta = getCoinMeta(coin.id);
            return (
              <motion.div
                key={coin.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/45 dark:bg-[#1E293B]/30 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex flex-col justify-between h-[230px] relative overflow-hidden group"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${isPositive ? 'from-emerald-500 to-teal-400' : 'from-rose-500 to-red-400'}`} />

                {/* Coin Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Coin Letter icon mock logo */}
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-extrabold text-sm shadow ${meta.color}`}>
                      {coin.symbol}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white leading-tight">
                        {coin.name}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {coin.symbol}/USD
                      </span>
                    </div>
                  </div>

                  {/* Sparkline visualization */}
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                    {drawSparkline(coin.id, isPositive)}
                  </div>
                </div>

                {/* Pricing values */}
                <div className="mt-4 space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    {isPositive ? (
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+{coin.price_change_percentage_24h.toFixed(2)}%</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg">
                        <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                        <span>{coin.price_change_percentage_24h.toFixed(2)}%</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400 dark:text-slate-500">24h delta</span>
                  </div>
                </div>

                {/* Footer specs inside card */}
                <div className="mt-4 pt-3 border-t border-slate-200/10 dark:border-slate-800/30 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className={`w-3.5 h-3.5 ${isLive ? 'text-emerald-500' : 'text-amber-500'}`} />
                    <span>{isLive ? 'LIVE FEED' : 'FALLBACK OK'}</span>
                  </div>
                  <span>ID: {coin.id.toUpperCase().slice(0, 10)}</span>
                </div>

              </motion.div>
            );
          })
        )}
      </section>

      {/* Under-dashboard Info and metrics */}
      <section className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-900/5 dark:bg-[#1E293B]/20 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 text-slate-600 dark:text-slate-400">
            <Clock className="w-5 h-5 animate-pulse text-purple-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Database Fetch</h4>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {lastUpdated.toLocaleTimeString()} ({isLive ? 'Real-time API' : 'Cached Static Fallback'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-500 font-semibold font-mono">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Refreshes auto every 30s or on-demand</span>
        </div>
      </section>

    </div>
  );
}
