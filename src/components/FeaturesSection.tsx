import { 
  Brain, 
  Database, 
  Zap, 
  Shield, 
  Target, 
  Lock 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: '10+ ML Models',
    description: 'Ensemble of Random Forest, Neural Networks, SVM, Gradient Boosting, and more for maximum accuracy',
  },
  {
    icon: Database,
    title: 'Comprehensive Dataset',
    description: 'Trained on 50,000+ URLs from multiple phishing databases and legitimate sources',
  },
  {
    icon: Zap,
    title: 'Real-Time Analysis',
    description: 'Instant URL scanning with sub-2-second response times for immediate threat detection',
  },
  {
    icon: Shield,
    title: 'VirusTotal Integration',
    description: "Cross-reference results with VirusTotal's extensive threat intelligence database",
  },
  {
    icon: Target,
    title: '99.2% Accuracy',
    description: 'Industry-leading detection rates with minimal false positives through advanced feature engineering',
  },
  {
    icon: Lock,
    title: '30+ Security Features',
    description: 'Analyzes URL length, special characters, domain age, SSL certificates, and more',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">
          Advanced Detection Technology
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our system combines cutting-edge machine learning with comprehensive threat 
          intelligence to provide unparalleled protection against phishing attacks
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card 
            key={index} 
            className="glass-card hover:border-primary/50 transition-all duration-300 group"
          >
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
