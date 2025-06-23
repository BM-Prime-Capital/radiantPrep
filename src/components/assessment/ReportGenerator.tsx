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
}

export function ReportGenerator({ assessmentResult, studentName }: ReportGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGenerating(true);
    
    try {
      // Créer un élément clone pour la capture
      const clone = reportRef.current.cloneNode(true) as HTMLElement;
      clone.style.visibility = 'visible';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      // Attendre que les éléments soient rendus
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clone, {
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (element) => {
          // Ignorer les éléments inutiles
          return false;
        }
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // Largeur A4 en mm
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
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
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