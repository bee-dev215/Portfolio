import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://wlpripxhdnpfitczjsfx.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjY1YmU1Y2VmLWQ2M2YtNDIxMC04N2QwLTI2OGNiNTZhNjI2ZiJ9.eyJwcm9qZWN0SWQiOiJ3bHByaXB4aGRucGZpdGN6anNmeCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzkyMzk3ODQxLCJleHAiOjIxMDc3NTc4NDEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.4Kv3BcGfWMdVxEEC3WauVti8nx5fIJNgXIzGtSEIwVE';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };