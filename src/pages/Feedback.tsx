import { ThemeProvider } from 'next-themes';
import { MessageSquare } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FeedbackForm } from '@/components/FeedbackForm';
import { Helmet } from 'react-helmet-async';

const Feedback = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Helmet>
        <title>Feedback - PhishGuard AI</title>
        <meta name="description" content="Share your feedback, suggestions, or report issues with PhishGuard AI." />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="container flex-1 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <MessageSquare className="h-4 w-4" />
                We Value Your Input
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Submit Feedback
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Help us improve PhishGuard AI by sharing your thoughts, suggestions, or reporting any issues.
              </p>
            </div>

            {/* Feedback Form */}
            <FeedbackForm />
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Feedback;
