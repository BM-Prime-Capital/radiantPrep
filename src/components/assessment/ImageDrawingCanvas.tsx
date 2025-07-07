'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ImageDrawingCanvasProps {
  imageUrl: string | undefined; // Permet d'être undefined
  onSave: (drawingData: string) => void;
  initialDrawing?: string;
}


export function ImageDrawingCanvas({ imageUrl, onSave, initialDrawing }: ImageDrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Initialize canvas and context
  useEffect(() => {
    if (!canvasRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set drawing style
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Load initial drawing if provided
    if (initialDrawing) {
      const img = new window.Image();
      img.src = initialDrawing;
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  }, [imageLoaded, initialDrawing]);

  // Handle mouse/touch events
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
  };

  return (
    <div className="relative">
      <Image
        src={imageUrl ?? ''}
        alt="Drawing canvas background"
        width={400}
        height={300}
        className="rounded-md"
        onLoadingComplete={() => setImageLoaded(true)}
      />
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="absolute top-0 left-0 w-full h-full cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}