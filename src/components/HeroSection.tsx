import { Shield, Scan, Lock, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  onScanClick: () => void;
}

export function HeroSection({ onScanClick }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay to allow loading screen to finish
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
            className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          />
          <path 
            d="M0,450 Q300,250 600,450 T1200,450" 
            fill="none" 
            stroke="hsl(195, 100%, 50%)" 
            strokeWidth="1"
            strokeDasharray="8 8"
            opacity="0.5"
            className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-50' : 'opacity-0'}`}
          />
        </svg>
      </div>
      
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <Shield className="h-4 w-4" />
          AI-Powered Security
        </div>

        {/* Main heading with gradient */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span 
            className={`block text-foreground transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Advanced Phishing
          </span>
          <span 
            className={`gradient-text block transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Detection System
          </span>
        </h1>

        {/* Description */}
        <p 
          className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Protect yourself from phishing attacks with our cutting-edge AI models. 
          Real-time URL analysis powered by machine learning and threat intelligence.
        </p>

        {/* CTA Buttons */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-[400ms] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
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
          {[
            { icon: Shield, value: '99.2%', label: 'Detection Accuracy', delay: 500 },
            { icon: Scan, value: '10+', label: 'ML Models', delay: 600 },
            { icon: Lock, value: '50K+', label: 'Threats Analyzed', delay: 700 },
          ].map((stat, index) => (
            <div 
              key={index}
              className={`glass-card rounded-xl p-4 md:p-6 hover:border-primary/50 hover:scale-105 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${stat.delay}ms` }}
            >
              <div className="flex justify-center mb-2">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
