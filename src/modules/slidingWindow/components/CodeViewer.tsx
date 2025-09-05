import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface Props {
  language?: 'cpp' | 'typescript' | 'python';
  code: string;
  activeLine?: number; // 1-based index of the line to highlight
}

export default function CodeViewer({ language = 'cpp', code, activeLine }: Props) {
  const lines = code.split('\n');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{language.toUpperCase()} Code</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLine === lineNumber;
          return (
            <View key={idx} style={[styles.line, isActive && styles.activeLine]}>
              <Text style={[styles.lineNumber, isActive && styles.activeLineNumber]}>{lineNumber.toString().padStart(3, ' ')}</Text>
              <Text style={[styles.codeText, isActive && styles.activeCodeText]}>{line.length ? line : ' '}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#080A0D',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0C1116',
    borderBottomWidth: 1,
    borderBottomColor: '#1E2632',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B4BCC8',
  },
  scroll: {
    maxHeight: 260,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 2,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  activeLine: {
    backgroundColor: 'rgba(245, 217, 10, 0.12)',
    borderWidth: 1,
    borderColor: '#F5D90A',
  },
  lineNumber: {
    width: 28,
    marginRight: 8,
    textAlign: 'right',
    color: '#5A6573',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  activeLineNumber: {
    color: '#E8ECF2',
    fontWeight: '700',
  },
  codeText: {
    flex: 1,
    color: '#29D3FF',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'monospace',
  },
  activeCodeText: {
    color: '#080A0D',
    fontWeight: '700',
  },
});
