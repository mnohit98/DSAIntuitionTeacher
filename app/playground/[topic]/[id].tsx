import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PlaygroundRedirect() {
  const { topic, id } = useLocalSearchParams<{
    topic: string;
    id: string;
  }>();

  useEffect(() => {
    // Redirect old playground routes to new practice routes
    if (topic && id) {
      const newRoute = `/practice/${topic}/${id}`;
      console.log(`Redirecting from /playground/${topic}/${id} to ${newRoute}`);
      router.replace(newRoute as any);
    } else {
      // If no parameters, redirect to home
      router.replace('/home' as any);
    }
  }, [topic, id]);

  // Show a brief loading message while redirecting
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting to practice...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080A0D',
  },
  text: {
    color: '#E8ECF2',
    fontSize: 16,
  },
});
