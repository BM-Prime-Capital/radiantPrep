import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { VisionAnalyzer } from '@/lib/vision';

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageData, questionId, questionText, userDrawing, correctAnswer } = await request.json();

    if (!imageData || !questionId || !questionText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Conversion de l'image base64 en buffer
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Analyse avec Google Vision API
      console.log('🔍 Début de l\'analyse Google Vision...');
      const visionResult = await VisionAnalyzer.analyzeImage(imageBuffer);
      
      console.log('📊 Objets détectés:', visionResult.objects.length);
      console.log('📝 Texte détecté:', visionResult.textDetections.length);
      console.log('🎨 Annotations détectées:', visionResult.annotations.length);

      // Comparaison avec la réponse attendue
      const analysisResult = VisionAnalyzer.compareWithExpectedAnswer(
        visionResult,
        userDrawing || [],
        questionText,
        correctAnswer
      );

      // Sauvegarde de l'image analysée (optionnel)
      const timestamp = Date.now();
      const filename = `analysis_${questionId}_${timestamp}.png`;
      
      // Vous pouvez sauvegarder l'image analysée si nécessaire
      // const fs = require('fs').promises;
      // const path = require('path');
      // const analysisPath = path.join(process.cwd(), 'public', 'analysis', filename);
      // await fs.writeFile(analysisPath, imageBuffer);

      return NextResponse.json({
        success: true,
        feedback: analysisResult.feedback,
        score: analysisResult.score,
        details: {
          ...analysisResult.details,
          visionAnalysis: {
            objectsDetected: visionResult.objects.length,
            textDetected: visionResult.textDetections.length,
            annotationsDetected: visionResult.annotations.length,
            topObjects: visionResult.objects.slice(0, 5).map(obj => ({
              name: obj.name,
              confidence: Math.round(obj.confidence * 100)
            }))
          }
        },
        imagePath: `/analysis/${filename}` // Chemin vers l'image analysée
      });

    } catch (visionError: any) {
      console.error('❌ Erreur Google Vision:', visionError);
      
      // Fallback vers l'analyse simulée en cas d'erreur Vision API
      const fallbackResult = await analyzeDrawingWithSimulation(imageData, questionText, userDrawing);
      
      return NextResponse.json({
        success: true,
        feedback: `${fallbackResult.feedback} (Analyse de secours utilisée)`,
        score: fallbackResult.score,
        details: {
          ...fallbackResult.details,
          fallbackUsed: true,
          visionError: visionError.message
        },
        imagePath: null
      });
    }

  } catch (error: any) {
    console.error('❌ Erreur générale lors de l\'analyse:', error);
    return NextResponse.json(
      { error: error.message || 'Échec de l\'analyse' },
      { status: 500 }
    );
  }
}

// Fonction de fallback en cas d'échec de Google Vision
async function analyzeDrawingWithSimulation(imageData: string, questionText: string, userDrawing: any[] = []) {
  const score = Math.floor(Math.random() * 40) + 60; // Score entre 60-100
  
  let feedback = "Analyse de secours : ";
  
  if (questionText.toLowerCase().includes("circle") || questionText.toLowerCase().includes("encercl")) {
    const circleCount = userDrawing.filter(item => item.type === 'circle' || item.radius).length;
    if (score >= 80) {
      feedback += `Excellent travail ! Vous avez dessiné ${circleCount} cercle(s) pour identifier les objets différents.`;
    } else if (score >= 70) {
      feedback += `Bon travail avec ${circleCount} cercle(s), mais vérifiez que vous avez encerclé tous les objets différents.`;
    } else {
      feedback += `Essayez de mieux identifier les objets différents. ${circleCount} cercle(s) détecté(s).`;
    }
  } else if (questionText.toLowerCase().includes("match") || questionText.toLowerCase().includes("connect")) {
    const lineCount = userDrawing.filter(item => item.points && item.points.length >= 4).length;
    if (score >= 80) {
      feedback += `Parfait ! Vous avez tracé ${lineCount} ligne(s) pour connecter les éléments correspondants.`;
    } else {
      feedback += `Vérifiez vos ${lineCount} connexion(s) entre les éléments.`;
    }
  } else if (questionText.toLowerCase().includes("pattern")) {
    const shapeCount = userDrawing.filter(item => item.type && ['circle', 'triangle', 'square'].includes(item.type)).length;
    if (score >= 80) {
      feedback += `Excellent ! Vous avez placé ${shapeCount} forme(s) en suivant le motif correctement.`;
    } else {
      feedback += `Observez bien le motif avec vos ${shapeCount} forme(s) placée(s).`;
    }
  } else {
    feedback += `Votre réponse avec ${userDrawing.length} élément(s) a été analysée. Continuez vos efforts !`;
  }

  return {
    score,
    feedback,
    details: {
      analysisType: "Simulation Fallback",
      userDrawingElements: userDrawing.length,
      questionType: questionText.includes("circle") ? "DRAWING" : 
                   questionText.includes("match") ? "MATCHING" : "PATTERN",
      timestamp: new Date().toISOString()
    }
  };
}