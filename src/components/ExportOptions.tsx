import { useState } from 'react';
import { 
  Download, 
  FileJson, 
  FileText, 
  Copy, 
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { AnalysisResult, BulkScanItem } from '@/types/analysis';
import { generatePdfReport, exportToJson, exportToCsv, copyReportToClipboard } from '@/lib/export-utils';

interface ExportOptionsProps {
  result?: AnalysisResult;
  bulkResults?: BulkScanItem[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportOptions({ 
  result, 
  bulkResults,
  variant = 'outline',
  size = 'default'
}: ExportOptionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result) {
      await copyReportToClipboard(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Report copied to clipboard');
    }
  };

  const handleJsonExport = () => {
    if (result) {
      exportToJson(result, `phishguard-report-${result.id || 'scan'}.json`);
      toast.success('JSON report downloaded');
    } else if (bulkResults) {
      const completedResults = bulkResults
        .filter(item => item.result)
        .map(item => item.result!);
      exportToJson(completedResults, `phishguard-bulk-report-${Date.now()}.json`);
      toast.success('JSON report downloaded');
    }
  };

  const handleCsvExport = () => {
    if (bulkResults) {
      exportToCsv(bulkResults, `phishguard-bulk-report-${Date.now()}.csv`);
      toast.success('CSV report downloaded');
    }
  };

  const handlePdfExport = async () => {
    if (result) {
      await generatePdfReport(result);
      toast.success('PDF report downloaded');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {result && (
          <>
            <DropdownMenuItem onClick={handlePdfExport}>
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={handleJsonExport}>
          <FileJson className="mr-2 h-4 w-4" />
          Download JSON
        </DropdownMenuItem>
        
        {bulkResults && (
          <DropdownMenuItem onClick={handleCsvExport}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Download CSV
          </DropdownMenuItem>
        )}
        
        {result && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCopy}>
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-success" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy to Clipboard
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
