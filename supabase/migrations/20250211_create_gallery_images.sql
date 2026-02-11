-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    description TEXT,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Policies for gallery_images
CREATE POLICY "Allow public read access" ON public.gallery_images
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated upload" ON public.gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON public.gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON public.gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Bucket Setup for 'gallery'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING ( bucket_id = 'gallery' );

CREATE POLICY "Authenticated Upload" ON storage.objects
    FOR INSERT WITH CHECK ( bucket_id = 'gallery' AND auth.role() = 'authenticated' );

CREATE POLICY "Authenticated Delete" ON storage.objects
    FOR DELETE USING ( bucket_id = 'gallery' AND auth.role() = 'authenticated' );
