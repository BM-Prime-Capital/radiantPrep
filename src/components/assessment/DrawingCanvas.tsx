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
  Plus,
  Minus,
  MousePointer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const arrowColors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#ec4899'];

type Mode = 'encircle' | 'matching' | 'pattern';

interface DrawingCanvasProps {
  imageUrl: string;
  questionId: string;
  questionText?: string;
  mode: Mode;
  onSelectionChange?: (data: any) => void;
  onDrawingChange?: (data: any) => void;
  onCaptureImage?: (dataUrl: string) => void;
  initialSelections?: any[];
  initialDrawing?: any[];
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
  initialDrawing = [],
  canvasSize,
}) => {
  const [image] = useImage(imageUrl);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const [isResizing, setIsResizing] = useState<'enlarge' | 'shrink' | false>(false);

  const handleResize = (direction: 'enlarge' | 'shrink') => {
    if (selectedIndex === null) return;
    
    pushToHistory();
    const updated = [...circles];
    const scaleBy = 1.1;

    if (updated[selectedIndex].type === 'oval') {
      if (direction === 'enlarge') {
        updated[selectedIndex].radiusX = Math.min(200, updated[selectedIndex].radiusX * scaleBy);
        updated[selectedIndex].radiusY = Math.min(200, updated[selectedIndex].radiusY * scaleBy);
      } else {
        updated[selectedIndex].radiusX = Math.max(5, updated[selectedIndex].radiusX / scaleBy);
        updated[selectedIndex].radiusY = Math.max(5, updated[selectedIndex].radiusY / scaleBy);
      }
    } else {
      updated[selectedIndex].radius = direction === 'enlarge'
        ? Math.min(200, updated[selectedIndex].radius * scaleBy)
        : Math.max(5, updated[selectedIndex].radius / scaleBy);
    }

    setCircles(updated);
    onSelectionChange?.(updated);
  };

  const [analysis, setAnalysis] = useState<{
    score?: number;
    feedback?: string;
    loading?: boolean;
    details?: any;
  }>({});

  const pushToHistory = () => {
    setHistory(prev => [...prev, { circles, lines, shapes }]);
    setFuture([]);
  };

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
        setCanvasWidth(Math.min(width, 800));
        setCanvasHeight(Math.min(width * ratio, 600));
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [image, canvasSize]);

  const handleAnalyze = async () => {
    if (!stageRef.current || !questionId || !questionText) {
      toast({
        title: "Erreur",
        description: "Impossible d'analyser sans question ou canvas",
        variant: "destructive"
      });
      return;
    }

    setAnalysis({ loading: true });
    
    try {
      const dataUrl = stageRef.current.toDataURL();
      
      // Préparer les données de dessin de l'utilisateur
      const userDrawing = mode === 'encircle' ? circles : 
                         mode === 'matching' ? lines : shapes;
      
      const response = await fetch('/api/analyze-drawing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: dataUrl,
          questionId,
          questionText,
          userDrawing,
          correctAnswer: null // Sera récupéré côté serveur si nécessaire
        })
      });

      if (!response.ok) {
        throw new Error('Erreur du serveur');
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalysis({
          feedback: result.feedback,
          score: result.score,
          details: result.details,
        });
        
        toast({
          title: "Analyse terminée !",
          description: `Score: ${result.score}/100`,
          variant: "default"
        });
      } else {
        throw new Error(result.error || 'Échec de l\'analyse');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Échec de l'analyse";
      setAnalysis({
        feedback: errorMessage,
        details: null
      });
      
      toast({
        title: "Erreur d'analyse",
        description: errorMessage,
        variant: "destructive"
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
      onSelectionChange?.(updated);
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
      onSelectionChange?.(updated);
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
      <div className="flex gap-2 flex-wrap items-center px-2 py-3 bg-gray-50 rounded-lg">
        {mode === 'encircle' && (
          <>
            <button onClick={() => setTool('draw')} title="Dessiner un cercle"
              className={cn('p-2 rounded hover:bg-gray-200 transition-colors', tool === 'draw' && 'bg-blue-200 text-blue-800')}>
              <CircleIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setTool('select')} title="Sélectionner"
              className={cn('p-2 rounded hover:bg-gray-200 transition-colors', tool === 'select' && 'bg-blue-200 text-blue-800')}>
              <Move className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOval(!isOval)} title="Ovale"
              className={cn('p-2 rounded hover:bg-gray-200 transition-colors', isOval && 'bg-blue-200 text-blue-800')}>
              <Ellipsis className="w-5 h-5" />
            </button>
          </>
        )}

        {mode === 'encircle' && tool === 'select' && selectedIndex !== null && (
          <div className="flex gap-2">
            <button 
              onClick={() => handleResize('enlarge')} 
              title="Agrandir"
              className="p-2 rounded hover:bg-gray-200 transition-colors bg-green-100 text-green-800">
              <Plus className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleResize('shrink')} 
              title="Réduire"
              className="p-2 rounded hover:bg-gray-200 transition-colors bg-red-100 text-red-800">
              <Minus className="w-5 h-5" />
            </button>
          </div>
        )}

        {mode === 'pattern' && (
          <>
            <button onClick={() => setShapeType('circle')} title="Cercle"
              className={cn('p-2 rounded hover:bg-gray-200 transition-colors', shapeType === 'circle' && 'bg-blue-200 text-blue-800')}>
              <CircleIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setShapeType('triangle')} title="Triangle"
              className={cn('p-2 rounded hover:bg-gray-200 transition-colors', shapeType === 'triangle' && 'bg-blue-200 text-blue-800')}>
              <Triangle className="w-5 h-5" />
            </button>
            <button onClick={() => setShapeType('square')} title="Carré"
              className={cn('p-2 rounded hover:bg-gray-200 transition-colors', shapeType === 'square' && 'bg-blue-200 text-blue-800')}>
              <Square className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2 ml-auto">
          <button onClick={handleDeleteSelected} title="Supprimer la sélection" 
            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded transition-colors"
            disabled={selectedIndex === null}>
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={handleClearAll} title="Tout effacer" 
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors">
            <RotateCw className="w-5 h-5" />
          </button>
          <button onClick={undo} disabled={history.length === 0} title="Annuler"
            className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded disabled:opacity-50 transition-colors">
            <Undo2 className="w-5 h-5" />
          </button>
          <button onClick={redo} disabled={future.length === 0} title="Rétablir"
            className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded disabled:opacity-50 transition-colors">
            <Redo2 className="w-5 h-5" />
          </button>
          <button onClick={captureCanvas} title="Capturer l'image" 
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={analysis.loading}
            className={cn(
              "p-2 rounded transition-colors",
              analysis.loading ? "bg-gray-200 cursor-not-allowed" : "bg-purple-100 hover:bg-purple-200 text-purple-800"
            )}
            title="Analyser avec l'IA"
          >
            {analysis.loading ? (
              <div className="w-5 h-5 animate-spin border-2 border-purple-600 border-t-transparent rounded-full" />
            ) : (
              <Brain className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="overflow-auto border-2 border-gray-200 rounded-lg bg-white">
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          ref={stageRef}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
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
                      stroke={selectedIndex === index ? "blue" : "red"}
                      strokeWidth={selectedIndex === index ? 3 : 2}
                      draggable={tool === 'select' && !isResizing}
                      onClick={() => tool === 'select' && setSelectedIndex(index)}
                      onDragEnd={(e) => {
                        const updated = [...circles];
                        updated[index].x = e.target.x();
                        updated[index].y = e.target.y();
                        setCircles(updated);
                        onSelectionChange?.(updated);
                      }}
                      onMouseEnter={() => {
                        if (isResizing && selectedIndex === index) {
                          stageRef.current.container().style.cursor = 'ns-resize';
                        }
                      }}
                      onMouseLeave={() => {
                        if (isResizing) {
                          stageRef.current.container().style.cursor = 'default';
                        }
                      }}
                      onWheel={(e) => {
                        if (isResizing && selectedIndex === index) {
                          e.evt.preventDefault();
                          const scaleBy = 1.1;
                          const updated = [...circles];
                          
                          if (isResizing === 'enlarge') {
                            updated[index].radiusX = Math.min(200, updated[index].radiusX * scaleBy);
                            updated[index].radiusY = Math.min(200, updated[index].radiusY * scaleBy);
                          } else {
                            updated[index].radiusX = Math.max(5, updated[index].radiusX / scaleBy);
                            updated[index].radiusY = Math.max(5, updated[index].radiusY / scaleBy);
                          }
                          
                          setCircles(updated);
                          onSelectionChange?.(updated);
                        }
                      }}
                    />
                  ) : (
                    <Circle
                      x={circle.x}
                      y={circle.y}
                      radius={circle.radius}
                      stroke={selectedIndex === index ? "blue" : "red"}
                      strokeWidth={selectedIndex === index ? 3 : 2}
                      draggable={tool === 'select' && !isResizing}
                      onClick={() => tool === 'select' && setSelectedIndex(index)}
                      onDragEnd={(e) => {
                        const updated = [...circles];
                        updated[index].x = e.target.x();
                        updated[index].y = e.target.y();
                        setCircles(updated);
                        onSelectionChange?.(updated);
                      }}
                      onMouseEnter={() => {
                        if (isResizing && selectedIndex === index) {
                          stageRef.current.container().style.cursor = 'ns-resize';
                        }
                      }}
                      onMouseLeave={() => {
                        if (isResizing) {
                          stageRef.current.container().style.cursor = 'default';
                        }
                      }}
                      onWheel={(e) => {
                        if (isResizing && selectedIndex === index) {
                          e.evt.preventDefault();
                          const scaleBy = 1.1;
                          const updated = [...circles];
                          const newRadius = isResizing === 'enlarge' 
                            ? updated[index].radius * scaleBy
                            : updated[index].radius / scaleBy;
                          
                          // Limiter la taille min/max
                          updated[index].radius = Math.max(5, Math.min(200, newRadius));
                          setCircles(updated);
                          onSelectionChange?.(updated);
                        }
                      }}
                    />
                  )}
                </React.Fragment>
              ))}

            {mode === 'matching' &&
              lines.map((line, index) => (
                <Arrow
                  key={index}
                  points={line.points}
                  stroke={selectedIndex === index ? "blue" : line.color}
                  fill={selectedIndex === index ? "blue" : line.color}
                  strokeWidth={selectedIndex === index ? 4 : 3}
                  pointerLength={10}
                  pointerWidth={10}
                  tension={0.5}
                  draggable
                  onClick={() => setSelectedIndex(index)}
                  onDragEnd={(e) => {
                    const dx = e.target.x();
                    const dy = e.target.y();
                    const updated = [...lines];
                    updated[index].points = updated[index].points.map((val: number, i: number) =>
                      i % 2 === 0 ? val + dx : val + dy
                    );
                    setLines(updated);
                    onDrawingChange?.(updated);
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
                  stroke: selectedIndex === index ? 'blue' : 'black',
                  strokeWidth: selectedIndex === index ? 3 : 1,
                  draggable: true,
                  onClick: () => setSelectedIndex(index),
                  onDragEnd: (e: any) => {
                    const updated = [...shapes];
                    updated[index].x = e.target.x();
                    updated[index].y = e.target.y();
                    setShapes(updated);
                    onDrawingChange?.(updated);
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
        <div className={cn(
          "mt-4 p-4 rounded-lg border transition-all",
          (analysis.score || 0) > 70 
            ? "bg-green-50 border-green-200" 
            : "bg-orange-50 border-orange-200"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Analyse IA :</span>
            {analysis.score && <span className="px-2 py-1 bg-white rounded text-sm font-bold">{analysis.score}/100</span>}
          </div>
          <p className="text-sm">{analysis.feedback}</p>
          {analysis.details?.visionAnalysis && (
            <div className="mt-2 text-xs text-gray-600">
              Objets détectés: {analysis.details.visionAnalysis.objectsDetected} | 
              Texte détecté: {analysis.details.visionAnalysis.textDetected}
            </div>
          )}
        </div>
      )}

      {/* État actuel */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        Mode: {mode} | Éléments: {mode === 'encircle' ? circles.length : mode === 'matching' ? lines.length : shapes.length}
        {selectedIndex !== null && ` | Sélectionné: ${selectedIndex + 1}`}
      </div>
    </div>
  );
};