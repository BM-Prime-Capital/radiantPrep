import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  MessageCircle, 
  BookOpen, 
  Calculator, 
  Star, 
  Target,
  Lightbulb, 
  TrendingUp,
  Award,
  Brain,
  Sparkles,
  ChevronRight,
  X,
  Minimize2,
  Maximize2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  Zap,
  Bookmark,
  Notebook,
  Puzzle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AssessmentResult, Subject, ChildInformation } from '@/lib/types';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  learningResources?: LearningResource[];
}

interface LearningResource {
  type: 'video' | 'article' | 'practice' | 'game';
  title: string;
  url?: string;
  content?: string;
}

interface StudyRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  subject: Subject;
  estimatedTime: string;
  difficulty: string;
  topics: string[];
  focusAreas: string[];
  resources?: LearningResource[];
}

interface LearningSession {
  goal: string;
  topic: string;
  progress: number;
  resources: LearningResource[];
  completed?: boolean;
}

interface AIAgentProps {
  assessmentResult?: AssessmentResult;
  isOpen?: boolean;
  onToggle?: () => void;
  learningTools?: {
    explanationStyles: string[];
    practiceModes: string[];
  };
  personality?: {
    tone: 'encouraging' | 'formal' | 'friendly';
    pace: 'slow' | 'moderate' | 'fast';
    feedbackStyle: 'constructive' | 'direct' | 'supportive';
  };
}

