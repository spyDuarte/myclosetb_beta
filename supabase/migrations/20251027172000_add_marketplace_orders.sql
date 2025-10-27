-- Marketplace orders table for platform payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'marketplace_orders'
  ) THEN
    CREATE TABLE public.marketplace_orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      listing_id uuid NOT NULL,
      buyer_id uuid NOT NULL,
      buyer_email text,
      payment_method text NOT NULL,
      payment_status text NOT NULL DEFAULT 'pending',
      amount numeric(10, 2) NOT NULL,
      reference text NOT NULL,
      buyer_notes text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    ALTER TABLE public.marketplace_orders
      ADD CONSTRAINT marketplace_orders_listing_fk
      FOREIGN KEY (listing_id)
      REFERENCES public.marketplace_listings (id)
      ON DELETE CASCADE;

    ALTER TABLE public.marketplace_orders
      ADD CONSTRAINT marketplace_orders_buyer_fk
      FOREIGN KEY (buyer_id)
      REFERENCES auth.users (id)
      ON DELETE CASCADE;

    ALTER TABLE public.marketplace_orders
      ADD CONSTRAINT marketplace_orders_reference_unique UNIQUE (reference);

    ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Trigger to keep updated_at fresh
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'marketplace_orders_set_updated_at'
  ) THEN
    CREATE TRIGGER marketplace_orders_set_updated_at
    BEFORE UPDATE ON public.marketplace_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_orders'
      AND policyname = 'view relevant marketplace orders'
  ) THEN
    CREATE POLICY "view relevant marketplace orders"
      ON public.marketplace_orders
      FOR SELECT
      USING (
        auth.uid() = buyer_id OR
        auth.uid() IN (
          SELECT user_id
          FROM public.marketplace_listings
          WHERE marketplace_listings.id = marketplace_orders.listing_id
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_orders'
      AND policyname = 'insert own marketplace orders'
  ) THEN
    CREATE POLICY "insert own marketplace orders"
      ON public.marketplace_orders
      FOR INSERT
      WITH CHECK (auth.uid() = buyer_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_orders'
      AND policyname = 'update marketplace orders participants'
  ) THEN
    CREATE POLICY "update marketplace orders participants"
      ON public.marketplace_orders
      FOR UPDATE
      USING (
        auth.uid() = buyer_id OR
        auth.uid() IN (
          SELECT user_id
          FROM public.marketplace_listings
          WHERE marketplace_listings.id = marketplace_orders.listing_id
        )
      )
      WITH CHECK (
        auth.uid() = buyer_id OR
        auth.uid() IN (
          SELECT user_id
          FROM public.marketplace_listings
          WHERE marketplace_listings.id = marketplace_orders.listing_id
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'marketplace_orders'
      AND policyname = 'delete own marketplace orders'
  ) THEN
    CREATE POLICY "delete own marketplace orders"
      ON public.marketplace_orders
      FOR DELETE
      USING (auth.uid() = buyer_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS marketplace_orders_listing_idx
  ON public.marketplace_orders (listing_id);
