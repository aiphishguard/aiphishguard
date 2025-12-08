import { useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { UrlScanner } from '@/components/UrlScanner';
import { AnalysisResults } from '@/components/AnalysisResults';
import { useAnalysis } from '@/hooks/useAnalysis';
import { saveScanToHistory } from '@/hooks/useScanHistory';

const Index = () => {
  const { isAnalyzing, analysisProgress, currentStep, result, analyze, reset } = useAnalysis();
  const scannerRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (url: string, options: { deepAnalysis: boolean; virusTotalScan: boolean }) => {
    const analysisResult = await analyze(url, options);
    if (analysisResult) {
      await saveScanToHistory(analysisResult);
    }
  };

  const scrollToScanner = () => {
    scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Helmet>
        <title>PhishGuard AI - Advanced Phishing Detection System</title>
        <meta name="description" content="Protect yourself from phishing attacks with our AI-powered detection system. Real-time URL analysis using machine learning and threat intelligence." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1">
          <div className="container">
            {/* Hero Section */}
            <HeroSection onScanClick={scrollToScanner} />

            {/* Scanner Section */}
            <section ref={scannerRef} className="py-16 md:py-24 scroll-mt-20">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Scan URL for Threats
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Enter any URL to analyze it with AI models and VirusTotal threat intelligence
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
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
            </section>

            {/* Features Section */}
            <FeaturesSection />
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
