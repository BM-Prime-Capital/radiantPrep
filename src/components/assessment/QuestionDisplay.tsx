'use client';

import type { Question } from '@/lib/types';
import { QuestionType } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Pencil, MousePointer, Info, Target, Shuffle, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { DrawingCanvas } from './DrawingCanvas';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerChange: (answer: string | string[]) => void;
  currentAnswer: string | string[] | undefined;
}

export function QuestionDisplay({ question, questionNumber, totalQuestions, onAnswerChange, currentAnswer }: QuestionDisplayProps) {
  //  const handleImageCapture = (dataUrl: string) => {
  //   const audio = new Audio('/sounds/capture.wav'); // place capture.mp3 dans public/sounds/
  //     audio.play();
  //     console.log("🖼️ Image capturée :", dataUrl);
  //   };

  const handleImageCapture = async (dataUrl: string) => {
    const audio = new Audio('/sounds/capture.wav');
    audio.play();

    try {
      const response = await fetch('/api/save-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageData: dataUrl, 
          questionId: question.id 
        }),
      });

      const result = await response.json();
      console.log('Image sauvegardée :', result.path);
      // Maintenant vous pouvez envoyer `result.path` à votre IA
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.IMAGE_CHOICE:
        return (
          <RadioGroup
            value={currentAnswer as string || undefined}
            onValueChange={(value) => onAnswerChange(value)}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted transition-colors">
                <RadioGroupItem value={option} id={`${question.id}-option-${index}`} />
                <Label htmlFor={`${question.id}-option-${index}`} className="text-base cursor-pointer flex-grow">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case QuestionType.TEXT:
      case QuestionType.GRAMMAR: 
        return (
          <Input
            type="text"
            value={currentAnswer as string || ''}
            onChange={(e) => onAnswerChange(e.target.value.toLowerCase())}
            placeholder="Type your answer here"
            className="text-base"
          />
        );
      case QuestionType.WRITING:
        return (
          <Textarea
            value={currentAnswer as string || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Write your response here..."
            rows={6}
            className="text-base"
          />
        );
      case QuestionType.FILL_IN_THE_BLANK:
        return (
          <div className="space-y-4">
            {question.blanks?.map((blankText, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Label htmlFor={`${question.id}-blank-${index}`} className="text-base sm:min-w-[200px] whitespace-pre-wrap">
                  {blankText.replace(/_+/, ' ______ ')} 
                </Label>
                <Input
                  id={`${question.id}-blank-${index}`}
                  type="text"
                  value={Array.isArray(currentAnswer) ? currentAnswer[index] || '' : ''}
                  onChange={(e) => {
                    const newAnswers = Array.isArray(currentAnswer) ? [...currentAnswer] : new Array(question.blanks?.length || 0).fill('');
                    newAnswers[index] = e.target.value.toLowerCase();
                    onAnswerChange(newAnswers);
                  }}
                  className="text-base"
                />
              </div>
            ))}
          </div>
        );
      case QuestionType.DRAWING:
      case QuestionType.MATCHING:
      case QuestionType.PATTERN:
        const drawingMode =
          question.type === QuestionType.DRAWING ? "encircle" :
          question.type === QuestionType.MATCHING ? "matching" :
          question.type === QuestionType.PATTERN ? "pattern" :
          "encircle";

        const instructionColors = {
          encircle: {
            bg: "from-blue-50 to-indigo-50",
            border: "border-blue-200",
            icon: <Palette className="h-6 w-6 text-blue-600" />,
            label: "Interactive Drawing Tools"
          },
          matching: {
            bg: "from-purple-50 to-pink-50",
            border: "border-purple-200",
            icon: <Shuffle className="h-6 w-6 text-purple-600" />,
            label: "Interactive Matching Tools"
          },
          pattern: {
            bg: "from-green-50 to-emerald-50",
            border: "border-green-200",
            icon: <Target className="h-6 w-6 text-green-600" />,
            label: "Interactive Pattern Recognition"
          }
        };


        const colors = instructionColors[drawingMode];

        console.log("📝 Question text to analyze:", question.question);

        return (
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-r ${colors.bg} ${colors.border} rounded-lg p-6`}
            >
              <div className="flex items-start gap-4">
                <div className={`${colors.border} p-2 rounded-lg`}>{colors.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    {/* <Palette className="h-4 w-4" /> */}
                    {colors.label}
                  </h4>
                  <div className="text-sm text-foreground/80 space-y-1 ml-2">
                    {drawingMode === "encircle" && (
                      <>
                        <p>• Click to add a circle or an oval on the image</p>
                        <p>• Use the arrow tool to move or resize shapes</p>
                        <p>• Use the top icons to select, delete, undo or redo</p>
                      </>
                    )}
                    {drawingMode === "matching" && (
                      <>
                        <p>• Click and drag to draw an arrow between two points</p>
                        <p>• Use different colors to connect related elements</p>
                        <p>• Use the top icons to remove, undo or redo connections</p>
                      </>
                    )}
                    {drawingMode === "pattern" && (
                      <>
                        <p>• Click to place a shape (circle, triangle, or square)</p>
                        <p>• Use the top icons to change the shape type</p>
                        <p>• Drag to reposition, or use tools to delete or undo</p>
                      </>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>

            {question.image ? (
              <DrawingCanvas
                imageUrl={question.image.startsWith('/') ? question.image : `/images/${question.image}`}
                questionId={String(question.id)}
                questionText={question.question} 
                mode={drawingMode}
                canvasSize={{ width: 800, height: 400 }}
                onSelectionChange={(selections) => {
                  if (drawingMode === 'encircle') onAnswerChange(selections);
                }}
                onDrawingChange={(drawingData) => {
                  if (drawingMode !== 'encircle') onAnswerChange(drawingData);
                }}
                onCaptureImage={handleImageCapture}
                initialSelections={Array.isArray(currentAnswer) ? currentAnswer : []}
                initialDrawing={typeof currentAnswer === 'string' ? currentAnswer : ''}
              />
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Info className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Aucune image disponible pour cette question.</p>
              </div>
            )}

            <div className={`rounded-lg p-4 ${colors.border} bg-opacity-20`}>
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-full ${colors.border}`}>
                  {colors.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Mode actif : {drawingMode}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentAnswer 
                      ? 'Vos annotations sont sauvegardées.' 
                      : 'Utilisez les outils ci-dessus pour interagir avec l’image.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case QuestionType.CLOCK:
      case QuestionType.COMPARISON:
      case QuestionType.WORD_SORT:
      case QuestionType.FRACTION:
        return (
          <div className="p-4 border border-dashed rounded-md bg-muted">
            <p className="text-muted-foreground text-center">
              Interactive question type ({question.type.replace("_", " ").toLowerCase()}) placeholder.
              <br />
              Please use text input for your answer if applicable.
            </p>
            <Input
              type="text"
              value={currentAnswer as string || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Type your answer for this question"
              className="text-base mt-2"
            />
          </div>
        );
      default:
        return <p>Unsupported question type.</p>;
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">Question {questionNumber} of {totalQuestions}</CardTitle>
        {question.category && <CardDescription className="text-accent">{question.category}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {question.passage && (
          <div className="p-4 bg-muted rounded-md border max-h-60 overflow-y-auto">
            <h4 className="font-semibold mb-2 text-lg">Passage:</h4>
            <p className="text-foreground/90 whitespace-pre-line text-sm">{question.passage}</p>
          </div>
        )}
        
        {/* Only show image for non-interactive question types */}
        {question.image && 
         question.type !== QuestionType.DRAWING && 
         question.type !== QuestionType.MATCHING && 
         question.type !== QuestionType.PATTERN && (
          <div className="my-4 flex justify-center">
            <img 
              src={question.image.startsWith('/') ? question.image : `/images/${question.image}`}
              alt={`Question ${question.id} image`} 
              width={question.type === QuestionType.IMAGE_CHOICE || question.image.includes("clock") || question.image.includes("cube") || question.image.includes("circle") ? 250 : 400} 
              height={question.type === QuestionType.IMAGE_CHOICE || question.image.includes("clock") || question.image.includes("cube") || question.image.includes("circle") ? 250 : 300}
              className="rounded-md object-contain border"
            />
          </div>
        )}
        
        <p className="text-xl font-medium text-foreground/90 whitespace-pre-wrap">{question.question}</p>
        <div>{renderQuestionContent()}</div>
      </CardContent>
    </Card>
  );
}