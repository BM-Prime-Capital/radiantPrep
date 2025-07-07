// src/components/assessment/Avatar.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Avatar({ speaking = false }: { speaking?: boolean }) {
  const [expression, setExpression] = useState('default');
  
  // Change expression randomly
  useEffect(() => {
    if (speaking) {
      const expressions = ['default', 'happy', 'thinking'];
      const interval = setInterval(() => {
        setExpression(expressions[Math.floor(Math.random() * expressions.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [speaking]);

  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <motion.div
        className="relative"
        animate={speaking ? { 
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        } : {}}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        {/* Visage */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white shadow-lg relative overflow-hidden">
          
          {/* Yeux */}
          <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-white rounded-full">
            <div className={`absolute top-1/2 left-1/2 w-3 h-3 bg-blue-600 rounded-full 
              ${expression === 'happy' ? 'transform -translate-x-1 -translate-y-1' : ''}`}></div>
          </div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white rounded-full">
            <div className={`absolute top-1/2 left-1/2 w-3 h-3 bg-blue-600 rounded-full 
              ${expression === 'happy' ? 'transform -translate-x-1 -translate-y-1' : ''}`}></div>
          </div>
          
          {/* Bouche */}
          <div className={`absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-16 h-6 
            ${expression === 'happy' ? 'bg-red-400 rounded-b-full' : 
              expression === 'thinking' ? 'bg-red-400 rounded-full w-8 h-4' : 
              'bg-red-400 rounded-full w-16 h-2'}`}>
          </div>
          
          {/* Indicateur de parole */}
          {speaking && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Texte IA */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm text-xs font-bold text-blue-600">
          Tuteur IA
        </div>
      </motion.div>
    </div>
  );
}