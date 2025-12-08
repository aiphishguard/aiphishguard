import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ThemeProvider } from 'next-themes';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThreatLevelBadge } from '@/components/ThreatLevelBadge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, TrendingUp, AlertTriangle, Globe } from 'lucide-react';
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
  const recentHighRisk = scans
    .filter(s => s.threat_level === 'high' || s.threat_level === 'critical')
    .slice(0, 5);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Helmet>
        <title>Analytics Dashboard - PhishGuard AI</title>
        <meta 
          name="description" 
          content="View scan statistics and threat analytics from PhishGuard AI." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container py-8 md:py-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Insights and statistics from URL security scans
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Scans</p>
                      <p className="text-2xl font-bold">{totalScans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-warning/10">
                      <TrendingUp className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                      <p className={cn(
                        "text-2xl font-bold",
                        avgRiskScore < 30 && "text-success",
                        avgRiskScore >= 30 && avgRiskScore < 60 && "text-warning",
                        avgRiskScore >= 60 && "text-destructive"
                      )}>
                        {avgRiskScore}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-destructive/10">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">High Risk URLs</p>
                      <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-info/10">
                      <Globe className="h-6 w-6 text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unique Domains</p>
                      <p className="text-2xl font-bold">{topDomains.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Scans Over Time */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Scans Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyStats}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="hsl(var(--primary))" 
                          fillOpacity={1}
                          fill="url(#colorCount)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Threat Distribution */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Threat Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={threatDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
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
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2">
                      {threatDistribution.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">
                            {item.name}: <strong>{item.value}</strong>
                          </span>
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
                  <CardTitle>Most Scanned Domains</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topDomains.map((item, index) => (
                      <div 
                        key={item.domain}
                        className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-6">
                            #{index + 1}
                          </span>
                          <span className="font-mono text-sm truncate max-w-[200px]">
                            {item.domain}
                          </span>
                        </div>
                        <Badge variant="secondary">{item.count} scans</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent High Risk */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent High-Risk URLs</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentHighRisk.length > 0 ? (
                    <div className="space-y-3">
                      {recentHighRisk.map((scan) => (
                        <div 
                          key={scan.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="font-mono text-sm truncate">{scan.url}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(scan.scanned_at).toLocaleString()}
                            </p>
                          </div>
                          <ThreatLevelBadge level={scan.threat_level as ThreatLevel} size="sm" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-3 text-success" />
                      <p>No high-risk URLs detected!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
