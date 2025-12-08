import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { ThreatLevel } from '@/types/analysis';

interface AnimatedRiskScoreProps {
  score: number;
  threatLevel: ThreatLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

const sizeConfig = {
  sm: { dimension: 120, strokeWidth: 8, fontSize: 'text-2xl', labelSize: 'text-xs' },
  md: { dimension: 180, strokeWidth: 10, fontSize: 'text-4xl', labelSize: 'text-sm' },
  lg: { dimension: 240, strokeWidth: 12, fontSize: 'text-5xl', labelSize: 'text-base' },
};

const threatColors = {
  safe: 'hsl(var(--threat-safe))',
  low: 'hsl(var(--threat-low))',
  medium: 'hsl(var(--threat-medium))',
  high: 'hsl(var(--threat-high))',
  critical: 'hsl(var(--threat-critical))',
};

const threatLabels = {
  safe: 'Safe',
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
  critical: 'Critical',
};

export function AnimatedRiskScore({ 
  score, 
  threatLevel, 
  size = 'md', 
  showLabel = true,
  animate = true 
}: AnimatedRiskScoreProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [progress, setProgress] = useState(animate ? 0 : score);
  const animationRef = useRef<number>();
  
  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      setProgress(score);
      return;
    }

    const duration = 1500;
    const startTime = Date.now();
    const startScore = displayScore;
    const startProgress = progress;

    const animateScore = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      
      const currentScore = Math.round(startScore + (score - startScore) * eased);
      const currentProgress = startProgress + (score - startProgress) * eased;
      
      setDisplayScore(currentScore);
      setProgress(currentProgress);

      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animateScore);
      }
    };

    animationRef.current = requestAnimationFrame(animateScore);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score, animate]);

  const color = threatColors[threatLevel];
  const isCritical = threatLevel === 'critical' || threatLevel === 'high';

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={config.dimension}
        height={config.dimension}
        className={cn(
          "transform -rotate-90",
          isCritical && "animate-pulse"
        )}
      >
        {/* Background circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={config.strokeWidth}
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
          style={{
            filter: isCritical ? `drop-shadow(0 0 10px ${color})` : undefined,
          }}
        />
        
        {/* Glow effect for high risk */}
        {isCritical && (
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth / 2}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="opacity-50 blur-sm"
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className={cn(config.fontSize, "font-bold font-display")}
          style={{ color }}
        >
          {displayScore}
        </span>
        {showLabel && (
          <span className={cn(config.labelSize, "text-muted-foreground mt-1")}>
            {threatLabels[threatLevel]}
          </span>
        )}
      </div>
    </div>
  );
}
