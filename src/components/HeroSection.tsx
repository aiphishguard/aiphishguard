import { Shield, Scan, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScanClick: () => void;
}

export function HeroSection({ onScanClick }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Shield className="h-4 w-4" />
          AI-Powered Security
        </div>

        {/* Main heading with gradient */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="block">Advanced Phishing</span>
          <span className="gradient-text">Detection System</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Protect yourself from phishing attacks with our cutting-edge AI models. 
          Real-time URL analysis powered by machine learning and threat intelligence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            onClick={onScanClick}
            className="gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
          >
            <Scan className="h-5 w-5 mr-2" />
            Scan URL Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg font-semibold border-border/50 hover:bg-secondary/80"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
            <ArrowDown className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-8">
          <div className="glass-card rounded-xl p-4 md:p-6">
            <div className="flex justify-center mb-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">99.2%</div>
            <div className="text-xs md:text-sm text-muted-foreground">Detection Accuracy</div>
          </div>
          <div className="glass-card rounded-xl p-4 md:p-6">
            <div className="flex justify-center mb-2">
              <Scan className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">10+</div>
            <div className="text-xs md:text-sm text-muted-foreground">ML Models</div>
          </div>
          <div className="glass-card rounded-xl p-4 md:p-6">
            <div className="flex justify-center mb-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">50K+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Threats Analyzed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
