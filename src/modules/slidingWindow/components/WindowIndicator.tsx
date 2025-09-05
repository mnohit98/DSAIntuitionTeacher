import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  highlightedElements: number[];
  elements: any[];
  windowSum?: number;
  maxSum?: number;
  currentLength?: number;
  maxLength?: number;
  problemType?: string;
}

export default function WindowIndicator({ 
  highlightedElements,
  elements,
  windowSum,
  maxSum,
  currentLength,
  maxLength,
  problemType 
}: Props) {
  if (highlightedElements.length === 0) {
    return null;
  }

  const getWindowInfo = () => {
    if (problemType === 'fixed') {
      return {
        label: 'Window Sum',
        value: windowSum || 0,
        subtitle: `Size: ${highlightedElements.length}`,
        color: '#0066CC'
      };
    } else if (problemType === 'variable') {
      return {
        label: 'Current Length',
        value: currentLength || 0,
        subtitle: `Best: ${maxLength || 0}`,
        color: '#8B5CF6'
      };
    } else {
      return {
        label: 'Window Elements',
        value: highlightedElements.length,
        subtitle: `Indices: ${highlightedElements.join(', ')}`,
        color: '#059669'
      };
    }
  };

  const windowInfo = getWindowInfo();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📍 Current Window</Text>
        <Text style={styles.info}>
          {windowInfo.label}: {windowInfo.value}
        </Text>
      </View>
      
      <View style={styles.windowElements}>
        {highlightedElements.map((index, i) => (
          <View key={i} style={styles.element}>
            <Text style={styles.elementValue}>
              {elements[index]?.value || '?'}
            </Text>
            <Text style={styles.elementIndex}>{index}</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.subtitle}>{windowInfo.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  windowElements: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  element: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  elementValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  elementIndex: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  windowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  windowElement: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  activeElement: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  elementText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
  },
  activeElementText: {
    color: '#FFFFFF',
  },
  windowInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  windowSize: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  currentPosition: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});
