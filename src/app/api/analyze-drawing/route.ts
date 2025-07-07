import { NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import fs from 'fs';
import path from 'path';

const client = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { imageData, questionId, questionText } = body;

        // Sauvegarder l'image
        const imagePath = await saveImage(imageData, questionId);

        // Analyser les objets
        const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');
        const [objectResult] = await client.objectLocalization({
            image: { content: base64Image }
        });

        const allObjects = objectResult.localizedObjectAnnotations?.map(obj => 
            obj.name?.toLowerCase() || 'unknown'
        ) || [];

        // Détection simplifiée des cercles (fallback si échec)
        let circledObjects: string[] = [];
        if (allObjects.length > 0) {
            // Prendre l'objet avec le plus haut score comme "encerclé"
            const highestScoreObj = objectResult.localizedObjectAnnotations?.reduce((prev, current) => 
                (prev.score || 0) > (current.score || 0) ? prev : current
            );
            if (highestScoreObj?.score && highestScoreObj.score > 0.5) {
                circledObjects = [highestScoreObj.name?.toLowerCase() || 'unknown'];
            }
        }

        // Générer le feedback
        let feedback = "";
        if (circledObjects.length === 0) {
            feedback = allObjects.length > 0 
                ? "Aucun cercle détecté mais objets trouvés: " + [...new Set(allObjects)].join(", ")
                : "Aucun objet détecté dans l'image";
        } else {
            feedback = `Objet encerclé: ${circledObjects[0]}`;
            
            if (questionText.toLowerCase().includes('different') && allObjects.length > 1) {
                const objectCounts = allObjects.reduce((acc: Record<string, number>, obj) => {
                    acc[obj] = (acc[obj] || 0) + 1;
                    return acc;
                }, {});

                const differentObject = Object.entries(objectCounts)
                    .find(([_, count]) => count === 1)?.[0];

                if (differentObject) {
                    feedback += circledObjects.includes(differentObject)
                        ? "\nCorrect: Vous avez bien encerclé l'objet différent !"
                        : `\nIncorrect: L'objet différent était ${differentObject}`;
                }
            }
        }

        return NextResponse.json({ 
            success: true,
            imagePath,
            feedback,
            details: {
                circledObjects,
                allDetectedObjects: allObjects,
                objectCounts: allObjects.reduce((acc: Record<string, number>, obj) => {
                    acc[obj] = (acc[obj] || 0) + 1;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Erreur:', error);
        return NextResponse.json(
            { success: false, error: "Échec de l'analyse" },
            { status: 500 }
        );
    }
}

async function saveImage(imageData: string, questionId: string): Promise<string> {
    const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid image data');
    
    const buffer = Buffer.from(matches[2], 'base64');
    const dir = path.join(process.cwd(), 'public', 'uploads');
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const filename = `drawing_${questionId}_${Date.now()}.${matches[1]}`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, buffer);
    
    return `/uploads/${filename}`;
}