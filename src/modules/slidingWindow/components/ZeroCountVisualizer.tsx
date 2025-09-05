import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  zeroCount: number;
  k: number;
  currentWindow: number[];
}

export default function ZeroCountVisualizer({ zeroCount, k, currentWindow }: Props) {
  const isWithinLimit = zeroCount <= k;
  const zerosInWindow = currentWindow.filter(val => val === 0).length;
  const onesInWindow = currentWindow.filter(val => val === 1).length;
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>🔢 Binary Array Analysis</Text>
      
      {/* Current Window Display */}
      <View style={styles.windowContainer}>
        <Text style={styles.windowLabel}>Current Window:</Text>
        <View style={styles.arrayDisplay}>
          {currentWindow.map((value, index) => (
            <View key={index} style={[
              styles.arrayElement,
              value === 0 ? styles.zeroElement : styles.oneElement
            ]}>
              <Text style={styles.elementText}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Zero Count Display */}
      <View style={[
        styles.zeroCounter,
        isWithinLimit ? styles.withinLimit : styles.exceededLimit
      ]}>
        <Text style={styles.zeroLabel}>
          Zeros in Window: {zerosInWindow}
        </Text>
        <Text style={styles.limitText}>
          Max Zeros Allowed: {k}
        </Text>
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>
            {isWithinLimit ? '✅ Valid' : '❌ Exceeded'}
          </Text>
        </View>
      </View>
      
      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Ones:</Text>
          <Text style={styles.statValue}>{onesInWindow}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Zeros:</Text>
          <Text style={styles.statValue}>{zerosInWindow}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total:</Text>
          <Text style={styles.statValue}>{currentWindow.length}</Text>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.oneElement]} />
          <Text style={styles.legendText}>Ones (1)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.zeroElement]} />
          <Text style={styles.legendText}>Zeros (0)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.withinLimit]} />
          <Text style={styles.legendText}>Valid (≤{k})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.exceededLimit]} />
          <Text style={styles.legendText}>Exceeded ({'>'}{k})</Text>
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
  label: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0066CC',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  windowContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  windowLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0066CC',
    marginBottom: 12,
  },
  arrayDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  arrayElement: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  oneElement: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  zeroElement: {
    backgroundColor: '#F44336',
    borderColor: '#C62828',
  },
  elementText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  zeroCounter: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  withinLimit: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  exceededLimit: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  zeroLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    marginBottom: 4,
  },
  limitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#388E3C',
    marginBottom: 8,
  },
  statusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '800',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderStyle: 'dotted',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0066CC',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: '#FFF8DC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderStyle: 'dotted',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B8860B',
  },
});
