import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient({
  keyFilename: './lib/gcloud-key.json'
});

export async function analyzeDrawing(imageBuffer: Buffer, questionType: string) {
  if (typeof client.objectLocalization !== 'function') {
    throw new Error('Google Vision objectLocalization method is not available.');
  }
  const [result] = await client.objectLocalization({
    image: { content: imageBuffer.toString('base64') }
  });

  const objects = result.localizedObjectAnnotations || [];

  // Filtrage selon le type de question
  const relevantObjects = objects.filter(obj => {
    switch(questionType) {
      case 'DRAWING':
        return obj.name === 'Circle' || obj.name === 'Ellipse';
      case 'MATCHING':
        return obj.name === 'Line' || obj.name === 'Arrow';
      case 'PATTERN':
        return typeof obj.name === 'string' && ['Triangle', 'Square', 'Circle'].includes(obj.name);
      default:
        return true;
    }
  });

  return {
    objects: relevantObjects,
    score: calculateDrawingScore(
      relevantObjects.map(obj => ({ name: obj.name ?? '' })), 
      questionType
    ),
    feedback: generateFeedback(
      relevantObjects.map(obj => ({ name: obj.name ?? '' })), 
      questionType
    )
  };
}

function calculateDrawingScore(objects: Array<{ name: string }>, questionType: string) {
  // Logique de scoring basique (à adapter)
  const baseScore = objects.length * 20;
  return Math.min(baseScore, 100);
}

function generateFeedback(objects: Array<{ name: string }>, questionType: string) {
  const count = objects.length;
  
  if (count === 0) return "Aucun élément pertinent détecté";
  
  switch(questionType) {
    case 'DRAWING':
      return `${count} ${count > 1 ? 'cercles détectés' : 'cercle détecté'}`;
    case 'MATCHING':
      return `${count} connexions établies`;
    case 'PATTERN':
      return `Modèle partiellement reconnu (${count}/3 éléments)`;
    default:
      return "Analyse terminée";
  }
}