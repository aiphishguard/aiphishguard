import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskGauge({ score, size = 'md' }: RiskGaugeProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  
  // Calculate rotation for the needle (-90 to 90 degrees)
  const rotation = -90 + (clampedScore / 100) * 180;
  
  const getColorClass = () => {
    if (clampedScore < 20) return 'text-threat-safe';
    if (clampedScore < 40) return 'text-threat-low';
    if (clampedScore < 60) return 'text-threat-medium';
    if (clampedScore < 80) return 'text-threat-high';
    return 'text-threat-critical';
  };

  const sizeClasses = {
    sm: { container: 'w-24 h-16', text: 'text-lg' },
    md: { container: 'w-32 h-20', text: 'text-2xl' },
    lg: { container: 'w-48 h-28', text: 'text-4xl' },
  };

  const config = sizeClasses[size];

  return (
    <div className={cn('relative', config.container)}>
      {/* Background arc */}
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Background gradient arc */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--threat-safe))" />
            <stop offset="25%" stopColor="hsl(var(--threat-low))" />
            <stop offset="50%" stopColor="hsl(var(--threat-medium))" />
            <stop offset="75%" stopColor="hsl(var(--threat-high))" />
            <stop offset="100%" stopColor="hsl(var(--threat-critical))" />
          </linearGradient>
        </defs>
        
        {/* Background arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Colored arc */}
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${clampedScore * 1.26} 126`}
        />
        
        {/* Needle */}
        <g transform={`rotate(${rotation}, 50, 50)`}>
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={getColorClass()}
          />
          <circle
            cx="50"
            cy="50"
            r="4"
            fill="currentColor"
            className={getColorClass()}
          />
        </g>
      </svg>
      
      {/* Score display */}
      <div className="absolute inset-x-0 bottom-0 text-center">
        <span className={cn('font-bold', config.text, getColorClass())}>
          {clampedScore}
        </span>
        <span className="text-xs text-muted-foreground ml-1">/100</span>
      </div>
    </div>
  );
}
