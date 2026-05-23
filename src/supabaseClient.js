import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://dlxhmucifqthksnjgbjc.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRseGhtdWNpZnF0aGtzbmpnYmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTI5MDEsImV4cCI6MjA5NTEyODkwMX0.tjfGLa-LMAcS_j01BCEcuzpJC25KKsNtukEgHSA3b5c'
);

export default supabase;
