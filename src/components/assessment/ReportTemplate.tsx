'use client';

import React from 'react';
import type { AssessmentResult } from '@/lib/types';

interface ReportTemplateProps {
  assessmentResult: AssessmentResult;
  studentName: string;
}

export const ReportTemplate = React.forwardRef<HTMLDivElement, ReportTemplateProps>(
  ({ assessmentResult, studentName }, ref) => {
    const correctAnswers = assessmentResult.answers
      .filter(ans => ans.isCorrect)
      .map((ans, i) => ({
        number: i + 1,
        description: ans.topic || `Question ${i + 1}`
      }));

    const incorrectAnswers = assessmentResult.answers
      .filter(ans => !ans.isCorrect)
      .map((ans, i) => ({
        number: i + 1,
        description: ans.topic || `Question ${i + 1}`
      }));

    const percentage = Math.round((assessmentResult.score / assessmentResult.totalQuestions) * 100);
    const takenDate = new Date(assessmentResult.takenAt ?? '');

    // Données pour les graphiques
    const timeData = {
      utilized: 55,
      unutilized: 5
    };

    const scoreData = {
      student: 2.5, // Axe Title value
      average: 4 // Average Score value
    };

    // 3D Bar Chart pour Score Comparison (à gauche)
    const ScoreComparisonBarChart = () => (
      <div className="relative w-full h-48">
        <svg width="280" height="190" viewBox="0 0 280 190" className="overflow-visible">
          {/* Axes */}
          <line x1="40" y1="20" x2="40" y2="150" stroke="black" strokeWidth="1" />
          <line x1="40" y1="150" x2="220" y2="150" stroke="black" strokeWidth="1" />

          {/* Graduations Y */}
          {[0, 1, 2, 3, 4, 5].map((val, i) => (
            <g key={i}>
              <line x1="35" y1={150 - val * 25} x2="40" y2={150 - val * 25} stroke="black" strokeWidth="1" />
              <text x="30" y={154 - val * 25} textAnchor="end" fontFamily="Arial" fontSize="10">
                {val}
              </text>
            </g>
          ))}

          {/* Barre Student's Score (teal/cyan) - 3D Effect */}
          <g>
            {/* Face avant */}
            <rect x="80" y={150 - scoreData.student * 25} width="30" height={scoreData.student * 25} fill="#20B2AA" stroke="black" strokeWidth="0.5" />
            {/* Face droite */}
            <polygon points={`110,${150 - scoreData.student * 25} 120,${140 - scoreData.student * 25} 120,150 110,150`} fill="#1A9B9A" stroke="black" strokeWidth="0.5" />
            {/* Face dessus */}
            <polygon points={`80,${150 - scoreData.student * 25} 90,${140 - scoreData.student * 25} 120,${140 - scoreData.student * 25} 110,${150 - scoreData.student * 25}`} fill="#2DC5C5" stroke="black" strokeWidth="0.5" />
          </g>

          {/* Barre Average Score (rouge) - 3D Effect */}
          <g>
            {/* Face avant */}
            <rect x="140" y={150 - scoreData.average * 25} width="30" height={scoreData.average * 25} fill="#FE0000" stroke="black" strokeWidth="0.5" />
            {/* Face droite */}
            <polygon points={`170,${150 - scoreData.average * 25} 180,${140 - scoreData.average * 25} 180,150 170,150`} fill="#B71C1C" stroke="black" strokeWidth="0.5" />
            {/* Face dessus */}
            <polygon points={`140,${150 - scoreData.average * 25} 150,${140 - scoreData.average * 25} 180,${140 - scoreData.average * 25} 170,${150 - scoreData.average * 25}`} fill="#FF4444" stroke="black" strokeWidth="0.5" />
          </g>

          {/* Labels */}
          <text x="95" y="165" textAnchor="middle" fontFamily="Arial" fontSize="11" fontWeight="bold">MATH</text>

          {/* Légende */}
          <rect x="50" y="175" width="12" height="8" fill="#20B2AA" />
          <text x="65" y="182" fontFamily="Arial" fontSize="10">Student's Score</text>

          <rect x="150" y="175" width="12" height="8" fill="#DC143C" />
          <text x="165" y="182" fontFamily="Arial" fontSize="10">Average Score</text>

          {/* Axe Title */}
          <text x="20" y="90" fontFamily="Arial" fontSize="11" fontWeight="bold" transform="rotate(-90, 20, 90)">Axe Title</text>
        </svg>
      </div>
    );

    // Pie Chart pour Time Distribution (à droite)
    const TimeDistributionPieChart = () => {
        const radius = 50;
        const center = { x: 50, y: 70 };
        const total = timeData.utilized + timeData.unutilized;
        const utilizedAngle = (timeData.utilized / total) * 360;

        return (
            <div className="w-full h-48">
            <svg width="160" height="190" viewBox="0 0 160 190" className="mx-auto">
                {/* Section Utilized (bleu) */}
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

                {/* Section Unutilized (orange) */}
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

                {/* Légende - repositionnée pour mieux s'adapter */}
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
        <div ref={ref} className="w-[794px] bg-white text-black font-sans leading-tight text-sm" style={{
          height: 'calc(1122.52px * 2)', // Hauteur pour deux pages A4
          position: 'relative'
        }}>
          {/* Première page */}
          <div className="page w-full h-[1122.52px] flex flex-col">
            {/* Contenu principal (tout sauf le footer) */}
            <div className="flex-1 mt-6">
              {/* Header avec couleurs */}
              <div className="flex justify-between items-start mb-4 px-6 pt-6">
                <div className="flex-1">
                  <div className="flex items-start">
                    <div>
                      <h1 className="text-4xl font-black tracking-wider mb-9 mt-3">
                        <span style={{ color: '#DF01CC' }}>COMPLE</span>
                        <span style={{ color: '#00A238' }}>METRICS</span>
                        <span className="text-lg align-top">®</span>
                      </h1>
                      <div style={{
                        background: '#dc2626',
                        color: 'white',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        paddingTop: 0,
                        paddingBottom: 0,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        lineHeight: 1.2,
                        verticalAlign: 'top',
                        height: '24px',
                        marginBottom: '0.5rem'
                      }}>
                        Complete Academic Metrics. Accurate, Insightful, Proof in Data.
                      </div>
                    </div>

                    <img
                      src="/newlogo.png"
                      alt="Radiant Prep Logo"
                      className="h-32 w-32 object-contain ml-10"
                      style={{ marginTop: '-0.5rem' }}
                    />
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center">
                      <div style={{
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '0 0.5rem',
                        marginLeft: '0.25rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'flex-start',
                        height: '24px',
                        lineHeight: '.75',
                        verticalAlign: 'top',
                      }}>
                        K-12
                      </div>
                      <div className="flex items-center mx-2">
                        {['S', 'C', 'O', 'R', 'E'].map((letter, i) => (
                          <span
                            key={i}
                            style={{
                              width: '24px',
                              height: '24px',
                              border: '2px solid black',
                              borderRadius: '50%',
                              display: 'inline-flex',
                              alignItems: 'flex-start',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              margin: '0 0.125rem',
                              lineHeight: '.75',
                              verticalAlign: 'top',
                              paddingTop: '-15px'
                            }}
                          >
                            {letter}
                          </span>
                        ))}
                      </div>
                      <div style={{
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '0 0.5rem',
                        marginLeft: '0.25rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'flex-start',
                        height: '24px',
                        lineHeight: '.75',
                        verticalAlign: 'top',
                      }}>
                        REPORT
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs leading-tight">
                  <div className="font-bold">Radiant Prep, LLC</div>
                  <div>42-20 Broadway</div>
                  <div>Astoria, NY 11103</div>
                  <div className="mt-2">Learn@radiantprep.com</div>
                  <div>(347) 531-0888</div>
                  <div className="mt-1">www.RadiantPrep.com</div>
                </div>
              </div>

              {/* Scholar Info avec Grade */}
              <div className="px-6 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1 flex items-center">
                    <div style={{
                      backgroundColor: 'black',
                      color: 'white',
                      padding: '0 0.5rem',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'flex-start',
                      height: '24px',
                      lineHeight: '.75',
                      verticalAlign: 'top',
                    }}>
                      SCHOLAR&nbsp;
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '0 0.5rem',
                      marginLeft: '0.25rem',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'flex-start',
                      height: '24px',
                      lineHeight: '.75',
                      verticalAlign: 'top',
                    }}>
                      {studentName}
                    </div>
                  </div>
                  <div className="flex">
                    <div style={{
                      backgroundColor: 'black',
                      color: 'white',
                      padding: '0 0.5rem',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'flex-start',
                      height: '24px',
                      lineHeight: '.75',
                      verticalAlign: 'top',
                    }}>
                      <span className="mr-2">Grade&nbsp;:</span>
                    </div>
                    <div style={{
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '0 0.5rem',
                      marginLeft: '0.25rem',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'inline-flex',
                      alignItems: 'flex-start',
                      height: '24px',
                      lineHeight: '.75',
                      verticalAlign: 'top',
                    }}>
                      {assessmentResult.grade}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-200 p-3 mt-2 text-sm">
                  <div><strong>Assessment:</strong> Radiant PACED™ Assessments- Grade {assessmentResult.grade} {assessmentResult.subject.toUpperCase()}</div>
                  <div><strong>Date Administered:</strong> {takenDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              {/* Section principale avec graphiques et score - DISPOSITION CORRIGÉE */}
              <div className="px-6 mb-6">
                <div className="flex justify-between items-start">
                  {/* 3D Bar Chart à GAUCHE */}
                  <div className="w-1/3">
                    <ScoreComparisonBarChart />
                  </div>

                  {/* Score au MILIEU */}
                  <div className="w-1/3 text-center px-4">
                    <div className="mt-4">
                      <div className="text-lg font-bold mb-2">SCORE:</div>
                      <div className="text-6xl font-bold">{percentage}%</div>

                      <div className="mt-4 text-sm space-y-1">
                        <div>Custom Scale: 1.9</div>
                        <div>Set Scale: 3.4</div>
                      </div>
                    </div>
                  </div>

                  {/* Time Distribution à DROITE */}
                  <div className="w-1/3">
                    <div className="border border-gray-400 p-4 h-full flex flex-col">
                      <h3 className="font-bold text-lg text-center mb-2 font-sans">Time Distribution</h3>
                      <div className="flex-1">
                        <TimeDistributionPieChart />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections Correct/Incorrect */}
              <div className="px-6 mb-6">
                <div className="flex">
                  {/* Section Correct */}
                  <div className="w-1/2 bg-black text-white p-4">
                    <div className="flex items-center justify-start mb-4">
                      <span className="text-white font-bold text-lg mr-2">#</span>
                      <span className="text-green-400 font-bold text-3xl">Correct</span>
                    </div>

                    <div className="space-y-1 text-sm">
                      {[
                        "1 Word problem; multiplication",
                        "5 Word problem; determining area",
                        "8 Algebraic translation; verbal to abstract",
                        "20 Equations; one-step",
                        "11, 21 Word problem; division",
                        "23 World problem; real-world context",
                        "24 Angle classifications"
                      ].map((item, i) => (
                        <div key={i}>{item}</div>
                      ))}
                    </div>
                  </div>

                  {/* Section Incorrect */}
                  <div className="w-1/2 bg-black text-white p-4">
                    <div className="flex items-center justify-start mb-4">
                      <span className="text-white font-bold text-lg mr-2">#</span>
                      <span className="text-red-400 font-bold text-3xl">Incorrect</span>
                    </div>

                    <div className="space-y-1 text-sm">
                      {[
                        "2 Word problem; fractional division",
                        "3, 17 Greatest Common Factor",
                        "4 Probability",
                        "6 Unit conversion; customary capacity",
                        "7 Word Problem; Calculating Average",
                        "9 Word problem; multiply mixed numbers",
                        "10 Prime factorization",
                        "12 Mixed number operations",
                        "13 World problem; real-world context",
                        "14 Computation; decimal multiplication",
                        "15 Calculating percentage",
                        "16 Evaluating expressions",
                        "18 Proportional Reasoning",
                        "19 Fractional division",
                        "22 Algebraic translation; verbal to abstract"
                      ].map((item, i) => (
                        <div key={i}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Indicateur de page 1 */}
            <div className="mt-auto">
              <div className="bg-white text-black text-center py-2 text-xs">
                Page 1 of 2
              </div>
            </div>
          </div>

          {/* Deuxième page */}
          <div className="page w-full h-[1122.52px] flex flex-col">
            {/* Analysis Section */}
            <div className="flex-1 mt-6 px-6">
                <div className="flex h-full">
                    <div className="w-full">
                    <table className="w-full border-collapse border border-black">
                        <thead>
                        <tr>
                            <th className="w-2/3 p-2 bg-yellow-400 border border-black text-sm font-bold">
                            GENERAL ANALYSIS / FOCUS AREAS
                            </th>
                            <th className="w-1/3 p-2 bg-yellow-400 border border-black text-sm font-bold">
                            PROJECTED PREP LENGTH
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="w-2/3 p-4 border border-black text-sm">
                            Data suggests that <strong style={{ color: '#0000FF' }}>{studentName}</strong> requires significant intervention in <strong style={{ color: '#0000FF' }}>{assessmentResult.subject}</strong>.
                            As she is currently lagging behind peers, focus areas include: solidifying foundation skills and operational fluency with decimals, fractions and mixed numbers, as well as work with real-world problems.
                            </td>
                            <td className="w-1/3 p-4 border border-black text-sm">
                            Varies based on service options
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col">
                <div className="bg-black text-white text-center py-2 text-xs">
                    <div>Copyright © by Radiant Prep, LLC. All Rights Reserved. CONFIDENTIAL - May NOT be reproduced in any form.</div>
                </div>
                {/* <div className="bg-white text-black text-center py-2 text-xs">
                    <div>Page 2 of 2</div>
                </div> */}
            </div>

          </div>
        </div>
      </div>
    );
  }
);

ReportTemplate.displayName = 'ReportTemplate';
