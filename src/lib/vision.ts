import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';

const keyPath = path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS || '');
console.log('[GOOGLE KEY PATH]:', keyPath);

const vision = new ImageAnnotatorClient({
  keyFilename: keyPath
});

export interface VisionAnalysisResult {
  objects: Array<{
    name: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
  textDetections: Array<{
    text: string;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

export class VisionAnalyzer {
  static async analyzeImage(imageBuffer: Buffer, imageWidth = 800, imageHeight = 400): Promise<VisionAnalysisResult> {
    try {
      const [objectsResult] = await vision.objectLocalization({ image: { content: imageBuffer } });
      const [textResult] = await vision.textDetection({ image: { content: imageBuffer } });

      const objects = objectsResult.localizedObjectAnnotations?.map(obj => {
        const vertices = obj.boundingPoly?.normalizedVertices || [];
        const minX = Math.min(...vertices.map(v => v.x || 0));
        const minY = Math.min(...vertices.map(v => v.y || 0));
        const maxX = Math.max(...vertices.map(v => v.x || 0));
        const maxY = Math.max(...vertices.map(v => v.y || 0));

        return {
          name: obj.name || 'unknown',
          confidence: obj.score || 0,
          boundingBox: {
            x: minX * imageWidth,
            y: minY * imageHeight,
            width: (maxX - minX) * imageWidth,
            height: (maxY - minY) * imageHeight,
          },
        };
      }) || [];

      const textDetections = textResult.textAnnotations?.slice(1).map(text => {
        const vertices = text.boundingPoly?.vertices || [];
        const minX = Math.min(...vertices.map(v => v.x || 0));
        const minY = Math.min(...vertices.map(v => v.y || 0));
        const maxX = Math.max(...vertices.map(v => v.x || 0));
        const maxY = Math.max(...vertices.map(v => v.y || 0));

        return {
          text: text.description || '',
          confidence: 0.9,
          boundingBox: {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
          },
        };
      }) || [];

      return { objects, textDetections };
    } catch (error) {
      console.error('Erreur lors de l\'analyse Vision API:', error);
      throw new Error('Échec de l\'analyse d\'image');
    }
  }

  static compareWithExpectedAnswer(
    visionResult: VisionAnalysisResult,
    userDrawing: any[],
    questionText: string,
    correctAnswer: any
  ): { score: number; feedback: string; details: any } {
    let score = 0;
    let feedback = '';
    const details: any = {
      detectedObjects: visionResult.objects,
      userAnnotations: userDrawing,
      analysisType: 'Google Vision API',
      timestamp: new Date().toISOString(),
    };

    try {
      if (questionText.toLowerCase().includes('circle') || questionText.toLowerCase().includes('encercl')) {
        const result = this.evaluateCirclingTask(visionResult, userDrawing, correctAnswer);
        score = result.score;
        feedback = result.feedback;
        details.circledObjects = result.circledObjects;
      } else if (questionText.toLowerCase().includes('match') || questionText.toLowerCase().includes('connect')) {
        score = this.evaluateMatchingTask(visionResult, userDrawing, correctAnswer);
        feedback = this.generateMatchingFeedback(score, visionResult.objects);
      } else {
        score = this.evaluateGeneralTask(visionResult, userDrawing);
        feedback = this.generateGeneralFeedback(score, visionResult.objects);
      }

      const detectionQuality = this.assessDetectionQuality(visionResult);
      score = Math.round(score * detectionQuality);
      details.detectionQuality = detectionQuality;
      details.rawScore = score;

    } catch (error) {
      console.error('Erreur lors de la comparaison:', error);
      score = 50;
      feedback = 'Analyse partiellement réussie. Votre travail a été enregistré.';
    }

    return { score: Math.max(0, Math.min(100, score)), feedback, details };
  }

  private static evaluateCirclingTask(
    visionResult: VisionAnalysisResult,
    userDrawing: any[],
    correctAnswer: any
  ): { score: number; feedback: string; circledObjects: string[] } {
    const detectedObjects = visionResult.objects;
    const userCircles = userDrawing.filter(item => item.type === 'circle' || item.radius);

    if (userCircles.length === 0) {
      return {
        score: 0,
        feedback: 'Aucun cercle détecté. Veuillez encercler les objets demandés.',
        circledObjects: []
      };
    }

    const isPointInsideCircle = (px: number, py: number, cx: number, cy: number, r: number) => {
      const dx = px - cx;
      const dy = py - cy;
      return dx * dx + dy * dy <= r * r;
    };

    const circledObjects: string[] = [];
    const tolerance = 50;

    userCircles.forEach(circle => {
      console.log('[🔵 CERCLE UTILISATEUR]', circle);

      const matchedObject = detectedObjects.find(obj => {
        const bb = obj.boundingBox;

        // Points à tester
        const pointsToCheck = [
          // Centre
          [bb.x + bb.width / 2, bb.y + bb.height / 2],
          // Coins
          [bb.x, bb.y],
          [bb.x + bb.width, bb.y],
          [bb.x, bb.y + bb.height],
          [bb.x + bb.width, bb.y + bb.height],
        ];

        const fits = pointsToCheck.some(([px, py]) =>
          isPointInsideCircle(px, py, circle.x, circle.y, circle.radius + tolerance)
        );

        console.log(`[📦 OBJET TESTÉ] ${obj.name} | fits: ${fits}`);
        return fits;
      });

      if (matchedObject) {
        circledObjects.push(matchedObject.name);
      }
    });

    let score = 0;
    if (correctAnswer) {
      const correctMatches = circledObjects.filter(objName =>
        correctAnswer.toLowerCase().includes(objName.toLowerCase())
      ).length;
      score = Math.round((correctMatches / Math.max(circledObjects.length, 1)) * 100);
    } else {
      score = Math.round((circledObjects.length / userCircles.length) * 100);
    }

    let feedback = '';
    if (circledObjects.length === 0) {
      feedback = 'Aucun objet détecté dans vos cercles. Essayez de dessiner des cercles plus précis autour des objets.';
    } else if (score >= 80) {
      feedback = `Excellent travail ! Vous avez correctement encerclé ${circledObjects.length} objet(s): ${circledObjects.join(', ')}.`;
    } else if (score >= 60) {
      feedback = `Bon travail ! Vous avez encerclé ${circledObjects.length} objet(s): ${circledObjects.join(', ')}. Vérifiez que ce sont bien les objets demandés.`;
    } else {
      feedback = `Vous avez encerclé ${circledObjects.length} objet(s): ${circledObjects.join(', ')}. Continuez vos efforts pour identifier les bons objets.`;
    }

    return {
      score,
      feedback,
      circledObjects
    };
  }



  private static evaluateMatchingTask(visionResult: VisionAnalysisResult, userDrawing: any[], correctAnswer: any): number {
    const lines = userDrawing.filter(item => item.points && item.points.length >= 4);
    const detectedObjects = visionResult.objects;

    if (lines.length === 0) return 0;

    let correctConnections = 0;
    const tolerance = 40;

    lines.forEach(line => {
      const startX = line.points[0];
      const startY = line.points[1];
      const endX = line.points[2];
      const endY = line.points[3];

      // Vérifier si la ligne connecte deux objets détectés
      const startObject = detectedObjects.find(obj => 
        this.isPointNearObject(startX, startY, obj, tolerance)
      );
      const endObject = detectedObjects.find(obj => 
        this.isPointNearObject(endX, endY, obj, tolerance)
      );

      if (startObject && endObject && startObject !== endObject) {
        correctConnections++;
      }
    });

    return Math.round((correctConnections / Math.max(lines.length, 1)) * 100);
  }

  private static evaluatePatternTask(visionResult: VisionAnalysisResult, userDrawing: any[], correctAnswer: any): number {
    const shapes = userDrawing.filter(item => item.type && ['circle', 'triangle', 'square'].includes(item.type));
    
    if (shapes.length === 0) return 0;

    // Évaluation basée sur la cohérence du motif
    const shapeTypes = shapes.map(s => s.type);
    const uniqueTypes = [...new Set(shapeTypes)];
    
    // Bonus pour la variété et l'organisation
    let score = 60; // Score de base
    
    if (uniqueTypes.length > 1) score += 20; // Variété de formes
    if (shapes.length >= 3) score += 20; // Nombre suffisant de formes
    
    return Math.min(100, score);
  }

  private static evaluateGeneralTask(visionResult: VisionAnalysisResult, userDrawing: any[]): number {
    const hasDrawing = userDrawing.length > 0;
    const hasDetectedObjects = visionResult.objects.length > 0;
    
    let score = 50; // Score de base
    
    if (hasDrawing) score += 25;
    if (hasDetectedObjects) score += 25;
    
    return score;
  }

  private static isPointNearObject(x: number, y: number, obj: any, tolerance: number): boolean {
    return (
      x >= obj.boundingBox.x - tolerance &&
      x <= obj.boundingBox.x + obj.boundingBox.width + tolerance &&
      y >= obj.boundingBox.y - tolerance &&
      y <= obj.boundingBox.y + obj.boundingBox.height + tolerance
    );
  }

  private static assessDetectionQuality(visionResult: VisionAnalysisResult): number {
    const objectCount = visionResult.objects.length;
    const avgConfidence = visionResult.objects.reduce((sum, obj) => sum + obj.confidence, 0) / Math.max(objectCount, 1);
    
    // Facteur de qualité basé sur le nombre d'objets détectés et leur confiance
    let quality = 0.7; // Qualité de base
    
    if (objectCount > 0) quality += 0.2;
    if (avgConfidence > 0.5) quality += 0.1;
    
    return Math.min(1, quality);
  }

  private static generateCirclingFeedback(score: number, objects: any[]): string {
    const objectNames = objects.map(obj => obj.name).join(', ');
    
    if (score >= 80) {
      return `Excellent travail ! Vous avez correctement identifié et encerclé les objets différents. Objets détectés : ${objectNames || 'plusieurs éléments'}.`;
    } else if (score >= 60) {
      return `Bon travail ! Vérifiez que vous avez bien encerclé tous les objets qui sont différents des autres dans chaque groupe. Objets détectés : ${objectNames || 'quelques éléments'}.`;
    } else {
      return `Continuez vos efforts ! Observez attentivement chaque groupe et encerclez l'objet qui est différent des autres. ${objects.length > 0 ? `Objets détectés : ${objectNames}` : 'Essayez de dessiner des cercles plus précis.'}.`;
    }
  }

  private static generateMatchingFeedback(score: number, objects: any[]): string {
    if (score >= 80) {
      return `Parfait ! Vous avez correctement connecté les éléments correspondants. L'analyse a détecté ${objects.length} objets dans l'image.`;
    } else if (score >= 60) {
      return `Bien joué ! Vérifiez quelques connexions pour vous assurer qu'elles sont correctes. ${objects.length} objets ont été détectés.`;
    } else {
      return `Continuez ! Observez bien les éléments à connecter et tracez des lignes claires entre eux. ${objects.length} objets détectés pour vous aider.`;
    }
  }

  private static generatePatternFeedback(score: number, objects: any[]): string {
    if (score >= 80) {
      return `Excellent ! Vous avez suivi le motif correctement et placé les formes de manière organisée.`;
    } else if (score >= 60) {
      return `Bon travail ! Continuez à suivre le motif et vérifiez l'organisation de vos formes.`;
    } else {
      return `Observez bien le motif demandé et essayez de le reproduire avec les formes appropriées.`;
    }
  }

  private static generateGeneralFeedback(score: number, objects: any[]): string {
    return `Votre réponse a été analysée avec l'intelligence artificielle. ${objects.length} éléments ont été détectés dans votre travail. Continuez vos efforts !`;
  }
}