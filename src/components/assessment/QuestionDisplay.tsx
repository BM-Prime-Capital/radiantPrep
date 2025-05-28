'use client';

import type { Question } from '@/lib/types';
import { QuestionType } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerChange: (answer: string | string[]) => void;
  currentAnswer: string | string[] | undefined;
}

export function QuestionDisplay({ question, questionNumber, totalQuestions, onAnswerChange, currentAnswer }: QuestionDisplayProps) {
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
      case QuestionType.GRAMMAR: // Treat grammar as text input for correction
        return (
          <Input
            type="text"
            value={currentAnswer as string || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
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
                    newAnswers[index] = e.target.value;
                    onAnswerChange(newAnswers);
                  }}
                  className="text-base"
                />
              </div>
            ))}
          </div>
        );
      // Placeholder for complex types
      case QuestionType.DRAWING:
      case QuestionType.PATTERN:
      case QuestionType.MATCHING:
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
        {question.image && (
          <div className="my-4 flex justify-center">
            <Image 
              src={question.image} 
              alt={`Question ${question.id} image`} 
              width={question.type === QuestionType.IMAGE_CHOICE || question.image.includes("clock") || question.image.includes("cube") || question.image.includes("circle") ? 250 : 400} 
              height={question.type === QuestionType.IMAGE_CHOICE || question.image.includes("clock") || question.image.includes("cube") || question.image.includes("circle") ? 250 : 300}
              className="rounded-md object-contain border"
              data-ai-hint={question.dataAihint as string || ""}
            />
          </div>
        )}
        <p className="text-xl font-medium text-foreground/90 whitespace-pre-wrap">{question.question}</p>
        <div>{renderQuestionContent()}</div>
      </CardContent>
    </Card>
  );
}
