import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BulkScanSummary as SummaryType } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface BulkScanSummaryProps {
  summary: SummaryType;
  className?: string;
}

const threatColors = {
  safe: 'hsl(142, 76%, 36%)',
  low: 'hsl(142, 70%, 45%)',
  medium: 'hsl(45, 93%, 47%)',
  high: 'hsl(25, 95%, 53%)',
  critical: 'hsl(0, 84%, 60%)',
  errors: 'hsl(var(--muted-foreground))',
};

export function BulkScanSummary({ summary, className }: BulkScanSummaryProps) {
  const chartData = [
    { name: 'Safe', value: summary.safe, color: threatColors.safe },
    { name: 'Low', value: summary.low, color: threatColors.low },
    { name: 'Medium', value: summary.medium, color: threatColors.medium },
    { name: 'High', value: summary.high, color: threatColors.high },
    { name: 'Critical', value: summary.critical, color: threatColors.critical },
    { name: 'Errors', value: summary.errors, color: threatColors.errors },
  ].filter(item => item.value > 0);

  const completionRate = summary.totalUrls > 0 
    ? Math.round((summary.completed / summary.totalUrls) * 100) 
    : 0;

  const dangerousCount = summary.high + summary.critical;
  const dangerousPercentage = summary.completed > 0 
    ? Math.round((dangerousCount / summary.completed) * 100) 
    : 0;

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {/* Completion Stats */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scanned</p>
              <p className="text-3xl font-bold">
                {summary.completed}
                <span className="text-lg text-muted-foreground">/{summary.totalUrls}</span>
              </p>
            </div>
            <div className="text-right">
              <Badge variant={completionRate === 100 ? "default" : "secondary"}>
                {completionRate}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Score */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Risk Score</p>
              <p className={cn(
                "text-3xl font-bold",
                summary.averageRiskScore < 30 && "text-success",
                summary.averageRiskScore >= 30 && summary.averageRiskScore < 60 && "text-warning",
                summary.averageRiskScore >= 60 && "text-destructive"
              )}>
                {Math.round(summary.averageRiskScore)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dangerous URLs */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High/Critical</p>
              <p className={cn(
                "text-3xl font-bold",
                dangerousCount === 0 ? "text-success" : "text-destructive"
              )}>
                {dangerousCount}
              </p>
            </div>
            {dangerousCount > 0 && (
              <Badge variant="destructive">
                {dangerousPercentage}% dangerous
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Errors */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Errors</p>
              <p className={cn(
                "text-3xl font-bold",
                summary.errors === 0 ? "text-success" : "text-muted-foreground"
              )}>
                {summary.errors}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      {chartData.length > 0 && (
        <Card className="glass-card md:col-span-2 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Threat Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
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
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full shrink-0"
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
      )}
    </div>
  );
}
