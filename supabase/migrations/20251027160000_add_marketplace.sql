-- Create marketplace_listings table and policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'marketplace_listings'
  ) THEN
    CREATE TABLE public.marketplace_listings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      item_id uuid NOT NULL,
      title text NOT NULL,
      description text,
      price numeric(10, 2) NOT NULL,
      condition text NOT NULL,
      status text NOT NULL DEFAULT 'available',
      owner_email text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT marketplace_item_unique UNIQUE (item_id)
    );

    ALTER TABLE public.marketplace_listings
      ADD CONSTRAINT marketplace_listings_user_fk
      FOREIGN KEY (user_id)
      REFERENCES auth.users (id)
      ON DELETE CASCADE;

    ALTER TABLE public.marketplace_listings
      ADD CONSTRAINT marketplace_listings_item_fk
      FOREIGN KEY (item_id)
      REFERENCES public.wardrobe_items (id)
      ON DELETE CASCADE;

    ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Ensure helper function exists to bump updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'marketplace_listings_set_updated_at'
  ) THEN
    CREATE TRIGGER marketplace_listings_set_updated_at
    BEFORE UPDATE ON public.marketplace_listings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- Policies
DO $$
BEGIN
  -- Select policy
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_listings'
      AND policyname = 'view marketplace listings'
  ) THEN
    CREATE POLICY "view marketplace listings"
      ON public.marketplace_listings
      FOR SELECT
      USING (
        status = 'available' OR auth.uid() = user_id
      );
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_listings'
      AND policyname = 'insert own marketplace listings'
  ) THEN
    CREATE POLICY "insert own marketplace listings"
      ON public.marketplace_listings
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_listings'
      AND policyname = 'update own marketplace listings'
  ) THEN
    CREATE POLICY "update own marketplace listings"
      ON public.marketplace_listings
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_listings'
      AND policyname = 'delete own marketplace listings'
  ) THEN
    CREATE POLICY "delete own marketplace listings"
      ON public.marketplace_listings
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Index to speed up public browsing
CREATE INDEX IF NOT EXISTS marketplace_listings_status_idx
  ON public.marketplace_listings (status, created_at DESC);
