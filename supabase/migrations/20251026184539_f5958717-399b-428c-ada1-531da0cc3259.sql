-- Add missing columns to wardrobe_items table
DO $$ 
BEGIN
  -- Add tags column if not exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wardrobe_items' 
    AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.wardrobe_items ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;

  -- Add usage_count column if not exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wardrobe_items' 
    AND column_name = 'usage_count'
  ) THEN
    ALTER TABLE public.wardrobe_items ADD COLUMN usage_count INTEGER NOT NULL DEFAULT 0;
  END IF;

  -- Add favorite column if not exists
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'wardrobe_items' 
    AND column_name = 'favorite'
  ) THEN
    ALTER TABLE public.wardrobe_items ADD COLUMN favorite BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;