import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const results: Record<string, string> = {};

  // Check env vars
  results.DATABASE_URL = process.env.DATABASE_URL ? 'set' : 'MISSING';
  results.BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN ? 'set' : 'MISSING';
  results.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ? 'set' : 'MISSING';
  results.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? 'MISSING';

  // Check DB
  try {
    await prisma.$queryRaw`SELECT 1`;
    results.database = 'ok';
  } catch (e) {
    results.database = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Check Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import('@vercel/blob');
      await list({ limit: 1 });
      results.blob = 'ok';
    } catch (e) {
      results.blob = `error: ${e instanceof Error ? e.message : String(e)}`;
    }
  } else {
    results.blob = 'skipped (token missing)';
  }

  return NextResponse.json(results);
}
