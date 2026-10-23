import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://wxszdybwmcblyvnyddja.supabase.co";

const supabaseKey =
  "sb_publishable_bhM98SF3n015WasB-VwYNw_g8iX-gvf";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );