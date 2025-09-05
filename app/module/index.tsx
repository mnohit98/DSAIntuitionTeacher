import { router } from "expo-router";
import React, { useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";

export default function ModuleIndexScreen() {
  const { theme } = useTheme();
  
  // Set document title for web
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'All Modules - DSA Intuition Teacher';
    }
  }, []);

  const modules = [
    {
      id: "basics",
      title: "Basics",
      description: "Fundamental concepts and basic problems",
      problems: 1,
      color: "#3B82F6",
    },
    {
      id: "patterns",
      title: "Patterns",
      description: "Common algorithmic patterns and techniques",
      problems: 1,
      color: "#10B981",
    },
    {
      id: "slidingWindow",
      title: "Sliding Window",
      description: "Master the sliding window technique",
      problems: 17,
      color: "#F59E0B",
    },
    {
      id: "twoPointers",
      title: "Two Pointers",
      description: "Two pointer technique problems",
      problems: 1,
      color: "#8B5CF6",
    },
  ];

  const handleModulePress = (moduleId: string) => {
    router.push(`/module/${moduleId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={[styles.moduleCard, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }]}
              onPress={() => handleModulePress(module.id)}
            >
              <View style={styles.moduleHeader}>
                <View style={[styles.moduleIcon, { backgroundColor: module.color }]}>
                  <Text style={styles.moduleIconText}>
                    {module.title.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.moduleInfo}>
                  <Text style={[styles.moduleTitle, { color: theme.colors.textPrimary }]}>
                    {module.title}
                  </Text>
                  <Text style={[styles.moduleDescription, { color: theme.colors.textSecondary }]}>
                    {module.description}
                  </Text>
                </View>
              </View>
              
              <View style={styles.moduleFooter}>
                <View style={[styles.problemCount, { backgroundColor: theme.colors.primaryLight }]}>
                  <Text style={[styles.problemCountText, { color: theme.colors.primary }]}>
                    {module.problems} {module.problems === 1 ? 'Problem' : 'Problems'}
                  </Text>
                </View>
                
                <View style={[styles.arrowContainer, { backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.arrow, { color: theme.colors.textInverse }]}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  moduleCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  problemCount: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  problemCountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Helper function to get color with opacity
const getColorWithOpacity = (color: string, opacity: number) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
