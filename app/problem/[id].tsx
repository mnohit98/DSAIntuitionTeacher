import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";
import { DynamicDataService, ProblemData } from "../../src/services/DynamicDataService";

export default function ProblemScreen() {
  const params = useLocalSearchParams();
  const problemId = params.id as string;
  const { theme } = useTheme();
  const navigation = useRouter();
  
  const [showDescription, setShowDescription] = useState(true);
  const [showAim, setShowAim] = useState(true);
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [loading, setLoading] = useState(true);

  // Set document title for web
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Problem ${problemId} - DSA Intuition Teacher`;
    }
  }, [problemId]);

  useEffect(() => {
    loadProblemData();
  }, [problemId]);

  const loadProblemData = async () => {
    try {
      setLoading(true);
      const data = await DynamicDataService.getProblemData(problemId);
      setProblem(data);
    } catch (error) {
      console.error('Error loading problem data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#080A0D' }]}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Loading problem...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!problem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Problem not found: {problemId}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleUserPlayground = () => {
    const route = DynamicDataService.getPlaygroundRoute(problemId);
    if (route) {
      router.push(route as any);
    } else {
      Alert.alert(
        "User Playground",
        "This feature will be implemented based on the specific module and problem type."
      );
    }
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#080A0D' }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              console.log('Back button pressed');
              try {
                navigation.back();
              } catch (error) {
                console.log('Navigation error:', error);
                // Fallback navigation
                router.push('/home');
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonIcon}>←</Text>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{problem.difficulty}</Text>
          </View>
        </View>

        {/* Problem Title */}
        <Text style={styles.problemTitle}>{problem.title}</Text>
        

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TouchableOpacity onPress={() => setShowDescription(!showDescription)}>
              <Text style={styles.chevron}>
                {showDescription ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showDescription && (
            <View style={styles.sectionContent}>
              <Text style={styles.descriptionText}>
                {problem.description}
              </Text>
            </View>
          )}
        </View>

        {/* Aim Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Objective</Text>
            <TouchableOpacity onPress={() => setShowAim(!showAim)}>
              <Text style={styles.chevron}>
                {showAim ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showAim && (
            <View style={styles.sectionContent}>
              <Text style={styles.aimText}>
                {problem.aim}
              </Text>
            </View>
          )}
        </View>

        {/* Examples Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Examples</Text>
          </View>
          
          <View style={styles.sectionContent}>
            {problem.examples.map((example, index) => (
              <View key={index} style={styles.exampleCard}>
                <Text style={styles.exampleLabel}>Example {index + 1}:</Text>
                <Text style={styles.exampleInput}>Input: {example.input}</Text>
                <Text style={styles.exampleOutput}>Output: {example.output}</Text>
                <Text style={styles.exampleExplanation}>
                  {example.explanation}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryActionButton}
            onPress={handleUserPlayground}
          >
            <Text style={styles.primaryActionButtonText}>
              Practice Step-by-Step
            </Text>
            <Text style={styles.playgroundSubtext}>
              {problem.moduleId === 'slidingWindow' || problem.moduleId === 'topological_sort' ? 'Learn by doing with guided practice' : 'Coming soon...'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#0C1116',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1116',
    borderWidth: 1,
    borderColor: '#1E2632',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  backButtonIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#B4BCC8',
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B4BCC8',
  },
  difficultyBadge: {
    backgroundColor: '#F5D90A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "700",
    color: '#080A0D',
  },
  problemTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#E8ECF2',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    textShadowColor: 'rgba(41, 211, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 24,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#111720',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: '#B4BCC8',
  },
  section: {
    marginBottom: 24,
    marginHorizontal: 20,
    backgroundColor: '#111720',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2632',
    overflow: 'hidden',
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E8ECF2',
  },
  chevron: {
    fontSize: 16,
    fontWeight: "700",
    color: '#29D3FF',
  },
  sectionContent: {
    padding: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#B4BCC8',
  },
  aimText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#B4BCC8',
  },
  exampleCard: {
    backgroundColor: '#0C1116',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2632',
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E8ECF2',
    marginBottom: 8,
  },
  exampleInput: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#B4BCC8',
  },
  exampleOutput: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#F5D90A',
  },
  exampleExplanation: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '500',
    color: '#B4BCC8',
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  primaryActionButton: {
    backgroundColor: '#F5D90A',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryActionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#080A0D',
    textAlign: 'center',
  },
  playgroundSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
    color: '#080A0D',
  },
  bottomSpacing: {
    height: 40,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    padding: 20,
    color: '#E8ECF2',
  },
});
