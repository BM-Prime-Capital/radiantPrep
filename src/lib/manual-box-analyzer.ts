// src/lib/manual-box-analyzer.ts

export interface ManualBox {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const labelMap: Record<number, string> = {
  0: 'duck',
  1: 'fuel_gauge'
};

export const parseYoloBoxes = (txt: string, imageWidth: number, imageHeight: number): ManualBox[] => {
  return txt.trim().split('\n').map(line => {
    const [classId, xC, yC, w, h] = line.split(' ').map(Number);
    const width = w * imageWidth;
    const height = h * imageHeight;
    const centerX = xC * imageWidth;
    const centerY = yC * imageHeight;
    return {
      label: labelMap[classId] || `class_${classId}`,
      x: centerX - width / 2,
      y: centerY - height / 2,
      width,
      height,
    };
  });
};

export const evaluateDrawingWithManualBoxes = (
  userDrawing: any[],
  manualBoxes: ManualBox[],
  expectedLabels: string[]
): { score: number; feedback: string; circledLabels: string[] } => {
  const tolerance = 50;

  const isBoxInsideCircle = (box: ManualBox, circle: any) => {
    const cx = circle.x;
    const cy = circle.y;
    const r = circle.radius || 30;

    const corners = [
      [box.x, box.y],
      [box.x + box.width, box.y],
      [box.x, box.y + box.height],
      [box.x + box.width, box.y + box.height],
      [box.x + box.width / 2, box.y + box.height / 2],
    ];

    return corners.every(([px, py]) => {
      const dx = px - cx;
      const dy = py - cy;
      return dx * dx + dy * dy <= (r + tolerance) * (r + tolerance);
    });
  };

  const circledLabels: string[] = [];

  userDrawing.forEach(circle => {
    const matchedBox = manualBoxes.find(box => isBoxInsideCircle(box, circle));
    if (matchedBox) {
      circledLabels.push(matchedBox.label);
    }
  });

  const correctMatches = circledLabels.filter(label => expectedLabels.includes(label));
  const score = Math.round((correctMatches.length / Math.max(expectedLabels.length, 1)) * 100);

  let feedback = '';
  if (score === 100) {
    feedback = `Parfait ! Vous avez bien encerclé : ${circledLabels.join(', ')}`;
  } else if (score >= 60) {
    feedback = `Bon travail ! Objets encerclés : ${circledLabels.join(', ')}. Vérifiez vos réponses.`;
  } else {
    feedback = `Continuez ! Objets encerclés : ${circledLabels.join(', ')}.`;
  }

  return { score, feedback, circledLabels };
};