export function AIAgent({ 
  assessmentResult, 
  isOpen = false, 
  onToggle,
  learningTools = {
    explanationStyles: ['visual', 'textual', 'interactive'],
    practiceModes: ['guided', 'timed', 'challenge']
  },
  personality = {
    tone: 'encouraging',
    pace: 'moderate',
    feedbackStyle: 'constructive'
  }
}: AIAgentProps) {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'progress' | 'resources'>('chat');
  const [activeLearningSession, setActiveLearningSession] = useState<LearningSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const childUser = role === 'child' ? (user as ChildInformation) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeConversation();
    }
  }, [isOpen, assessmentResult]);

  const getDetailedAssessmentAnalysis = () => {
    if (!assessmentResult) return null;

    const { score, totalQuestions, answers, subject, grade } = assessmentResult;
    const percentage = Math.round((score / totalQuestions) * 100);
    const incorrectAnswers = answers.filter(answer => !answer.isCorrect);
    const correctAnswers = answers.filter(answer => answer.isCorrect);

    const weakAreas = incorrectAnswers.map((answer, index) => {
      const questionNumber = answers.findIndex(a => a === answer) + 1;
      return {
        questionNumber,
        userAnswer: answer.userAnswer,
        correctAnswer: answer.correctAnswer,
        topic: getTopicFromQuestion(questionNumber, subject),
        difficulty: calculateQuestionDifficulty(index, totalQuestions)
      };
    });

    return {
      percentage,
      correctCount: correctAnswers.length,
      incorrectCount: incorrectAnswers.length,
      weakAreas,
      strongAreas: correctAnswers.map((answer, index) => {
        const questionNumber = answers.findIndex(a => a === answer) + 1;
        return {
          topic: getTopicFromQuestion(questionNumber, subject),
          difficulty: calculateQuestionDifficulty(index, totalQuestions)
        };
      }),
      performanceLevel: percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs-improvement',
      subject,
      grade
    };
  };

  const calculateQuestionDifficulty = (index: number, total: number): number => {
    // Simple heuristic - questions later in assessment are considered more difficult
    return Math.min(5, Math.max(1, Math.ceil((index / total) * 5)));
  };

  const getTopicFromQuestion = (questionNumber: number, subject: Subject): string => {
    if (subject === 'Math') {
      const mathTopics = [
        'Basic Operations', 'Word Problems', 'Fractions', 'Decimals', 
        'Geometry', 'Measurement', 'Algebra', 'Data Analysis'
      ];
      return mathTopics[questionNumber % mathTopics.length];
    } else {
      const elaTopics = [
        'Reading Comprehension', 'Vocabulary', 'Grammar', 'Writing', 
        'Main Ideas', 'Inference', 'Text Analysis', 'Language Usage'
      ];
      return elaTopics[questionNumber % elaTopics.length];
    }
  };

  const getToneAdjustedResponse = (baseResponse: string): string => {
    if (personality.tone === 'encouraging') {
      return baseResponse.replace(/\./g, '!').replace(/\b(I|you)\b/g, match => 
        match === 'I' ? "I'm" : "you're"
      );
    }
    return baseResponse;
  };

  const initializeConversation = () => {
    const analysis = getDetailedAssessmentAnalysis();
    let welcomeContent = `Hi ${childUser?.childName || 'there'}! 👋 I'm your AI learning assistant.`;

    if (analysis) {
      const { percentage, correctCount, incorrectCount, performanceLevel } = analysis;
      
      welcomeContent += ` I've analyzed your ${assessmentResult?.subject} assessment (Grade ${analysis.grade}):

🎯 **Score**: ${percentage}% (${correctCount}/${assessmentResult?.totalQuestions} correct)
`;

      if (performanceLevel === 'excellent') {
        welcomeContent += `\n🌟 **Outstanding!** You've mastered most concepts. Let's tackle advanced challenges!`;
      } else if (performanceLevel === 'good') {
        welcomeContent += `\n👍 **Solid work!** You're doing well with room to grow in ${incorrectCount} areas.`;
      } else {
        welcomeContent += `\n💪 **Let's improve!** We'll focus on ${incorrectCount} key areas to strengthen.`;
      }

      welcomeContent += `\n\nHow can I help you today?`;
    } else {
      welcomeContent += ` I'm here to help with your studies. Complete an assessment for personalized help!`;
    }

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: getToneAdjustedResponse(welcomeContent),
      timestamp: new Date(),
      suggestions: analysis ? [
        "Explain my mistakes",
        "Create practice plan", 
        "Show weak areas",
        "Recommend resources"
      ] : [
        "Explain math concepts",
        "Help with reading",
        "Study techniques",
        "Practice problems"
      ]
    };
    setMessages([welcomeMessage]);
  };

  const startLearningSession = (topic: string) => {
    const session: LearningSession = {
      goal: `Master ${topic}`,
      topic,
      progress: 0,
      resources: generateResourcesForTopic(topic)
    };
    setActiveLearningSession(session);
    return session;
  };

  const generateResourcesForTopic = (topic: string): LearningResource[] => {
    const isMath = assessmentResult?.subject === 'Math';
    return [
      {
        type: 'video',
        title: `${isMath ? 'Math' : 'Reading'} video: ${topic}`,
        url: '#'
      },
      {
        type: 'article',
        title: `Guide to ${topic}`,
        content: `This is a comprehensive guide about ${topic}...`
      },
      {
        type: 'practice',
        title: `${topic} practice problems`,
        content: 'Try these exercises to reinforce your learning...'
      },
      {
        type: 'game',
        title: `${topic} learning game`,
        url: '#'
      }
    ];
  };

