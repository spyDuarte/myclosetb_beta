-- Create looks table (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'looks') THEN
    CREATE TABLE public.looks (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL,
      name TEXT NOT NULL,
      occasion TEXT,
      item_ids TEXT[],
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );
    
    ALTER TABLE public.looks ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "view own looks" ON public.looks
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "insert own looks" ON public.looks
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "update own looks" ON public.looks
      FOR UPDATE USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "delete own looks" ON public.looks
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;