import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNhlNews } from "../lib/newsApi";
import { Loader2, ExternalLink, CalendarDays, Tag } from "lucide-react";

export default function NewsPage() {
  const { data: news, isLoading, error } = useQuery({
    queryKey: ["nhlNews"],
    queryFn: fetchNhlNews,
    staleTime: 60 * 60 * 1000,
  });

  const isDev = (import.meta as any).env.DEV;

  const faqData = [
    { q: "Var kan jag se NHL-recaps?", a: "Du kan se NHL-recaps och highlights från alla matcher direkt här på NHL Pulse under fliken Matcher." },
    { q: "Hur ofta uppdateras NHL Pulse?", a: "Vår matchdata och nyheter uppdateras kontinuerligt under säsongen, ofta i samband med nattens matcher." },
    { q: "Visar NHL Pulse hela matcher?", a: "Nej, vi fokuserar på korta och koncisa recaps, 3 minuters highlights och de viktigaste matchhändelserna." },
    { q: "Är nyheterna från NHL.com?", a: "Ja, våra artikelsammanfattningar bygger på originalrapporter från NHL.com." }
  ];

  return (
    <div className="flex flex-col flex-1 pb-16">
      {/* Search Console / SEO Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        })
      }} />

      <section className="bg-background-secondary pt-12 pb-8 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
             {isDev && (
               <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-neon-orange/20 text-neon-orange border border-neon-orange/30">
                 DEV MOCK DATA
               </span>
             )}
          </div>
          <div className="flex flex-col space-y-2 max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              NHL-nyheter, recaps och senaste händelser
            </h1>
            <p className="text-text-secondary text-base">
              Håll dig uppdaterad med korta svenska sammanfattningar av nattens matcher och nyheter från ligan.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-ice-blue" />
          </div>
        ) : error ? (
           <div className="glass p-8 rounded-2xl text-center">
              <p className="text-text-secondary">Vi kunde inte ladda nyheterna just nu. Kika in lite senare!</p>
           </div>
        ) : news?.length === 0 ? (
           <div className="glass p-8 rounded-2xl text-center">
              <p className="text-text-secondary">Inga aktuella nyheter hittades.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news?.map((item, idx) => (
              <article key={idx} className="glass-card flex flex-col p-6 hover:bg-white/[0.06] border-border-subtle flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                     <Tag className="w-3 h-3" />
                     {item.tag || "NHL"}
                  </span>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(item.date).toLocaleDateString("sv-SE")}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 tracking-tight">{item.title}</h2>
                <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-6">
                  {item.summary}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] uppercase text-text-secondary/50 font-bold tracking-widest">Källa: NHL.com</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-ice-blue hover:text-white transition-colors text-sm font-bold flex items-center gap-1">
                    Läs original
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-24 max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Vanliga frågor om NHL Pulse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12">
            {faqData.map((f, i) => (
               <div key={i}>
                 <h3 className="font-bold text-white mb-2">{f.q}</h3>
                 <p className="text-sm text-text-secondary leading-relaxed">{f.a}</p>
               </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
