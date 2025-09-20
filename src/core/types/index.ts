// Generic interfaces for the playground system

export interface GenericPlaygroundConfig {
  moduleId: string;
  moduleName: string;
  description: string;
  // Header configuration
  header: {
    title: string;
    subtitle?: string;
  };
  // Chat configuration
  chat: {
    initialMessage: string;
    aiAssistantEnabled: boolean;
  };
  // Sidebar configuration
  sidebar: {
    enabled: boolean;
    sections: SidebarSection[];
  };
  // Legend configuration
  legend?: {
    enabled: boolean;
    items: LegendItem[];
  };
  // Step tracking
  stepTracking: {
    enabled: boolean;
    totalSteps?: number;
  };
}

export interface SidebarSection {
  id: string;
  title: string;
  type: 'currentStep' | 'codeHint' | 'variables' | 'custom';
  icon?: string;
  content?: any; // Will be populated dynamically
}

export interface LegendItem {
  color: string;
  borderColor: string;
  label: string;
  icon: string;
}

export interface GenericPlaygroundState {
  currentStep: number;
  totalSteps: number;
  jarvisMessage: {
    id: string;
    message: string;
    timestamp: Date;
  } | null;
  variables: Array<{
    name: string;
    value: any;
    description: string;
  }>;
  currentStepDescription: string;
  codeHint?: string;
  isCompleted: boolean;
}

export interface VisualizationComponentProps {
  uiState: any;
  onElementPress?: (index: number) => void;
  onUserAction?: (action: string, data?: any) => void;
  expectedIndex?: number;
  [key: string]: any; // Allow additional props
}
