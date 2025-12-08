import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, Target, Zap, Layers } from 'lucide-react';

const performanceMetrics = [
  { label: 'Accuracy', value: 99.5, color: 'bg-primary' },
  { label: 'Precision', value: 99.3, color: 'bg-cyan-500' },
  { label: 'Recall', value: 99.4, color: 'bg-teal-500' },
  { label: 'F1 Score', value: 99.4, color: 'bg-emerald-500' },
];

const keyMetrics = [
  { icon: Target, label: 'False Positive Rate', value: '0.3%' },
  { icon: Layers, label: 'ML Models', value: '10+' },
  { icon: Zap, label: 'Training Samples', value: '50K+' },
  { icon: TrendingUp, label: 'Features Analyzed', value: '30+' },
];

const modelComparison = [
  { model: 'Random Forest', accuracy: '99.2%', precision: '98.8%', recall: '99.1%' },
  { model: 'Neural Network', accuracy: '98.7%', precision: '98.3%', recall: '98.9%' },
  { model: 'Gradient Boosting', accuracy: '98.9%', precision: '98.6%', recall: '99.0%' },
  { model: 'SVM', accuracy: '97.8%', precision: '97.4%', recall: '98.1%' },
  { model: 'Ensemble Model', accuracy: '99.5%', precision: '99.3%', recall: '99.4%' },
];

export function ModelPerformanceSection() {
  return (
    <section id="models" className="py-16 md:py-24">
      <div className="text-center space-y-4 mb-12">
        <Badge variant="outline" className="text-primary border-primary/30">
          Model Performance
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          Industry-Leading Accuracy
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our ensemble of machine learning models achieves state-of-the-art performance 
          in phishing detection across all key metrics
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overall Performance */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Overall Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-bold text-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {keyMetrics.map((metric) => (
                <div 
                  key={metric.label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <metric.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Comparison Table */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Model Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30">
                    <TableHead className="font-semibold">Model</TableHead>
                    <TableHead className="font-semibold">Accuracy</TableHead>
                    <TableHead className="font-semibold">Precision</TableHead>
                    <TableHead className="font-semibold">Recall</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelComparison.map((row) => (
                    <TableRow 
                      key={row.model}
                      className={row.model === 'Ensemble Model' ? 'bg-primary/5' : ''}
                    >
                      <TableCell className="font-medium">
                        {row.model}
                        {row.model === 'Ensemble Model' && (
                          <Badge className="ml-2 text-xs" variant="default">Best</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-primary font-semibold">{row.accuracy}</TableCell>
                      <TableCell>{row.precision}</TableCell>
                      <TableCell>{row.recall}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}