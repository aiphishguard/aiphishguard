import { Shield, AlertTriangle, Globe, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatsCards() {
  const stats = [
    {
      icon: Shield,
      label: 'AI-Powered',
      value: 'Detection',
      description: 'Advanced threat analysis',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: AlertTriangle,
      label: '30+ Features',
      value: 'Analyzed',
      description: 'URL pattern detection',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Globe,
      label: 'Deep Content',
      value: 'Inspection',
      description: 'Webpage analysis',
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      icon: Zap,
      label: 'Real-time',
      value: 'Results',
      description: 'Instant feedback',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className={`p-3 rounded-xl ${stat.bgColor} mb-3`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
