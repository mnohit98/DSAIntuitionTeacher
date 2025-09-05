import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  charCount: { [key: string]: number };
  distinctChars: number;
  k: number;
}

export default function CharacterCountVisualizer({ charCount, distinctChars, k }: Props) {
  const isWithinLimit = distinctChars <= k;
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>🔤 Character Frequency Map</Text>
      
      {/* Character Count Display */}
      <View style={styles.charCountContainer}>
        {Object.keys(charCount).length === 0 ? (
          <Text style={styles.emptyText}>No characters yet</Text>
        ) : (
          Object.entries(charCount).map(([char, count]) => (
            <View key={char} style={styles.charItem}>
              <View style={styles.charBox}>
                <Text style={styles.charText}>{char}</Text>
              </View>
              <Text style={styles.countText}>× {count}</Text>
            </View>
          ))
        )}
      </View>
      
      {/* Distinct Characters Counter */}
      <View style={[
        styles.distinctCounter,
        isWithinLimit ? styles.withinLimit : styles.exceededLimit
      ]}>
        <Text style={styles.distinctLabel}>
          Distinct Characters: {distinctChars}
        </Text>
        <Text style={styles.limitText}>
          Limit: {k}
        </Text>
        <View style={styles.statusIndicator}>
          <Text style={styles.statusText}>
            {isWithinLimit ? '✅ Valid' : '❌ Exceeded'}
          </Text>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.withinLimit]} />
          <Text style={styles.legendText}>Within limit (≤{k})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.exceededLimit]} />
          <Text style={styles.legendText}>Exceeded limit ({'>'}{k})</Text>
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
  charCountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
    minHeight: 80,
    alignItems: 'center',
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
  charBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  charText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  countText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  distinctCounter: {
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
  distinctLabel: {
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
