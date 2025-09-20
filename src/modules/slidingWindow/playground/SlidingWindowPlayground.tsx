import React, { useState } from 'react';
import { Platform } from 'react-native';
import { ConfigService, PlaygroundContainer } from '../../../core';
import { StandardEngine } from '../../../core/types/engine';
import AlgorithmState from '../../../core/ui/AlgorithmState';
import CompletionScreen from '../../../core/ui/CompletionScreen';
import DataVisualizer from '../components/DataVisualizer';
import { EngineFactory } from '../engines/EngineFactory';

interface Props {
  problemData: any;
}

// Adapter to make existing engine compatible with StandardEngine interface
class SlidingWindowEngineAdapter implements StandardEngine {
  private engine: any;
  private configService: ConfigService;
  private problemData: any;

  constructor(engine: any, problemData: any) {
    this.engine = engine;
    this.problemData = problemData;
    this.configService = ConfigService.getInstance();
  }

  getCurrentState() {
    const state = this.engine.getCurrentState();
    return {
      currentStep: state.currentStep || 0,
      totalSteps: state.totalSteps || 1,
      uiState: state.uiState,
      isCompleted: state.isCompleted || false
    };
  }

  getCurrentStep() {
    return this.engine.getCurrentStep();
  }

  processUserAction(action: string, data?: any) {
    return this.engine.processUserAction(action, data);
  }

  reset() {
    this.engine.reset();
  }

  getVariables() {
    const state = this.getCurrentState();
    return this.configService.extractVariablesFromState('sliding-window', state, this.problemData);
  }

  getStepDescription() {
    const step = this.getCurrentStep();
    return step.description || 'Continue with the algorithm';
  }

  getJarvisMessage() {
    const step = this.getCurrentStep();
    return step.jarvisMessage || 'Let\'s continue with the next step!';
  }

  getCodeHint() {
    const step = this.getCurrentStep();
    return step.codeHint || null;
  }

  getCodeSnippet() {
    const step = this.getCurrentStep();
    return step.codeSnippet || null;
  }

  getCodeExplanation() {
    const step = this.getCurrentStep();
    return step.codeExplanation || null;
  }

  isCompleted() {
    const state = this.engine.getCurrentState();
    return state.isCompleted || false;
  }
}

