-- Create scan_history table
CREATE TABLE public.scan_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  threat_level TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  confidence INTEGER NOT NULL,
  analysis TEXT,
  url_features JSONB,
  content_analysis JSONB,
  language_detection JSONB,
  virustotal_result JSONB,
  warnings TEXT[],
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('complaint', 'suggestion', 'other')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert scan history (public feature)
CREATE POLICY "Anyone can insert scan history"
ON public.scan_history
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read scan history
CREATE POLICY "Anyone can read scan history"
ON public.scan_history
FOR SELECT
USING (true);

-- Allow anyone to submit feedback
CREATE POLICY "Anyone can submit feedback"
ON public.feedback
FOR INSERT
WITH CHECK (true);

-- Only allow reading own feedback (by email match - basic privacy)
CREATE POLICY "Feedback is write-only for public"
ON public.feedback
FOR SELECT
USING (false);