const generateAIResponse = async (userMessage: string): Promise<{content: string; resources: LearningResource[] | undefined}> => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    const message = userMessage.toLowerCase();
    const analysis = getDetailedAssessmentAnalysis();
    let response = { content: '', resources: undefined as LearningResource[] | undefined };

    // Intent detection
    if (message.includes('incorrect') || message.includes('wrong') || message.includes('mistake')) {
      response = handleMistakesQuery(message, analysis);
    } else if (message.includes('weak') || message.includes('practice') || message.includes('improve')) {
      response = handleWeakAreasQuery(message, analysis);
    } else if (message.includes('strong') || message.includes('good at') || message.includes('strength')) {
      response = handleStrengthsQuery(message, analysis);
    } else if (message.includes('study plan') || message.includes('schedule') || message.includes('plan')) {
      response = handleStudyPlanQuery(message, analysis);
    } else if (message.includes('math') || (assessmentResult?.subject === 'Math' && 
             (message.includes('explain') || message.includes('help')))) {
      response = handleMathQuery(message, analysis);
    } else if (message.includes('reading') || message.includes('ela') || 
             (assessmentResult?.subject === 'ELA' && (message.includes('explain') || message.includes('help')))) {
      response = handleReadingQuery(message, analysis);
    } else if (message.includes('resource') || message.includes('material') || message.includes('learn')) {
      response = handleResourcesQuery(message, analysis);
    } else {
      response = handleGeneralQuery(message, analysis);
    }

    return {
      content: getToneAdjustedResponse(response.content),
      resources: response.resources
    };
  };

  const handleMistakesQuery = (message: string, analysis: any) => {
    if (analysis && analysis.weakAreas.length > 0) {
      let content = `Let's review your mistakes:\n\n`;
      
      analysis.weakAreas.slice(0, 3).forEach((area: any) => {
        content += `**Q${area.questionNumber} (${area.topic})**:\n`;
        content += `✖ Your answer: ${formatAnswer(area.userAnswer)}\n`;
        content += `✔ Correct: ${formatAnswer(area.correctAnswer)}\n`;
        content += `📚 Focus area: ${area.topic}\n\n`;
      });

      if (analysis.weakAreas.length > 3) {
        content += `There are ${analysis.weakAreas.length - 3} more to review when you're ready!\n\n`;
      }

      content += `💡 Remember: Mistakes are stepping stones to mastery!`;

      return { 
        content,
        resources: generateResourcesForTopic(analysis.weakAreas[0].topic)
      };
    }
    return { content: "I don't see any assessment results to analyze yet." };
  };

  const formatAnswer = (answer: string | string[]): string => {
    if (Array.isArray(answer)) return answer.join(', ');
    return answer || 'No answer';
  };

  const handleWeakAreasQuery = (message: string, analysis: any) => {
    if (analysis) {
      const uniqueWeakTopics = [...new Set(analysis.weakAreas.map((area: any) => area.topic))];
      
      let content = `Your key areas to improve:\n\n`;
      uniqueWeakTopics.forEach((topic, index) => {
        const count = analysis.weakAreas.filter((area: any) => area.topic === topic).length;
        content += `${index + 1}. **${topic}** (${count} question${count > 1 ? 's' : ''})\n`;
      });

      content += `\nLet's focus on **${uniqueWeakTopics[0]}** first. Would you like to:
• Get an explanation
• Try practice problems
• See examples
• Learn strategies`;

      return { 
        content,
        resources: generateResourcesForTopic(uniqueWeakTopics[0])
      };
    }
    return { content: "Complete an assessment to identify weak areas." };
  };

  const handleStrengthsQuery = (message: string, analysis: any) => {
    if (analysis && analysis.strongAreas.length > 0) {
      const uniqueStrongTopics = [...new Set(analysis.strongAreas.map((area: any) => area.topic))];
      
      let content = `You're excelling in:\n`;
      uniqueStrongTopics.forEach(topic => {
        content += `✓ **${topic}** - Great job!\n`;
      });

      content += `\nWe can use these strengths to tackle harder concepts!`;

      return { content };
    }
    return { content: "Complete an assessment to identify your strengths." };
  };

  const handleStudyPlanQuery = (message: string, analysis: any) => {
    if (analysis) {
      const studyMinutes = analysis.incorrectCount * 15;
      const mainTopic = analysis.weakAreas[0]?.topic || 'key concepts';
      
      const content = `**Personalized Study Plan**\n\n` +
        `⏳ Daily: ${studyMinutes} minutes\n` +
        `📌 Focus: ${mainTopic}\n\n` +
        `**Week 1**: Master fundamentals\n` +
        `• 10 min concept review\n` +
        `• 5 min practice\n\n` +
        `**Week 2**: Apply knowledge\n` +
        `• Mixed practice\n` +
        `• Real-world examples\n\n` +
        `Ready to begin with ${mainTopic}?`;

      return { 
        content,
        resources: generateResourcesForTopic(mainTopic)
      };
    }
    return { content: "Complete an assessment to generate a study plan." };
  };

  const handleMathQuery = (message: string, analysis: any) => {
  if (analysis) {
    const mathWeakAreas = analysis.weakAreas.filter((area: any) => 
      ['fractions', 'decimals', 'word problems', 'geometry', 'algebra']
        .some(topic => area.topic.toLowerCase().includes(topic))
    ).slice(0, 1); // Moved the parenthesis to properly close the filter method

    if (mathWeakAreas.length > 0) {
      const area = mathWeakAreas[0];
      const content = `Let's tackle **${area.topic}** (Q${area.questionNumber})!\n\n` +
        `1. Understand the concept\n` +
        `2. See worked examples\n` +
        `3. Try similar problems\n` +
        `4. Get immediate feedback\n\n` +
        `Want to start with step 1?`;

      return { 
        content,
        resources: generateResourcesForTopic(area.topic)
      };
    }
  }

  return {
    content: `Math help:\n` +
      `• Break problems into steps\n` +
      `• Draw diagrams\n` +
      `• Check work systematically\n\n` +
      `What specific concept do you need help with?`
  };
};

  const handleReadingQuery = (message: string, analysis: any) => {
    if (analysis) {
      const elaWeakAreas = analysis.weakAreas.filter((area: any) => 
        ['reading', 'vocabulary', 'comprehension', 'grammar', 'writing']
          .some(topic => area.topic.toLowerCase().includes(topic)))
          .slice(0, 1);

      if (elaWeakAreas.length > 0) {
        const area = elaWeakAreas[0];
        const content = `Let's improve **${area.topic}** skills!\n\n` +
          `📖 Read carefully\n` +
          `❓ Ask questions\n` +
          `✍ Summarize key points\n` +
          `🔍 Find evidence in text\n\n` +
          `Want to practice this now?`;

        return { 
          content,
          resources: generateResourcesForTopic(area.topic)
        };
      }
    }

    return {
      content: `Reading strategies:\n` +
        `• Preview headings/images\n` +
        `• Highlight key details\n` +
        `• Make predictions\n` +
        `• Summarize in your own words\n\n` +
        `What reading skill would you like to practice?`
    };
  };

  const handleResourcesQuery = (message: string, analysis: any) => {
    if (analysis) {
      const topic = analysis.weakAreas[0]?.topic || analysis.subject;
      const resources = generateResourcesForTopic(topic);
      
      return {
        content: `Here are resources for ${topic}:\n\n` +
          resources.map(r => `• ${r.title}`).join('\n') +
          `\n\nWhich would you like to explore first?`,
        resources
      };
    }
    return {
      content: "Complete an assessment for personalized resources.",
      resources: [
        {
          type: 'article',
          title: 'General study tips',
          content: 'Here are some general tips for effective studying...'
        }
      ]
    };
  };

  const handleGeneralQuery = (message: string, analysis: any) => {
    if (analysis) {
      return {
        content: `I can help with:\n` +
          `✓ Explaining concepts\n` +
          `✓ Practicing weak areas\n` +
          `✓ Study strategies\n` +
          `✓ Progress tracking\n\n` +
          `What would you like to focus on?`
      };
    }
    return {
      content: `I can help with:\n` +
        `• Math concepts\n` +
        `• Reading strategies\n` +
        `• Study skills\n` +
        `• Test preparation\n\n` +
        `What would you like help with?`
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const { content, resources } = await generateAIResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        suggestions: generateSuggestions(userMessage.content),
        learningResources: resources
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Start learning session if relevant
      if (resources && resources.length > 0) {
        const topic = userMessage.content.includes('math') ? 'Math' : 
                      userMessage.content.includes('reading') ? 'Reading' : 
                      assessmentResult?.subject || 'General Learning';
        startLearningSession(topic);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble right now. Could you try asking your question again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateSuggestions = (userMessage: string): string[] => {
    const message = userMessage.toLowerCase();
    const analysis = getDetailedAssessmentAnalysis();
    
    if (message.includes('math')) {
      return ["Explain fractions", "Help with word problems", "Show algebra basics"];
    }
    if (message.includes('reading') || message.includes('ela')) {
      return ["Reading strategies", "Vocabulary help", "Grammar practice"];
    }
    if (message.includes('study') || message.includes('practice')) {
      return ["Create study plan", "Time management", "Test strategies"];
    }
    if (analysis) {
      return ["Explain mistakes", "Practice weak areas", "Show progress"];
    }
    
    return ["Math help", "Reading help", "Study tips"];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      const sendButton = document.querySelector('#send-message') as HTMLButtonElement;
      if (sendButton) sendButton.click();
    }, 0);
  };

  const handleResourceClick = (resource: LearningResource) => {
    // In a real app, this would open the resource
    const message: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Opening: ${resource.title}\n\n${resource.content || 'Resource content would appear here'}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const generateStudyRecommendations = (): StudyRecommendation[] => {
    if (!assessmentResult) return [];

    const analysis = getDetailedAssessmentAnalysis();
    if (!analysis) return [];

    const recommendations: StudyRecommendation[] = [];
    const uniqueWeakTopics = [...new Set(analysis.weakAreas.map((area: any) => area.topic))];

    // High priority recommendations
    uniqueWeakTopics.slice(0, 2).forEach((topic, index) => {
      const questionsInTopic = analysis.weakAreas.filter((area: any) => area.topic === topic).length;
      recommendations.push({
        id: `high-${index}`,
        title: `Master ${topic}`,
        description: `Focus on ${topic} concepts from ${questionsInTopic} questions`,
        priority: 'high',
        subject: assessmentResult.subject,
        estimatedTime: `${questionsInTopic * 15} minutes`,
        difficulty: 'Targeted',
        topics: [topic],
        focusAreas: analysis.weakAreas
          .filter((area: any) => area.topic === topic)
          .map((area: any) => `Q${area.questionNumber}`),
        resources: generateResourcesForTopic(topic)
      });
    });

    // Medium priority
    if (analysis.correctCount > 0) {
      recommendations.push({
        id: 'medium-1',
        title: 'Mixed Practice',
        description: 'Combine strong and weak areas for balanced review',
        priority: 'medium',
        subject: assessmentResult.subject,
        estimatedTime: '20-30 minutes',
        difficulty: 'Mixed',
        topics: [...new Set([
          ...analysis.strongAreas.slice(0, 2).map((area: any) => area.topic),
          ...uniqueWeakTopics.slice(0, 1)
        ])],
        focusAreas: ['Integration', 'Application'],
        resources: [
          {
            type: 'practice',
            title: 'Mixed practice set',
            content: 'Problems combining multiple concepts'
          }
        ]
      });
    }

    // Low priority
    recommendations.push({
      id: 'low-1',
      title: 'Daily Maintenance',
      description: 'Quick review of all concepts',
      priority: 'low',
      subject: assessmentResult.subject,
      estimatedTime: '10-15 minutes',
      difficulty: 'General',
      topics: ['All concepts'],
      focusAreas: ['Retention', 'Recall'],
      resources: [
        {
          type: 'article',
          title: 'Daily review strategies',
          content: 'Effective techniques for short daily practice sessions'
        }
      ]
    });

    return recommendations;
  };

  const studyRecommendations = generateStudyRecommendations();
  const analysis = getDetailedAssessmentAnalysis();

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
        {assessmentResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <Sparkles className="h-3 w-3 text-white" />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className={`w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm ${isMinimized ? 'h-16' : 'h-[600px]'} transition-all duration-300`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Study Assistant</h3>
                <p className="text-xs opacity-90">
                  {analysis ? `${analysis.percentage}% in ${assessmentResult?.subject}` : 'Ready to help!'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-full">
            <div className="flex border-b">
              {[
                { id: 'chat', label: 'Chat', icon: MessageCircle },
                { id: 'recommendations', label: 'Study', icon: Target },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'resources', label: 'Resources', icon: Bookmark }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'border-b-2 border-purple-600 text-purple-600 bg-purple-50' 
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.suggestions && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                          {message.learningResources && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium">Resources:</p>
                              {message.learningResources.slice(0, 2).map((resource, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleResourceClick(resource)}
                                  className="flex items-center gap-2 text-xs bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 w-full text-left"
                                >
                                  {resource.type === 'video' && <BookOpen className="h-3 w-3" />}
                                  {resource.type === 'article' && <Notebook className="h-3 w-3" />}
                                  {resource.type === 'practice' && <Puzzle className="h-3 w-3" />}
                                  {resource.type === 'game' && <HelpCircle className="h-3 w-3" />}
                                  {resource.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((dot) => (
                            <motion.div
                              key={dot}
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: dot * 0.2
                              }}
                              className="w-2 h-2 bg-gray-500 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask your study question..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      id="send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center mb-4">
                  <Brain className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Study Recommendations</h3>
                  <p className="text-sm text-gray-600">
                    {analysis ? `Personalized for your needs` : 'Complete an assessment first'}
                  </p>
                </div>

                {studyRecommendations.length > 0 ? (
                  <div className="space-y-3">
                    {studyRecommendations.map((rec) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm">{rec.title}</h4>
                          <Badge 
                            variant={rec.priority === 'high' ? 'destructive' : 
                                    rec.priority === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rec.estimatedTime}
                          </span>
                          <span className="text-purple-600">{rec.difficulty}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {rec.topics.map((topic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        {rec.resources && rec.resources.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium mb-1">Resources:</p>
                            <div className="flex flex-wrap gap-1">
                              {rec.resources.slice(0, 2).map((resource, i) => (
                                <Badge 
                                  key={i} 
                                  variant="outline" 
                                  className="text-xs flex items-center gap-1"
                                >
                                  {resource.type === 'video' && <BookOpen className="h-3 w-3" />}
                                  {resource.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Complete an assessment to get recommendations</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center mb-4">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Your Progress</h3>
                  <p className="text-sm text-gray-600">
                    {analysis ? `In ${assessmentResult?.subject}` : 'No assessment data'}
                  </p>
                </div>

                {analysis ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Latest Results</span>
                        <Badge className="bg-blue-600">
                          {assessmentResult?.subject}
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {analysis.percentage}%
                      </div>
                      <p className="text-sm text-gray-600">
                        {analysis.correctCount} correct, {analysis.incorrectCount} to practice
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-6 w-6" />
                          {analysis.correctCount}
                        </div>
                        <div className="text-xs text-green-700">Correct</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                          <XCircle className="h-6 w-6" />
                          {analysis.incorrectCount}
                        </div>
                        <div className="text-xs text-red-700">To Improve</div>
                      </div>
                    </div>

                    {analysis.strongAreas.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          Strengths
                        </h4>
                        <div className="space-y-2">
                          {[...new Set(analysis.strongAreas.map((area: any) => area.topic))].slice(0, 3).map((topic, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                              <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                {topic}
                              </span>
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                Mastered
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.weakAreas.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Focus Areas
                        </h4>
                        <div className="space-y-2">
                          {[...new Set(analysis.weakAreas.map((area: any) => area.topic))].slice(0, 3).map((topic, index) => {
                            const questionsInTopic = analysis.weakAreas.filter((area: any) => area.topic === topic);
                            return (
                              <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded text-sm">
                                <span className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  {topic}
                                </span>
                                <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                                  {questionsInTopic.length} question{questionsInTopic.length > 1 ? 's' : ''}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Complete an assessment to see your progress</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-center mb-4">
                  <Bookmark className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-bold text-lg">Learning Resources</h3>
                  <p className="text-sm text-gray-600">
                    {analysis ? `For ${assessmentResult?.subject}` : 'General resources'}
                  </p>
                </div>

                <div className="space-y-3">
                  {activeLearningSession?.resources ? (
                    activeLearningSession.resources.map((resource, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 pt-1">
                            {resource.type === 'video' && <BookOpen className="h-5 w-5 text-red-500" />}
                            {resource.type === 'article' && <Notebook className="h-5 w-5 text-blue-500" />}
                            {resource.type === 'practice' && <Puzzle className="h-5 w-5 text-green-500" />}
                            {resource.type === 'game' && <HelpCircle className="h-5 w-5 text-purple-500" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{resource.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {resource.content || 'Click to view this resource'}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleResourceClick(resource)}
                            >
                              Open Resource
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-1">Math Resources</h4>
                        <p className="text-xs text-gray-600">Videos, practice problems and more</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-1">Reading Resources</h4>
                        <p className="text-xs text-gray-600">Guides, strategies and exercises</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-1">Study Skills</h4>
                        <p className="text-xs text-gray-600">Tips for effective learning</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}