// Visualisation des réponses interactives dans un tableau admin
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';

export const AdminInteractiveAnswerTable = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/admin/interactive-answers').then((res) => setData(res.data));
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Submitted Interactive Answers</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Answer (JSON)</TableCell>
            <TableCell>Correct</TableCell>
            <TableCell>Submitted At</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((answer) => (
            <TableRow key={answer.id}>
              <TableCell>{answer.questionId}</TableCell>
              <TableCell>{answer.assessment.childUserId || answer.assessment.parentUserId}</TableCell>
              <TableCell>
                <pre className="text-xs whitespace-pre-wrap max-w-xs overflow-auto">
                  {answer.userAnswer}
                </pre>
              </TableCell>
              <TableCell>{answer.isCorrect ? '✅' : '❌'}</TableCell>
              <TableCell>{new Date(answer.submittedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
