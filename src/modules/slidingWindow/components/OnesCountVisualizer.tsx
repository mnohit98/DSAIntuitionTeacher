import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  onesCount: number;
  k: number;
  currentWindow: (string | number)[];
}

export default function OnesCountVisualizer({ 
  onesCount,
  k,
  currentWindow 
}: Props) {
  const totalElements = currentWindow.length;
  const zerosCount = totalElements - onesCount;
  const isValid = zerosCount <= k;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔢 Ones & Zeros Counter</Text>
      
      <View style={styles.countsContainer}>
        <View style={styles.countItem}>
          <Text style={styles.countLabel}>1️⃣ Ones</Text>
          <Text style={styles.countValue}>{onesCount}</Text>
        </View>
        
        <View style={styles.countItem}>
          <Text style={styles.countLabel}>0️⃣ Zeros</Text>
          <Text style={styles.countValue}>{zerosCount}</Text>
        </View>
        
        <View style={styles.countItem}>
          <Text style={styles.countLabel}>📏 Total</Text>
          <Text style={styles.countValue}>{totalElements}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>🎯 Max Replacements (k)</Text>
          <Text style={styles.statValue}>{k}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>🔄 Replacements Needed</Text>
          <Text style={[
            styles.statValue,
            { color: isValid ? '#22C55E' : '#EF4444' }
          ]}>
            {zerosCount}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>📊 Window Status</Text>
          <Text style={[
            styles.statValue,
            { color: isValid ? '#22C55E' : '#EF4444' }
          ]}>
            {isValid ? '✅ Valid' : '❌ Invalid'}
          </Text>
        </View>
      </View>

      <View style={styles.windowContainer}>
        <Text style={styles.windowTitle}>📍 Current Window</Text>
        <View style={styles.windowElements}>
          {currentWindow.map((value, index) => (
            <View key={index} style={[
              styles.windowElement,
              { backgroundColor: value === 1 ? '#22C55E' : '#EF4444' }
            ]}>
              <Text style={styles.windowElementValue}>{value}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.windowText}>
          Length: {totalElements} | Ones: {onesCount} | Zeros: {zerosCount}
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
  countsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  countItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  countLabel: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  countValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0066CC',
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
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
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
    marginBottom: 15,
  },
  windowElements: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  windowElement: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  windowElementValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  windowText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
    textAlign: 'center',
  },
});
