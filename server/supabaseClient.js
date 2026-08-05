import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export function isSupabaseConfigured() {
  return !!supabase;
}

/**
 * Persists security analysis audit log to Supabase 'security_logs' table
 */
export async function saveAuditLogToSupabase(logData) {
  if (!supabase) {
    return { success: false, reason: 'Supabase client not configured in .env' };
  }

  try {
    const { data, error } = await supabase
      .from('security_logs')
      .insert([
        {
          user_email: logData.user_email || 'anonymous@safeprompt.io',
          user_role: logData.user_role || 'Analyst',
          original_text: logData.original_text,
          sanitized_text: logData.sanitized_text,
          trust_score: logData.trust_score,
          threat_level: logData.threat_level,
          detected_threats: logData.detected_threats,
          redaction_details: logData.redaction_details,
          explanation: logData.explanation,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.warn('Supabase insert log warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase save log error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch logs from Supabase 'security_logs' table
 */
export async function fetchAuditLogsFromSupabase(limit = 50) {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Supabase fetch logs warning:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Supabase fetch logs error:', err.message);
    return [];
  }
}
