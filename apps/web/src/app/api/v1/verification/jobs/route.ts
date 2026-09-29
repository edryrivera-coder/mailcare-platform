import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_BATCH_JOBS } from '@/lib/mailcare-data';

export async function GET() {
  return NextResponse.json({ jobs: INITIAL_BATCH_JOBS });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    fileName?: string;
    recordCount?: number;
    type?: 'Bulk Verification' | 'Inbox Cleanup' | 'CRM Sync' | 'Hygiene Job';
  };

  const totalRecords = body.recordCount ?? 100000;
  const partitions = Math.ceil(totalRecords / 10000);

  return NextResponse.json(
    {
      jobId: `BJ-2025-00${Math.floor(124 + Math.random() * 70)}`,
      type: body.type ?? 'Bulk Verification',
      category: 'Verification',
      status: 'Running',
      progress: 12,
      totalRecords,
      completedRecords: Math.floor(totalRecords * 0.12),
      partitionsCreated: partitions,
      checkpointRange: `000001 - ${String(Math.floor(totalRecords * 0.12)).padStart(6, '0')}`,
      createdRelative: 'Just now',
    },
    { status: 202 }
  );
}
