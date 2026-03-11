-- Migration to add hero carousel flag to gallery images
-- This allows admins to tick which images appear on the homepage hero section

ALTER TABLE public.gallery_images 
ADD COLUMN IF NOT EXISTS is_hero BOOLEAN DEFAULT false;

-- Optional: index for faster querying on the homepage
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_hero ON public.gallery_images(is_hero);
