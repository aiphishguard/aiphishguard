import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import BulkScanner from "@/pages/BulkScanner";
import EmailAnalyzer from "@/pages/EmailAnalyzer";
import Intelligence from "@/pages/Intelligence";
import Learn from "@/pages/Learn";
import Feedback from "@/pages/Feedback";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/bulk" element={<BulkScanner />} />
                  <Route path="/email" element={<EmailAnalyzer />} />
                  <Route path="/intel" element={<Intelligence />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
