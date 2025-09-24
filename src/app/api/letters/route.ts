import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipientName, 
      recipientDob, 
      question, 
      answer, 
      content, 
      attachments = [],
      mirrorOptIn = false 
    } = body;

    if (!recipientName || !recipientDob || !question || !answer || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const senderId = 'mock_user_123';

    const mockTxid = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockBucketId = `bucket_${recipientName}_${recipientDob}`.replace(/\s+/g, '').toLowerCase();
    
    const contentSize = new TextEncoder().encode(content).length;
    const attachmentSize = attachments.reduce((sum: number, att: any) => sum + (att.size || 0), 0);
    const totalBytes = contentSize + attachmentSize;

    const costAr = totalBytes * 0.000001; // Mock AR cost
    const costFiat = costAr * 25.50; // Mock AR to USD rate

    const maxSize = 5 * 1024 * 1024;
    if (totalBytes > maxSize) {
      return NextResponse.json(
        { error: 'Content exceeds 5MB limit' },
        { status: 413 }
      );
    }




    const supabase = createServerClient();
    const { data: letter, error: dbError } = await supabase
      .from('letters')
      .insert({
        txid: mockTxid,
        bucket_id: mockBucketId,
        sender_id: senderId,
        bytes: totalBytes,
        cost_ar: costAr,
        cost_fiat: costFiat,
        mirror_opt_in: mirrorOptIn,
        mirror_id: mirrorOptIn ? `mirror_${mockTxid}` : null
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save letter record' },
        { status: 500 }
      );
    }

    await supabase
      .from('telemetry')
      .insert({
        event: 'sent',
        txid: mockTxid,
        bucket_id: mockBucketId,
        value: totalBytes,
        meta: {
          cost_ar: costAr,
          cost_fiat: costFiat,
          attachments_count: attachments.length
        }
      });

    return NextResponse.json({
      success: true,
      txid: mockTxid,
      bucketId: mockBucketId,
      cost: {
        ar: costAr,
        fiat: costFiat
      },
      bytes: totalBytes
    });

  } catch (error) {
    console.error('Letter sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
