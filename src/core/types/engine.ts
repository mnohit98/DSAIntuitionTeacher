// Standardized engine interface that all modules must implement
export interface StandardEngine {
  // Core engine methods
  getCurrentState(): EngineState;
  getCurrentStep(): StepData;
  processUserAction(action: string, data?: any): ActionResult;
  reset(): void;
  
  // Data extraction methods (JSON-driven)
  getVariables(): Variable[];
  getStepDescription(): string;
  getJarvisMessage(): string;
  getCodeHint(): string | null;
  getCodeSnippet?(): string | null;
  getCodeExplanation?(): string | null;
  isCompleted(): boolean;
}

export interface EngineState {
  currentStep: number;
  totalSteps: number;
  uiState: any; // Module-specific UI state
  isCompleted: boolean;
}

export interface StepData {
  stepId: number;
  description: string;
  jarvisMessage: string;
  expectedAction: string;
  codeHint?: string;
  hideIndexHint?: boolean;
  expectedElementIndex?: number | number[];
}

export interface ActionResult {
  success: boolean;
  feedback: string;
  nextState?: any;
  completed?: boolean;
}

export interface Variable {
  name: string;
  value: any;
  description: string;
  type?: 'number' | 'string' | 'boolean' | 'object' | 'array';
}

// JSON-driven configuration interfaces
export interface ModuleConfiguration {
  id: string;
  name: string;
  description: string;
  
  // UI Configuration (from JSON)
  ui: {
    header: {
      title: string;
      subtitle?: string;
    };
    chat: {
      initialMessage: string;
      aiAssistantEnabled: boolean;
    };
    sidebar: {
      enabled: boolean;
      sections: SidebarSectionConfig[];
    };
    legend?: {
      enabled: boolean;
      items: LegendItemConfig[];
    };
    stepTracking: {
      enabled: boolean;
      showProgress: boolean;
    };
  };
  
  // Engine Configuration
  engine: {
    type: string; // e.g., 'sliding-window', 'topological-sort'
    variableExtractors: VariableExtractorConfig[];
  };
}

export interface SidebarSectionConfig {
  id: string;
  title: string;
  type: 'currentStep' | 'variables' | 'codeHint' | 'custom';
  icon: string;
  enabled: boolean;
}

export interface LegendItemConfig {
  color: string;
  borderColor: string;
  label: string;
  icon: string;
}

export interface VariableExtractorConfig {
  name: string;
  path: string; // JSONPath to extract from uiState
  description: string;
  type: 'number' | 'string' | 'boolean' | 'object' | 'array';
  formatter?: string; // Optional formatter function name
}
