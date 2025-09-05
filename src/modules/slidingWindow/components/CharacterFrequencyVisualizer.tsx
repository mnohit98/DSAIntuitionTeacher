import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  charFrequency: Record<string, number>;
  maxRepeatLetterCount: number;
  k: number;
  currentWindow: (string | number)[];
}

export default function CharacterFrequencyVisualizer({ 
  charFrequency,
  maxRepeatLetterCount,
  k,
  currentWindow 
}: Props) {
  const totalChars = Object.values(charFrequency).reduce((sum, count) => sum + count, 0);
  const replacementsNeeded = totalChars - maxRepeatLetterCount;
  const isValid = replacementsNeeded <= k;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔤 Character Frequency Tracker</Text>
      
      <View style={styles.frequencyContainer}>
        {Object.entries(charFrequency).map(([char, count]) => (
          <View key={char} style={styles.charItem}>
            <Text style={styles.charLabel}>{char}</Text>
            <Text style={styles.charCount}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>📊 Total Characters</Text>
          <Text style={styles.statValue}>{totalChars}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>⭐ Most Frequent</Text>
          <Text style={styles.statValue}>{maxRepeatLetterCount}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>🔄 Replacements Needed</Text>
          <Text style={[
            styles.statValue,
            { color: isValid ? '#22C55E' : '#EF4444' }
          ]}>
            {replacementsNeeded}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>🎯 Max Replacements (k)</Text>
          <Text style={styles.statValue}>{k}</Text>
        </View>
      </View>

      <View style={styles.windowContainer}>
        <Text style={styles.windowTitle}>📍 Current Window</Text>
        <Text style={styles.windowText}>
          [{currentWindow.join(', ')}]
        </Text>
        <Text style={[
          styles.statusText,
          { color: isValid ? '#22C55E' : '#EF4444' }
        ]}>
          {isValid ? '✅ Valid Window' : '❌ Too Many Replacements'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  charItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  charLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  charCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0066CC',
  },
  windowContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  windowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066CC',
    marginBottom: 10,
  },
  windowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
