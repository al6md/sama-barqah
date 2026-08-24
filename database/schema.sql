-- ==============================================================================
-- SCHEMA DEFINITION FOR SUPABASE / POSTGRESQL
-- منصة سما البارقة للسفر والسياحة (Sama Al Barqah Travel & Tourism)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    destination VARCHAR(150) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    currency VARCHAR(10) DEFAULT 'د.ع',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration VARCHAR(100) NOT NULL,
    max_seats INTEGER NOT NULL DEFAULT 20,
    booked_seats INTEGER NOT NULL DEFAULT 0,
    main_image TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT NOT NULL,
    overview TEXT,
    daily_program JSONB DEFAULT '[]'::JSONB,
    included_services TEXT[] DEFAULT ARRAY[]::TEXT[],
    excluded_services TEXT[] DEFAULT ARRAY[]::TEXT[],
    departure_info TEXT,
    visited_spots TEXT[] DEFAULT ARRAY[]::TEXT[],
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'completed', 'draft')),
    is_featured BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    offer_badge VARCHAR(100),
    is_seed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on slug & destination & status
CREATE INDEX IF NOT EXISTS idx_trips_slug ON public.trips(slug);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);

-- 2. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(50) PRIMARY KEY, -- e.g. SB-2026-0001
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    trip_title VARCHAR(255) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    trip_date DATE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(150),
    traveler_count INTEGER NOT NULL CHECK (traveler_count > 0),
    price_per_person NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'د.ع',
    preferred_contact_method VARCHAR(20) DEFAULT 'whatsapp' CHECK (preferred_contact_method IN ('whatsapp', 'phone', 'email')),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'جديد' CHECK (status IN ('جديد', 'قيد المراجعة', 'تم التواصل مع العميل', 'مؤكد', 'مكتمل', 'ملغي')),
    status_history JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(customer_phone);

-- 3. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'جديد' CHECK (status IN ('جديد', 'تم الرد', 'مؤرشف')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_messages(status);

-- 4. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(200) NOT NULL,
    company_name_en VARCHAR(200) NOT NULL,
    tagline TEXT,
    logo_text VARCHAR(100),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_badge VARCHAR(150),
    facebook_url TEXT,
    instagram_url TEXT,
    telegram_url TEXT,
    tiktok_url TEXT,
    booking_email_receiver VARCHAR(150),
    currency_symbol VARCHAR(10) DEFAULT 'د.ع',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VISITOR SESSIONS & ANALYTICS
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page VARCHAR(255) NOT NULL,
    trip_slug VARCHAR(255),
    referrer TEXT,
    device VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_created_at ON public.visitor_sessions(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active trips & site settings
CREATE POLICY "Public trips viewable by everyone" ON public.trips FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');
CREATE POLICY "Public settings viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public booking insertion" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public contact message insertion" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public analytics logging" ON public.visitor_sessions FOR INSERT WITH CHECK (true);

-- Authenticated Admin full access
CREATE POLICY "Admin full access trips" ON public.trips FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access bookings" ON public.bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access contacts" ON public.contact_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access analytics" ON public.visitor_sessions FOR ALL TO authenticated USING (true);
