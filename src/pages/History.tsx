import { useEffect, useState } from 'react';
import { History as HistoryIcon, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScanHistoryCard } from '@/components/ScanHistoryCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ThreatLevel } from '@/types/analysis';
import { Helmet } from 'react-helmet-async';

interface ScanHistoryItem {
  id: string;
  url: string;
  threat_level: string;
  risk_score: number;
  confidence: number;
  scanned_at: string;
}

const History = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('id, url, threat_level, risk_score, confidence, scanned_at')
        .order('scanned_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
      setFilteredHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter((item) =>
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Helmet>
        <title>Scan History - PhishGuard AI</title>
        <meta name="description" content="View your URL scan history and past phishing detection results." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="container flex-1 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <HistoryIcon className="h-4 w-4" />
                Scan History
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Recent URL Scans
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                View all previously scanned URLs and their threat analysis results.
              </p>
            </div>

            {/* Search and Refresh */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search URLs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchHistory}
                disabled={isLoading}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* History List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading scan history...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No scans found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? 'No results match your search query.'
                      : 'Start scanning URLs to see your history here.'}
                  </p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <ScanHistoryCard
                    key={item.id}
                    id={item.id}
                    url={item.url}
                    threatLevel={item.threat_level as ThreatLevel}
                    riskScore={item.risk_score}
                    confidence={item.confidence}
                    scannedAt={item.scanned_at}
                  />
                ))
              )}
            </div>

            {/* Stats */}
            {!isLoading && history.length > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing {filteredHistory.length} of {history.length} scans
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default History;
