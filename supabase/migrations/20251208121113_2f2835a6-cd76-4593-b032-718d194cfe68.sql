-- Add new analysis columns to scan_history
ALTER TABLE public.scan_history 
ADD COLUMN IF NOT EXISTS ssl_analysis jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS redirect_analysis jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS dns_analysis jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bulk_scan_id uuid DEFAULT NULL,
ADD COLUMN IF NOT EXISTS threat_factors jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS analysis_steps jsonb DEFAULT NULL;

-- Create bulk_scans table for batch operations
CREATE TABLE IF NOT EXISTS public.bulk_scans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  total_urls integer NOT NULL DEFAULT 0,
  completed integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  summary jsonb DEFAULT NULL
);

-- Enable RLS on bulk_scans
ALTER TABLE public.bulk_scans ENABLE ROW LEVEL SECURITY;

-- Create policies for bulk_scans (public access like scan_history)
CREATE POLICY "Anyone can insert bulk scans" 
ON public.bulk_scans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read bulk scans" 
ON public.bulk_scans 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update bulk scans" 
ON public.bulk_scans 
FOR UPDATE 
USING (true);

-- Add foreign key constraint for bulk_scan_id
ALTER TABLE public.scan_history
ADD CONSTRAINT fk_bulk_scan
FOREIGN KEY (bulk_scan_id) 
REFERENCES public.bulk_scans(id)
ON DELETE SET NULL;