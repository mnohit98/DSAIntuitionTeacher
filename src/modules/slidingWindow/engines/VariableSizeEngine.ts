import { BaseEngine, EngineResult, PlaygroundState, PlaygroundStep, UIState } from './BaseEngine';

export class VariableSizeEngine extends BaseEngine {
  protected initializeState(): PlaygroundState {
    const initialState = this.problemData.playground.initialState;
    return {
      currentStep: 0,
      totalSteps: this.problemData.playground.steps.length,
      uiState: {
        arrayElements: initialState.array?.map((value: number, index: number) => ({
          value,
          state: 'not_yet_reached' as const,
          index
        })) || initialState.stringElements || [],
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
        // Variable-size specific fields
        windowSize: initialState.windowSize || 0,
        isValidWindow: initialState.isValidWindow || false,
        bestWindow: initialState.bestWindow || null,
        // Character-based problems
        charCount: initialState.charCount || {},
        uniqueChars: initialState.uniqueChars || 0,
        repeatingChars: initialState.repeatingChars || 0,
        distinctChars: initialState.distinctChars || 0,
        // Binary array problems
        zeroCount: initialState.zeroCount || 0,
        // New problem types (p9-p13)
        charFrequency: initialState.charFrequency || {},
        maxRepeatLetterCount: initialState.maxRepeatLetterCount || 0,
        onesCount: initialState.onesCount || 0,
        prefixSum: initialState.prefixSum || 0,
        count: initialState.count || 0,
        prefixCount: initialState.prefixCount || {},
        currentIndex: initialState.currentIndex || 0,
        // String problems
        stringElements: initialState.stringElements || [],
        // Binary transformation
        binaryArray: initialState.binaryArray || []
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
      
      // New action types for p9-p13
      case 'process_element':
        return action === 'process_element' && 
               elementIndex === step.expectedElementIndex;
      
      case 'transform_array':
        return action === 'transform_array' && 
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
