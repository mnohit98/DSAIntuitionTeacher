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
        negativeQueue: initialState.negativeQueue || [],
        result: initialState.result || [],
        currentWindow: initialState.currentWindow || []
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
      
      console.log(`Step ${currentStep.stepId} completed. Current step index: ${this.currentState.currentStep}, Total steps: ${this.currentState.totalSteps}, Is last step: ${isStepComplete}`);
      
      if (!isStepComplete) {
        this.currentState.currentStep++;
        this.currentState.uiState = nextState;
        console.log(`Moved to step ${this.currentState.currentStep + 1}`);
      } else {
        this.currentState.isCompleted = true;
        console.log('Playground completed!');
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

    console.log(`Validating action: ${action}, elementIndex: ${elementIndex}, step: ${step.stepId}, expectedAction: ${step.expectedAction}, expectedElementIndex: ${step.expectedElementIndex}`);

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
        const isValid = action === 'slide_window' && 
               (Array.isArray(step.expectedElementIndex)
                 ? step.expectedElementIndex.includes(elementIndex as number)
                 : elementIndex === step.expectedElementIndex);
        console.log(`Slide window validation: action=${action}, elementIndex=${elementIndex}, expectedElementIndex=${step.expectedElementIndex}, isValid=${isValid}`);
        return isValid;
      
      case 'complete_algorithm':
        return action === 'complete_algorithm' && 
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
