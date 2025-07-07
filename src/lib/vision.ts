import { ImageAnnotatorClient } from '@google-cloud/vision';

// Configuration du client Google Vision
const vision = new ImageAnnotatorClient({
  // Les credentials seront automatiquement détectés depuis les variables d'environnement
  // ou depuis le fichier de service account
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
  annotations: Array<{
    type: 'circle' | 'line' | 'shape';
    confidence: number;
    coordinates: number[];
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
  /**
   * Analyse une image avec Google Vision API
   */
  static async analyzeImage(imageBuffer: Buffer): Promise<VisionAnalysisResult> {
    try {
      // Détection d'objets
      const [objectsResult] = await vision.objectLocalization({
        image: { content: imageBuffer },
      });

      // Détection de texte
      const [textResult] = await vision.textDetection({
        image: { content: imageBuffer },
      });

      // Détection de formes géométriques (utilise l'analyse d'image générale)
      const [labelResult] = await vision.labelDetection({
        image: { content: imageBuffer },
        maxResults: 20,
      });

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
            x: minX * 800, // Conversion en pixels (assumant 800px de largeur)
            y: minY * 400, // Conversion en pixels (assumant 400px de hauteur)
            width: (maxX - minX) * 800,
            height: (maxY - minY) * 400,
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
          confidence: 0.9, // Google Vision ne fournit pas de score pour le texte
          boundingBox: {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
          },
        };
      }) || [];

      // Analyse des annotations dessinées (cercles, lignes, etc.)
      const annotations = await this.detectDrawnAnnotations(imageBuffer, labelResult.labelAnnotations || []);

      return {
        objects,
        annotations,
        textDetections,
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse Vision API:', error);
      throw new Error('Échec de l\'analyse d\'image');
    }
  }

  /**
   * Détecte les annotations dessinées (cercles, lignes) dans l'image
   */
  private static async detectDrawnAnnotations(imageBuffer: Buffer, labels: any[]): Promise<VisionAnalysisResult['annotations']> {
    const annotations: VisionAnalysisResult['annotations'] = [];

    // Recherche d'indices de formes géométriques dans les labels
    const shapeLabels = labels.filter(label => 
      ['circle', 'oval', 'line', 'arrow', 'rectangle', 'triangle', 'shape'].some(shape => 
        label.description?.toLowerCase().includes(shape)
      )
    );

    shapeLabels.forEach(label => {
      const description = label.description?.toLowerCase() || '';
      let type: 'circle' | 'line' | 'shape' = 'shape';

      if (description.includes('circle') || description.includes('oval')) {
        type = 'circle';
      } else if (description.includes('line') || description.includes('arrow')) {
        type = 'line';
      }

      annotations.push({
        type,
        confidence: label.score || 0,
        coordinates: [], // Les coordonnées exactes nécessiteraient une analyse plus poussée
      });
    });

    return annotations;
  }

  /**
   * Compare les objets détectés avec les réponses attendues
   */
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
      // Analyse basée sur le type de question
      if (questionText.toLowerCase().includes('circle') || questionText.toLowerCase().includes('encercl')) {
        score = this.evaluateCirclingTask(visionResult, userDrawing, correctAnswer);
        feedback = this.generateCirclingFeedback(score, visionResult.objects);
      } else if (questionText.toLowerCase().includes('match') || questionText.toLowerCase().includes('connect')) {
        score = this.evaluateMatchingTask(visionResult, userDrawing, correctAnswer);
        feedback = this.generateMatchingFeedback(score, visionResult.objects);
      } else if (questionText.toLowerCase().includes('pattern')) {
        score = this.evaluatePatternTask(visionResult, userDrawing, correctAnswer);
        feedback = this.generatePatternFeedback(score, visionResult.objects);
      } else {
        // Analyse générale
        score = this.evaluateGeneralTask(visionResult, userDrawing);
        feedback = this.generateGeneralFeedback(score, visionResult.objects);
      }

      // Ajustement du score basé sur la précision de la détection
      const detectionQuality = this.assessDetectionQuality(visionResult);
      score = Math.round(score * detectionQuality);

      details.detectionQuality = detectionQuality;
      details.rawScore = score;

    } catch (error) {
      console.error('Erreur lors de la comparaison:', error);
      score = 50; // Score par défaut en cas d'erreur
      feedback = 'Analyse partiellement réussie. Votre travail a été enregistré.';
    }

    return { score: Math.max(0, Math.min(100, score)), feedback, details };
  }

  private static evaluateCirclingTask(visionResult: VisionAnalysisResult, userDrawing: any[], correctAnswer: any): number {
    const detectedObjects = visionResult.objects;
    const userCircles = userDrawing.filter(item => item.type === 'circle' || item.radius);

    if (userCircles.length === 0) return 0;

    let correctCircles = 0;
    const tolerance = 50; // Tolérance en pixels

    userCircles.forEach(circle => {
      // Vérifier si le cercle englobe un objet détecté
      const englobesObject = detectedObjects.some(obj => {
        const objCenterX = obj.boundingBox.x + obj.boundingBox.width / 2;
        const objCenterY = obj.boundingBox.y + obj.boundingBox.height / 2;
        const distance = Math.sqrt(
          Math.pow(circle.x - objCenterX, 2) + Math.pow(circle.y - objCenterY, 2)
        );
        return distance <= (circle.radius || 30) + tolerance;
      });

      if (englobesObject) correctCircles++;
    });

    return Math.round((correctCircles / Math.max(userCircles.length, 1)) * 100);
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