import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { imageData, questionId } = await request.json();

    if (!imageData || !questionId) {
      return NextResponse.json(
        { error: 'Missing imageData or questionId' },
        { status: 400 }
      );
    }

    // Créer le dossier captures s'il n'existe pas
    const capturesDir = join(process.cwd(), 'public', 'captures');
    try {
      await mkdir(capturesDir, { recursive: true });
    } catch (err) {
      // Le dossier existe déjà
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const filename = `capture_${questionId}_${timestamp}.png`;
    const filepath = join(capturesDir, filename);

    // Convertir base64 en buffer
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Sauvegarder le fichier
    await writeFile(filepath, buffer);

    const publicPath = `/captures/${filename}`;

    return NextResponse.json({
      success: true,
      path: publicPath,
      filename
    });

  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}