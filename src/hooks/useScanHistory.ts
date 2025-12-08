import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult } from '@/types/analysis';
import { Json } from '@/integrations/supabase/types';

export async function saveScanToHistory(result: AnalysisResult) {
  try {
    const insertData: {
      url: string;
      threat_level: string;
      risk_score: number;
      confidence: number;
      analysis?: string;
      url_features?: Json;
      content_analysis?: Json;
      language_detection?: Json;
      virustotal_result?: Json;
      warnings?: string[];
    } = {
      url: result.url,
      threat_level: result.threatLevel,
      risk_score: result.riskScore,
      confidence: result.confidence,
      analysis: result.aiAnalysis,
      url_features: result.urlFeatures as unknown as Json,
      content_analysis: result.contentAnalysis as unknown as Json,
      language_detection: result.languageDetection as unknown as Json,
      virustotal_result: result.virusTotalResult as unknown as Json,
      warnings: result.warnings,
    };

    const { error } = await supabase.from('scan_history').insert(insertData);

    if (error) {
      console.error('Error saving scan to history:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error saving scan to history:', error);
    return false;
  }
}
