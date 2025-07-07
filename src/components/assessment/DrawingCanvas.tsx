// ✅ DrawingCanvas.tsx complet avec capture d'image et support des trois modes

'use client';

import React, { useRef, useState, useEffect } from 'react';
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Ellipse,
  Rect,
  RegularPolygon,
  Arrow,
} from 'react-konva';
import useImage from 'use-image';
import {
  Circle as CircleIcon,
  Move,
  Ellipsis,
  Trash2,
  Undo2,
  Redo2,
  RotateCw,
  Triangle,
  Square,
  Camera,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const arrowColors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#ec4899'];



// Types

type Mode = 'encircle' | 'matching' | 'pattern';

interface DrawingCanvasProps {
  imageUrl: string;
  questionId: string;
  questionText?: string; // Optional, used for analysis
  mode: Mode;
  onSelectionChange?: (data: any) => void;
  onDrawingChange?: (data: any) => void;
  onCaptureImage?: (dataUrl: string) => void;
  initialSelections?: any[];
  initialDrawing?: any;
  canvasSize?: { width: number; height: number };
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  imageUrl,
  questionId,
  questionText,
  mode,
  onSelectionChange,
  onDrawingChange,
  onCaptureImage,
  initialSelections = [],
  initialDrawing = '',
  canvasSize,
}) => {
  const [image] = useImage(imageUrl);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [canvasWidth, setCanvasWidth] = useState(canvasSize?.width || 800);
  const [canvasHeight, setCanvasHeight] = useState(canvasSize?.height || 400);

  const [circles, setCircles] = useState<any[]>(initialSelections || []);
  const [lines, setLines] = useState<any[]>(initialDrawing || []);
  const [shapes, setShapes] = useState<any[]>(initialDrawing || []);

  const [drawingLine, setDrawingLine] = useState<number[] | null>(null);
  const [shapeType, setShapeType] = useState<'circle' | 'triangle' | 'square'>('circle');
  const [tool, setTool] = useState<'draw' | 'select'>('draw');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [arrowColorIndex, setArrowColorIndex] = useState(0);
  const [isOval, setIsOval] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);

  const pushToHistory = () => {
    setHistory(prev => [...prev, { circles, lines, shapes }]);
    setFuture([]);
  };

  const [analysis, setAnalysis] = useState<{
  score?: number;
  feedback?: string;
  loading?: boolean;
}>({});



  const captureCanvas = () => {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL();
      onCaptureImage?.(dataUrl);
    }
  };

  useEffect(() => {
    if (canvasSize) return;
    const resize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const ratio = image?.height && image?.width ? image.height / image.width : 0.75;
        setCanvasWidth(width);
        setCanvasHeight(width * ratio);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [image, canvasSize]);


  // const handleAnalyze = async () => {
  //   if (!stageRef.current) return;

  //   setAnalysis({ loading: true });
    
  //   try {
  //     const dataUrl = stageRef.current.toDataURL();
  //     const base64Data = dataUrl.split(',')[1];

  //     const response = await fetch('/api/analyze-drawing', {
  //       method: 'POST',
  //       headers: { 
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         imageData: base64Data,
  //         questionType: mode
  //       })
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     setAnalysis({
  //       score: result.score,
  //       feedback: result.feedback
  //     });

  //   } catch (error) {
  //     console.error("Erreur d'analyse:", error);
  //     setAnalysis({
  //       feedback: error instanceof Error ? error.message : "Échec de l'analyse"
  //     });
  //   } finally {
  //     setAnalysis(prev => ({ ...prev, loading: false }));
  //   }
  // };

const handleAnalyze = async () => {
  if (!stageRef.current || !questionId || !questionText) return;

  setAnalysis({ loading: true });
  
  try {
    // 1. Capture du canvas
    const dataUrl = stageRef.current.toDataURL();
    
    // 2. Envoi à l'API avec le texte de la question
    const response = await fetch('/api/analyze-drawing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: dataUrl,
        questionId,
        questionText // Ajout du texte de la question
      })
    });

    const result = await response.json();
    
    if (result.success) {
      setAnalysis({
        feedback: result.feedback,
        details: result.details,
        imagePath: result.imagePath
      });
    } else {
      throw new Error(result.error || 'Échec de l\'analyse');
    }

  } catch (error) {
    setAnalysis({
      feedback: error instanceof Error ? error.message : "Échec de l'analyse",
      details: null
    });
  } finally {
    setAnalysis(prev => ({ ...prev, loading: false }));
  }
};


  const handleClick = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    if (mode === 'encircle' && tool === 'draw') {
      pushToHistory();
      const newCircle = isOval
        ? { x: pointer.x, y: pointer.y, radiusX: 40, radiusY: 25, type: 'oval' }
        : { x: pointer.x, y: pointer.y, radius: 30, type: 'circle' };
      const updated = [...circles, newCircle];
      setCircles(updated);
      onSelectionChange?.(updated.map(c => ({ x: c.x, y: c.y, radius: c.radius || c.radiusX, type: c.type })));
    }

    if (mode === 'pattern') {
      pushToHistory();
      const shape = { x: pointer.x, y: pointer.y, type: shapeType, size: 25 };
      const updated = [...shapes, shape];
      setShapes(updated);
      onDrawingChange?.(updated);
    }
  };

  const handleMouseDown = (e: any) => {
    if (mode === 'matching') {
      const pos = e.target.getStage().getPointerPosition();
      if (pos) setDrawingLine([pos.x, pos.y]);
    }
  };

  const handleMouseUp = (e: any) => {
    if (mode === 'matching' && drawingLine) {
      const pos = e.target.getStage().getPointerPosition();
      if (pos) {
        pushToHistory();
        const newLine = {
          points: [...drawingLine, pos.x, pos.y],
          color: arrowColors[arrowColorIndex],
        };
        const updated = [...lines, newLine];
        setLines(updated);
        onDrawingChange?.(updated);
        setArrowColorIndex((arrowColorIndex + 1) % arrowColors.length);
        setDrawingLine(null);
      }
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIndex === null) return;
    pushToHistory();
    if (mode === 'encircle') {
      const updated = circles.filter((_, i) => i !== selectedIndex);
      setCircles(updated);
      console.log("🌀 Sending circles to parent:", updated);
      onSelectionChange?.(updated.map(c => ({ x: c.x, y: c.y, radius: c.radius || c.radiusX, type: c.type })));
    } else if (mode === 'matching') {
      const updated = lines.filter((_, i) => i !== selectedIndex);
      setLines(updated);
      onDrawingChange?.(updated);
    } else if (mode === 'pattern') {
      const updated = shapes.filter((_, i) => i !== selectedIndex);
      setShapes(updated);
      onDrawingChange?.(updated);
    }
    setSelectedIndex(null);
  };

  const handleClearAll = () => {
    pushToHistory();
    setCircles([]);
    setLines([]);
    setShapes([]);
    onSelectionChange?.([]);
    onDrawingChange?.([]);
    setSelectedIndex(null);
  };

  const undo = () => {
    const last = history.pop();
    if (!last) return;
    setFuture(prev => [...prev, { circles, lines, shapes }]);
    setCircles(last.circles);
    console.log("🌀 Sending circles to parent:", last.circles);
    setLines(last.lines);
    setShapes(last.shapes);
    onSelectionChange?.(last.circles);
    onDrawingChange?.(mode === 'matching' ? last.lines : last.shapes);
    setHistory([...history]);
  };

  const redo = () => {
    const next = future.pop();
    if (!next) return;
    setHistory(prev => [...prev, { circles, lines, shapes }]);
    setCircles(next.circles);
    setLines(next.lines);
    setShapes(next.shapes);
    onSelectionChange?.(next.circles);
    onDrawingChange?.(mode === 'matching' ? next.lines : next.shapes);
    setFuture([...future]);
  };

  return (
    <div className="w-full space-y-4" ref={containerRef}>
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap items-center px-2">
        {mode === 'encircle' && (
          <>
            <button onClick={() => setTool('draw')} title="Dessiner un cercle"
              className={cn('p-1 rounded hover:bg-gray-100', tool === 'draw' && 'bg-blue-200 text-blue-800')}>
              <CircleIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setTool('select')} title="Sélectionner"
              className={cn('p-1 rounded hover:bg-gray-100', tool === 'select' && 'bg-blue-200 text-blue-800')}>
              <Move className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOval(!isOval)} title="Ovale"
              className={cn('p-1 rounded hover:bg-gray-100', isOval && 'bg-blue-200 text-blue-800')}>
              <Ellipsis className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                captureCanvas();
              }} 
              title="Capturer l'image" 
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded ml-auto"
            >
              <Camera className="w-5 h-5" />
            </button>
          </>
        )}

        {mode === 'pattern' && (
          <>
            <button onClick={() => setShapeType('circle')} title="Cercle"
              className={cn('p-1 rounded hover:bg-gray-100', shapeType === 'circle' && 'bg-blue-200 text-blue-800')}>
              <CircleIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setShapeType('triangle')} title="Triangle"
              className={cn('p-1 rounded hover:bg-gray-100', shapeType === 'triangle' && 'bg-blue-200 text-blue-800')}>
              <Triangle className="w-5 h-5" />
            </button>
            <button onClick={() => setShapeType('square')} title="Carré"
              className={cn('p-1 rounded hover:bg-gray-100', shapeType === 'square' && 'bg-blue-200 text-blue-800')}>
              <Square className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Actions */}
        <button onClick={handleDeleteSelected} title="Supprimer" className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded">
          <Trash2 className="w-5 h-5" />
        </button>
        <button onClick={handleClearAll} title="Réinitialiser" className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded">
          <RotateCw className="w-5 h-5" />
        </button>
        <button onClick={undo} disabled={history.length === 0} title="Annuler"
          className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded disabled:opacity-50">
          <Undo2 className="w-5 h-5" />
        </button>
        <button onClick={redo} disabled={future.length === 0} title="Rétablir"
          className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded disabled:opacity-50">
          <Redo2 className="w-5 h-5" />
        </button>
          <button 
    onClick={handleAnalyze}
    disabled={analysis.loading}
    className={cn(
      "p-2 rounded ml-auto",
      analysis.loading ? "bg-gray-200" : "bg-purple-100 hover:bg-purple-200 text-purple-800"
    )}
    title="Analyser avec Google Vision"
  >
    {analysis.loading ? (
      <span className="flex items-center">
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="none" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
        </svg>
        Analyse...
      </span>
    ) : (
      <>
        <Brain className="inline mr-1 h-4 w-4" />
        Analyser
      </>
    )}
  </button>
      </div>

      {/* Canvas */}
      <div className="overflow-auto border rounded-md">
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          ref={stageRef}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{ background: '#f9fafb' }}
        >
          <Layer>
            {image && <KonvaImage image={image} width={canvasWidth} height={canvasHeight} />}
            
            {mode === 'encircle' &&
              circles.map((circle, index) => (
                <React.Fragment key={index}>
                  {circle.type === 'oval' ? (
                    <Ellipse
                      x={circle.x}
                      y={circle.y}
                      radiusX={circle.radiusX}
                      radiusY={circle.radiusY}
                      stroke="red"
                      strokeWidth={2}
                      draggable={tool === 'select'}
                      onClick={() => tool === 'select' && setSelectedIndex(index)}
                      onDragEnd={(e) => {
                        setCircles(prev => {
                          const updated = [...prev];
                          updated[index].x = e.target.x();
                          updated[index].y = e.target.y();
                          return updated;
                        });
                      }}
                    />
                  ) : (
                    <>
                      <Circle
                        x={circle.x}
                        y={circle.y}
                        radius={circle.radius}
                        stroke="red"
                        strokeWidth={2}
                        draggable={tool === 'select'}
                        onClick={() => tool === 'select' && setSelectedIndex(index)}
                        onDragEnd={(e) => {
                          setCircles(prev => {
                            const updated = [...prev];
                            updated[index].x = e.target.x();
                            updated[index].y = e.target.y();
                            return updated;
                          });
                        }}
                      />
                      {tool === 'select' && selectedIndex === index && (
                        <Circle
                          x={circle.x + circle.radius}
                          y={circle.y}
                          radius={5}
                          fill="red"
                          draggable
                          onDragMove={(e) => {
                            const dx = e.target.x() - circle.x;
                            setCircles(prev => {
                              const updated = [...prev];
                              updated[index].radius = Math.max(10, dx);
                              return updated;
                            });
                          }}
                        />
                      )}
                    </>

                  )}
                </React.Fragment>
              ))}

            {mode === 'matching' &&
              lines.map((line, index) => (
                <Arrow
                  key={index}
                  points={line.points}
                  stroke={line.color}
                  fill={line.color}
                  strokeWidth={3}
                  pointerLength={10}
                  pointerWidth={10}
                  tension={0.5}
                  draggable
                  onClick={() => setSelectedIndex(index)}
                  onDragEnd={(e) => {
                    const dx = e.target.x();
                    const dy = e.target.y();
                    setLines(prev => {
                      const updated = [...prev];
                        updated[index].points = updated[index].points.map((val: number, i: number) =>
                        i % 2 === 0 ? val + dx : val + dy
                        );
                      return updated;
                    });
                  }}
                />
              ))}
            {drawingLine && mode === 'matching' && (
              <Arrow
                points={drawingLine}
                stroke="gray"
                fill="gray"
                strokeWidth={2}
                pointerLength={10}
                pointerWidth={10}
                dash={[4, 4]}
              />
            )}

            {mode === 'pattern' &&
              shapes.map((shape, index) => {
                const commonProps = {
                  key: index,
                  x: shape.x,
                  y: shape.y,
                  stroke: 'black',
                  strokeWidth: 1,
                  draggable: true,
                  onClick: () => setSelectedIndex(index),
                  onDragEnd: (e: any) => {
                    setShapes(prev => {
                      const updated = [...prev];
                      updated[index].x = e.target.x();
                      updated[index].y = e.target.y();
                      return updated;
                    });
                  }
                };
                if (shape.type === 'triangle') {
                  return <RegularPolygon {...commonProps} sides={3} radius={shape.size} fill="orange" />;
                }
                if (shape.type === 'square') {
                  return <Rect {...commonProps} x={shape.x - shape.size} y={shape.y - shape.size} width={shape.size * 2} height={shape.size * 2} fill="skyblue" />;
                }
                return <RegularPolygon {...commonProps} sides={100} radius={shape.size} fill="lightgreen" />;
              })}
          </Layer>
        </Stage>
      </div>
      {/* Résultats d'analyse */}
{analysis.feedback && (
  <div className={`mt-4 p-3 rounded-lg border ${
    (analysis.score || 0) > 70 
      ? "bg-green-50 border-green-200" 
      : "bg-orange-50 border-orange-200"
  }`}>
    <div className="flex items-center gap-2">
      <span className="font-medium">Résultat :</span>
      <span>{analysis.score}/100</span>
    </div>
    <p className="mt-1 text-sm">{analysis.feedback}</p>
  </div>
)}
    </div>
  );
};
