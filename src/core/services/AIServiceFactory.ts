// AI Service Factory Pattern for different AI providers

export interface AIRequest {
    userQuery : string;
    context : {
        currentStep: string;
        stepDescription: string;
        algorithmType: string;
        variables: Array < {
            name: string;
            value: any;
            description: string;
        } >;
        problemData: {
            title: string;
            description: string;
            aim: string;
        };
    };
}

export interface AIResponse {
    response : string;
    success : boolean;
    error?: string;
}

export interface AIService {
    generateResponse(request : AIRequest) : Promise < AIResponse >;
    isAvailable() : Promise < boolean >;
    testConnection
        ? ()
        : Promise < string >; // Optional test method
}

// Ollama Local Service Implementation
class OllamaAIService implements AIService {
    private baseUrl : string;
    private model : string;

    constructor(baseUrl = 'http://localhost:11434', model = 'llama3') {
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async isAvailable() : Promise < boolean > {
        try {
            console.log('Checking Ollama availability at:', this.baseUrl);
            const response = await fetch(`${this.baseUrl}/api/tags`);
            console.log('Ollama response status:', response.status);
            return response.ok;
        } catch (error) {
            console.warn('Ollama not available:', error);
            return false;
        }
    }

    async generateResponse(request : AIRequest) : Promise < AIResponse > {
        try {
            const prompt = this.buildPrompt(request);
            console.log('Sending request to Ollama with prompt length:', prompt.length);

            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors', // Handle CORS for local development
                body: JSON.stringify({
                    model: this.model, prompt: prompt, stream: false, // Disable streaming for now to ensure basic connectivity
                    options: {
                        temperature: 0.7,
                        top_p: 0.9,
                        num_predict: 300 // Limit response length
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            // Handle non-streaming response
            const data = await response.json();
            console.log('Ollama response received:', data);

            return {
                response: data.response || 'No response generated',
                success: true
            };
        } catch (error) {
            console.error('Ollama service error:', error);
            return {
                response: '',
                success: false,
                error: error instanceof Error
                    ? error.message
                    : 'Unknown error'
            };
        }
    }

    async testConnection() : Promise < string > {
        try {
            console.log('Testing Ollama connection...');
            const testRequest : AIRequest = {
                userQuery: "Hello, can you help me?",
                context: {
                    currentStep: "Test Step",
                    stepDescription: "Testing connection",
                    algorithmType: "Test Algorithm",
                    variables: [],
                    problemData: {
                        title: "Test Problem",
                        description: "Testing Ollama connection",
                        aim: "Verify connectivity"
                    }
                }
            };

            const response = await this.generateResponse(testRequest);
            return response.success
                ? `✅ Ollama connected: ${response
                    .response
                    .substring(0, 50)}...`
                : `❌ Ollama error: ${response.error}`;
        } catch (error) {
            return `❌ Connection failed: ${error}`;
        }
    }

    private buildPrompt(request : AIRequest) : string {
        const {userQuery, context} = request;

        return `You are an expert DSA (Data Structures and Algorithms) tutor helping a student understand algorithms step by step.

CURRENT CONTEXT:
- Algorithm: ${context
            .algorithmType}
- Problem: ${context
            .problemData
            .title}
- Problem Description: ${context
            .problemData
            .description}
- Current Step: ${context
            .currentStep}
- Step Description: ${context
            .stepDescription}

CURRENT VARIABLES:
${context
            .variables
            .map(v => `- ${v.name}: ${v.value} (${v.description})`)
            .join('\n')}

STUDENT QUESTION: "${userQuery}"

Please provide a clear, concise explanation that:
1. Directly answers the student's question
2. Relates to the current step and algorithm state
3. Uses simple language and examples
4. Helps build intuition, not just facts
5. Keep response under 150 words

Response:`;
    }
}

// Future API Service Implementation (placeholder)
class APIAIService implements AIService {
    private apiKey : string;
    private baseUrl : string;

    constructor(apiKey : string, baseUrl = 'https://api.example.com') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async isAvailable() : Promise < boolean > {
        // Check API availability
        return false; // Placeholder - implement when ready
    }

    async generateResponse(request : AIRequest) : Promise < AIResponse > {
        // Future API implementation
        return {response: 'API service not implemented yet', success: false, error: 'API service not available'};
    }
}

// Mock Service for Development/Testing
class MockAIService implements AIService {
    async isAvailable() : Promise < boolean > {
        return true;
    }

    async generateResponse(request : AIRequest) : Promise < AIResponse > {
        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 1500));

        const responses = [
            `Great question! In this step, we're ${request
                .context
                .currentStep
                .toLowerCase()}. The key insight is that the sliding window technique helps us avoid recalculating the sum for overlapping elements.`,
            `I see you're asking about "${request.userQuery}". This relates to how we maintain our window efficiently. Think of it like a moving frame that slides across the array.`,
            `Excellent observation! The variables you see (${request
                .context
                .variables
                .map(v => v.name)
                .join(', ')}) work together to track our progress through the algorithm systematically.`
        ];

        return {
            response: responses[Math.floor(Math.random() * responses.length)],
            success: true
        };
    }
}

// AI Service Factory
export class AIServiceFactory {
    private static instance : AIService | null = null;

    public static async createAIService() : Promise < AIService > {
        if(this.instance) {
            console.log('Returning existing AI service instance');
            return this.instance;
        }

        console.log('Creating new AI service...');

        // Try Ollama first (local development)
        const ollamaService = new OllamaAIService();
        const isOllamaAvailable = await ollamaService.isAvailable();

        if (isOllamaAvailable) {
            console.log('✅ Using Ollama AI service (llama3 model)');
            this.instance = ollamaService;
            return ollamaService;
        }

        // Fall back to mock service
        console.log('⚠️ Ollama not available, using Mock AI service');
        this.instance = new MockAIService();
        return this.instance;
    }

    public static setAIService(service : AIService) : void {
        this.instance = service;
    }

    public static async getAIService() : Promise < AIService > {
        if(!this.instance) {
            return await this.createAIService();
        }
        return this.instance;
    }
}

export default AIServiceFactory;
