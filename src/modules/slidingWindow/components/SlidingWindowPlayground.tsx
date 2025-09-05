import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import AIService, { AIContext } from '../../../services/AIService';
import { EngineFactory } from '../engines/EngineFactory';
import CharacterCountVisualizer from './CharacterCountVisualizer';
import CharacterFrequencyVisualizer from './CharacterFrequencyVisualizer';
import ChatPanel from './ChatPanel';
import CodeHint from './CodeHint';
import CodeViewer from './CodeViewer';
import DataVisualizer from './DataVisualizer';
import OnesCountVisualizer from './OnesCountVisualizer';
import PrefixSumVisualizer from './PrefixSumVisualizer';
import ZeroCountVisualizer from './ZeroCountVisualizer';

interface Props {
  problemData: any;
}

const { width: screenWidth } = Dimensions.get('window');

export default function SlidingWindowPlayground({ problemData }: Props) {
  const { theme } = useTheme();
  console.log('SlidingWindowPlayground rendered'); // Debug log
  
  const [engine] = useState(() => EngineFactory.createEngine(problemData.submoduleId, problemData));
  const [currentState, setCurrentState] = useState(engine.getCurrentState());
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [isFullWindowMode, setIsFullWindowMode] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<{
    jarvis: {
      id: string;
      message: string;
      timestamp: Date;
    } | null;
    codebot: {
      id: string;
      message: string;
      codeSnippet?: string;
      timestamp: Date;
    } | null;
  }>({
    jarvis: null,
    codebot: null
  });

  // AI Assistant state
  const [isAILoading, setIsAILoading] = useState(false);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [blinkNextEnabled, setBlinkNextEnabled] = useState(true);
  const [showCodeView, setShowCodeView] = useState(false);
  const [activeCodeLine, setActiveCodeLine] = useState<number | undefined>(undefined);
  const [generatedCodeExplanation, setGeneratedCodeExplanation] = useState<string>('');

  // Header toggles
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize messages with the first step
  useEffect(() => {
    const step = engine.getCurrentStep();
    
    // Set Jarvis message immediately
    setCurrentMessages({
      jarvis: {
        id: '1',
        message: step.jarvisMessage,
        timestamp: new Date()
      },
      codebot: null
    });
    
    // Add CodeBot message after a short delay for the first step
    if (step.stepId === 1 && step.codeBotMessage) {
      setTimeout(() => {
        setCurrentMessages(prev => ({
          ...prev,
          codebot: {
            id: '2',
            message: step.codeBotMessage || '',
            codeSnippet: step.codeSnippet || '',
            timestamp: new Date()
          }
        }));
      }, 1000);
    }
  }, []); // Only run once on mount

  const handleUserAction = (action: string, elementIndex?: number) => {
    console.log(`User action: ${action}, elementIndex: ${elementIndex}`);
    const result = engine.processUserAction(action, elementIndex);
    
    console.log(`Action result:`, result);
    
    if (result.success) {
      // Update the state first
      setCurrentState(engine.getCurrentState());
      
      if (result.isStepComplete) {
        console.log('Step completed! Showing completion alert');
        Alert.alert(
          "🎉 Congratulations!",
          "You've completed the sliding window walkthrough! You now understand how the algorithm works step by step.",
          [{ text: "Continue", onPress: () => {} }] // Removed onComplete
        );
      } else {
        // Show the next step's guidance message
        if (result.nextState) {
          const nextStep = engine.getCurrentStep();
          console.log(`Next step:`, nextStep);
          
          // Show Jarvis message immediately
          setCurrentMessages(prev => ({
            jarvis: {
              id: Date.now().toString(),
              message: nextStep.jarvisMessage,
              timestamp: new Date()
            },
            codebot: prev.codebot // Keep the last CodeBot message
          }));
          
          // Show CodeBot message after a short delay for conversation effect
          if (nextStep.codeBotMessage) {
            setTimeout(() => {
              setCurrentMessages(prev => ({
                ...prev,
                codebot: {
                  id: (Date.now() + 1).toString(),
                  message: nextStep.codeBotMessage || '',
                  codeSnippet: nextStep.codeSnippet || '',
                  timestamp: new Date()
                }
              }));
            }, 800);
          }
          // If no CodeBot message, keep the previous one (don't clear it)
        } else {
          console.log('No next state available - this should not happen');
          setCurrentMessages(prev => ({
            jarvis: {
              id: Date.now().toString(),
              message: "🎉 Congratulations! You've completed the walkthrough!",
              timestamp: new Date()
            },
            codebot: prev.codebot // Keep the last CodeBot message
          }));
        }
      }
    } else {
      // Show error feedback
      setCurrentMessages(prev => ({
        jarvis: {
          id: Date.now().toString(),
          message: result.feedback,
          timestamp: new Date()
        },
        codebot: prev.codebot // Keep the last CodeBot message
      }));
    }
  };

  const handleReset = () => {
    engine.reset();
    setCurrentState(engine.getCurrentState());
    // Reset messages to first step
    const step = engine.getCurrentStep();
    
    setCurrentMessages({
      jarvis: {
        id: '1',
        message: step.jarvisMessage,
        timestamp: new Date()
      },
      codebot: null
    });
    
    // Add CodeBot message after a short delay
    if (step.codeBotMessage) {
      setTimeout(() => {
        setCurrentMessages(prev => ({
          ...prev,
          codebot: {
            id: '2',
            message: step.codeBotMessage || '',
            codeSnippet: step.codeSnippet || '',
            timestamp: new Date()
          }
        }));
      }, 1000);
    }
  };

  const handleElementPress = (index: number) => {
    const step = engine.getCurrentStep();
    // Handle all element interactions directly through clicks
    if (
      step.expectedAction === 'add_element_to_window' || 
      step.expectedAction === 'complete_first_window' ||
      step.expectedAction === 'slide_window' ||
      step.expectedAction === 'expand_window' ||
      step.expectedAction === 'contract_window' ||
      step.expectedAction === 'update_best' ||
      step.expectedAction === 'complete_algorithm' ||
      step.expectedAction === 'process_element' ||
      step.expectedAction === 'transform_array'
    ) {
      handleUserAction(step.expectedAction, index);
    }
  };

  const handleAIAssistantPress = async () => {
    setIsAILoading(true);
    
    try {
      const step = engine.getCurrentStep();
      const elements = shouldShowStringVisualizer 
        ? currentState.uiState.stringElements || []
        : currentState.uiState.arrayElements || [];

      const context: AIContext = {
        problemTitle: problemData.title,
        problemDescription: problemData.description,
        currentStep: step.description,
        expectedAction: step.expectedAction,
        currentState: currentState.uiState,
        userAction: step.expectedAction,
        codeSnippet: step.codeHint,
        variables: [
          { 
            name: 'windowSum',
            value: currentState.uiState.windowSum || 0,
            description: 'Current sum of elements in window'
          },
          { 
            name: 'maxSum',
            value: currentState.uiState.maxSum || 0,
            description: 'Maximum sum found so far'
          },
          { 
            name: 'windowStart',
            value: currentState.uiState.windowStart || 0,
            description: 'Starting index of current window'
          },
          { 
            name: 'windowSize',
            value: problemData.playground?.initialState?.k || 0,
            description: 'Size of the sliding window'
          }
        ],
        userLevel: userLevel
      };

      const aiResponse = await AIService.generateExplanation(context);
      
      // Replace Jarvis and CodeBot messages with AI response
      setCurrentMessages({
        jarvis: {
          id: Date.now().toString(),
          message: aiResponse.explanation,
          timestamp: new Date()
        },
        codebot: aiResponse.codeExplanation ? {
          id: (Date.now() + 1).toString(),
          message: aiResponse.intuition,
          codeSnippet: aiResponse.codeExplanation,
          timestamp: new Date()
        } : null
      });

    } catch (error) {
      console.error('AI Assistant Error:', error);
      Alert.alert(
        'AI Assistant Error',
        'Failed to get AI explanation. Please check if Ollama is running and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAILoading(false);
    }
  };

  const handleTakeMeToCode = async () => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
    setShowCodeView(true);

    const step = engine.getCurrentStep();
    const code = step.codeHint || '';
    const lines = code.split('\n');
    const markerIndex = lines.findIndex(l => l.toLowerCase().includes((step.expectedAction || '').replace(/_/g, ' ')));
    setActiveCodeLine(markerIndex >= 0 ? markerIndex + 1 : undefined);

    try {
      setIsAILoading(true);
      const context: AIContext = {
        problemTitle: problemData.title,
        problemDescription: problemData.description,
        currentStep: step.description,
        expectedAction: step.expectedAction,
        currentState: currentState.uiState,
        userAction: step.expectedAction,
        codeSnippet: code,
        variables: [
          { name: 'windowSum', value: currentState.uiState.windowSum || 0, description: '' },
          { name: 'maxSum', value: currentState.uiState.maxSum || 0, description: '' },
          { name: 'windowStart', value: currentState.uiState.windowStart || 0, description: '' },
          { name: 'windowSize', value: problemData.playground?.initialState?.k || 0, description: '' },
        ],
        userLevel,
      };
      const ai = await AIService.generateExplanation(context);
      setGeneratedCodeExplanation(ai.codeExplanation || ai.explanation);
    } catch (e) {
      setGeneratedCodeExplanation('Explanation not available right now.');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleToggleFullscreen = async () => {
    // Toggle internal fullscreen layout state
    const next = !isFullWindowMode;
    setIsFullWindowMode(next);

    // Best-effort web fullscreen
    if (Platform.OS === 'web') {
      try {
        const doc: any = document;
        const el: any = document.documentElement;
        const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement;
        if (!isFs && next) {
          if (el.requestFullscreen) await el.requestFullscreen();
          else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
          else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
        } else if (isFs && !next) {
          if (doc.exitFullscreen) await doc.exitFullscreen();
          else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
          else if (doc.mozCancelFullScreen) await doc.mozCancelFullScreen();
        }
      } catch (e) {
        console.log('Fullscreen API not available:', e);
      }
    }
  };

  // Keep local state in sync with browser fullscreen changes
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const doc: any = document;
    const handler = () => {
      const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement);
      setIsFullWindowMode(isFs);
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler as any);
    document.addEventListener('mozfullscreenchange', handler as any);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler as any);
      document.removeEventListener('mozfullscreenchange', handler as any);
    };
  }, []);

  // Determine if we should show array or string visualizer
  const shouldShowStringVisualizer = problemData.problemId === 'p9' || problemData.problemId === 'p11';
  const elements = shouldShowStringVisualizer 
    ? currentState.uiState.stringElements || []
    : currentState.uiState.arrayElements || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sliding Window</Text>
          </View>
          
          <View style={styles.headerActions}>
            {/* Bookmark toggle */}
            <TouchableOpacity 
              style={[styles.actionButton, isBookmarked && styles.bookmarkActive]}
              onPress={() => setIsBookmarked(prev => !prev)}
              activeOpacity={0.8}
              {...(Platform.OS === 'web' ? { title: 'Bookmark this problem' } : {})}
            >
              <Text style={[styles.actionButtonText, isBookmarked && styles.actionButtonTextActive]}>{isBookmarked ? '★' : '☆'}</Text>
            </TouchableOpacity>

            {/* Completion toggle */}
            <TouchableOpacity 
              style={[styles.actionButton, isCompleted && styles.completeActive]}
              onPress={() => setIsCompleted(prev => !prev)}
              activeOpacity={0.8}
              {...(Platform.OS === 'web' ? { title: 'Mark problem completed' } : {})}
            >
              <Text style={[styles.actionButtonText, isCompleted && styles.actionButtonTextActive]}>{isCompleted ? '✔' : '○'}</Text>
            </TouchableOpacity>

            {/* Problem description modal */}
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowProblemModal(true)}
              activeOpacity={0.8}
              {...(Platform.OS === 'web' ? { title: 'Open problem description' } : {})}
            >
              <Text style={styles.actionButtonText}>📄</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, isFullWindowMode && styles.actionButtonActive]}
              onPress={handleToggleFullscreen}
              activeOpacity={0.8}
              {...(Platform.OS === 'web' ? { title: isFullWindowMode ? 'Exit fullscreen' : 'Enter fullscreen' } : {})}
            >
              <Text style={[styles.actionButtonText, isFullWindowMode && styles.actionButtonTextActive]}>
                {isFullWindowMode ? '⛶' : '⛶'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleReset}
              activeOpacity={0.8}
              {...(Platform.OS === 'web' ? { title: 'Reset playground' } : {})}
            >
              <Text style={styles.actionButtonText}>↺</Text>
            </TouchableOpacity>

            {/* Blink next toggle */}
            <TouchableOpacity 
              style={[styles.actionButton, blinkNextEnabled && styles.actionButtonActive]}
              onPress={() => setBlinkNextEnabled(prev => !prev)}
              activeOpacity={0.8}
              {...(Platform.OS === 'web' ? { title: blinkNextEnabled ? 'Disable next-element blink' : 'Enable next-element blink' } : {})}
            >
              <Text style={[styles.actionButtonText, blinkNextEnabled && styles.actionButtonTextActive]}>
                ✨
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Problem Modal */}
      {showProblemModal && (
        <>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            onPress={() => setShowProblemModal(false)}
            activeOpacity={1}
          />
          
          <View style={styles.problemModalDark}>
            <View style={styles.modalHeaderDark}>
              <Text style={styles.modalTitleDark}>Problem Details</Text>
              <TouchableOpacity 
                style={styles.modalCloseButtonDark}
                onPress={() => setShowProblemModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCloseButtonTextDark}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContentContainer}
            >
              <View style={styles.problemSectionDark}>
                <Text style={styles.sectionTitleDark}>Problem</Text>
                <Text style={styles.problemTextDark}>{problemData.title}</Text>
              </View>
              
              <View style={styles.problemSectionDark}>
                <Text style={styles.sectionTitleDark}>Description</Text>
                <Text style={styles.problemTextDark}>{problemData.description}</Text>
              </View>
              
              <View style={styles.problemSectionDark}>
                <Text style={styles.sectionTitleDark}>Objective</Text>
                <Text style={styles.problemTextDark}>{problemData.aim || 'Find the optimal solution using sliding window technique.'}</Text>
              </View>
              
              {problemData.examples && problemData.examples.length > 0 && (
                <View style={styles.problemSectionDark}>
                  <Text style={styles.sectionTitleDark}>Examples</Text>
                  {problemData.examples.map((example: any, index: number) => (
                    <View key={index} style={styles.exampleContainerDark}>
                      <Text style={styles.exampleTitleDark}>Example {index + 1}</Text>
                      <Text style={styles.exampleInputDark}>Input: {example.input}</Text>
                      <Text style={styles.exampleOutputDark}>Output: {example.output}</Text>
                      {example.explanation && (
                        <Text style={styles.exampleExplanationDark}>{example.explanation}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </>
      )}

      {/* Main Workspace - Optimized Layout */}
      <View style={styles.workspace}>
        {/* Left Panel - AI Chat */}
        <View style={[styles.leftChatPanel]}>
          <View style={styles.chatMessages}>
            <ChatPanel 
              messages={[
                {
                  id: '1',
                  sender: 'jarvis' as const,
                  message: currentMessages.jarvis?.message || 'Welcome! Let\'s start by initializing our variables. Click the \'Initialize\' button to set up windowSum = 0, maxSum = 0, and windowStart = 0.',
                  timestamp: currentMessages.jarvis?.timestamp || new Date()
                },
                ...(currentMessages.codebot ? [{
                  id: '2',
                  sender: 'codebot' as const,
                  message: currentMessages.codebot.message,
                  codeSnippet: currentMessages.codebot.codeSnippet,
                  timestamp: currentMessages.codebot.timestamp
                }] : [])
              ]}
              onAIAssistantPress={handleAIAssistantPress}
              isAILoading={isAILoading}
            />
          </View>
        </View>

        {/* Right Panel - Main Algorithm Area */}
        <View style={styles.rightComponentsPanel}>
          {/* Main Algorithm Section - Centered Data Elements */}
          <View style={styles.mainAlgorithmSection}>
            {/* Floating Legend Button */}
            <TouchableOpacity
              style={styles.legendButton}
              onPress={() => setShowLegend(!showLegend)}
              activeOpacity={0.8}
            >
              <Text style={styles.legendButtonText}>ℹ️</Text>
            </TouchableOpacity>

            {showLegend && (
              <>
                <TouchableOpacity 
                  style={styles.legendBackdrop}
                  onPress={() => setShowLegend(false)}
                  activeOpacity={1}
                />
                <View style={styles.legendDropdown}>
                  <View style={styles.legendHeader}>
                    <Text style={styles.legendTitle}>Legend</Text>
                    <TouchableOpacity onPress={() => setShowLegend(false)} style={styles.legendCloseButton}>
                      <Text style={styles.legendCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.legendList}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, { backgroundColor: '#F59E0B', borderColor: '#D97706' }]} />
                      <Text style={styles.legendText}>⏳ Not yet reached</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, { backgroundColor: '#22C55E', borderColor: '#16A34A' }]} />
                      <Text style={styles.legendText}>🎯 In current window</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendBox, { backgroundColor: '#EF4444', borderColor: '#DC2626' }]} />
                      <Text style={styles.legendText}>❌ Out of window (past)</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View style={styles.mainAlgorithmContent}>
              {/* Data Visualization - Centered */}
              <View style={styles.dataVisualizationContainer}>
                {(() => {
                  const step = engine.getCurrentStep();
                  const expectedIndex = !step.hideIndexHint && blinkNextEnabled
                    ? (Array.isArray(step.expectedElementIndex)
                        ? step.expectedElementIndex[0]
                        : step.expectedElementIndex)
                    : undefined;
                  return (
                    <DataVisualizer 
                      uiState={{
                        ...currentState.uiState,
                        arrayElements: elements
                      }}
                      onElementPress={handleElementPress}
                      expectedIndex={expectedIndex}
                    />
                  );
                })()}
              </View>
              
              {/* Dynamic Content Area - New content appears below, existing shifts up */}
              <View style={styles.dynamicContentArea}>
                {/* Window Bracket Info - appears below elements */}
                {currentState.uiState.highlightedElements.length > 0 && (
                  <View style={styles.windowInfoContainer}>
                    <Text style={styles.windowInfoText}>
                      📍 Current Window: [{currentState.uiState.highlightedElements.map((i: number) => elements[i].value).join(', ')}]
                    </Text>
                    <Text style={styles.windowInfoSubtext}>
                      📏 Size: {currentState.uiState.highlightedElements.length}
                    </Text>
                  </View>
                )}
                
                {/* Step Progress Info - appears below window info */}
                <View style={styles.stepProgressContainer}>
                  <Text style={styles.stepProgressText}>
                    Step {engine.getCurrentStep().stepId}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
        </View>

        {/* Collapsible Sidebar */}
        <View style={[styles.sidebar, isSidebarOpen && styles.sidebarOpen]}>
          <TouchableOpacity 
            style={styles.sidebarToggle}
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.sidebarToggleIcon}>
              {isSidebarOpen ? '←' : '→'}
            </Text>
          </TouchableOpacity>
          
          {isSidebarOpen && (
            <ScrollView 
              style={styles.sidebarContent}
              showsVerticalScrollIndicator={false}
            >
            {/* Current Step Card - Now at the top */}
            <View style={styles.smallCard}>
              <View style={styles.smallCardHeader}>
                <Text style={styles.smallCardTitle}>Current Step</Text>
                <View style={styles.smallCardIndicator} />
              </View>
              
              <View style={styles.smallCardContent}>
                <View style={styles.stepDescriptionContainer}>
                  <Text style={styles.stepDescriptionText}>
                    {engine.getCurrentStep().description}
                  </Text>
                </View>

                {/* Action Button - Only show if there's an action */}
                {engine.getCurrentStep().expectedAction === 'click_initialize' && (
                  <TouchableOpacity
                    style={styles.actionButtonInSidebar}
                    onPress={() => handleUserAction('click_initialize')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionButtonTextInSidebar}>🚀 Initialize Variables</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Code Variables Card */}
            <View style={styles.smallCard}>
              <View style={styles.smallCardHeader}>
                <Text style={styles.smallCardTitle}>Variables</Text>
                <View style={styles.smallCardIndicator} />
              </View>
              
              <View style={styles.smallCardContent}>
                <CodeHint 
                  variables={[
                    { 
                      name: 'windowSum',
                      value: currentState.uiState.windowSum || 0,
                      description: 'Current sum'
                    },
                    { 
                      name: 'maxSum',
                      value: currentState.uiState.maxSum || 0,
                      description: 'Max sum found'
                    },
                    { 
                      name: 'windowStart',
                      value: currentState.uiState.windowStart || 0,
                      description: 'Window start'
                    },
                    { 
                      name: 'windowSize',
                      value: problemData.playground?.initialState?.k || 0,
                      description: 'Window size'
                    }
                  ]}
                />
              </View>
            </View>

            {/* Code Hint Card */}
            <View style={styles.smallCard}>
              <View style={styles.smallCardHeader}>
                <Text style={styles.smallCardTitle}>Code Hint</Text>
                <View style={styles.smallCardIndicator} />
              </View>
              
              <View style={styles.smallCardContent}>
                <View style={styles.codeHintContainer}>
                  <Text style={styles.codeHintText}>
                    {engine.getCurrentStep().codeHint || "// Add current element to window\nwindowSum += arr[windowSum];"}
                  </Text>
                </View>
              </View>
            </View>


            {showCodeView && (
              <View style={styles.smallCard}>
                <View style={styles.smallCardHeader}>
                  <Text style={styles.smallCardTitle}>C++ Code</Text>
                  <View style={styles.smallCardIndicator} />
                </View>
                <View style={styles.smallCardContent}>
                  <CodeViewer language="cpp" code={engine.getCurrentStep().codeHint || ''} activeLine={activeCodeLine} />
                  {!!generatedCodeExplanation && (
                    <View style={{ marginTop: 10, backgroundColor: '#0C1116', borderRadius: 6, borderWidth: 1, borderColor: '#1E2632', padding: 8 }}>
                      <Text style={{ fontSize: 11, color: '#E8ECF2', lineHeight: 16 }}>{generatedCodeExplanation}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Specialized Visualizers - Smaller */}
            {(problemData.problemId === 'p6' || problemData.problemId === 'p7') && (
              <View style={styles.smallCard}>
                <View style={styles.smallCardHeader}>
                  <Text style={styles.smallCardTitle}>Character Analysis</Text>
                  <View style={styles.smallCardIndicator} />
                </View>
                <View style={styles.smallCardContent}>
                  <CharacterCountVisualizer
                    charCount={currentState.uiState.charCount || {}}
                    distinctChars={currentState.uiState.distinctChars || 0}
                    k={problemData.playground?.initialState?.k || 2}
                  />
                </View>
              </View>
            )}
            
            {problemData.problemId === 'p9' && (
              <View style={styles.smallCard}>
                <View style={styles.smallCardHeader}>
                  <Text style={styles.smallCardTitle}>Character Frequency</Text>
                  <View style={styles.smallCardIndicator} />
                </View>
                <View style={styles.smallCardContent}>
                  <CharacterFrequencyVisualizer
                    charFrequency={currentState.uiState.charFrequency || {}}
                    maxRepeatLetterCount={currentState.uiState.maxRepeatLetterCount || 0}
                    k={problemData.playground?.initialState?.k || 1}
                    currentWindow={elements.map(el => el.value)}
                  />
                </View>
              </View>
            )}

            {problemData.problemId === 'p8' && (
              <View style={styles.smallCard}>
                <View style={styles.smallCardHeader}>
                  <Text style={styles.smallCardTitle}>Ones Count</Text>
                  <View style={styles.smallCardIndicator} />
                </View>
                <View style={styles.smallCardContent}>
                  <OnesCountVisualizer
                    onesCount={currentState.uiState.onesCount || 0}
                    k={problemData.playground?.initialState?.k || 1}
                    currentWindow={elements.map(el => el.value)}
                  />
                </View>
              </View>
            )}

            {problemData.problemId === 'p10' && (
              <View style={styles.smallCard}>
                <View style={styles.smallCardHeader}>
                  <Text style={styles.smallCardTitle}>Zero Count</Text>
                  <View style={styles.smallCardIndicator} />
                </View>
                <View style={styles.smallCardContent}>
                  <ZeroCountVisualizer
                    zeroCount={currentState.uiState.zeroCount || 0}
                    k={problemData.playground?.initialState?.k || 1}
                    currentWindow={elements.map(el => Number(el.value))}
                  />
                </View>
              </View>
            )}

            {problemData.problemId === 'p12' && (
              <View style={styles.smallCard}>
                <View style={styles.smallCardHeader}>
                  <Text style={styles.smallCardTitle}>Prefix Sum</Text>
                  <View style={styles.smallCardIndicator} />
                </View>
                <View style={styles.smallCardContent}>
                  <PrefixSumVisualizer
                    prefixSum={currentState.uiState.prefixSum || 0}
                    count={currentState.uiState.count || 0}
                    prefixCount={currentState.uiState.prefixCount || {}}
                    currentIndex={currentState.uiState.currentIndex || 0}
                    goal={problemData.playground?.initialState?.goal}
                    problemType="binary_sum"
                  />
                </View>
              </View>
            )}
            </ScrollView>
          )}
        </View>
      </View>

      {isFullWindowMode && (
        <View style={styles.fullscreenOverlay} pointerEvents="box-none">
          <View style={styles.fullscreenControls}>
            <Text style={styles.fullscreenHint}>Press Esc to exit</Text>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonActive]} onPress={handleToggleFullscreen} activeOpacity={0.85}>
              <Text style={[styles.actionButtonText, styles.actionButtonTextActive]}>Exit ⛶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080A0D',
  },
  
  // Modern Header
  header: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#0C1116',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111720',
    borderWidth: 1,
    borderColor: '#1E2632',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  backButtonIcon: {
    fontSize: 12,
    marginRight: 4,
    color: '#B4BCC8',
  },
  
  backButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B4BCC8',
  },
  
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8ECF2',
    textShadowColor: 'rgba(41, 211, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111720',
    borderWidth: 1,
    borderColor: '#1E2632',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  actionButtonActive: {
    backgroundColor: '#F5D90A',
    borderColor: '#F5D90A',
  },
  
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B4BCC8',
  },
  
  actionButtonTextActive: {
    color: '#080A0D',
  },

  bookmarkActive: {
    backgroundColor: '#F5D90A',
    borderColor: '#F5D90A',
  },

  completeActive: {
    backgroundColor: '#29D3FF',
    borderColor: '#29D3FF',
  },

  // Workspace Layout
  workspace: {
    flex: 1,
    flexDirection: 'row',
  },
  
  workspaceFullWindow: {
    flexDirection: 'row',
  },
  
  // Left Panel - Chat
  leftPanel: {
    width: 360,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  
  leftPanelFullWindow: {
    width: 420,
  },
  
  panelHeader: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  
  panelIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  leftPanelScroll: {
    flex: 1,
  },
  
  chatContainer: {
    padding: 24,
  },
  
  // Right Panel - Main Content
  rightPanel: {
    flex: 1,
    padding: 24,
  },
  
  rightPanelFullWindow: {
    padding: 32,
  },
  
  rightPanelScroll: {
    flex: 1,
  },
  
  rightPanelContent: {
    gap: 24,
    paddingBottom: 32,
  },
  
  // Card Components
  playgroundCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  
  variablesCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  
  stepCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  
  visualizerCard: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  
  cardHeader: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  
  cardIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  
  
  visualizationSection: {
    gap: 16,
  },
  
  controlSection: {
    gap: 16,
  },
  
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  // Modal Styles
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
  },
  
  problemModal: {
    position: 'absolute',
    top: '50%',
    left: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    zIndex: 1001,
    height: 600,
    transform: [{ translateY: -300 }],
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  
  modalCloseButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  
  modalCloseButtonText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
  },
  
  modalContent: {
    flex: 1,
  },
  
  modalContentContainer: {
    padding: 24,
    gap: 20,
  },

  // Dark modal styles
  problemModalDark: {
    position: 'absolute',
    top: '50%',
    left: 24,
    right: 24,
    backgroundColor: '#0C1116',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2632',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    zIndex: 1001,
    height: 560,
    transform: [{ translateY: -280 }],
  },

  modalHeaderDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },

  modalTitleDark: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E8ECF2',
  },

  modalCloseButtonDark: {
    width: 32,
    height: 32,
    backgroundColor: '#111720',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E2632',
  },

  modalCloseButtonTextDark: {
    fontSize: 14,
    color: '#B4BCC8',
    fontWeight: '700',
  },

  problemSectionDark: {
    gap: 8,
    backgroundColor: '#111720',
    borderWidth: 1,
    borderColor: '#1E2632',
    borderRadius: 8,
    padding: 12,
  },

  sectionTitleDark: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B4BCC8',
  },

  problemTextDark: {
    fontSize: 13,
    color: '#E8ECF2',
    lineHeight: 18,
  },

  exampleContainerDark: {
    backgroundColor: '#0C1116',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    gap: 6,
  },

  exampleTitleDark: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8ECF2',
  },

  exampleInputDark: {
    fontSize: 12,
    color: '#B4BCC8',
  },

  exampleOutputDark: {
    fontSize: 12,
    fontWeight: '700',
    color: '#29D3FF',
  },

  exampleExplanationDark: {
    fontSize: 12,
    color: '#B4BCC8',
    fontStyle: 'italic',
  },
  
  problemSection: {
    gap: 12,
  },
  
  
  problemText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  
  exampleContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  
  exampleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  
  exampleInput: {
    fontSize: 15,
    color: '#475569',
  },
  
  exampleOutput: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
  },
  
  exampleExplanation: {
    fontSize: 15,
    color: '#64748B',
    fontStyle: 'italic',
  },

  // Optimized Layout Styles
  leftChatPanel: {
    width: 250,
    backgroundColor: '#111720',
    borderRightWidth: 1,
    borderRightColor: '#1E2632',
  },

  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  fullscreenControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(12, 17, 22, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
  },
  fullscreenHint: {
    fontSize: 11,
    color: '#B4BCC8',
    marginRight: 8,
  },
  
  chatHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8ECF2',
  },
  
  chatIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#29D3FF',
  },
  
  chatMessages: {
    flex: 1,
    padding: 12,
  },
  
  rightComponentsPanel: {
    flex: 1,
    flexDirection: 'column',
  },
  
  mainAlgorithmSection: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    position: 'relative',
  },
  
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8ECF2',
  },
  
  sectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5D90A',
  },
  
  mainAlgorithmContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    paddingVertical: 20,
  },
  
  dataVisualizationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    marginBottom: 20,
  },

  dynamicContentArea: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: 600,
  },

  windowInfoContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
    marginBottom: 12,
    alignItems: 'center',
    minWidth: 300,
  },

  windowInfoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B4BCC8',
    textAlign: 'center',
    marginBottom: 2,
  },

  windowInfoSubtext: {
    fontSize: 10,
    color: '#5A6573',
    fontStyle: 'italic',
  },

  stepProgressContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E2632',
    alignItems: 'center',
  },

  stepProgressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E8ECF2',
    textAlign: 'center',
  },
  
  actionsContainer: {
    marginTop: 0,
  },
  
  sidebar: {
    width: 0,
    backgroundColor: '#0C1116',
    borderLeftWidth: 1,
    borderLeftColor: '#1E2632',
  },
  
  sidebarOpen: {
    width: 280,
  },
  
  sidebarToggle: {
    position: 'absolute',
    left: -20,
    top: 20,
    width: 20,
    height: 40,
    backgroundColor: '#111720',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#1E2632',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  sidebarToggleIcon: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B4BCC8',
  },
  
  sidebarContent: {
    flex: 1,
    padding: 16,
    paddingTop: 20,
  },
  
  smallCard: {
    backgroundColor: '#111720',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    marginBottom: 16,
  },
  
  smallCardHeader: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  smallCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E8ECF2',
  },
  
  smallCardIndicator: {
    width: 0,
    height: 0,
  },
  
  smallCardContent: {
    padding: 12,
  },
  
  codeHintContainer: {
    backgroundColor: '#080A0D',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E2632',
    padding: 8,
  },
  
  codeHintText: {
    fontSize: 10,
    color: '#29D3FF',
    fontFamily: 'monospace',
    lineHeight: 14,
  },
  
  stepDescriptionContainer: {
    backgroundColor: '#080A0D',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E2632',
    padding: 8,
  },
  
  stepDescriptionText: {
    fontSize: 11,
    color: '#E8ECF2',
    lineHeight: 16,
  },


  actionButtonInSidebar: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#F5D90A',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#F5D90A',
  },

  actionButtonTextInSidebar: {
    fontSize: 11,
    fontWeight: '700',
    color: '#080A0D',
    fontFamily: 'monospace',
  },

  // Legend (floating) styles
  legendButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#0C1116',
    borderWidth: 1,
    borderColor: '#1E2632',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  legendButtonText: {
    fontSize: 14,
    color: '#B4BCC8',
    fontWeight: '700',
  },
  legendBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 6,
  },
  legendDropdown: {
    position: 'absolute',
    top: 40,
    left: 8,
    width: 260,
    backgroundColor: '#0C1116',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
    padding: 12,
    zIndex: 7,
  },
  legendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
    paddingBottom: 8,
    marginBottom: 10,
  },
  legendTitle: {
    fontSize: 13,
    color: '#E8ECF2',
    fontWeight: '700',
  },
  legendCloseButton: {
    padding: 4,
  },
  legendCloseText: {
    fontSize: 14,
    color: '#B4BCC8',
  },
  legendList: {
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 11,
    color: '#B4BCC8',
  },
});
