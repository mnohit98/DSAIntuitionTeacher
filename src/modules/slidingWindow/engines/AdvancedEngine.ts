import { BaseEngine, EngineResult, PlaygroundState, PlaygroundStep, UIState } from './BaseEngine';

// Advanced engine to support complex sliding window interactions (freq maps, constraints, multi-counters)
export class AdvancedEngine extends BaseEngine {
  protected initializeState(): PlaygroundState {
    const initialState = this.problemData.playground.initialState;
    return {
      currentStep: 0,
      totalSteps: this.problemData.playground.steps.length,
      uiState: {
        arrayElements: initialState.array.map((value: any, index: number) => ({
          value,
          state: 'not_yet_reached' as const,
          index
        })),
        windowStart: null,
        windowEnd: null,
        // Common advanced fields; problem JSONs can set them in step uiState
        highlightedElements: [],
        // Optional commonly used counters for advanced problems
        targetSum: initialState.targetSum,
        currentSum: initialState.currentSum || 0,
        minLength: initialState.minLength || undefined,
        k: initialState.k,
        // String/frequency-oriented fields (as display strings)
        freqMapStr: initialState.freqMapStr || '{}',
        // p9: permutation tracking displays
        targetMapStr: initialState.targetMapStr || undefined,
        windowMapStr: initialState.windowMapStr || undefined,
        matches: initialState.matches || undefined,
        statusText: initialState.statusText || undefined,
        patternDisplay: initialState.patternDisplay || undefined,
        maxSize: initialState.maxSize || 0,
        // p11: substring concatenation tracking
        foundIndices: initialState.foundIndices || [],
        // Additional p11 variables
        stepAction: initialState.stepAction || undefined,
        currentWindowStr: initialState.currentWindowStr || undefined,
        currentChunks: initialState.currentChunks || undefined,
        valid: initialState.valid || undefined,
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
      feedback: isCorrect ? 'Correct!' : 'Try again!',
    };

    this.currentState.userActions.push(userAction);

    if (isCorrect) {
      const nextState = this.getNextState(currentStep);
      const isStepComplete = this.currentState.currentStep === this.currentState.totalSteps - 1;

      if (!isStepComplete) {
        this.currentState.currentStep++;
        this.currentState.uiState = nextState;
      } else {
        // Completion handling
        if (currentStep.expectedAction === 'complete_algorithm') {
          this.currentState.isCompleted = true;
          this.currentState.uiState.algorithmStepsMessage = this.getAlgorithmStepsMessage();
          this.currentState.uiState.complexityAnalysis = this.getComplexityAnalysis();
        } else {
          this.currentState.isCompleted = true;
        }
      }

      return {
        success: true,
        feedback: 'Great job! Action completed successfully.',
        nextState: isStepComplete ? undefined : nextState,
        isStepComplete
      };
    }

    return {
      success: false,
      feedback: this.getHint(currentStep),
      isStepComplete: false
    };
  }

  private validateAction(action: string, elementIndex: number | undefined, step: PlaygroundStep | undefined): boolean {
    if (!step) return false;

    switch (step.expectedAction) {
      case 'click_initialize':
        return action === 'click_initialize';
      case 'reinitialize_k_minus_1':
        return action === 'reinitialize_k_minus_1';
      case 'expand_window':
      case 'shrink_window':
      case 'slide_window':
      case 'add_element_to_window':
      case 'complete_first_window':
      case 'update_min_length':
      case 'update_freq':
      case 'check_validity':
        return action === step.expectedAction && (
          step.expectedElementIndex === undefined
            ? true
            : (Array.isArray(step.expectedElementIndex)
                ? (elementIndex !== undefined && step.expectedElementIndex.includes(elementIndex))
                : elementIndex === step.expectedElementIndex)
        );
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
      return '✅ Algorithm completed successfully!';
    }
    const stepsText = walkthrough.map((t: string, i: number) => `**Step ${i + 1}:** ${t}`).join('\n\n');
    return `${stepsText}\n\n`;
  }

  private getComplexityAnalysis(): string {
    const analysis = this.problemData.complexityAnalysis;
    if (analysis) {
      return this.formatStructuredComplexityAnalysis(analysis);
    }

    const lastStep = this.problemData.playground?.steps[this.problemData.playground.steps.length - 1];
    if (lastStep?.codeExplanation) {
      return this.formatComplexityAnalysis(lastStep.codeExplanation);
    }

    const solution = this.problemData.solution?.optimal;
    if (!solution) {
      return '// Complexity analysis not available';
    }

    const timeComplexity = solution.timeComplexity || 'Not specified';
    const spaceComplexity = solution.spaceComplexity || 'Not specified';
    const idea = solution.idea || '';

    return `COMPLEXITY ANALYSIS

**Time Complexity: ${timeComplexity}**
${this.getTimeComplexityExplanation(timeComplexity)}

**Space Complexity: ${spaceComplexity}**
${this.getSpaceComplexityExplanation(spaceComplexity)}

Algorithm Insight:
${idea}`;
  }

  private formatStructuredComplexityAnalysis(analysis: any): string {
    const overview = analysis.overview || '';
    const timeComplexity = analysis.timeComplexity || {};
    const spaceComplexity = analysis.spaceComplexity || {};
    const whyItMatters = analysis.whyItMatters || '';

    return `COMPLEXITY ANALYSIS

${overview}

**Time Complexity: ${timeComplexity.value || 'Not specified'}**
${timeComplexity.explanation || ''}

**Space Complexity: ${spaceComplexity.value || 'Not specified'}**
${spaceComplexity.explanation || ''}

Algorithm Insight:
${analysis.idea || timeComplexity.explanation || ''}

Why This Matters:
${whyItMatters}`;
  }

  private formatComplexityAnalysis(codeExplanation: string): string {
    return `COMPLEXITY ANALYSIS

${codeExplanation}`;
  }

  private getTimeComplexityExplanation(tc: string): string {
    switch (tc) {
      case 'O(n)':
        return 'We maintain counters/maps and move pointers linearly.';
      case 'O(n + m)':
        return 'We process the source string/array once and build a target map.';
      default:
        return 'Linear-time sliding window using maps and two pointers.';
    }
  }

  private getSpaceComplexityExplanation(sc: string): string {
    switch (sc) {
      case 'O(1)':
        return 'Alphabet bounded or constant extra state.';
      case 'O(k)':
      case 'O(m)':
        return 'Frequency maps proportional to unique elements in the window or pattern size.';
      default:
        return 'Small auxiliary maps/queues for constraints.';
    }
  }
}


