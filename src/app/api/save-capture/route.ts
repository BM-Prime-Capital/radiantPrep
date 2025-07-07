// Pour Next.js 13+ (App Router)
// app/api/save-capture/route.ts
import { NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const { imageData, questionId } = await request.json();

  try {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const savePath = path.join(process.cwd(), 'public', 'captures', `capture-${questionId}-${Date.now()}.png`);
    writeFileSync(savePath, buffer);

    return NextResponse.json({ path: `/captures/capture-${questionId}-${Date.now()}.png` });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de sauvegarde' }, { status: 500 });
  }
}