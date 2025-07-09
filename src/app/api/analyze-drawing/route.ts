// src/app/api/analyze-drawing/route.ts

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { parseYoloBoxes, evaluateDrawingWithManualBoxes } from '@/lib/manual-box-analyzer';

const yoloTxt = `
0 0.304521 0.752878 0.172872 0.341385
1 0.857713 0.764257 0.178191 0.343913
`; // YOLO export from MakeSense.ai

const expectedLabels = ['duck', 'fuel_gauge'];

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageData, questionId, questionText, userDrawing } = await request.json();

    if (!imageData || !questionId || !questionText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    console.log('🔍 Analyse sans IA — via YOLO zones');

    const canvasWidth = 800;
    const canvasHeight = 400;

    const manualBoxes = parseYoloBoxes(yoloTxt, canvasWidth, canvasHeight);

    const result = evaluateDrawingWithManualBoxes(userDrawing || [], manualBoxes, expectedLabels);

    return NextResponse.json({
      success: true,
      feedback: result.feedback,
      score: result.score,
      details: {
        circled: result.circledLabels,
        expected: expectedLabels,
        method: 'Manual Bounding Box'
      },
      imagePath: null
    });
  } catch (error: any) {
    console.error('❌ Erreur analyse manuelle:', error);
    return NextResponse.json({ error: error.message || 'Analyse échouée' }, { status: 500 });
  }
}
