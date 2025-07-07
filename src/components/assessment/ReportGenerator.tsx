import { Download, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ReportTemplate } from './ReportTemplate';
import { useRef, useState } from 'react';
import { AssessmentResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportGeneratorProps {
  assessmentResult: AssessmentResult;
  studentName: string;
  questions?: any[];
}

export function ReportGenerator({ assessmentResult, studentName, questions }: ReportGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [200, 260] // Custom format: width, height in mm
      });

      // Temporarily make the report visible for rendering
      const originalStyle = reportRef.current.style.cssText;
      reportRef.current.style.cssText = 'position: absolute; left: 0; top: 0; width: 794px;';

      const canvas = await html2canvas(reportRef.current, {
        logging: true,
        useCORS: true,
        background: '#FFFFFF',
      });

      // Restore original style
      reportRef.current.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 200; // Width in mm
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
    <>
      <div style={{ position: 'fixed', left: '-9999px', top: 0, width: '794px' }}>
        <ReportTemplate ref={reportRef} assessmentResult={assessmentResult} studentName={studentName} />
      </div>

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
    </>
  );
}
