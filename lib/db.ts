import { sql, createPool } from '@vercel/postgres'

/**
 * Execute parameterized SQL query against Vercel Postgres database.
 */
export async function query<T = any>(queryString: string, params: any[] = []): Promise<{ rows: T[]; rowCount: number }> {
  const postgresUrl = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL

  if (!postgresUrl && typeof window === 'undefined') {
    // If running on server without active POSTGRES_URL connection string
    console.warn('[Vercel Postgres] POSTGRES_URL is not set yet in environment variables.')
    return { rows: [], rowCount: 0 }
  }

  try {
    if (postgresUrl) {
      const pool = createPool({ connectionString: postgresUrl })
      const result = await pool.query(queryString, params)
      return { rows: result.rows as T[], rowCount: result.rowCount || 0 }
    } else {
      const result = await sql.query(queryString, params)
      return { rows: result.rows as T[], rowCount: result.rowCount || 0 }
    }
  } catch (error: any) {
    console.error('[Vercel Postgres Query Error]:', error.message || error)
    return { rows: [], rowCount: 0 }
  }
}
