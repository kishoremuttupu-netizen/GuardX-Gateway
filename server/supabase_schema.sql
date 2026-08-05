-- SQL Table Definition for Supabase Database
-- Run this in your Supabase SQL Editor (https://app.supabase.com -> Project -> SQL Editor)

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) DEFAULT 'anonymous@safeprompt.io',
    user_role VARCHAR(100) DEFAULT 'Analyst',
    original_text TEXT,
    sanitized_text TEXT,
    trust_score INT,
    threat_level VARCHAR(20),
    detected_threats JSONB,
    redaction_details JSONB,
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read and insert access for demo authentication
CREATE POLICY "Allow public read access to security_logs"
    ON public.security_logs FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to security_logs"
    ON public.security_logs FOR INSERT WITH CHECK (true);
