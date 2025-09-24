import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bucketId: string }> }
) {
  const { bucketId } = await params;
  try {

    if (!bucketId) {
      return NextResponse.json(
        { error: 'Bucket ID is required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data: letters, error } = await supabase
      .from('letters')
      .select('txid, created_at')
      .eq('bucket_id', bucketId)
      .order('created_at', { ascending: false }) as { 
        data: Array<{ txid: string; created_at: string }> | null; 
        error: unknown 
      };

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch letters' },
        { status: 500 }
      );
    }

    const candidates = await Promise.all(
      (letters || []).map(async (letter) => {
        try {
          
          return {
            txid: letter.txid,
            question: "あなたの好きな色は？", // Mock question
            timestamp: letter.created_at
          };
        } catch (error) {
          console.error(`Failed to fetch letter ${letter.txid}:`, error);
          return null;
        }
      })
    );

    const validCandidates = candidates.filter(c => c !== null);

    // await supabase
    //   .from('telemetry')
    //   .insert({
    //     event: 'found',
    //     bucket_id: bucketId,
    //     value: validCandidates.length,
    //     meta: {
    //       total_letters: letters?.length || 0
    //     }
    //   });

    return NextResponse.json({
      bucketId,
      candidates: validCandidates,
      total: validCandidates.length
    });

  } catch (error) {
    console.error('Index fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
