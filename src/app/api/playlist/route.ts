import { NextResponse } from 'next/server';
import { generatePlaylist } from '@/lib/storage';

export async function GET() {
  try {
    // Generate playlist from bucket
    const playlist = await generatePlaylist('intimate-commons-prod');
    
    return NextResponse.json({ 
      success: true, 
      playlist,
      message: 'Playlist generated dynamically' 
    });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate playlist' 
    }, { status: 500 });
  }
}