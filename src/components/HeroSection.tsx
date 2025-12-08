import { Shield, Scan, Lock, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScanClick: () => void;
}

export function HeroSection({ onScanClick }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      
      {/* Curved line decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path 
            d="M0,400 Q300,200 600,400 T1200,400" 
            fill="none" 
            stroke="hsl(195, 100%, 50%)" 
            strokeWidth="1"
            strokeDasharray="8 8"
          />
          <path 
            d="M0,450 Q300,250 600,450 T1200,450" 
            fill="none" 
            stroke="hsl(195, 100%, 50%)" 
            strokeWidth="1"
            strokeDasharray="8 8"
            opacity="0.5"
          />
        </svg>
      </div>
      
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
          <Shield className="h-4 w-4" />
          AI-Powered Security
        </div>

        {/* Main heading with gradient */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="block text-foreground">Advanced Phishing</span>
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
            className="gradient-primary text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
          >
            <Scan className="h-5 w-5 mr-2" />
            Scan URL Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg font-semibold border-border/50 hover:bg-secondary/80 hover:border-primary/50 transition-all duration-300"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
            <ArrowDown className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-8">
          <div className="glass-card rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex justify-center mb-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">99.2%</div>
            <div className="text-xs md:text-sm text-muted-foreground">Detection Accuracy</div>
          </div>
          <div className="glass-card rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex justify-center mb-2">
              <Scan className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">10+</div>
            <div className="text-xs md:text-sm text-muted-foreground">ML Models</div>
          </div>
          <div className="glass-card rounded-xl p-4 md:p-6 hover:border-primary/50 transition-all duration-300">
            <div className="flex justify-center mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">50K+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Threats Analyzed</div>
          </div>
        </div>
      </div>
    </section>
  );
}