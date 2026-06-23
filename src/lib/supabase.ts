import { createClient } from "@supabase/supabase-js";

// 데이터베이스(Supabase)에 연결하는 통로.
// 주소와 키는 .env.local 파일에서 읽어온다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
