import React from 'react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 64,
  lg: 120,
  xl: 200,
};

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'md',
  showText = true,
  animated = true,
  className = '',
}) => {
  const dimension = sizeMap[size];
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-2xl';

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-shield-pulse' : ''}
      >
        <defs>
          {/* Main shield gradient */}
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(195, 100%, 50%)" />
            <stop offset="50%" stopColor="hsl(220, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(270, 100%, 50%)" />
          </linearGradient>
          
          {/* Core glow gradient */}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(185, 100%, 50%)" stopOpacity="1" />
            <stop offset="70%" stopColor="hsl(195, 100%, 50%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(195, 100%, 50%)" stopOpacity="0" />
          </radialGradient>

          {/* Background glow */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Scan line gradient */}
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(185, 100%, 50%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(185, 100%, 50%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(185, 100%, 50%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer glow ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#shieldGradient)"
          strokeWidth="2"
          opacity="0.3"
          className={animated ? 'animate-pulse-slow' : ''}
        />

        {/* Shield shape */}
        <path
          d="M100 20 L170 50 L170 100 C170 140 140 170 100 185 C60 170 30 140 30 100 L30 50 Z"
          fill="url(#shieldGradient)"
          opacity="0.15"
          filter="url(#glow)"
        />
        <path
          d="M100 20 L170 50 L170 100 C170 140 140 170 100 185 C60 170 30 140 30 100 L30 50 Z"
          fill="none"
          stroke="url(#shieldGradient)"
          strokeWidth="3"
          className={animated ? 'animate-glow' : ''}
        />

        {/* AI Core - central hexagon */}
        <g className={animated ? 'animate-core-glow' : ''}>
          <polygon
            points="100,70 125,82 125,108 100,120 75,108 75,82"
            fill="url(#coreGlow)"
            opacity="0.8"
          />
          <polygon
            points="100,70 125,82 125,108 100,120 75,108 75,82"
            fill="none"
            stroke="hsl(185, 100%, 50%)"
            strokeWidth="2"
          />
          
          {/* Inner circuit pattern */}
          <circle cx="100" cy="95" r="8" fill="hsl(185, 100%, 50%)" opacity="0.9" />
          <line x1="100" y1="87" x2="100" y2="75" stroke="hsl(185, 100%, 50%)" strokeWidth="2" />
          <line x1="100" y1="103" x2="100" y2="115" stroke="hsl(185, 100%, 50%)" strokeWidth="2" />
          <line x1="92" y1="95" x2="80" y2="95" stroke="hsl(185, 100%, 50%)" strokeWidth="2" />
          <line x1="108" y1="95" x2="120" y2="95" stroke="hsl(185, 100%, 50%)" strokeWidth="2" />
        </g>

        {/* Neural network nodes */}
        {[
          { cx: 60, cy: 55, delay: '0s' },
          { cx: 140, cy: 55, delay: '0.3s' },
          { cx: 50, cy: 100, delay: '0.6s' },
          { cx: 150, cy: 100, delay: '0.9s' },
          { cx: 70, cy: 145, delay: '1.2s' },
          { cx: 130, cy: 145, delay: '1.5s' },
        ].map((node, i) => (
          <g key={i}>
            {/* Connection line to core */}
            <line
              x1={node.cx}
              y1={node.cy}
              x2="100"
              y2="95"
              stroke="hsl(195, 100%, 50%)"
              strokeWidth="1"
              opacity="0.4"
              strokeDasharray="4,4"
              className={animated ? 'animate-connection-flow' : ''}
            />
            {/* Node */}
            <circle
              cx={node.cx}
              cy={node.cy}
              r="6"
              fill="hsl(195, 100%, 50%)"
              className={animated ? 'animate-node-pulse' : ''}
              style={{ animationDelay: node.delay }}
            />
          </g>
        ))}

        {/* Scanning line */}
        {animated && (
          <rect
            x="35"
            y="0"
            width="130"
            height="8"
            fill="url(#scanGradient)"
            className="animate-scan-line"
          />
        )}
      </svg>

      {showText && size !== 'sm' && (
        <div className={`font-display font-bold ${textSize} gradient-text`}>
          PhishGuard AI
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;
