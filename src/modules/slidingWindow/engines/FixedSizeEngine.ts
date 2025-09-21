import { BaseEngine, EngineResult, PlaygroundState, PlaygroundStep, UIState } from './BaseEngine';

export class FixedSizeEngine extends BaseEngine {
  protected initializeState(): PlaygroundState {
    const initialState = this.problemData.playground.initialState;
    return {
      currentStep: 0,
      totalSteps: this.problemData.playground.steps.length,
      uiState: {
        arrayElements: initialState.array.map((value: number, index: number) => ({
          value,
          state: 'not_yet_reached' as const,
          index
        })),
        windowStart: null,
        windowEnd: null,
        windowSum: initialState.windowSum || 0,
        maxSum: initialState.maxSum || 0,
        highlightedElements: [],
      },
      isCompleted: false,
      userActions: []
    };
  }

  public getCurrentStep(): PlaygroundStep {
    return this.problemData.playground.steps[this.currentState.currentStep];
  }

  public processUserAction(action: string, elementIndex?: number): EngineResult {
    const currentStep = this.getCurrentStep();
    const isCorrect = this.validateAction(action, elementIndex, currentStep);
    
    const userAction = {
      stepId: currentStep.stepId,
      action,
      timestamp: new Date(),
      isCorrect,
      feedback: isCorrect ? "Correct!" : "Try again!",
    };

    this.currentState.userActions.push(userAction);

    if (isCorrect) {
      const nextState = this.getNextState(currentStep);
      // Check if this is the last step BEFORE incrementing
      const isStepComplete = this.currentState.currentStep === this.currentState.totalSteps - 1;
      
      if (!isStepComplete) {
        this.currentState.currentStep++;
        this.currentState.uiState = nextState;
      } else {
        // Handle completion
        if (currentStep.expectedAction === 'complete_algorithm') {
          this.currentState.isCompleted = true;
          // Set the algorithm steps message for completion
          this.currentState.uiState.algorithmStepsMessage = this.getAlgorithmStepsMessage();
          // Set complexity analysis for code panel
          this.currentState.uiState.complexityAnalysis = this.getComplexityAnalysis();
        } else {
          this.currentState.isCompleted = true;
        }
        // Don't update uiState for the last step - keep current state
      }

      // Return success feedback - the playground will automatically show next step's guidance
      return {
        success: true,
        feedback: "Great job! Action completed successfully.",
        nextState: isStepComplete ? undefined : nextState,
        isStepComplete
      };
    } else {
      return {
        success: false,
        feedback: this.getHint(currentStep),
        isStepComplete: false
      };
    }
  }

  private validateAction(action: string, elementIndex?: number, step?: PlaygroundStep): boolean {
    if (!step) return false;

    switch (step.expectedAction) {
      case 'click_initialize':
        return action === 'click_initialize';
      
      case 'add_element_to_window':
        return action === 'add_element_to_window' && 
               (Array.isArray(step.expectedElementIndex)
                 ? step.expectedElementIndex.includes(elementIndex as number)
                 : elementIndex === step.expectedElementIndex);
      
      case 'complete_first_window':
        return action === 'complete_first_window' && 
               (Array.isArray(step.expectedElementIndex)
                 ? step.expectedElementIndex.includes(elementIndex as number)
                 : elementIndex === step.expectedElementIndex);
      
      case 'slide_window':
        return action === 'slide_window' && 
               (Array.isArray(step.expectedElementIndex)
                 ? step.expectedElementIndex.includes(elementIndex as number)
                 : elementIndex === step.expectedElementIndex);
      
      case 'complete_algorithm':
        return action === 'complete_algorithm';
      
      default:
        return false;
    }
  }

  private getNextState(currentStep: PlaygroundStep): UIState {
    return currentStep.uiState;
  }

  private getHint(step: PlaygroundStep): string {
    return `Hint: ${step.description}. ${step.codeHint}`;
  }

  private getAlgorithmStepsMessage(): string {
    const walkthrough = this.problemData.solution?.optimal?.walkthrough || [];
    if (walkthrough.length === 0) {
      return "✅ Algorithm completed successfully!";
    }

    const stepsText = walkthrough.map((step: string, index: number) =>
      `**Step ${index + 1}:** ${step}`
    ).join('\n\n');

    return `${stepsText}\n\n`;
  }

  private getComplexityAnalysis(): string {
    // Try to get structured complexity analysis from the new complexityAnalysis key
    const complexityAnalysis = this.problemData.complexityAnalysis;
    if (complexityAnalysis) {
      return this.formatStructuredComplexityAnalysis(complexityAnalysis);
    }

    // Fallback to last step's codeExplanation
    const lastStep = this.problemData.playground?.steps[this.problemData.playground.steps.length - 1];
    if (lastStep?.codeExplanation) {
      return this.formatComplexityAnalysis(lastStep.codeExplanation);
    }

    // Final fallback to solution data
    const solution = this.problemData.solution?.optimal;
    if (!solution) {
      return "// Complexity analysis not available";
    }

    const timeComplexity = solution.timeComplexity || "Not specified";
    const spaceComplexity = solution.spaceComplexity || "Not specified";
    const idea = solution.idea || "";

    return `COMPLEXITY ANALYSIS

**Time Complexity: ${timeComplexity}**
${this.getTimeComplexityExplanation(timeComplexity)}

**Space Complexity: ${spaceComplexity}**
${this.getSpaceComplexityExplanation(spaceComplexity)}

Algorithm Insight:
${idea}`;
  }

  private formatStructuredComplexityAnalysis(analysis: any): string {
    const title = analysis.title || "🚀 COMPLEXITY ANALYSIS";
    const overview = analysis.overview || "";
    const timeComplexity = analysis.timeComplexity || {};
    const spaceComplexity = analysis.spaceComplexity || {};
    const whyItMatters = analysis.whyItMatters || "";

    return `COMPLEXITY ANALYSIS

${overview}

**Time Complexity: ${timeComplexity.value || "Not specified"}**
${timeComplexity.explanation || ""}

**Space Complexity: ${spaceComplexity.value || "Not specified"}**
${spaceComplexity.explanation || ""}

Algorithm Insight:
${analysis.idea || timeComplexity.explanation || ""}

Why This Matters:
${whyItMatters}`;
  }

  private formatComplexityAnalysis(codeExplanation: string): string {
    // Extract and enhance the existing complexity analysis from codeExplanation
    return `COMPLEXITY ANALYSIS

${codeExplanation}`;
  }

  private getTimeComplexityExplanation(tc: string): string {
    switch (tc) {
      case "O(n)":
        return "We traverse the array exactly once, visiting each element only once during our sliding window traversal.";
      case "O(n²)":
        return "We have nested loops or operations that scale quadratically with input size.";
      case "O(log n)":
        return "We use divide-and-conquer or binary search techniques that halve the problem size.";
      default:
        return "Linear time complexity - efficient single-pass algorithm.";
    }
  }

  private getSpaceComplexityExplanation(sc: string): string {
    switch (sc) {
      case "O(1)":
        return "We only use a constant amount of extra variables (windowSum, maxSum, pointers) regardless of input size.";
      case "O(n)":
        return "We use additional space that grows linearly with the input size.";
      case "O(log n)":
        return "We use space proportional to the logarithm of the input size, often due to recursion stack.";
      default:
        return "Constant space complexity - memory efficient approach.";
    }
  }
}
