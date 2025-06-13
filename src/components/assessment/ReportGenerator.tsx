'use client';

import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2 } from 'lucide-react';
import type { AssessmentResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ReportGeneratorProps {
  assessmentResult: AssessmentResult;
  studentName: string;
}

export function ReportGenerator({ assessmentResult, studentName }: ReportGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const correctAnswers = assessmentResult.answers.filter(answer => answer.isCorrect);
  const incorrectAnswers = assessmentResult.answers.filter(answer => !answer.isCorrect);

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        logging: false,
        useCORS: true,
        width: reportRef.current.scrollWidth * 2,
        height: reportRef.current.scrollHeight * 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`COMPLEMETRICS_Report_${studentName}_${assessmentResult.subject}_Grade${assessmentResult.grade}.pdf`);
      
      toast({
        title: "Report Downloaded",
        description: "The report has been successfully downloaded as PDF.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <Button onClick={downloadPDF} className="gap-2" disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Download className="h-5 w-5" />
          )}
          Download Report as PDF
        </Button>
      </div>

      <div ref={reportRef} className="bg-white p-8 text-black max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">COMPLEMETRICS®</h1>
        <p className="text-center mb-8">Complete Academic Metrics, Accurate, Insightful, Proof in Data.</p>

        <h2 className="text-2xl font-bold text-center mb-8">K-12 SCORE REPORT</h2>
        <hr className="border-t-2 border-black mb-8" />

        <h3 className="text-xl font-bold mb-4">SCHOLAR: {studentName.toUpperCase()}</h3>
        
        <div className="mb-6">
          <p><strong>Assessment:</strong> Radiant PACED™ Assessments- Grade {assessmentResult.grade} {assessmentResult.subject}</p>
          <p><strong>Date Administered:</strong> {new Date(assessmentResult.takenAt || Date.now()).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold mb-2">Time Distribution</h4>
          <ul className="list-disc pl-5 mb-4">
            <li>Student's Score</li>
            <li>Average Score</li>
          </ul>

          <div className="flex gap-8 mb-4">
            <div>
              <h4 className="font-bold">S C O R E:</h4>
              <p>{assessmentResult.score}/{assessmentResult.totalQuestions}</p>
            </div>
            <div>
              <h4 className="font-bold">TIME UTILIZED:</h4>
              <p>55</p>
            </div>
            <div>
              <h4 className="font-bold">UNUTILIZED TIME:</h4>
              <p>5</p>
            </div>
          </div>

          <div className="flex gap-8">
            <div>
              <h4 className="font-bold">Custom Scale:</h4>
              <p>0.4</p>
            </div>
            <div>
              <h4 className="font-bold">Set Scale:</h4>
              <p>3.4</p>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-black mb-8" />

        <div className="mb-8">
          <h4 className="font-bold text-green-600 mb-2">Correct</h4>
          <p>{correctAnswers.length} Vocabulary; homonyms</p>
        </div>

        <div className="mb-8">
          <h4 className="font-bold text-red-600 mb-2">Incorrect</h4>
          {incorrectAnswers.map((answer, index) => (
            <p key={index}>{index + 1} Reading comprehension; detail</p>
          ))}
        </div>

        <div className="mb-8">
          <h4 className="font-bold">PROJECTED PREP LENGTH:</h4>
          <p>Varies based on service options</p>
        </div>

        <hr className="border-t-2 border-black mb-8" />

        <div>
          <h4 className="font-bold mb-2">GENERAL ANALYSIS / FOCUS AREAS:</h4>
          <p className="mb-4">
            Our data indicates {studentName} requires critical intervention in {assessmentResult.subject}. 
            {assessmentResult.score / assessmentResult.totalQuestions < 0.5 ? 
              " His results are dramatically behind typical peer metrics. " + 
              studentName + " does not yet have a foundation in literacy. An intensive and foundational approach is an appropriate start for helping " + 
              studentName + "." : 
              " While showing some understanding, there are significant areas needing improvement. " + 
              "Targeted practice in specific skill areas would be beneficial."}
          </p>
          <p className="text-sm text-gray-500">
            Copyright © by Radiant Prep, LLC. All Rights Reserved. CONFIDENTIAL - May NOT be reproduced in any form.
          </p>
        </div>
      </div>
    </div>
  );
}