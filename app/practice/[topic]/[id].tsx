import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DynamicDataService } from '../../../src/services/DynamicDataService';

// Import playground components
import SlidingWindowPlayground from '../../../src/modules/slidingWindow/playground/SlidingWindowPlayground';

// Component registry for playgrounds
const PLAYGROUND_COMPONENTS: Record<string, React.ComponentType<any>> = {
  'sliding-window': SlidingWindowPlayground,
  // 'topological-sort': TopologicalSortPlayground, // To be implemented
};

export default function PracticeRoute() {
  const { topic: topicParam, id: problemId } = useLocalSearchParams<{
    topic: string;
    id: string;
  }>();

  const [problemData, setProblemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlaygroundData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading practice data for:', { topicParam, problemId });

        if (!topicParam || !problemId) {
          throw new Error('Missing topic or problem ID');
        }

        // Get module configuration
        const moduleConfig = DynamicDataService.getModuleConfig(topicParam);
        if (!moduleConfig) {
          throw new Error(`Module configuration not found for: ${topicParam}`);
        }

        // Get problem data
        const problem = await DynamicDataService.getProblemData(problemId);
        if (!problem) {
          throw new Error(`Problem data not found for: ${problemId}`);
        }

        console.log('Loaded problem data:', problem);

        // Set document title for web
        if (typeof document !== 'undefined') {
          document.title = `${problem.title} - ${moduleConfig.name} | DSA Intuition Teacher`;
        }

        setProblemData(problem);

      } catch (err) {
        console.error('Error loading playground data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadPlaygroundData();
  }, [topicParam, problemId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading playground...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorDetails}>
            Topic: {topicParam}, Problem: {problemId}
          </Text>
        </View>
      </View>
    );
  }

  if (!problemData) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No problem data available</Text>
        </View>
      </View>
    );
  }

  // Get the appropriate playground component
  const PlaygroundComponent = PLAYGROUND_COMPONENTS[topicParam];

  if (!PlaygroundComponent) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            Practice component not found for topic: {topicParam}
          </Text>
          <Text style={styles.errorDetails}>
            Available topics: {Object.keys(PLAYGROUND_COMPONENTS).join(', ')}
          </Text>
        </View>
      </View>
    );
  }

  console.log('Rendering practice component for:', topicParam);

  return <PlaygroundComponent problemData={problemData} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080A0D',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#E8ECF2',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#B4BCC8',
    textAlign: 'center',
  },
});