export default function SlidingWindowPlayground({ problemData }: Props) {
  // Get module configuration from JSON
  const configService = ConfigService.getInstance();
  const moduleConfig = configService.getModuleConfiguration('sliding-window');
  
  if (!moduleConfig) {
    return <div>Module configuration not found</div>;
  }

  // Create engine instance and wrap it with adapter
  const [originalEngine] = useState(() => EngineFactory.createEngine(problemData.submoduleId, problemData));
  const [engine, setEngine] = useState(() => new SlidingWindowEngineAdapter(originalEngine, problemData));
  const [currentState, setCurrentState] = useState(originalEngine.getCurrentState());
  const [forceUpdate, setForceUpdate] = useState(0);

  // Handle user actions from the visualization component
  const handleUserAction = (action: string, data?: any) => {
    
    if (action === 'click_element' && typeof data === 'number') {
      // Get current step to determine what action to send to engine
      const currentStep = originalEngine.getCurrentStep();
      const expectedAction = currentStep?.expectedAction;
      
      // Map click_element to the expected action based on current step
      let engineAction = expectedAction;
      if (expectedAction === 'add_element_to_window' || 
          expectedAction === 'complete_first_window' || 
          expectedAction === 'slide_window' ||
          expectedAction === 'expand_window' ||
          expectedAction === 'contract_window' ||
          expectedAction === 'process_element') {
        engineAction = expectedAction;
      } else {
        engineAction = 'click_element';
      }
      
      const result = originalEngine.processUserAction(engineAction, data);
      
      if (result.success && result.nextState) {
        // Get the updated state from the engine after processing
        const updatedEngineState = originalEngine.getCurrentState();
        setCurrentState(updatedEngineState);
        
        // Force re-render to update UI immediately
        setForceUpdate(prev => prev + 1);
        
        // Create new engine adapter to trigger PlaygroundContainer update
        const newAdapter = new SlidingWindowEngineAdapter(originalEngine, problemData);
        setEngine(newAdapter);
      } else {
        console.log('Action failed:', result.feedback);
      }
    } else {
      // Handle other actions (including complete_algorithm)
      console.log('Processing other action:', action);
      const result = originalEngine.processUserAction(action, data);
      console.log('Other action result:', result);
      
      if (result.success) {
        // Get the updated state from the engine after processing
        const updatedEngineState = originalEngine.getCurrentState();
        console.log('Updated engine state after other action:', updatedEngineState);
        setCurrentState(updatedEngineState);
        
        // Force re-render to update UI immediately
        setForceUpdate(prev => prev + 1);
        
        // Create new engine adapter to trigger PlaygroundContainer update
        const newAdapter = new SlidingWindowEngineAdapter(originalEngine, problemData);
        setEngine(newAdapter);
      } else {
        console.log('Action failed:', result.feedback);
      }
    }
  };

  // Use current state for UI consistency with React rendering
  const step = originalEngine.getCurrentStep();
  
  // Determine if we should show string visualizer
  const shouldShowStringVisualizer = problemData.problemId === 'p9' || problemData.problemId === 'p11';
  const elements = shouldShowStringVisualizer 
    ? currentState.uiState.stringElements || []
    : currentState.uiState.arrayElements || [];

  const expectedIndex = !step.hideIndexHint
    ? (Array.isArray(step.expectedElementIndex)
        ? step.expectedElementIndex[0]
        : step.expectedElementIndex)
    : undefined;

  // Check if we should show Initialize button based on current step
  const showInitializeButton = step?.expectedAction === 'click_initialize';
  
  // Check if we should show Complete Algorithm button
  const showCompleteButton = step?.expectedAction === 'complete_algorithm';
  
  // Check if problem is completed - use currentState for consistency
  const isCompleted = currentState.isCompleted;
  console.log('Playground render - isCompleted:', isCompleted, 'currentStep:', currentState.currentStep);

  // Navigation handlers for completion
  const handleTryAgain = () => {
    originalEngine.reset();
    const resetState = originalEngine.getCurrentState();
    setCurrentState(resetState);
    setForceUpdate(prev => prev + 1);
    const newAdapter = new SlidingWindowEngineAdapter(originalEngine, problemData);
    setEngine(newAdapter);
  };

  // Custom reset handler for the reset button - same as try again
  const handleCustomReset = () => {
    originalEngine.reset();
    const resetState = originalEngine.getCurrentState();
    setCurrentState(resetState);
    setForceUpdate(prev => prev + 1);
    const newAdapter = new SlidingWindowEngineAdapter(originalEngine, problemData);
    setEngine(newAdapter);
    console.log('SlidingWindowPlayground reset to initial state:', resetState);
  };

  const handleNextProblem = () => {
    if (Platform.OS === 'web') {
      window.location.href = `/module/${problemData.moduleId}`;
    }
  };

  const handleNextModule = () => {
    if (Platform.OS === 'web') {
      window.location.href = '/home';
    }
  };

  return (
    <PlaygroundContainer
      problemData={problemData}
      moduleConfig={moduleConfig}
      engine={engine}
      onReset={handleCustomReset}
    >
      {/* Module-specific visualization */}
      {isCompleted ? (
        // Show completion screen in middle section only
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          padding: '20px'
        }}>
          <CompletionScreen
            problemData={problemData}
            onTryAgain={handleTryAgain}
            onNextProblem={handleNextProblem}
            onNextModule={handleNextModule}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Main Data Visualizer */}
          <DataVisualizer 
            uiState={{
              ...currentState.uiState,
              arrayElements: elements,
              windowStart: currentState.uiState.windowStart ?? undefined,
              windowEnd: currentState.uiState.windowEnd ?? undefined
            }}
            onElementPress={(index: number) => handleUserAction('click_element', index)}
            expectedIndex={expectedIndex}
            showInitializeButton={showInitializeButton}
            onInitializePress={() => handleUserAction('click_initialize')}
            showCompleteButton={showCompleteButton}
            onCompletePress={() => handleUserAction('complete_algorithm', undefined)}
          />
          
          {/* Algorithm State - Below Array */}
          <AlgorithmState 
            variables={engine.getVariables()}
            title="Algorithm State"
          />
          
          {/* Window Info */}
          {currentState.uiState.highlightedElements && currentState.uiState.highlightedElements.length > 0 && (
            <div style={{
              backgroundColor: '#111720',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #1E2632',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', color: '#29D3FF', fontWeight: '600' }}>
                📍 Current Window: [{currentState.uiState.highlightedElements.map((i: number) => elements[i]?.value).join(', ')}]
              </div>
              <div style={{ fontSize: '12px', color: '#B4BCC8', marginTop: '4px' }}>
                📏 Size: {currentState.uiState.highlightedElements.length}
              </div>
            </div>
          )}
        </div>
      )}
    </PlaygroundContainer>
  );
}
