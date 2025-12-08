import { cn } from '@/lib/utils';
import type { ThreatLevel } from '@/types/analysis';
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Skull } from 'lucide-react';

interface ThreatLevelBadgeProps {
  level: ThreatLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showLabel?: boolean;
}

const levelConfig: Record<ThreatLevel, {
  label: string;
  icon: typeof Shield;
  className: string;
  bgClassName: string;
}> = {
  safe: {
    label: 'Safe',
    icon: ShieldCheck,
    className: 'text-threat-safe',
    bgClassName: 'bg-threat-safe/10 border-threat-safe/30',
  },
  low: {
    label: 'Low Risk',
    icon: Shield,
    className: 'text-threat-low',
    bgClassName: 'bg-threat-low/10 border-threat-low/30',
  },
  medium: {
    label: 'Medium Risk',
    icon: ShieldAlert,
    className: 'text-threat-medium',
    bgClassName: 'bg-threat-medium/10 border-threat-medium/30',
  },
  high: {
    label: 'High Risk',
    icon: ShieldX,
    className: 'text-threat-high',
    bgClassName: 'bg-threat-high/10 border-threat-high/30',
  },
  critical: {
    label: 'Critical',
    icon: Skull,
    className: 'text-threat-critical',
    bgClassName: 'bg-threat-critical/10 border-threat-critical/30',
  },
};

const sizeClasses = {
  sm: {
    container: 'px-2 py-1 text-xs gap-1',
    icon: 'h-3 w-3',
  },
  md: {
    container: 'px-3 py-1.5 text-sm gap-1.5',
    icon: 'h-4 w-4',
  },
  lg: {
    container: 'px-4 py-2 text-base gap-2',
    icon: 'h-5 w-5',
  },
};

export function ThreatLevelBadge({ 
  level, 
  size = 'md', 
  showIcon = true, 
  showLabel = true 
}: ThreatLevelBadgeProps) {
  const config = levelConfig[level];
  const sizeConfig = sizeClasses[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center font-semibold rounded-full border',
        config.bgClassName,
        config.className,
        sizeConfig.container
      )}
    >
      {showIcon && <Icon className={sizeConfig.icon} />}
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
