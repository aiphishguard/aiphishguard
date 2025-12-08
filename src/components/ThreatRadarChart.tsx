import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ThreatFactors, ThreatLevel } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface ThreatRadarChartProps {
  factors: ThreatFactors;
  threatLevel: ThreatLevel;
  className?: string;
}

const factorLabels = {
  urlStructure: 'URL Structure',
  domainReputation: 'Domain Reputation',
  contentRisk: 'Content Risk',
  sslSecurity: 'SSL Security',
  externalIntelligence: 'External Intel',
};

const factorDescriptions = {
  urlStructure: 'Analysis of URL length, characters, and suspicious patterns',
  domainReputation: 'Domain age, registration details, and known reputation',
  contentRisk: 'Page content analysis for phishing indicators',
  sslSecurity: 'SSL certificate validity and configuration',
  externalIntelligence: 'VirusTotal and other external threat databases',
};

const threatColors = {
  safe: 'hsl(142, 76%, 36%)',
  low: 'hsl(142, 76%, 36%)',
  medium: 'hsl(45, 93%, 47%)',
  high: 'hsl(25, 95%, 53%)',
  critical: 'hsl(0, 84%, 60%)',
};

export function ThreatRadarChart({ factors, threatLevel, className }: ThreatRadarChartProps) {
  const data = Object.entries(factors).map(([key, value]) => ({
    factor: factorLabels[key as keyof ThreatFactors],
    value,
    fullMark: 100,
    description: factorDescriptions[key as keyof ThreatFactors],
  }));

  const color = threatColors[threatLevel];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{data.factor}</p>
          <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
          <p className="text-sm font-bold mt-2" style={{ color }}>
            Risk: {data.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          Threat Factor Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of risk indicators across different categories
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid 
                stroke="hsl(var(--border))" 
                strokeDasharray="3 3"
              />
              <PolarAngleAxis 
                dataKey="factor" 
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 11,
                }}
                tickLine={false}
              />
              <Radar
                name="Threat Level"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {data.map((item) => (
            <div 
              key={item.factor}
              className="flex items-center gap-2 text-xs"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: color,
                  opacity: item.value / 100 
                }}
              />
              <span className="text-muted-foreground truncate">
                {item.factor}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
