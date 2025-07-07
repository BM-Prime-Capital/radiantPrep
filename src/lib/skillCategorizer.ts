import type { Question, AssessmentResultAnswer, Subject } from './types';

// Skill categories for each subject
export const SKILL_CATEGORIES = {
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
    "Vocabulary; prefix & suffix",
    "Grammar; sentence structure",
    "Writing; organization",
    "Reading; context clues",
    "Literature; character analysis",
    "Poetry; figurative language",
    "Spelling; phonics patterns"
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
    "Fractional division",
    "Geometry; perimeter and area",
    "Data analysis; graphs and charts",
    "Number patterns; sequences",
    "Fractions; comparing and ordering"
  ]
};

interface SkillAnalysisResult {
  skill: string;
  confidence: number;
  reasoning: string;
}

export class SkillCategorizer {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  async categorizeQuestion(
    question: Question, 
    subject: Subject
  ): Promise<SkillAnalysisResult> {
    const availableSkills = SKILL_CATEGORIES[subject];
    
    const prompt = this.buildPrompt(question, subject, availableSkills);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an educational assessment expert who categorizes questions into specific skill areas. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return {
        skill: result.skill,
        confidence: result.confidence,
        reasoning: result.reasoning
      };
    } catch (error) {
      console.error('Error categorizing question:', error);
      // Fallback to basic categorization
      return this.fallbackCategorization(question, subject);
    }
  }

  private buildPrompt(question: Question, subject: Subject, availableSkills: string[]): string {
    return `
Analyze this ${subject} question and categorize it into the most appropriate skill area.

QUESTION DETAILS:
- Type: ${question.type}
- Question: "${question.question}"
- Passage: ${question.passage ? `"${question.passage.substring(0, 200)}..."` : 'None'}
- Category: ${question.category || 'Not specified'}
- Options: ${question.options ? question.options.join(', ') : 'None'}

AVAILABLE SKILL CATEGORIES:
${availableSkills.map((skill, i) => `${i + 1}. ${skill}`).join('\n')}

Analyze the question content, type, and context to determine which skill category it best fits into.

Respond with JSON in this exact format:
{
  "skill": "exact skill name from the list above",
  "confidence": 0.95,
  "reasoning": "brief explanation of why this categorization fits"
}

Choose the skill that most accurately represents what this question is testing.
    `;
  }

  private fallbackCategorization(question: Question, subject: Subject): SkillAnalysisResult {
    const availableSkills = SKILL_CATEGORIES[subject];
    const questionText = question.question.toLowerCase();
    const category = question.category?.toLowerCase() || '';
    
    // Simple keyword-based fallback
    if (subject === 'ELA') {
      if (questionText.includes('vocabulary') || questionText.includes('word')) {
        return {
          skill: "Vocabulary; descriptions",
          confidence: 0.6,
          reasoning: "Fallback: Contains vocabulary-related keywords"
        };
      }
      if (questionText.includes('read') || questionText.includes('passage')) {
        return {
          skill: "Reading comprehension; detail",
          confidence: 0.6,
          reasoning: "Fallback: Contains reading-related keywords"
        };
      }
    } else if (subject === 'Math') {
      if (questionText.includes('word problem') || questionText.includes('solve')) {
        return {
          skill: "Word problem; real-world context",
          confidence: 0.6,
          reasoning: "Fallback: Contains word problem keywords"
        };
      }
      if (questionText.includes('multiply') || questionText.includes('multiplication')) {
        return {
          skill: "Word problem; multiplication",
          confidence: 0.6,
          reasoning: "Fallback: Contains multiplication keywords"
        };
      }
    }
    
    // Default fallback
    return {
      skill: availableSkills[0],
      confidence: 0.3,
      reasoning: "Fallback: Default categorization due to analysis failure"
    };
  }

  async categorizeAssessmentAnswers(
    answers: AssessmentResultAnswer[],
    questions: Question[],
    subject: Subject
  ): Promise<{ correct: string[], incorrect: string[] }> {
    const categorizedSkills = new Set<string>();
    const correctSkills: string[] = [];
    const incorrectSkills: string[] = [];

    // Process each answer
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      try {
        const skillResult = await this.categorizeQuestion(question, subject);
        
        // Avoid duplicate skills
        if (!categorizedSkills.has(skillResult.skill)) {
          categorizedSkills.add(skillResult.skill);
          
          if (answer.isCorrect) {
            correctSkills.push(skillResult.skill);
          } else {
            incorrectSkills.push(skillResult.skill);
          }
        }
      } catch (error) {
        console.error('Error categorizing answer:', error);
      }
    }

    return { correct: correctSkills, incorrect: incorrectSkills };
  }
}

// Singleton instance
export const skillCategorizer = new SkillCategorizer();