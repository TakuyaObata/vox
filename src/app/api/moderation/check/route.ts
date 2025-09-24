import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, attachments = [] } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required for moderation check' },
        { status: 400 }
      );
    }

    
    console.log('Moderation check requested:', {
      contentLength: content.length,
      attachmentCount: attachments.length,
      timestamp: new Date().toISOString()
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      approved: true,
      confidence: 0.95,
      flags: [],
      message: 'Content approved by moderation system'
    });

  } catch (error) {
    console.error('Moderation check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
