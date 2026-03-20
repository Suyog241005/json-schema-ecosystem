"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Zap, 
  HeartPulse,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { EcosystemInsights } from "@/lib/insights.types";

export function OverviewContent({ data }: { data: EcosystemInsights }) {
  const { 
    languageDistribution, 
    releaseFrequency, 
    contributorGrowth, 
    testCoverageTrends, 
    activityHealth,
    ecosystemMaturity
  } = data;

  const activeProjects = releaseFrequency.filter((r: any) => r.status === "active").length;
  const growingProjects = contributorGrowth.filter((c: any) => c.status === "growing").length;

  const summaryCards = [
    {
      title: "Maturity Score",
      value: `${ecosystemMaturity?.compositeScore || 0}/100`,
      sub: `Rating: ${ecosystemMaturity?.healthRating || "N/A"}`,
      icon: HeartPulse,
      color: "text-purple-500",
      href: "/insights" // Keep on overview for now
    },
    {
      title: "Top Language",
      value: languageDistribution.topLanguage,
      sub: `${languageDistribution.total} Implementations`,
      icon: BarChart3,
      color: "text-blue-500",
      href: "/insights/languages"
    },
    {
      title: "Active Maintenance",
      value: activeProjects,
      sub: "Projects releasing monthly",
      icon: Zap,
      color: "text-amber-500",
      href: "/insights/maintenance"
    },
    {
      title: "Community Growth",
      value: `${growingProjects} Projects`,
      sub: "Increasing contributors",
      icon: Users,
      color: "text-emerald-500",
      href: "/insights/community"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="glass border-none group hover:bg-white/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className={card.color} size={16} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{card.value}</div>
                <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tight">
                  {card.sub}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Ecosystem Diversity</CardTitle>
            <Link href="/insights/languages" className="text-primary hover:underline text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
              Details <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {languageDistribution.languages.slice(0, 6).map((l: any) => (
                <Badge key={l.name} variant="secondary" className="bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  {l.name} ({l.count})
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Primary Language Share</span>
                  <span>{languageDistribution.languages[0].percentage}%</span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${languageDistribution.languages[0].percentage}%` }} />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Health Distribution</CardTitle>
            <Link href="/insights/health" className="text-primary hover:underline text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
              Details <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
               <div className="space-y-1">
                  <div className="text-2xl font-black text-emerald-500">{activeProjects}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Active</div>
               </div>
               <div className="space-y-1">
                  <div className="text-2xl font-black text-amber-500">
                    {releaseFrequency.filter((r: any) => r.status === "moderate").length}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Moderate</div>
               </div>
               <div className="space-y-1">
                  <div className="text-2xl font-black text-rose-500">
                    {releaseFrequency.filter((r: any) => r.status === "stale").length}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Stale</div>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Ecosystem Maturity Index Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <DimensionItem 
                label="Compliance Strength" 
                score={ecosystemMaturity.dimensions.complianceStrength} 
                weight="40%" 
                description="Avg Bowtie test compliance"
              />
              <DimensionItem 
                label="Activity Health" 
                score={ecosystemMaturity.dimensions.activityHealth} 
                weight="30%" 
                description="Releases & responsiveness"
              />
              <DimensionItem 
                label="Adoption Momentum" 
                score={ecosystemMaturity.dimensions.adoptionMomentum} 
                weight="20%" 
                description="Contributor growth rate"
              />
              <DimensionItem 
                label="Community Support" 
                score={ecosystemMaturity.dimensions.communitySupport} 
                weight="10%" 
                description="Community feedback signals"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DimensionItem({ label, score, weight, description }: { label: string, score: number, weight: string, description: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="text-[9px] font-bold text-primary/60 italic">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black">{score}%</span>
          <span className="text-[8px] block font-black text-muted-foreground uppercase">{weight} Weight</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000" 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}
