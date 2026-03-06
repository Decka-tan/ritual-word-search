/**
 * Supabase client configuration.
 */

import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Public client for client-side queries (lazy initialization)
function getSupabaseUrl() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }
    return url;
}

function getSupabaseAnonKey() {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
    }
    return key;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
    get(target, prop) {
        if (!supabaseInstance) {
            supabaseInstance = createClient(getSupabaseUrl(), getSupabaseAnonKey());
        }
        return supabaseInstance[prop as keyof typeof supabaseInstance];
    },
});

/**
 * Service role client for server-side operations with elevated privileges.
 * IMPORTANT: Only use this in API routes, never expose to client.
 */
export function getServiceRoleClient() {
    if (typeof window !== 'undefined') {
        throw new Error('Service role client can only be used on the server side');
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }

    return createClient(getSupabaseUrl(), serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
