import React, { useEffect, useState } from 'react';
import AnimatedLogo from './AnimatedLogo';

interface LoadingScreenProps {
  minDisplayTime?: number;
  onLoadComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  minDisplayTime = 2000,
  onLoadComplete,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        onLoadComplete?.();
      }, 500);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onLoadComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <AnimatedLogo size="xl" showText={false} animated={true} />
        
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-display font-bold gradient-text">
            PhishGuard AI
          </h1>
          <p className="text-muted-foreground text-sm tracking-wider">
            Initializing security protocols
            <span className="inline-flex ml-1">
              <span className="animate-loading-dot" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-loading-dot" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-loading-dot" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary via-accent to-primary animate-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
