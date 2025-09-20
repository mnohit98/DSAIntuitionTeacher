export interface PlaygroundStep {
  stepId: number;
  description: string;
  expectedAction: string;
  expectedElementIndex?: number | number[];
  expectedRemoveIndex?: number;
  expectedAddIndex?: number;
  uiState: UIState;
  jarvisMessage: string;
  codeHint: string;
  codeBotMessage?: string;
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
  negativeQueue?: number[];
  result?: number[];
  currentWindow?: number[];
  // Variable-size specific fields
  minLength?: number;
  maxLength?: number;
  currentLength?: number;
  targetSum?: number;
  distinctCount?: number;
  maxDistinct?: number;
  windowSize?: number;
  isValidWindow?: boolean;
  bestWindow?: any;
  // Character-based problems
  charCount?: Record<string, number>;
  uniqueChars?: number;
  repeatingChars?: number;
  distinctChars?: number;
  // Binary array problems
  zeroCount?: number;
  // New problem types (p9-p13)
  charFrequency?: Record<string, number>;
  maxRepeatLetterCount?: number;
  onesCount?: number;
  prefixSum?: number;
  count?: number;
  prefixCount?: Record<string, number>;
  currentIndex?: number;
  // String problems
  stringElements?: StringElement[];
  // Binary transformation
  binaryArray?: number[];
  // Advanced engine specific fields
  targetString?: string;
  pattern?: string;
  anagramCount?: number;
  minWindow?: string;
  product?: number;
  targetProduct?: number;
  validSubarrays?: number;
  charMap?: Record<string, number>;
  left?: number;
  right?: number;
  patternFreq?: Record<string, number>;
  windowFreq?: Record<string, number>;
  matches?: number;
  requiredMatches?: number;
}

export interface ArrayElement {
  value: number;
  state: 'not_yet_reached' | 'in_window' | 'out_of_window_past';
  index: number;
}

export interface StringElement {
  value: string;
  state: 'not_yet_reached' | 'in_window' | 'out_of_window_past' | 'processed' | 'transformed';
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
