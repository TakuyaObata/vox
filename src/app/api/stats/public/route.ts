import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: letterStats, error: letterError } = await supabase
      .from('letters')
      .select('id, sender_id, cost_fiat')
      .not('sender_id', 'is', null) as { 
        data: Array<{ id: string; sender_id: string; cost_fiat: number | null }> | null; 
        error: unknown 
      };

    if (letterError) {
      console.error('Letter stats error:', letterError);
      return NextResponse.json(
        { error: 'Failed to fetch letter statistics' },
        { status: 500 }
      );
    }

    const { data: openingStats, error: openingError } = await supabase
      .from('openings')
      .select('id, opener_id') as { 
        data: Array<{ id: string; opener_id: string }> | null; 
        error: unknown 
      };

    if (openingError) {
      console.error('Opening stats error:', openingError);
      return NextResponse.json(
        { error: 'Failed to fetch opening statistics' },
        { status: 500 }
      );
    }

    const letterCount = letterStats?.length || 0;
    const uniqueSenders = new Set(letterStats?.map(l => l.sender_id) || []).size;
    const openingCount = openingStats?.length || 0;
    const uniqueOpeners = new Set(openingStats?.map(o => o.opener_id) || []).size;
    
    const totalFiat = letterStats?.reduce((sum, letter) => sum + (letter.cost_fiat || 0), 0) || 0;
    const avgPerLetter = letterCount > 0 ? totalFiat / letterCount : 0;

    const gatewayStatus = {
      gateway: "https://arweave.net",
      ok: true,
      rttMs: Math.floor(Math.random() * 300) + 100 // Mock response time
    };

    const stats = {
      letters: {
        count: letterCount,
        uniqueSenders
      },
      openings: {
        count: openingCount,
        uniqueOpeners
      },
      cost: {
        totalFiat: Math.round(totalFiat * 100) / 100,
        avgPerLetter: Math.round(avgPerLetter * 100) / 100
      },
      arweave: gatewayStatus
    };

    // await supabase
    //   .from('telemetry')
    //   .insert({
    //     event: 'view',
    //     meta: {
    //       endpoint: 'stats/public',
    //       stats_snapshot: stats
    //     }

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Public stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
