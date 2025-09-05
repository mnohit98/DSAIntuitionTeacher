import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  prefixSum: number;
  count: number;
  prefixCount: Record<string, number>;
  currentIndex: number;
  goal?: number;
  k?: number;
  problemType: 'binary_sum' | 'nice_subarrays';
}

export default function PrefixSumVisualizer({ 
  prefixSum,
  count,
  prefixCount,
  currentIndex,
  goal,
  k,
  problemType
}: Props) {
  const entries = Object.entries(prefixCount).map(([key, value]) => `${key}:${value}`);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {problemType === 'binary_sum' ? '🔢 Prefix Sum Tracker' : '🎯 Nice Subarrays Counter'}
      </Text>
      
      <View style={styles.mainStatsContainer}>
        <View style={styles.mainStatItem}>
          <Text style={styles.mainStatLabel}>📊 Current Prefix Sum</Text>
          <Text style={styles.mainStatValue}>{prefixSum}</Text>
        </View>
        
        <View style={styles.mainStatItem}>
          <Text style={styles.mainStatLabel}>
            {problemType === 'binary_sum' ? '🎯 Target Sum' : '🎯 Required Odds (k)'}
          </Text>
          <Text style={styles.mainStatValue}>
            {problemType === 'binary_sum' ? goal : k}
          </Text>
        </View>
        
        <View style={styles.mainStatItem}>
          <Text style={styles.mainStatLabel}>📈 Valid Subarrays</Text>
          <Text style={styles.mainStatValue}>{count}</Text>
        </View>
      </View>

      <View style={styles.prefixCountContainer}>
        <Text style={styles.prefixCountTitle}>🗂️ Prefix Sum Frequency Map</Text>
        <View style={styles.prefixCountGrid}>
          {entries.map((entry, index) => (
            <View key={index} style={styles.prefixCountItem}>
              <Text style={styles.prefixCountKey}>{entry.split(':')[0]}</Text>
              <Text style={styles.prefixCountValue}>{entry.split(':')[1]}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.currentStateContainer}>
        <Text style={styles.currentStateTitle}>📍 Current State</Text>
        <View style={styles.currentStateRow}>
          <Text style={styles.currentStateLabel}>Index:</Text>
          <Text style={styles.currentStateValue}>{currentIndex}</Text>
        </View>
        <View style={styles.currentStateRow}>
          <Text style={styles.currentStateLabel}>Looking for:</Text>
          <Text style={styles.currentStateValue}>
            {problemType === 'binary_sum' 
              ? `prefixSum - ${goal} = ${prefixSum - (goal || 0)}`
              : `prefixSum - ${k} = ${prefixSum - (k || 0)}`
            }
          </Text>
        </View>
        <View style={styles.currentStateRow}>
          <Text style={styles.currentStateLabel}>Found in map:</Text>
          <Text style={[
            styles.currentStateValue,
            { color: prefixCount[prefixSum - (goal || k || 0)] ? '#22C55E' : '#EF4444' }
          ]}>
            {prefixCount[prefixSum - (goal || k || 0)] ? '✅ Yes' : '❌ No'}
          </Text>
        </View>
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
  mainStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  mainStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  mainStatLabel: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainStatValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0066CC',
  },
  prefixCountContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prefixCountTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066CC',
    textAlign: 'center',
    marginBottom: 15,
  },
  prefixCountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  prefixCountItem: {
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 10,
    margin: 4,
    minWidth: 60,
    borderWidth: 1,
    borderColor: '#1E90FF',
  },
  prefixCountKey: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0066CC',
    marginBottom: 4,
  },
  prefixCountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0066CC',
  },
  currentStateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066CC',
    textAlign: 'center',
    marginBottom: 15,
  },
  currentStateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  currentStateLabel: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
  currentStateValue: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
