import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BotDemo from "./components/BotDemo";
import slidingWindowData from "./module.json";

interface Problem {
  problemId: string;
  title: string;
}

interface Submodule {
  submoduleId: string;
  title: string;
  description: string;
  problems: Problem[];
}

interface SlidingWindowData {
  moduleId: string;
  moduleName: string;
  submodules: Submodule[];
}

export default function SlidingWindowScreen() {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const data = slidingWindowData as SlidingWindowData;

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{data.moduleName}</Text>
      
      {/* Bot Avatar Demo Section */}
      <View style={styles.demoSection}>
        <Text style={styles.demoTitle}>🤖 Meet Your AI Teachers</Text>
        <BotDemo />
      </View>

      <FlatList
        data={data.submodules}
        keyExtractor={(item) => item.submoduleId}
        renderItem={({ item }) => (
          <View style={styles.submodule}>
            <TouchableOpacity onPress={() => toggleExpand(item.submoduleId)}>
              <View style={styles.submoduleHeader}>
                <Text style={styles.submoduleTitle}>{item.title}</Text>
                <Text style={styles.submoduleDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>

            {expanded[item.submoduleId] && (
              <View style={styles.problemList}>
                {item.problems.map((problem: Problem) => (
                  <Text key={problem.problemId} style={styles.problemItem}>
                    • {problem.title}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  demoSection: {
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    color: '#1E293B',
  },
  submodule: { marginBottom: 12, borderRadius: 8, overflow: "hidden" },
  submoduleHeader: { backgroundColor: "#d4f8d4", padding: 12 },
  submoduleTitle: { fontSize: 18, fontWeight: "bold" },
  submoduleDescription: { fontSize: 14, marginTop: 4 },
  problemList: { padding: 12, backgroundColor: "#f9f9f9" },
  problemItem: { fontSize: 14, paddingVertical: 4 }
});