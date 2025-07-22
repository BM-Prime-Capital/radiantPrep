'use client';

import type { Question } from '@/lib/types';
import { QuestionType } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion } from "framer-motion";
import { Check, ChevronRight, ImageIcon, Pencil, Type } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerChange: (answer: string | string[]) => void;
  currentAnswer: string | string[] | undefined;
}

export function QuestionDisplay({ question, questionNumber, totalQuestions, onAnswerChange, currentAnswer }: QuestionDisplayProps) {
  const { toast } = useToast();

  const getQuestionTypeIcon = () => {
    switch(question.type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.IMAGE_CHOICE:
        return <Check className="h-5 w-5" />;
      case QuestionType.TEXT:
      case QuestionType.GRAMMAR:
        return <Type className="h-5 w-5" />;
      case QuestionType.WRITING:
        return <Pencil className="h-5 w-5" />;
      case QuestionType.DRAWING:
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <ChevronRight className="h-5 w-5" />;
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
case QuestionType.MULTIPLE_CHOICE:
  return (
    <RadioGroup
      value={currentAnswer as string || undefined}
      onValueChange={(value) => onAnswerChange(value)}
      className="space-y-3"
    >
      {question.options?.map((option, index) => {
        const optionText = typeof option === 'string' ? option : option.text;
        const optionValue = typeof option === 'string' ? option : index.toString();

        return (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RadioGroupItem 
              value={optionValue} 
              id={`${question.id}-option-${index}`}
              className="h-5 w-5 border-2 text-primary"
            />
            <Label 
              htmlFor={`${question.id}-option-${index}`} 
              className="text-base cursor-pointer flex-grow"
            >
              {optionText}
            </Label>
          </motion.div>
        );
      })}
    </RadioGroup>
  );

case QuestionType.COMPARISON:
  return (
    <div className="space-y-4">
      {question.blanks?.map((blank, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-lg font-medium">{blank}</span>
          <RadioGroup 
            value={Array.isArray(currentAnswer) ? currentAnswer[index] : ''}
            onValueChange={(value) => {
              const newAnswers = Array.isArray(currentAnswer) 
                ? [...currentAnswer] 
                : Array(question.blanks?.length || 0).fill('');
              newAnswers[index] = value;
              onAnswerChange(newAnswers);
            }}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value=">" id={`${question.id}-gt-${index}`} />
              <Label htmlFor={`${question.id}-gt-${index}`}>{'>'}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="<" id={`${question.id}-lt-${index}`} />
              <Label htmlFor={`${question.id}-lt-${index}`}>{'<'}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="=" id={`${question.id}-eq-${index}`} />
              <Label htmlFor={`${question.id}-eq-${index}`}>=</Label>
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
    case QuestionType.IMAGE_CHOICE:
      return (
        <RadioGroup
          value={currentAnswer as string || undefined}
          onValueChange={(value) => onAnswerChange(value)}
          className="space-y-3"
        >
          {question.options?.map((option, index) => {
            // Gestion des deux formats d'options
            const optionText = typeof option === 'string' ? option : option.text;
            const optionValue = typeof option === 'string' ? option : index.toString();
            const optionImage = typeof option === 'object' ? option.image : undefined;

            return (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RadioGroupItem 
                  value={optionValue} 
                  id={`${question.id}-option-${index}`}
                  className="h-5 w-5 border-2 text-primary"
                />
                <Label 
                  htmlFor={`${question.id}-option-${index}`} 
                  className="text-base cursor-pointer flex-grow"
                >
                  {optionImage && (
                    <img 
                      src={`/images/${optionImage}`} 
                      alt={optionText}
                      className="w-12 h-12 object-contain mr-3"
                    />
                  )}
                  {optionText}
                </Label>
              </motion.div>
            );
          })}
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
            className="text-base h-12 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        );

      case QuestionType.WRITING:
        return (
          <div className="space-y-2">
            <Textarea
              value={currentAnswer as string || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Write your response here..."
              rows={6}
              className="text-base border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-sm text-gray-500">
              Minimum 50 characters. Be as detailed as possible.
            </p>
          </div>
        );

  case QuestionType.FILL_IN_THE_BLANK:
    // Compter le nombre total de trous (___) dans toutes les lignes
    const totalBlanks = question.blanks?.reduce((count, blank) => 
      count + (typeof blank === 'string' ? blank.split('___').length - 1 : 0), 0) || 0;

    // Créer un tableau d'index de réponses par ligne
    const blankIndexes: number[][] = [];
    let currentIndex = 0;
    
    question.blanks?.forEach(blank => {
      if (typeof blank !== 'string') return;
      const blanksInLine = blank.split('___').length - 1;
      blankIndexes.push(Array.from({length: blanksInLine}, (_, i) => currentIndex + i));
      currentIndex += blanksInLine;
    });

    return (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        {question.blanks?.map((blankLine, lineIndex) => {
          if (typeof blankLine !== 'string') return null;
          
          const lineAnswerIndexes = blankIndexes[lineIndex] || [];
          const segments = blankLine.split('___');
          const inputs = [];

          for (let i = 0; i < segments.length; i++) {
            inputs.push(
              <span key={`text-${lineIndex}-${i}`} className="whitespace-pre text-gray-700">
                {segments[i]}
              </span>
            );

            if (i < segments.length - 1) {
              const answerIndex = lineAnswerIndexes[i];
              inputs.push(
                <Input
                  key={`input-${lineIndex}-${i}`}
                  type="number"
                  value={
                    Array.isArray(currentAnswer) && currentAnswer[answerIndex] !== undefined
                      ? currentAnswer[answerIndex]
                      : ''
                  }
                  onChange={(e) => {
                    const newAnswers = Array.isArray(currentAnswer)
                      ? [...currentAnswer]
                      : Array(totalBlanks).fill('');
                    
                    newAnswers[answerIndex] = e.target.value;
                    onAnswerChange(newAnswers);
                  }}
                  className="w-16 h-8 text-center border-b-2 border-primary mx-1"
                  placeholder="?"
                  min="0"
                  max="100"
                />
              );
            }
          }

          return (
            <div key={lineIndex} className="flex flex-wrap items-baseline gap-1">
              {inputs}
            </div>
          );
        })}
      </div>
    );
        default:
          return (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <p className="text-center text-gray-500">
                Interactive question type ({question.type.replace("_", " ").toLowerCase()}) coming soon.
                <br />
                Please use text input for your answer if applicable.
              </p>
              <Input
                type="text"
                value={currentAnswer as string || ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type your answer here"
                className="mt-3 text-base h-12 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          );
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Question Card avec bordure plus visible */}
      <Card className="w-full shadow-sm border border-gray-300 bg-white rounded-lg">
        <CardHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getQuestionTypeIcon()}
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                {question.category || 'General Question'}
              </CardTitle>
              {question.passage && (
                <CardDescription className="text-gray-500">
                  Read the passage carefully
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {question.passage && (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-700">Reading Passage:</h4>
              <p className="text-gray-600 whitespace-pre-line">{question.passage}</p>
            </div>
          )}

          {/* Question Image */}
          {question.image && (
            <div className="flex justify-center my-4">
              <img 
                src={question.image.startsWith('/') ? question.image : `/images/${question.image}`}
                alt={`Question ${question.id} visual`}
                className="rounded-lg border border-gray-200 max-h-64 object-contain shadow-sm"
              />
            </div>
          )}

          {/* Question Text */}
          <motion.p 
            className="text-xl font-medium text-gray-800 whitespace-pre-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {question.question}
          </motion.p>

          {/* Answer Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {renderQuestionContent()}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}