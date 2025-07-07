// src/components/assessment/AITutor.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import type { AssessmentResult } from '@/lib/types';
import { BookOpen, Lightbulb, MessageSquare, Bot, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './Avatar';

interface AITutorProps {
  assessmentResult: AssessmentResult;
  studentName: string;
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AITutor({ assessmentResult, studentName }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState('');
  const [studyPlan, setStudyPlan] = useState('');
  const [resources, setResources] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Message initial du tuteur IA
    setMessages([{
      role: 'assistant',
      content: `Bonjour ${studentName}! Je suis ton tuteur IA. J'analyse tes résultats...`
    }]);

    // Lance l'analyse
    analyzeResults();
  }, [assessmentResult, studentName]); // Added studentName to dependency array

  const callGeminiAPI = async (prompt: string, chatHistory: Message[] = []) => {
    try {
      const response = await fetch('/api/aitutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          chatHistory: chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        // Log non-JSON response for debugging
        console.error('Non-JSON response received:', text);
        throw new Error(`Erreur: Réponse non-JSON du serveur. Contenu: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (!response.ok) {
        // If server returns a non-2xx status, it should have an error message
        const serverErrorMessage = data.error || `Erreur HTTP ${response.status}`;
        throw new Error(`Erreur du serveur Gemini: ${serverErrorMessage} ${data.details ? `(${data.details})` : ''}`);
      }

      if (!data.message) {
        throw new Error('Réponse vide de Gemini: Le message de l\'IA est absent.');
      }

      return data.message;
    } catch (error) {
      console.error('Erreur API Gemini (client):', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Erreur inconnue lors de la communication avec Gemini.'
      );
    }
  };

  const handleUserMessage = async (message: string) => {
    const newMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, newMessage]);

    try {
      const aiMessage = await callGeminiAPI(message, messages);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiMessage || "Je n'ai pas pu obtenir de réponse de l'IA."
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error instanceof Error
          ? `Désolé, une erreur est survenue: ${error.message}`
          : "Une erreur inattendue s'est produite lors de l'envoi du message."
      }]);
    }
  };

  const analyzeResults = async () => {
    setIsLoading(true);
    try {
      const prompt = `
        Tu es un tuteur pédagogique expert. Analyse les résultats d'évaluation d'un élève et fournis:
        1. Analyse: Une analyse détaillée des forces et faiblesses
        2. Plan: Un plan d'étude personnalisé
        3. Ressources: Des ressources recommandées

        Résultats:
        - Élève: ${studentName}
        - Matière: ${assessmentResult.subject}
        - Niveau: Grade ${assessmentResult.grade}
        - Score: ${assessmentResult.score}/${assessmentResult.totalQuestions} (${Math.round((assessmentResult.score / assessmentResult.totalQuestions) * 100)}%)
        - Réponses incorrectes: ${assessmentResult.answers.filter(a => !a.isCorrect).length}

        Fournis ta réponse en français, en 3 parties clairement identifiées.
      `;

      const responseText = await callGeminiAPI(prompt);
      processAIResponse(responseText);
    } catch (error) {
      console.error("Erreur d'analyse (client):", error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error
            ? `Désolé, une erreur est survenue lors de l'analyse: ${error.message}`
            : "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processAIResponse = (response: string) => {
    // Amélioration du parsing avec des regex
    const analysisMatch = response.match(/1\. Analyse:\s*(.*?)(?=2\. Plan:|$)/s);
    const planMatch = response.match(/2\. Plan:\s*(.*?)(?=3\. Ressources:|$)/s);
    const resourcesMatch = response.match(/3\. Ressources:\s*(.*)/s);

    // Provide default messages if parsing fails or parts are empty
    setAnalysis(analysisMatch ? analysisMatch[1].trim() : "Analyse non disponible. La réponse de l'IA n'a pas le format attendu.");
    setStudyPlan(planMatch ? planMatch[1].trim() : "Plan d'étude non disponible. La réponse de l'IA n'a pas le format attendu.");
    setResources(resourcesMatch ? resourcesMatch[1].trim() : "Ressources non disponibles. La réponse de l'IA n'a pas le format attendu.");

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: "J'ai terminé mon analyse! Voici ce que j'ai trouvé..."
    }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]); // Added isLoading to dependencies for better scroll sync

  return (
    <div className="mt-12 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Sparkles className="text-purple-500" />
        <span>Tuteur IA Personnel</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar et Chat */}
        <div className="lg:col-span-1 space-y-4">
          <Avatar />

          <Card className="h-full shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span>Dialogue avec le tuteur</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-64 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input');
                if (input?.value) {
                  handleUserMessage(input.value);
                  input.value = '';
                }
              }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Posez une question..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={isLoading}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Analyse détaillée */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                <span>Analyse des Performances</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {analysis.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-sm border-0 h-full">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Plan d'Étude</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {studyPlan.split('\n').filter(p => p.trim()).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 h-full">
              <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Ressources Recommandées</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {resources.split('\n').filter(p => p.trim()).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}