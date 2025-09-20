import { BaseEngine, EngineResult, PlaygroundState, PlaygroundStep, UIState } from './BaseEngine';

export class AdvancedEngine extends BaseEngine {
  protected initializeState(): PlaygroundState {
    const initialState = this.problemData.playground.initialState;
    return {
      currentStep: 0,
      totalSteps: this.problemData.playground.steps?.length || 0,
      uiState: {
        arrayElements: initialState.array?.map((value: number, index: number) => ({
          value,
          state: 'not_yet_reached' as const,
          index
        })) || [],
        stringElements: initialState.stringElements || [],
        windowStart: null,
        windowEnd: null,
        windowSum: initialState.windowSum || 0,
        maxSum: initialState.maxSum || 0,
        minLength: initialState.minLength || Infinity,
        maxLength: initialState.maxLength || 0,
        currentLength: initialState.currentLength || 0,
        targetSum: initialState.targetSum || 0,
        distinctCount: initialState.distinctCount || 0,
        maxDistinct: initialState.maxDistinct || 0,
        highlightedElements: [],
        // Advanced sliding window fields
        windowSize: initialState.windowSize || 0,
        isValidWindow: initialState.isValidWindow || false,
        bestWindow: initialState.bestWindow || null,
        // Character-based problems
        charCount: initialState.charCount || {},
        uniqueChars: initialState.uniqueChars || 0,
        repeatingChars: initialState.repeatingChars || 0,
        distinctChars: initialState.distinctChars || 0,
        // Advanced problem types
        charFrequency: initialState.charFrequency || {},
        maxRepeatLetterCount: initialState.maxRepeatLetterCount || 0,
        onesCount: initialState.onesCount || 0,
        prefixSum: initialState.prefixSum || 0,
        count: initialState.count || 0,
        prefixCount: initialState.prefixCount || {},
        currentIndex: initialState.currentIndex || 0,
        // String problems
        // Binary transformation
        binaryArray: initialState.binaryArray || [],
        // Advanced specific fields
        targetString: initialState.targetString || '',
        pattern: initialState.pattern || '',
        anagramCount: initialState.anagramCount || 0,
        minWindow: initialState.minWindow || '',
        product: initialState.product || 1,
        targetProduct: initialState.targetProduct || 0,
        validSubarrays: initialState.validSubarrays || 0,
        // Hash map for character counting
        charMap: initialState.charMap || {},
        // Two pointer specific
        left: initialState.left || 0,
        right: initialState.right || 0,
        // Permutation specific
        patternFreq: initialState.patternFreq || {},
        windowFreq: initialState.windowFreq || {},
        matches: initialState.matches || 0,
        requiredMatches: initialState.requiredMatches || 0
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
      const isStepComplete = this.currentState.currentStep === this.currentState.totalSteps - 1;
      
      console.log(`Step ${currentStep.stepId} completed. Current step index: ${this.currentState.currentStep}, Total steps: ${this.currentState.totalSteps}, Is last step: ${isStepComplete}`);
      
      if (!isStepComplete) {
        this.currentState.currentStep++;
        this.currentState.uiState = nextState;
        console.log(`Moved to step ${this.currentState.currentStep + 1}`);
      } else {
        this.currentState.isCompleted = true;
        console.log('Playground completed!');
      }

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

    console.log(`Validating action: ${action}, elementIndex: ${elementIndex}, step: ${step.stepId}, expectedAction: ${step.expectedAction}, expectedElementIndex: ${step.expectedElementIndex}`);

    switch (step.expectedAction) {
      case 'click_initialize':
        return action === 'click_initialize';
      
      case 'expand_window':
        return action === 'expand_window' && 
               elementIndex === step.expectedElementIndex;
      
      case 'contract_window':
        return action === 'contract_window' && 
               elementIndex === step.expectedElementIndex;
      
      case 'slide_window':
        return action === 'slide_window' && 
               elementIndex === step.expectedElementIndex;
      
      case 'update_best':
        return action === 'update_best' && 
               elementIndex === step.expectedElementIndex;
      
      case 'complete_algorithm':
        return action === 'complete_algorithm' && 
               elementIndex === step.expectedElementIndex;
      
      case 'process_element':
        return action === 'process_element' && 
               elementIndex === step.expectedElementIndex;
      
      case 'transform_array':
        return action === 'transform_array' && 
               elementIndex === step.expectedElementIndex;
      
      // Advanced action types
      case 'update_char_count':
        return action === 'update_char_count' && 
               elementIndex === step.expectedElementIndex;
      
      case 'check_anagram':
        return action === 'check_anagram' && 
               elementIndex === step.expectedElementIndex;
      
      case 'update_min_window':
        return action === 'update_min_window' && 
               elementIndex === step.expectedElementIndex;
      
      case 'calculate_product':
        return action === 'calculate_product' && 
               elementIndex === step.expectedElementIndex;
      
      case 'update_pattern_freq':
        return action === 'update_pattern_freq' && 
               elementIndex === step.expectedElementIndex;
      
      case 'slide_two_pointers':
        return action === 'slide_two_pointers' && 
               elementIndex === step.expectedElementIndex;
      
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
}
