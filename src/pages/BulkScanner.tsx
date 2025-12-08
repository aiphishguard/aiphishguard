import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BulkUrlScanner } from '@/components/BulkUrlScanner';
import { BulkResultsTable } from '@/components/BulkResultsTable';
import { BulkScanSummary } from '@/components/BulkScanSummary';
import { HistoryDetailModal } from '@/components/HistoryDetailModal';
import { ExportOptions } from '@/components/ExportOptions';
import { useBulkAnalysis } from '@/hooks/useBulkAnalysis';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { BulkScanItem } from '@/types/analysis';

export default function BulkScanner() {
  const {
    items,
    summary,
    isScanning,
    progress,
    currentUrl,
    startBulkScan,
    rescanUrl,
    reset,
  } = useBulkAnalysis();

  const [selectedItem, setSelectedItem] = useState<BulkScanItem | null>(null);

  const handleViewDetails = (item: BulkScanItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Helmet>
        <title>Bulk URL Scanner - PhishGuard AI</title>
        <meta 
          name="description" 
          content="Scan multiple URLs at once for phishing threats with PhishGuard AI's bulk scanning feature." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 container py-8 md:py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                Bulk URL Scanner
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Scan multiple URLs at once by uploading a file or pasting a list. 
                Get comprehensive threat analysis for all your URLs.
              </p>
            </div>

            {/* Scanner */}
            {items.length === 0 && (
              <BulkUrlScanner
                onStartScan={startBulkScan}
                isScanning={isScanning}
                progress={progress}
                currentUrl={currentUrl}
              />
            )}

            {/* Results */}
            {items.length > 0 && (
              <div className="space-y-6">
                {/* Actions */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Scan Results</h2>
                  <div className="flex gap-2">
                    <ExportOptions bulkResults={items} />
                    <Button 
                      variant="outline" 
                      onClick={reset}
                      disabled={isScanning}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      New Scan
                    </Button>
                  </div>
                </div>

                {/* Summary */}
                <BulkScanSummary summary={summary} />

                {/* Results Table */}
                <BulkResultsTable
                  items={items}
                  onViewDetails={handleViewDetails}
                  onRescan={rescanUrl}
                />
              </div>
            )}
          </div>
        </main>

        <Footer />

        {/* Detail Modal */}
        <HistoryDetailModal
          isOpen={!!selectedItem}
          onClose={handleCloseModal}
          result={selectedItem?.result || null}
          onRescan={rescanUrl}
        />
      </div>
    </ThemeProvider>
  );
}
