import { NextResponse } from 'next/server';
import { generatePlaylist } from '@/lib/storage';

export async function GET() {
  try {
    // Generate playlist from bucket
    const playlist = await generatePlaylist('intimate-commons-prod');
    
    return NextResponse.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch playlist',
      tracks: []
    }, { status: 500 });
  }
}