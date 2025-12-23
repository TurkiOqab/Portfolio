import { createClient, SupabaseClient } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null = null

/**
 * Get or create a Supabase admin client with service role key.
 * This client bypasses Row Level Security and should only be used in server-side code.
 *
 * @throws Error if required environment variables are not set
 */
export function getAdminClient(): SupabaseClient {
    if (adminClient) {
        return adminClient
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set')
    }

    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    }

    adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })

    return adminClient
}

/**
 * Create a new Supabase admin client instance.
 * Use this when you need a fresh client (e.g., in edge functions).
 *
 * @throws Error if required environment variables are not set
 */
export function createAdminClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set')
    }

    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
