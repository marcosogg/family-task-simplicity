// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://qwktijytabdbnvweugfs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3Rpanl0YWJkYm52d2V1Z2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MTY2NjAsImV4cCI6MjA0ODM5MjY2MH0.GkgJ-E1LnE2lwokjuX8mqRBxWA30rNTYcFxONzf61jM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);