import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import AIServiceFactory, { AIRequest } from '../services/AIServiceFactory';
import { ModuleConfiguration, StandardEngine, Variable } from '../types/engine';
import AIModal from '../ui/AIModal';
import ChatPanel from '../ui/ChatPanel';
import CodePanel from '../ui/CodePanel';
import Header from '../ui/Header';

interface CleanPlaygroundState {
  currentStep: number;
  totalSteps: number;
  jarvisMessage: {
    id: string;
    message: string;
    timestamp: Date;
  } | null;
  codeInfo: {
    id: string;
    codeSnippet: string | null;
    codeExplanation?: string;
    timestamp: Date;
  } | null;
  variables: Variable[];
  currentStepDescription: string;
  codeHint: string | null;
  isCompleted: boolean;
}

interface Props {
  problemData: any;
  moduleConfig: ModuleConfiguration;
  engine: StandardEngine;
  children: React.ReactNode; // Module-specific visualization
  onReset?: () => void; // Optional custom reset handler
}

export default function CleanGenericPlayground({ 
  problemData, 
  moduleConfig, 
  engine, 
  children,
  onReset: customOnReset
}: Props) {
  const { theme } = useTheme();

  // Pure generic state - no module-specific logic
  const [playgroundState, setPlaygroundState] = useState<CleanPlaygroundState>({
    currentStep: 1,
    totalSteps: 1,
    jarvisMessage: null,
    codeInfo: null,
    variables: [],
    currentStepDescription: '',
    codeHint: null,
    isCompleted: false
  });

  // UI state
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [isFullWindowMode, setIsFullWindowMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(moduleConfig.ui.sidebar.enabled);
  const [showLegend, setShowLegend] = useState(false);
  
  // AI Assistant state
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiResponse, setAIResponse] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [hoveredHelp, setHoveredHelp] = useState(false);
  
  // Panel highlighting state
  const [showPanelHighlight, setShowPanelHighlight] = useState(false);
  const [showGuidanceMessage, setShowGuidanceMessage] = useState(false);

  // Initialize playground state from engine (JSON-driven)
  useEffect(() => {
    if (engine) {
      const state = engine.getCurrentState();
      
      setPlaygroundState({
        currentStep: state.currentStep,
        totalSteps: state.totalSteps,
        jarvisMessage: {
          id: '1',
          message: engine.getJarvisMessage(),
          timestamp: new Date()
        },
        codeInfo: (engine.getCodeSnippet && engine.getCodeSnippet()) ? {
          id: '1',
          codeSnippet: engine.getCodeSnippet!(),
          codeExplanation: (engine.getCodeExplanation && engine.getCodeExplanation()) ? engine.getCodeExplanation()! : undefined,
          timestamp: new Date()
        } : null,
        variables: engine.getVariables(),
        currentStepDescription: engine.getStepDescription(),
        codeHint: engine.getCodeHint(),
        isCompleted: engine.isCompleted()
      });
    }
  }, [engine]);

  // Pure generic user action handler - delegates to engine
  const handleUserAction = (action: string, data?: any) => {
    if (!engine) return;

    const result = engine.processUserAction(action, data);
    
    if (result.success) {
      const newState = engine.getCurrentState();
      
      // Check if this was the first initialize action
      if (action === 'click_initialize' && newState.currentStep === 1) {
        // Trigger panel highlighting and guidance message
        setShowPanelHighlight(true);
        setShowGuidanceMessage(true);
        
        // Hide guidance message after 5 seconds
        setTimeout(() => {
          setShowGuidanceMessage(false);
        }, 5000);
        
        // Stop highlighting after 3 seconds
        setTimeout(() => {
          setShowPanelHighlight(false);
        }, 3000);
      }
      
      setPlaygroundState({
        currentStep: newState.currentStep,
        totalSteps: newState.totalSteps,
        jarvisMessage: {
          id: Date.now().toString(),
          message: engine.getJarvisMessage(),
          timestamp: new Date()
        },
        codeInfo: (engine.getCodeSnippet && engine.getCodeSnippet()) ? {
          id: Date.now().toString(),
          codeSnippet: engine.getCodeSnippet!(),
          codeExplanation: (engine.getCodeExplanation && engine.getCodeExplanation()) ? engine.getCodeExplanation()! : undefined,
          timestamp: new Date()
        } : null,
        variables: engine.getVariables(),
        currentStepDescription: engine.getStepDescription(),
        codeHint: engine.getCodeHint(),
        isCompleted: engine.isCompleted()
      });
    } else {
      // Show error feedback
      setPlaygroundState(prev => ({
        ...prev,
        jarvisMessage: {
          id: Date.now().toString(),
          message: result.feedback,
          timestamp: new Date()
        }
      }));
    }
  };

  // Pure generic reset handler - works like try again button
  const handleReset = () => {
    if (customOnReset) {
      // Use custom reset handler if provided (e.g., from SlidingWindowPlayground)
      customOnReset();
    } else if (engine) {
      // Fallback to generic reset for other modules
      engine.reset();
      const resetState = engine.getCurrentState();
      
      // Update playground state with reset values
      setPlaygroundState({
        currentStep: resetState.currentStep,
        totalSteps: resetState.totalSteps,
        jarvisMessage: {
          id: '1',
          message: engine.getJarvisMessage(),
          timestamp: new Date()
        },
        codeInfo: (engine.getCodeSnippet && engine.getCodeSnippet()) ? {
          id: '1',
          codeSnippet: engine.getCodeSnippet!(),
          codeExplanation: (engine.getCodeExplanation && engine.getCodeExplanation()) ? engine.getCodeExplanation()! : undefined,
          timestamp: new Date()
        } : null,
        variables: engine.getVariables(),
        currentStepDescription: engine.getStepDescription(),
        codeHint: engine.getCodeHint(),
        isCompleted: resetState.isCompleted || false
      });
      
      // Clear any AI response and loading state
      setAIResponse(null);
      setIsAILoading(false);
      
      console.log('Playground reset to initial state:', resetState);
    }
  };

  // New AI Assistant handler
  const handleAIRequest = async (request: AIRequest) => {
    try {
      setIsAILoading(true);
      setAIResponse(null);

      const aiService = await AIServiceFactory.getAIService();
      const response = await aiService.generateResponse(request);

      if (response.success) {
        setAIResponse(response.response);
      } else {
        setAIResponse(`Sorry, I encountered an error: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('AI Service error:', error);
      setAIResponse('Sorry, I\'m having trouble connecting. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleAskMore = () => {
    setAIResponse(null);
  };


  // Generic fullscreen handler
  const handleToggleFullscreen = async () => {
    const next = !isFullWindowMode;
    setIsFullWindowMode(next);

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

  // Fullscreen event listener
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Problem Title */}
      <Header
        title={problemData.title}
        subtitle={moduleConfig.ui.header.title} // Module name as subtitle
        problemData={problemData}
        onShowProblemModal={() => setShowProblemModal(true)}
        onReset={handleReset}
        isFullWindowMode={isFullWindowMode}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Problem Modal - Generic */}
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
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseTextDark}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContentDark} showsVerticalScrollIndicator={false}>
              <View style={styles.problemSectionDark}>
                <Text style={styles.sectionTitleDark}>Description</Text>
                <Text style={styles.descriptionTextDark}>
                  {problemData.description}
                </Text>
              </View>
              
              <View style={styles.problemSectionDark}>
                <Text style={styles.sectionTitleDark}>What You'll Learn</Text>
                <Text style={styles.aimTextDark}>
                  {problemData.aim}
                </Text>
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

      {/* Main Workspace - Full Width */}
      <View style={styles.workspace}>
        {/* Left Panel - Step Guide Only */}
        <View style={[
          styles.stepGuidePanel,
          showPanelHighlight && styles.highlightedPanel
        ]}>
          <ChatPanel 
            message={playgroundState.jarvisMessage}
            onAIAssistantPress={undefined}
            isAILoading={false}
          />
        </View>

        {/* Right Panel - Main Algorithm Area */}
        <View style={styles.rightComponentsPanel}>
          {/* Main Algorithm Section */}
          <View style={styles.mainAlgorithmSection}>
            {/* Generic Legend Button - JSON configured */}
            {moduleConfig.ui.legend?.enabled && (
              <TouchableOpacity
                style={styles.legendButton}
                onPress={() => setShowLegend(!showLegend)}
                activeOpacity={0.8}
              >
                <Text style={styles.legendButtonText}>ℹ️</Text>
              </TouchableOpacity>
            )}

            {showLegend && moduleConfig.ui.legend && (
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
                    {moduleConfig.ui.legend.items.map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: item.color, borderColor: item.borderColor }]} />
                        <Text style={styles.legendText}>{item.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Guidance Message - One-time helper */}
            {showGuidanceMessage && (
              <View style={styles.guidanceMessageContainer}>
                <View style={styles.guidanceMessage}>
                  <Text style={styles.guidanceTitle}>💡 Learning Tip</Text>
                  <Text style={styles.guidanceText}>
                    Follow the <Text style={styles.guidanceHighlight}>Step Guide</Text> (left) for intuition and the <Text style={styles.guidanceHighlight}>Code Implementation</Text> (right) to see how concepts translate to code!
                  </Text>
                  <TouchableOpacity 
                    style={styles.guidanceCloseButton}
                    onPress={() => setShowGuidanceMessage(false)}
                  >
                    <Text style={styles.guidanceCloseText}>Got it! ✓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Module-specific visualization content */}
            <View style={styles.mainAlgorithmContent}>
              {React.isValidElement(children) 
                ? React.cloneElement(children, { onUserAction: handleUserAction } as any)
                : children
              }
            </View>

            {/* Floating Help Button */}
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => setShowAIModal(true)}
              activeOpacity={0.8}
              {...(Platform.OS === 'web' && {
                onMouseEnter: () => setHoveredHelp(true),
                onMouseLeave: () => setHoveredHelp(false)
              })}
            >
              <Text style={styles.helpButtonText}>Ask AI</Text>
              {hoveredHelp && Platform.OS === 'web' && (
                <View style={styles.helpTooltip}>
                  <Text style={styles.helpTooltipText}>Ask AI about this step</Text>
                  <View style={styles.helpTooltipArrow} />
                </View>
              )}
            </TouchableOpacity>

          </View>
        </View>

        {/* Right Sidebar - Code Implementation */}
        <View style={[
          styles.rightSidebar,
          showPanelHighlight && styles.highlightedPanel
        ]}>
          {/* Code Implementation Panel */}
          <View style={styles.codePanel}>
            <CodePanel 
              codeInfo={playgroundState.codeInfo}
            />
          </View>
          
          {/* Generic Collapsible Sidebar - JSON configured */}
          {moduleConfig.ui.sidebar.enabled && (
            <View style={[styles.sidebar, isSidebarOpen && styles.sidebarOpen]}>
              <TouchableOpacity 
                style={styles.sidebarToggle}
                onPress={() => setIsSidebarOpen(!isSidebarOpen)}
                activeOpacity={0.8}
              >
                <Text style={styles.sidebarToggleText}>
                  {isSidebarOpen ? '→' : '←'}
                </Text>
              </TouchableOpacity>
              
              {isSidebarOpen && (
                <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
                  {moduleConfig.ui.sidebar.sections.filter(section => section.enabled).map((section) => (
                    <View key={section.id} style={styles.smallCard}>
                      <View style={styles.smallCardHeader}>
                        <Text style={styles.smallCardTitle}>
                          {section.title}
                        </Text>
                        <View style={styles.smallCardIndicator} />
                      </View>
                      <View style={styles.smallCardContent}>
                        {section.type === 'currentStep' && (
                          <Text style={styles.stepDescriptionText}>
                            {playgroundState.currentStepDescription}
                          </Text>
                        )}
                        {section.type === 'codeHint' && playgroundState.codeHint && (
                          <Text style={styles.codeHintText}>
                            {playgroundState.codeHint}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </View>


      {/* AI Assistant Modal */}
      <AIModal
        isVisible={showAIModal}
        onClose={() => setShowAIModal(false)}
        onAIRequest={handleAIRequest}
        isLoading={isAILoading}
        response={aiResponse}
        onAskMore={handleAskMore}
        context={{
          currentStep: `Step ${playgroundState.currentStep}`,
          stepDescription: playgroundState.currentStepDescription,
          algorithmType: moduleConfig.name,
          variables: playgroundState.variables,
          problemData: {
            title: problemData.title,
            description: problemData.description,
            aim: problemData.aim
          }
        }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080A0D',
  },
  
  // Workspace Layout
  workspace: {
    flex: 1,
    flexDirection: 'row',
  },
  
  // Step Guide Panel - Left Side
  stepGuidePanel: {
    width: 280,
    backgroundColor: '#111720',
    borderRightWidth: 1,
    borderRightColor: '#1E2632',
  },

  // Right Panel - Algorithm Area
  rightComponentsPanel: {
    flex: 1,
    backgroundColor: '#080A0D',
  },

  // Right Sidebar - Step Progress and Code
  rightSidebar: {
    width: 300,
    backgroundColor: '#0C1116',
    borderLeftWidth: 1,
    borderLeftColor: '#1E2632',
    flexDirection: 'column',
  },
  
  // Code Panel - In Right Sidebar
  codePanel: {
    flex: 1,
    backgroundColor: '#0C1116',
  },

  mainAlgorithmSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  mainAlgorithmContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },

  // Floating Help Button
  helpButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },

  helpButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },

  // Help Tooltip
  helpTooltip: {
    position: 'absolute',
    right: 0,
    top: -35,
    backgroundColor: '#1F2937',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  helpTooltipText: {
    fontSize: 11,
    color: '#E5E7EB',
    fontWeight: '500',
  },

  helpTooltipArrow: {
    position: 'absolute',
    top: '100%',
    right: 12,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#374151',
  },


  // Panel highlighting styles
  highlightedPanel: {
    borderWidth: 3,
    borderColor: '#F5D90A',
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  // Guidance message styles
  guidanceMessageContainer: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: [{ translateX: -150 }],
    zIndex: 1000,
  },

  guidanceMessage: {
    backgroundColor: '#1A1D23',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F5D90A',
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    maxWidth: 300,
  },

  guidanceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F5D90A',
    marginBottom: 8,
    textAlign: 'center',
  },

  guidanceText: {
    fontSize: 12,
    color: '#E8ECF2',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 12,
  },

  guidanceHighlight: {
    color: '#29D3FF',
    fontWeight: '600',
  },

  guidanceCloseButton: {
    backgroundColor: '#F5D90A',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },

  guidanceCloseText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#080A0D',
  },

  // Sidebar
  sidebar: {
    width: 0,
    backgroundColor: '#0C1116',
    borderLeftWidth: 1,
    borderLeftColor: '#1E2632',
    overflow: 'hidden',
  },

  sidebarOpen: {
    width: 300,
  },

  sidebarToggle: {
    position: 'absolute',
    left: -30,
    top: '50%',
    width: 30,
    height: 60,
    backgroundColor: '#111720',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#1E2632',
    zIndex: 10,
  },

  sidebarToggleText: {
    fontSize: 16,
    color: '#B4BCC8',
    fontWeight: 'bold',
  },

  sidebarContent: {
    flex: 1,
    padding: 16,
  },

  smallCard: {
    backgroundColor: '#111720',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
  },

  smallCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },

  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E8ECF2',
  },

  smallCardIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#29D3FF',
  },

  smallCardContent: {
    padding: 12,
  },

  stepDescriptionText: {
    fontSize: 13,
    color: '#B4BCC8',
    lineHeight: 18,
  },

  variableItem: {
    marginBottom: 8,
  },

  variableName: {
    fontSize: 12,
    color: '#29D3FF',
    fontWeight: '600',
  },

  variableValue: {
    fontSize: 12,
    color: '#10B981',
    fontFamily: 'monospace',
    marginTop: 2,
  },

  variableDescription: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  codeHintText: {
    fontSize: 12,
    color: '#E8ECF2',
    fontFamily: 'monospace',
    lineHeight: 16,
  },

  // Legend
  legendButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111720',
    borderWidth: 1,
    borderColor: '#1E2632',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 5,
  },

  legendButtonText: {
    fontSize: 16,
  },

  legendBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 6,
  },

  legendDropdown: {
    position: 'absolute',
    top: 60,
    left: 20,
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
    marginBottom: 8,
  },

  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E8ECF2',
  },

  legendCloseButton: {
    padding: 4,
  },

  legendCloseText: {
    fontSize: 12,
    color: '#B4BCC8',
  },

  legendList: {
    gap: 8,
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

  // Modal styles (same as before)
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
  },

  problemModalDark: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    right: '10%',
    bottom: '10%',
    backgroundColor: '#0C1116',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
  },

  modalHeaderDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },

  modalTitleDark: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E8ECF2',
  },

  modalCloseButtonDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1D23',
    borderWidth: 1,
    borderColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseTextDark: {
    fontSize: 14,
    color: '#B4BCC8',
    fontWeight: '600',
  },

  modalContentDark: {
    flex: 1,
    padding: 20,
  },

  problemSectionDark: {
    marginBottom: 20,
  },

  sectionTitleDark: {
    fontSize: 16,
    fontWeight: '600',
    color: '#29D3FF',
    marginBottom: 8,
  },

  descriptionTextDark: {
    fontSize: 14,
    color: '#E8ECF2',
    lineHeight: 20,
  },

  aimTextDark: {
    fontSize: 14,
    color: '#E8ECF2',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  exampleContainerDark: {
    backgroundColor: '#111720',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
  },

  exampleTitleDark: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5D90A',
    marginBottom: 6,
  },

  exampleInputDark: {
    fontSize: 13,
    color: '#29D3FF',
    fontFamily: 'monospace',
    marginBottom: 4,
  },

  exampleOutputDark: {
    fontSize: 13,
    color: '#10B981',
    fontFamily: 'monospace',
    marginBottom: 4,
  },

  exampleExplanationDark: {
    fontSize: 12,
    color: '#B4BCC8',
    lineHeight: 16,
  },

});
