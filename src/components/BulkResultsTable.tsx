import { useState } from 'react';
import { 
  ExternalLink, 
  Eye, 
  RefreshCw, 
  ChevronUp, 
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThreatLevelBadge } from './ThreatLevelBadge';
import type { BulkScanItem } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface BulkResultsTableProps {
  items: BulkScanItem[];
  onViewDetails: (item: BulkScanItem) => void;
  onRescan: (url: string) => void;
}

type SortField = 'url' | 'status' | 'threatLevel' | 'riskScore';
type SortDirection = 'asc' | 'desc';

const statusConfig = {
  pending: { icon: Clock, color: 'text-muted-foreground', label: 'Pending' },
  scanning: { icon: Loader2, color: 'text-primary', label: 'Scanning' },
  completed: { icon: CheckCircle2, color: 'text-success', label: 'Completed' },
  error: { icon: XCircle, color: 'text-destructive', label: 'Error' },
};

export function BulkResultsTable({ items, onViewDetails, onRescan }: BulkResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'url':
        comparison = a.url.localeCompare(b.url);
        break;
      case 'status':
        const statusOrder = { pending: 0, scanning: 1, completed: 2, error: 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'threatLevel':
        const threatOrder = { safe: 0, low: 1, medium: 2, high: 3, critical: 4 };
        const aLevel = a.result?.threatLevel || 'safe';
        const bLevel = b.result?.threatLevel || 'safe';
        comparison = threatOrder[aLevel] - threatOrder[bLevel];
        break;
      case 'riskScore':
        comparison = (a.result?.riskScore || 0) - (b.result?.riskScore || 0);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3 w-3 ml-1" />
    ) : (
      <ChevronDown className="h-3 w-3 ml-1" />
    );
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30">
            <TableHead 
              className="cursor-pointer hover:bg-secondary/50"
              onClick={() => handleSort('url')}
            >
              <div className="flex items-center">
                URL <SortIcon field="url" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-secondary/50 w-[120px]"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status <SortIcon field="status" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-secondary/50 w-[130px]"
              onClick={() => handleSort('threatLevel')}
            >
              <div className="flex items-center">
                Threat Level <SortIcon field="threatLevel" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-secondary/50 w-[100px]"
              onClick={() => handleSort('riskScore')}
            >
              <div className="flex items-center">
                Risk Score <SortIcon field="riskScore" />
              </div>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => {
            const StatusIcon = statusConfig[item.status].icon;
            
            return (
              <TableRow key={item.id} className="hover:bg-secondary/20">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-mono text-sm truncate max-w-[300px]"
                      title={item.url}
                    >
                      {truncateUrl(item.url)}
                    </span>
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn("flex items-center gap-2", statusConfig[item.status].color)}>
                    <StatusIcon className={cn(
                      "h-4 w-4",
                      item.status === 'scanning' && "animate-spin"
                    )} />
                    <span className="text-sm">{statusConfig[item.status].label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.result ? (
                    <ThreatLevelBadge level={item.result.threatLevel} size="sm" />
                  ) : item.error ? (
                    <Badge variant="destructive" className="text-xs">Error</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {item.result ? (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-16 h-2 rounded-full bg-secondary overflow-hidden"
                      >
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.result.riskScore < 30 && "bg-success",
                            item.result.riskScore >= 30 && item.result.riskScore < 60 && "bg-warning",
                            item.result.riskScore >= 60 && "bg-destructive"
                          )}
                          style={{ width: `${item.result.riskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {item.result.riskScore}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {item.status === 'completed' && item.result && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onViewDetails(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {(item.status === 'completed' || item.status === 'error') && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onRescan(item.url)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
