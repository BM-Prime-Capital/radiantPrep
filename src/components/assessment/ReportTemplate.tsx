'use client';

import React, { useEffect, useState } from 'react';
import type { AssessmentResult } from '@/lib/types';
import { skillCategorizer } from '@/lib/skillCategorizer';

interface ReportTemplateProps {
  assessmentResult: AssessmentResult;
  studentName: string;
  questions?: any[]; // Optional questions array for skill categorization
}

export const ReportTemplate = React.forwardRef<HTMLDivElement, ReportTemplateProps>(
    ({ assessmentResult, studentName, questions = [] }, ref) => {
    const [skillCategories, setSkillCategories] = useState<{
      correct: string[];
      incorrect: string[];
    }>({ correct: [], incorrect: [] });
    
    const [isAnalyzing, setIsAnalyzing] = useState(true);

    useEffect(() => {
      if (!assessmentResult || !assessmentResult.answers) return;
      const analyzeSkills = async () => {
        if (questions.length === 0) {
          // Fallback: use predefined skills based on performance
          const correctCount = assessmentResult.answers.filter(ans => ans.isCorrect).length;
          const incorrectCount = assessmentResult.totalQuestions - correctCount;
          
          const fallbackSkills = {
            ELA: [
              "Reading comprehension; detail",
              "Short open response; comprehension",
              "Short open response; detail recall",
              "Reading comprehension; main idea",
              "Vocabulary; descriptions",
              "Short open response; author's purpose",
              "Short open response; inferences",
              "Vocabulary; antonyms",
              "Vocabulary; synonyms (MC)",
              "Sentence correction; vocabulary & tense",
              "Vocabulary; word association",
              "Word type recognition",
              "Vocabulary; singular/plural",
              "Vocabulary; prefix & suffix"
            ],
            Math: [
              "Word problem; multiplication",
              "Word problem; fractional division",
              "Word problem; determining area",
              "Greatest Common Factor",
              "Algebraic translation; verbal to abstract",
              "Probability",
              "Equations; one-step",
              "Unit conversion; customary capacity",
              "Word problem; division",
              "Word Problem; Calculating Average",
              "Word problem; real-world context",
              "Word problem; multiply mixed numbers",
              "Angle classifications",
              "Prime factorization",
              "Mixed number operations",
              "Computation; decimal multiplication",
              "Calculating percentage",
              "Evaluating expressions",
              "Proportional Reasoning",
              "Fractional division"
            ]
          };
          
          const subjectSkills = fallbackSkills[assessmentResult.subject] || [];
          setSkillCategories({
            correct: subjectSkills.slice(0, correctCount),
            incorrect: subjectSkills.slice(correctCount, correctCount + incorrectCount)
          });
          setIsAnalyzing(false);
          return;
        }

        try {
          const result = await skillCategorizer.categorizeAssessmentAnswers(
            assessmentResult.answers,
            questions,
            assessmentResult.subject
          );
          setSkillCategories(result);
        } catch (error) {
          console.error('Error analyzing skills:', error);
          // Use fallback on error
          const correctCount = assessmentResult.answers.filter(ans => ans.isCorrect).length;
          setSkillCategories({
            correct: [`${assessmentResult.subject} Skills (${correctCount} correct)`],
            incorrect: [`${assessmentResult.subject} Skills (${assessmentResult.totalQuestions - correctCount} incorrect)`]
          });
        } finally {
          setIsAnalyzing(false);
        }
      };

      analyzeSkills();
    }, [assessmentResult]);
 
    const percentage = Math.round((assessmentResult.score / assessmentResult.totalQuestions) * 100);
    const takenDate = new Date(assessmentResult.takenAt ?? '');

    // Données pour les graphiques
    const timeData = {
      utilized: 55,
      unutilized: 5
    };

    const scoreData = {
      student: 2.5,
      average: 4
    };

    // 3D Bar Chart pour Score Comparison

    const ScoreComparisonBarChart = () => (
      <div className="relative w-full h-48">
        <svg width="300" height="200" viewBox="0 0 300 200" className="overflow-visible">
          {/* Axes */}
          <line x1="50" y1="30" x2="50" y2="160" stroke="black" strokeWidth="2" />
          <line x1="50" y1="160" x2="250" y2="160" stroke="black" strokeWidth="2" />

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4, 5].map((val, i) => (
            <g key={i}>
              <line x1="45" y1={160 - val * 25} x2="50" y2={160 - val * 25} stroke="black" strokeWidth="1" />
              <text x="40" y={164 - val * 25} textAnchor="end" fontFamily="Arial" fontSize="12" fill="black">
                {val}
              </text>
            </g>
          ))}

          {/* Student's bar (teal/cyan) */}
          <g>
            {/* Front face */}
            <rect x="90" y={160 - scoreData.student * 25} width="40" height={scoreData.student * 25} 
                  fill="#20B2AA" stroke="black" strokeWidth="1" />
            {/* Right face (darker) */}
            <polygon points={`130,${160 - scoreData.student * 25} 145,${145 - scoreData.student * 25} 145,160 130,160`} 
                     fill="#1A9B9A" stroke="black" strokeWidth="1" />
            {/* Top face (lighter) */}
            <polygon points={`90,${160 - scoreData.student * 25} 105,${145 - scoreData.student * 25} 145,${145 - scoreData.student * 25} 130,${160 - scoreData.student * 25}`} 
                     fill="#2DC5C5" stroke="black" strokeWidth="1" />
          </g>

          {/* Average bar (red) */}
          <g>
            {/* Front face */}
            <rect x="170" y={160 - scoreData.average * 25} width="40" height={scoreData.average * 25} 
                  fill="#DC143C" stroke="black" strokeWidth="1" />
            {/* Right face (darker) */}
            <polygon points={`210,${160 - scoreData.average * 25} 225,${145 - scoreData.average * 25} 225,160 210,160`} 
                     fill="#B71C1C" stroke="black" strokeWidth="1" />
            {/* Top face (lighter) */}
            <polygon points={`170,${160 - scoreData.average * 25} 185,${145 - scoreData.average * 25} 225,${145 - scoreData.average * 25} 210,${160 - scoreData.average * 25}`} 
                     fill="#FF4444" stroke="black" strokeWidth="1" />
          </g>

          {/* X-axis label */}
          <text x="150" y="180" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="black">MATH</text>

          {/* Legend */}
          <rect x="70" y="185" width="15" height="10" fill="#20B2AA" />
          <text x="90" y="194" fontFamily="Arial" fontSize="11" fill="black">Student's Score</text>
          <rect x="180" y="185" width="15" height="10" fill="#DC143C" />
          <text x="200" y="194" fontFamily="Arial" fontSize="11" fill="black">Average Score</text>

          {/* Y-axis title */}
          <text x="25" y="100" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="black" 
                transform="rotate(-90, 25, 100)" textAnchor="middle">Score</text>
        </svg>
      </div>
    );



    // Pie Chart pour Time Distribution
    const TimeDistributionPieChart = () => {
      const radius = 50;
      const center = { x: 50, y: 70 };
      const total = timeData.utilized + timeData.unutilized;
      const utilizedAngle = (timeData.utilized / total) * 360;

      return (
        <div className="w-full h-48">
          <svg width="160" height="190" viewBox="0 0 160 190" className="mx-auto">
            <path
              d={`
                M ${center.x},${center.y}
                L ${center.x},${center.y - radius}
                A ${radius},${radius} 0 ${utilizedAngle > 180 ? 1 : 0},1
                ${center.x + radius * Math.sin(utilizedAngle * Math.PI / 180)},${center.y - radius * Math.cos(utilizedAngle * Math.PI / 180)}
                Z
              `}
              fill="#3233FF"
              stroke="white"
              strokeWidth="2"
            />

            <path
              d={`
                M ${center.x},${center.y}
                L ${center.x + radius * Math.sin(utilizedAngle * Math.PI / 180)},${center.y - radius * Math.cos(utilizedAngle * Math.PI / 180)}
                A ${radius},${radius} 0 ${(360 - utilizedAngle) > 180 ? 1 : 0},1
                ${center.x},${center.y - radius}
                Z
              `}
              fill="#FF5E18"
              stroke="white"
              strokeWidth="2"
            />

            <g transform="translate(0, 140)">
              <rect x="0" y="0" width="12" height="8" fill="#4169E1" />
              <text x="20" y="7" fontFamily="Arial" fontSize="10" fontWeight="bold">
                UTILIZED: {timeData.utilized}min
              </text>
              <rect x="0" y="15" width="12" height="8" fill="#FF6B35" />
              <text x="20" y="22" fontFamily="Arial" fontSize="10" fontWeight="bold">
                UNUTILIZED: {timeData.unutilized}min
              </text>
            </g>
          </svg>
        </div>
      );
    };

