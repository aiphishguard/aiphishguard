import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ThemeProvider } from 'next-themes';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThreatLevelBadge } from '@/components/ThreatLevelBadge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Globe, 
  Activity,
  Zap,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThreatLevel } from '@/types/analysis';

interface ScanData {
  id: string;
  url: string;
  threat_level: string;
  risk_score: number;
  scanned_at: string;
}

interface DailyStats {
  date: string;
  count: number;
  avgRisk: number;
}

interface ThreatDistribution {
  name: string;
  value: number;
  color: string;
}

const threatColors = {
  safe: 'hsl(142, 76%, 36%)',
  low: 'hsl(142, 70%, 45%)',
  medium: 'hsl(45, 93%, 47%)',
  high: 'hsl(25, 95%, 53%)',
  critical: 'hsl(0, 84%, 60%)',
};

export default function Dashboard() {
  const [scans, setScans] = useState<ScanData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [threatDistribution, setThreatDistribution] = useState<ThreatDistribution[]>([]);
  const [topDomains, setTopDomains] = useState<{ domain: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('id, url, threat_level, risk_score, scanned_at')
        .order('scanned_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      setScans(data || []);
      processData(data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processData = (data: ScanData[]) => {
    // Daily stats
    const dailyMap = new Map<string, { count: number; totalRisk: number }>();
    
    for (const scan of data) {
      const date = new Date(scan.scanned_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      const existing = dailyMap.get(date) || { count: 0, totalRisk: 0 };
      dailyMap.set(date, {
        count: existing.count + 1,
        totalRisk: existing.totalRisk + scan.risk_score,
      });
    }

    const daily = Array.from(dailyMap.entries())
      .slice(0, 14)
      .reverse()
      .map(([date, stats]) => ({
        date,
        count: stats.count,
        avgRisk: Math.round(stats.totalRisk / stats.count),
      }));
    setDailyStats(daily);

    // Threat distribution
    const threatCounts = { safe: 0, low: 0, medium: 0, high: 0, critical: 0 };
    for (const scan of data) {
      const level = scan.threat_level as keyof typeof threatCounts;
      if (threatCounts[level] !== undefined) {
        threatCounts[level]++;
      }
    }

    const distribution: ThreatDistribution[] = Object.entries(threatCounts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: threatColors[name as keyof typeof threatColors],
      }));
    setThreatDistribution(distribution);

    // Top domains
    const domainCounts = new Map<string, number>();
    for (const scan of data) {
      try {
        const domain = new URL(scan.url).hostname;
        domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
      } catch {
        // Skip invalid URLs
      }
    }

    const domains = Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([domain, count]) => ({ domain, count }));
    setTopDomains(domains);
  };

  const totalScans = scans.length;
  const avgRiskScore = scans.length > 0 
    ? Math.round(scans.reduce((sum, s) => sum + s.risk_score, 0) / scans.length)
    : 0;
  const highRiskCount = scans.filter(s => 
    s.threat_level === 'high' || s.threat_level === 'critical'
  ).length;
  const safeCount = scans.filter(s => s.threat_level === 'safe' || s.threat_level === 'low').length;
  const safePercentage = totalScans > 0 ? Math.round((safeCount / totalScans) * 100) : 0;
  const recentHighRisk = scans
    .filter(s => s.threat_level === 'high' || s.threat_level === 'critical')
    .slice(0, 5);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Helmet>
        <title>Analytics Dashboard - PhishGuard AI</title>
        <meta 
          name="description" 
          content="View comprehensive scan statistics and threat analytics from PhishGuard AI security platform." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container relative py-8 md:py-12">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                      Analytics Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Real-time insights from PhishGuard AI security scans
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards - Enhanced Design */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card group hover:border-primary/40 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">Total Scans</p>
                        <p className="text-3xl font-bold">{totalScans}</p>
                        <div className="flex items-center gap-1 text-xs text-success">
                          <ArrowUpRight className="h-3 w-3" />
                          <span>Active monitoring</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card group hover:border-warning/40 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">Avg Risk Score</p>
                        <p className={cn(
                          "text-3xl font-bold",
                          avgRiskScore < 30 && "text-success",
                          avgRiskScore >= 30 && avgRiskScore < 60 && "text-warning",
                          avgRiskScore >= 60 && "text-destructive"
                        )}>
                          {avgRiskScore}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          <span>Based on {totalScans} URLs</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-6 w-6 text-warning" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card group hover:border-destructive/40 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">High Risk URLs</p>
                        <p className="text-3xl font-bold text-destructive">{highRiskCount}</p>
                        <div className="flex items-center gap-1 text-xs text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Threats detected</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 group-hover:scale-110 transition-transform">
                        <Target className="h-6 w-6 text-destructive" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card group hover:border-success/40 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-medium">Safe Rate</p>
                        <p className="text-3xl font-bold text-success">{safePercentage}%</p>
                        <div className="flex items-center gap-1 text-xs text-success">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{safeCount} safe URLs</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-success/10 border border-success/20 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-6 w-6 text-success" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Scans Over Time */}
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Scan Activity
                        </CardTitle>
                        <CardDescription>Daily scan volume over time</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyStats}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '12px',
                              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            strokeWidth={2.5}
                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Threat Distribution */}
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Threat Distribution
                        </CardTitle>
                        <CardDescription>Breakdown by risk level</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center gap-6">
                      <div className="flex-1 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={threatDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={65}
                              outerRadius={100}
                              paddingAngle={3}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {threatDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number) => [`${value} URLs`, '']}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3 min-w-[140px]">
                        {threatDistribution.map((item) => (
                          <div key={item.name} className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full shadow-lg"
                              style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}50` }}
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium">{item.name}</span>
                              <p className="text-xs text-muted-foreground">{item.value} URLs</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Scanned Domains */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Most Scanned Domains
                    </CardTitle>
                    <CardDescription>Top domains by scan frequency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topDomains.length > 0 ? (
                      <div className="space-y-3">
                        {topDomains.slice(0, 8).map((item, index) => (
                          <div 
                            key={item.domain}
                            className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
                              index === 0 && "bg-primary/20 text-primary",
                              index === 1 && "bg-warning/20 text-warning",
                              index === 2 && "bg-info/20 text-info",
                              index > 2 && "bg-muted text-muted-foreground"
                            )}>
                              {index + 1}
                            </div>
                            <span className="font-mono text-sm truncate flex-1">
                              {item.domain}
                            </span>
                            <Badge variant="outline" className="ml-auto shrink-0">
                              {item.count} scans
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No domains scanned yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent High Risk */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Recent High-Risk URLs
                    </CardTitle>
                    <CardDescription>Latest detected threats</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentHighRisk.length > 0 ? (
                      <div className="space-y-3">
                        {recentHighRisk.map((scan) => (
                          <div 
                            key={scan.id}
                            className="flex items-center gap-4 p-3 rounded-xl bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-destructive/10">
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm truncate">{scan.url}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                  {new Date(scan.scanned_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <ThreatLevelBadge level={scan.threat_level as ThreatLevel} size="sm" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                          <Shield className="h-8 w-8 text-success" />
                        </div>
                        <p className="font-medium text-success">All Clear!</p>
                        <p className="text-sm text-muted-foreground mt-1">No high-risk URLs detected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
