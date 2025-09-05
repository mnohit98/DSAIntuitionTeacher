interface AIContext {
  problemTitle: string;
  problemDescription: string;
  currentStep: string;
  expectedAction: string;
  currentState: any;
  userAction?: string;
  codeSnippet?: string;
  variables: Array<{
    name: string;
    value: any;
    description: string;
  }>;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface AIResponse {
  explanation: string;
  codeExplanation?: string;
  intuition: string;
  nextSteps?: string;
}

class AIService {
  private baseURL = 'http://localhost:11434'; // Default Ollama URL
  private model = 'llama3.2'; // Default model, can be changed

  async generateExplanation(context: AIContext): Promise<AIResponse> {
    try {
      const prompt = this.buildPrompt(context);
      
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 1000,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAIResponse(data.response);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(context);
    }
  }

  private buildPrompt(context: AIContext): string {
    const levelInstructions = {
      beginner: "Explain in simple terms, use analogies, focus on the 'why' behind each step",
      intermediate: "Provide technical details with context, explain the algorithm logic",
      advanced: "Focus on optimization, edge cases, and advanced concepts"
    };

    return `You are an expert DSA tutor helping a ${context.userLevel} programmer understand sliding window algorithms.

CONTEXT:
- Problem: ${context.problemTitle}
- Description: ${context.problemDescription}
- Current Step: ${context.currentStep}
- Expected Action: ${context.expectedAction}
- User Action: ${context.userAction || 'No specific action yet'}
- Current Variables: ${JSON.stringify(context.variables)}

INSTRUCTIONS:
${levelInstructions[context.userLevel]}

Provide a response in this JSON format:
{
  "explanation": "Clear explanation of what's happening and why",
  "codeExplanation": "Explanation of the code logic if applicable",
  "intuition": "The key insight or intuition behind this step",
  "nextSteps": "What the user should do next"
}

Focus on building intuition from the user's current action and state. Make it engaging and educational.`;
  }

  private parseAIResponse(response: string): AIResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
    }

    // Fallback: treat the entire response as explanation
    return {
      explanation: response,
      intuition: "The AI is helping you understand this step better.",
      nextSteps: "Continue with the algorithm to see more insights."
    };
  }

  private getFallbackResponse(context: AIContext): AIResponse {
    const levelResponses = {
      beginner: {
        explanation: `Let's break down what's happening in this ${context.problemTitle} problem. You're learning the sliding window technique, which is like looking through a moving window to find the best solution.`,
        intuition: "Think of it like looking through a camera lens that moves across your data to find the perfect shot.",
        nextSteps: "Try the next action to see how the window moves and what changes."
      },
      intermediate: {
        explanation: `In this step of ${context.problemTitle}, you're ${context.currentStep}. This is a key part of the sliding window algorithm where we maintain our window properties efficiently.`,
        intuition: "The sliding window technique optimizes by reusing previous calculations instead of recalculating everything.",
        nextSteps: "Observe how the variables change and how this affects the overall algorithm performance."
      },
      advanced: {
        explanation: `This step demonstrates the core optimization principle of sliding window algorithms. You're ${context.currentStep}, which maintains O(n) time complexity.`,
        intuition: "The key insight is maintaining invariant properties while sliding the window, avoiding redundant computations.",
        nextSteps: "Consider edge cases and how this approach scales with different input sizes."
      }
    };

    return levelResponses[context.userLevel];
  }

  // Method to set custom model
  setModel(model: string) {
    this.model = model;
  }

  // Method to set custom Ollama URL
  setBaseURL(url: string) {
    this.baseURL = url;
  }
}

export default new AIService();
export type { AIContext, AIResponse };