return (
  <div className="relative">
    <div ref={ref} className="w-[210mm] bg-white text-black font-sans leading-tight text-xs flex flex-col" style={{
height: '297mm',
    }}>
      
      {/* Header avec l'image */}
      <div className="w-full" style={{ lineHeight: 0 }}>
        <img
          src="/radiant-head.jpg"
          alt="Radiant Prep Header"
          className="w-full h-auto"
          style={{ display: 'block' }}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex-grow px-6">
        {/* Scholar Info et Grade */}
        <div className="mb-2 mt-5">
          <div className="flex justify-between items-center">
            <div className="flex-1 flex items-center">
              <div style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '0rem 0.5rem',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                height: '32px',
                lineHeight: '.9',
                boxSizing: 'border-box',
              }}>
                SCHOLAR&nbsp;:
              </div>
              <div style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '0rem 0.5rem',
                marginLeft: '0.25rem',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                height: '32px',
                lineHeight: '.9',
                boxSizing: 'border-box',
              }}>
                {studentName}
              </div>
            </div>
            <div className="flex">
              <div style={{
                backgroundColor: 'black',
                color: 'white',
                padding: '0rem 0.5rem',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                height: '32px',
                lineHeight: '.9',
                boxSizing: 'border-box',
              }}>
                <span className="mr-2">Grade&nbsp;:</span>
              </div>
              <div style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '0rem 0.5rem',
                marginLeft: '0.25rem',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                height: '32px',
                lineHeight: '.9',
                boxSizing: 'border-box',
              }}>
                {assessmentResult.grade}
              </div>
            </div>
          </div>

          <div className="bg-gray-200 p-2 mt-5 text-sm">
            <div><strong>Assessment:</strong> Radiant PACED™ Assessments- Grade {assessmentResult.grade} {assessmentResult.subject.toUpperCase()}</div>
            <div><strong>Date Administered:</strong> {takenDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
        </div>

        {/* Graphiques et score */}
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div className="w-1/3">
              <ScoreComparisonBarChart />
            </div>
            <div className="w-1/3 text-center px-2">
              <div className="mt-2">
                <div className="text-lg font-bold mb-1">SCORE:</div>
                <div className="text-5xl font-bold">{percentage}%</div>
                <div className="mt-2 text-xs space-y-0">
                  <div>Custom Scale: 1.9</div>
                  <div>Set Scale: 3.4</div>
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="border border-gray-400 p-2 h-full flex flex-col">
                <h3 className="font-bold text-base text-center mb-1 font-sans">Time Distribution</h3>
                <div className="flex-1">
                  <TimeDistributionPieChart />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections Correct/Incorrect */}
        <div className="mb-4">
          <div className="flex justify-center mb-2">
            <img 
              src="/Screenshot 2025-06-27 at 22.36.34.png" 
              alt="Correct & Incorrect" 
            />
          </div>
          <div className="grid grid-cols-2 gap-x-8 px-8">
            <div className="space-y-1">
              {skillCategories.correct.map((skill, i) => (
                <div key={i} className="flex items-start">
                  <span className="inline-block w-6 text-right pr-1">{i+1}.</span>
                  <span className="flex-1">{skill}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              {skillCategories.incorrect.map((skill, i) => (
                <div key={i} className="flex items-start">
                  <span className="inline-block w-6 text-right pr-1">{i+1}.</span>
                  <span className="flex-1">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer fixe en bas */}
      <div className="px-6 w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-[#f7ff3c]">
              <th className="w-2/3 p-2 border-r border-black font-bold">
                GENERAL ANALYSIS / FOCUS AREAS:
              </th>
              <th className="w-1/3 p-2 font-bold text-white">
                PROJECTED PREP LENGTH:
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-r border-black">
                Our data indicates <span className="text-blue-600 font-semibold">{studentName}</span> requires intervention in <span className="text-blue-600 font-semibold">{assessmentResult.subject}</span>.
              </td>
              <td className="p-2">
                Varies based on service options
              </td>
            </tr>
          </tbody>
        </table>
        <div className="bg-black text-white text-center py-1 text-xs">
          Copyright © by Radiant Prep, LLC. All Rights Reserved. CONFIDENTIAL - May NOT be reproduced in any form.
        </div>
      </div>
    </div>
  </div>
);
  }
);

ReportTemplate.displayName = 'ReportTemplate';