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
  windowSum?: number;
  maxSum?: number;
  result?: number[];
  negativeQueue?: number[];
  k?: number;
  // Variable-size window specific properties
  targetSum?: number;
  minLength?: number;
  currentSum?: number;
  highlightedElements: number[];
  algorithmStepsMessage?: string;
  complexityAnalysis?: string;
  // Advanced string/frequency problems (p8, p9)
  maxFreq?: number;
  freqMapStr?: string;
  maxSize?: number;
  // p9 specific display fields
  targetMapStr?: string;
  windowMapStr?: string;
  matches?: string;
  statusText?: string;
  // optional pretty row for s1 pattern display
  patternDisplay?: string;
  // p11 substring concatenation specific
  foundIndices?: number[];
  stepAction?: string;
  currentWindowStr?: string;
  currentChunks?: string;
  valid?: boolean | string;
}

export interface ArrayElement {
  value: string | number;
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
