/**
 * Supabase client configuration.
 */

import { createClient } from '@supabase/supabase-js';

// Public client for client-side queries
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Service role client for server-side operations with elevated privileges.
 * IMPORTANT: Only use this in API routes, never expose to client.
 */
export function getServiceRoleClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }

    // Non-null assertion: we've verified serviceRoleKey exists above
    return createClient(supabaseUrl!, serviceRoleKey!, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
