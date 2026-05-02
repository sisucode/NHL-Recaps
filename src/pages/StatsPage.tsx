import { useQuery } from "@tanstack/react-query";
import { fetchStatsLeaders } from "../lib/nhlApi";
import { Loader2, Trophy, User, Hash, Star, LayoutGrid, Info, BarChart3 } from "lucide-react";
import TeamLogo from "../components/matches/TeamLogo";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function StatsPage() {
  const { data: leaders, isLoading, error } = useQuery({
    queryKey: ["statsLeaders"],
    queryFn: fetchStatsLeaders,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const topThree = leaders?.slice(0, 3) || [];
  const topFive = leaders?.slice(0, 5) || [];
  const rest = leaders?.slice(3) || [];

  const chartData = topFive.map(p => ({
    name: p.playerName.default.split(' ').pop(),
    points: p.points,
    fullName: p.playerName.default
  }));

  return (
    <div className="pb-20">
      {/* Hero Stats */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-orange/5 blur-[120px] rounded-full -z-10" />
        
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              NHL <span className="text-ice-blue">Poängliga</span>
            </h1>
            <p className="text-text-secondary max-w-xl">
              Aktuell NHL poängliga med mål, assists och poäng under säsongen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Top 3 Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 glass-card animate-pulse bg-white/5" />
                ))
              ) : topThree.map((player, index) => (
                <motion.div
                  key={player.playerId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 glass border-none rounded-2xl bg-gradient-to-br ${
                    index === 0 
                      ? 'from-neon-orange/20 to-neon-orange/5 ring-1 ring-neon-orange/20 orange-glow' 
                      : 'from-white/[0.04] to-white/[0.01]'
                  }`}
                >
                  <div className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-full bg-black/40 text-xs font-black italic">
                    #{index + 1}
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/10 glow-blue">
                         <User className="h-10 w-10 text-white/20" />
                      </div>
                      <TeamLogo abbrev={player.teamAbbrev} className="absolute -bottom-2 -right-2 h-8 w-8 p-1 bg-background rounded-full border border-white/10" />
                    </div>
                    <div className="text-center">
                       <h3 className="text-lg font-black text-white leading-tight">{player.playerName.default}</h3>
                       <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{player.teamAbbrev}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 w-full pt-4 border-t border-white/5">
                       <StatItem label="P" value={player.points} highlight />
                       <StatItem label="M" value={player.goals} />
                       <StatItem label="A" value={player.assists} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Chart */}
            <div className="lg:col-span-4 glass-card bg-white/[0.02] p-6 flex flex-col">
               <h3 className="text-xs font-black uppercase tracking-widest text-ice-blue mb-6 flex items-center gap-2">
                 <BarChart3 className="h-4 w-4" />
                 Poäng Topp 5
               </h3>
               {isLoading ? (
                 <div className="flex-1 flex items-center justify-center">
                   <Loader2 className="h-8 w-8 animate-spin text-white/10" />
                 </div>
               ) : (
                 <div className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: -10, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          scale="band" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#07111F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          labelStyle={{ color: '#F8FAFC', fontWeight: 800, fontSize: '12px' }}
                          itemStyle={{ color: '#7DD3FC', fontSize: '11px', fontWeight: 600 }}
                        />
                        <Bar dataKey="points" radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#FF7A1A' : '#7DD3FC'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Stats Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border-subtle bg-white/[0.02] flex items-center justify-between">
             <h2 className="text-sm font-black uppercase tracking-widest text-text-primary flex items-center gap-2">
                <Trophy className="h-4 w-4 text-ice-blue" />
                Topp 10 Spelare
             </h2>
             <span className="text-[10px] text-text-secondary uppercase font-bold tabular-nums">Visa alla leaderboard</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-text-secondary">
                <tr>
                  <th className="px-6 py-4"><Hash className="h-3 w-3" /></th>
                  <th className="px-6 py-4">Spelare</th>
                  <th className="px-6 py-4">Lag</th>
                  <th className="px-6 py-4 text-center">GP</th>
                  <th className="px-6 py-4 text-center">M</th>
                  <th className="px-6 py-4 text-center">A</th>
                  <th className="px-6 py-4 text-center bg-white/5 text-ice-blue">P</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-6 py-4"><div className="h-4 bg-white/5 rounded" /></td>
                    </tr>
                  ))
                ) : rest.length > 0 ? (
                  rest.map((player) => (
                    <tr key={player.playerId} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 text-sm font-black text-text-secondary italic">
                        {player.rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                             <User className="h-4 w-4 text-white/20" />
                           </div>
                           <span className="text-sm font-bold text-white group-hover:text-ice-blue transition-colors">
                             {player.playerName.default}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-xs text-text-secondary">
                        <div className="flex items-center gap-2">
                          <TeamLogo abbrev={player.teamAbbrev} size="sm" />
                          {player.teamAbbrev}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-mono text-text-secondary">{player.gamesPlayed}</td>
                      <td className="px-6 py-4 text-center text-sm font-mono text-text-secondary">{player.goals}</td>
                      <td className="px-6 py-4 text-center text-sm font-mono text-text-secondary">{player.assists}</td>
                      <td className="px-6 py-4 text-center text-sm font-black text-white bg-white/[0.02]">{player.points}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center justify-center gap-3">
                         <Info className="h-8 w-8 text-white/10" />
                         <p className="text-sm text-text-secondary">Data kunde inte laddas just nu.</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="mx-auto max-w-4xl px-4 mt-20">
         <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
            <h4 className="text-sm font-black uppercase tracking-widest text-ice-blue mb-4">Om spelarstatistiken</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Följ NHL:s poängliga med aktuella spelare, mål, assists och totalpoäng under säsongen. 
              Denna dashboard uppdateras kontinuerligt med data direkt från NHL för att ge dig den mest aktuella bilden av ligans toppresterare. 
              Vi prioriterar snabbhet och tydlighet så att du aldrig missar vem som leder jakten på Art Ross Trophy.
            </p>
         </div>
      </section>
    </div>
  );
}

function StatItem({ label, value, highlight }: { label: string, value: number, highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-black uppercase text-text-secondary mb-1">{label}</span>
      <span className={`text-xl font-black ${highlight ? 'text-ice-blue' : 'text-white'}`}>{value}</span>
    </div>
  );
}
