import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/Header';
import { UrlScanner } from '@/components/UrlScanner';
import { AnalysisResults } from '@/components/AnalysisResults';
import { StatsCards } from '@/components/StatsCards';
import { useAnalysis } from '@/hooks/useAnalysis';

const Index = () => {
  const { isAnalyzing, analysisProgress, currentStep, result, analyze, reset } = useAnalysis();

  const handleAnalyze = (url: string, options: { deepAnalysis: boolean; virusTotalScan: boolean }) => {
    analyze(url, options);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="gradient-text">PhishGuard</span> AI
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced AI-powered phishing detection with deep content analysis, 
                language detection, and real-time threat intelligence.
              </p>
            </div>

            {/* Stats */}
            <StatsCards />

            {/* Scanner or Results */}
            {result ? (
              <AnalysisResults result={result} onNewScan={reset} />
            ) : (
              <UrlScanner
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                progress={analysisProgress}
                currentStep={currentStep}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-6 mt-12">
          <div className="container text-center text-sm text-muted-foreground">
            <p>PhishGuard AI • Advanced Phishing Detection System</p>
            <p className="mt-1">Powered by Lovable AI</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
