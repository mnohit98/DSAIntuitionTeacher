export interface PlaygroundStep {
  stepId: number;
  description: string;
  expectedAction: string;
  expectedElementIndex?: number | number[];
  uiState: UIState;
  jarvisMessage: string;
  codeHint: string;
  codeSnippet?: string;
  hideIndexHint?: boolean;
}

export interface UIState {
  arrayElements: ArrayElement[];
  windowStart: number | null;
  windowEnd: number | null;
  windowSum: number;
  maxSum: number;
  highlightedElements: number[];
  algorithmStepsMessage?: string;
  complexityAnalysis?: string;
}

export interface ArrayElement {
  value: number;
  state: 'not_yet_reached' | 'in_window' | 'out_of_window_past';
  index: number;
}


export interface PlaygroundState {
  currentStep: number;
  totalSteps: number;
  uiState: UIState;
  isCompleted: boolean;
  userActions: UserAction[];
}

export interface UserAction {
  stepId: number;
  action: string;
  timestamp: Date;
  isCorrect: boolean;
  feedback: string;
}

export interface EngineResult {
  success: boolean;
  feedback: string;
  nextState?: UIState;
  isStepComplete: boolean;
}

export abstract class BaseEngine {
  protected problemData: any;
  protected currentState: PlaygroundState;

  constructor(problemData: any) {
    this.problemData = problemData;
    this.currentState = this.initializeState();
  }

  protected abstract initializeState(): PlaygroundState;
  
  public abstract getCurrentStep(): PlaygroundStep;
  
  public abstract processUserAction(action: string, elementIndex?: number): EngineResult;

  public getCurrentState(): PlaygroundState {
    return this.currentState;
  }

  public reset(): void {
    this.currentState = this.initializeState();
  }

  public getProgress(): number {
    return (this.currentState.currentStep / this.currentState.totalSteps) * 100;
  }
}
