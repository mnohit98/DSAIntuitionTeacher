import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../src/contexts/ThemeContext';
import { DynamicDataService } from '../src/services/DynamicDataService';

export default function Home() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput | null>(null);

  // Get modules from JSON configuration - completely dynamic!
  const modules = DynamicDataService.getAllModules().map(config => ({
    id: config.id,
    title: config.name,
    description: config.description,
    problems: config.problemCount,
    difficulty: config.difficulty
  }));

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Home - DSA Intuition Teacher';
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      const isK = e.key?.toLowerCase() === 'k';
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler as any);
    return () => window.removeEventListener('keydown', handler as any);
  }, []);

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const renderHighlighted = (text: string) => {
    const query = searchQuery.trim();
    if (!query) return text;
    try {
      const pattern = new RegExp(`(${escapeRegExp(query)})`, 'ig');
      const parts = text.split(pattern);
      return parts.map((part, index) => {
        if (part.toLowerCase() === query.toLowerCase()) {
          return (
            <Text key={`h-${index}`} style={styles.highlight}>
              {part}
            </Text>
          );
        }
        return <Text key={`t-${index}`}>{part}</Text>;
      });
    } catch {
      return text;
    }
  };

  const handleModulePress = (moduleId: string) => {
    router.push(`/module/${moduleId}`);
  };

  const filteredModules = modules.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#080A0D' }]}>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.container}>
          {/* Top Navigation */}
          <View style={[styles.topNav, { backgroundColor: 'rgba(8, 10, 13, 0.95)' }]}>
            <View style={styles.navLeft}>
              <TouchableOpacity 
                style={[styles.navPill, { borderColor: theme.colors.border }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={[styles.navPillIcon, { color: '#B4BCC8' }]}>←</Text>
                <Text style={[styles.navPillText, { color: theme.colors.textSecondary }]}>Back</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.navCenter}>
              <View style={[styles.searchBar, { borderColor: theme.colors.border }]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  ref={searchInputRef}
                  style={[styles.searchInput, { 
                    backgroundColor: 'transparent',
                    color: theme.colors.textPrimary,
                    borderColor: 'transparent'
                  }]}
                  placeholder="Search modules…"
                  placeholderTextColor="#B4BCC8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.searchHint} onPress={() => searchInputRef.current?.focus()}>
                  <Text style={styles.searchHintText}>⌘K</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Module Rows */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.cardGridContainer}>
              <View style={styles.modulesList}>
                {filteredModules.map((module) => (
                  <TouchableOpacity
                    key={module.id}
                    style={[styles.moduleRow, { 
                      backgroundColor: '#111720',
                      borderColor: '#1E2632'
                    }]}
                    onPress={() => handleModulePress(module.id)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.rowContent}>
                      <View style={styles.rowLeft}>
                        <Text style={[styles.moduleTitle, { color: '#E8ECF2' }]}>
                          {renderHighlighted(module.title)}
                        </Text>
                        <Text style={[styles.moduleDescription, { color: '#E8ECF2' }]} numberOfLines={2}>
                          {renderHighlighted(module.description)}
                        </Text>
                        
                        <View style={styles.featuresRow}>
                          <View style={[styles.featureTag, { backgroundColor: 'rgba(41, 211, 255, 0.1)' }]}>
                            <Text style={[styles.featureText, { color: '#29D3FF' }]}>{module.problems} Problems</Text>
                          </View>
                          <View style={[styles.featureTag, { backgroundColor: 'rgba(245, 217, 10, 0.1)' }]}>
                            <Text style={[styles.featureText, { color: '#F5D90A' }]}>{module.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.rowRight}>
                        <TouchableOpacity 
                          style={[styles.arrowButton, { backgroundColor: '#F5D90A' }]}
                          onPress={() => handleModulePress(module.id)}
                        >
                          <Text style={[styles.arrowIcon, { color: '#080A0D' }]}>→</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(41, 211, 255, 0.1)',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1116',
    borderWidth: 1,
    borderColor: '#1E2632',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },
  navPillIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  navPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0C1116',
    borderWidth: 1,
    borderColor: '#1E2632',
    minWidth: 400,
    height: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
    paddingLeft: 6,
    paddingRight: 50,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#B4BCC8',
  },
  searchHint: {
    backgroundColor: '#0A0E13',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
  },
  searchHintText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B4BCC8',
  },
  scrollView: {
    flex: 1,
    paddingTop: 100,
  },
  cardGridContainer: {
    backgroundColor: '#0C1116',
    borderRadius: 12,
    marginHorizontal: 40,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E2632',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modulesList: {
    flexDirection: 'column',
    gap: 16,
  },
  moduleRow: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderColor: '#1E2632',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: {
    flex: 1,
    marginRight: 20,
  },
  rowRight: {
    alignItems: 'center',
    gap: 12,
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
    color: '#E8ECF2',
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#E8ECF2',
  },
  difficultyBadge: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#080A0D',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  featureTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5D90A',
    borderWidth: 0,
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  arrowIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
  },
  highlight: {
    backgroundColor: 'rgba(245, 217, 10, 0.25)',
    borderRadius: 3,
    paddingHorizontal: 2,
  },
});
