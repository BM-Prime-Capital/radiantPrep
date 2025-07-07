'use client';

import React, { useState } from 'react';
import { DrawingCanvas } from '../assessment/DrawingCanvas';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface AdminDrawingAnswerEditorProps {
  questionId: string;
  imageUrl: string;
  mode: 'encircle' | 'matching' | 'pattern';
}

export const AdminDrawingAnswerEditor: React.FC<AdminDrawingAnswerEditorProps> = ({
  questionId,
  imageUrl,
  mode
}) => {
  const [answerData, setAnswerData] = useState<{
    circles?: any;
    drawings?: any;
    baseWidth?: number;
    baseHeight?: number;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!answerData || (!answerData.circles && !answerData.drawings)) {
      toast.warning('Please provide a drawing before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await axios.post(`/api/questions/${questionId}/save-answer`, {
        answerValue: answerData,
      });
      toast.success('✅ Correct answer saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to save the answer. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-xl font-semibold text-center">Define the correct interactive answer</h2>

      <DrawingCanvas
        imageUrl={imageUrl}
        questionId={questionId}
        mode={mode}
        canvasSize={{ width: 800, height: 400 }}
        onSelectionChange={(
          data: any,
          canvasSize?: { width: number; height: number }
        ) => {
          const size = canvasSize ?? { width: 800, height: 400 };
          if (mode === 'encircle') {
            setAnswerData({
              circles: data,
              baseWidth: size.width,
              baseHeight: size.height,
            });
          }
        }}
        onDrawingChange={(
          data: any,
          canvasSize?: { width: number; height: number }
        ) => {
          const size = canvasSize ?? { width: 800, height: 400 };
          if (mode !== 'encircle') {
            setAnswerData({
              drawings: data,
              baseWidth: size.width,
              baseHeight: size.height,
            });
          }
        }}
        initialSelections={[]}
        initialDrawing={''}
      />

      <div className="flex justify-center">
        <Button disabled={isSaving} onClick={handleSave} className="min-w-[180px]">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Correct Answer'}
        </Button>
      </div>
    </div>
  );
};
