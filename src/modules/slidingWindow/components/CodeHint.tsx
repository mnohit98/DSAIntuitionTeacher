import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CodeVariable {
  name: string;
  value: string | number;
  description?: string;
}

interface Props {
  variables: CodeVariable[];
  title?: string;
}

export default function CodeHint({ variables, title = "💻 Code Variables" }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.variablesContainer}>
        {variables.map((variable, index) => (
          <View
            key={index}
            style={styles.variableRow}
            {...(typeof document !== 'undefined' && variable.description ? { title: variable.description } : {})}
          >
            <Text style={styles.variableName}>{variable.name}</Text>
            <Text style={styles.variableValue}>{String(variable.value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  variablesContainer: {
    flex: 1,
    gap: 3,
  },
  variableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0C1116',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E2632',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  variableName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#29D3FF',
    fontFamily: 'monospace',
  },
  variableValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F5D90A',
    fontFamily: 'monospace',
  },
});
