import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useTheme } from "../../src/contexts/ThemeContext";

import { DynamicDataService } from "../../src/services/DynamicDataService";

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const searchInputRef = useRef<TextInput | null>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [moduleInfo, setModuleInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [bookmarkFilter, setBookmarkFilter] = useState('All');
  const [completionFilter, setCompletionFilter] = useState('All');
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showBookmarkDropdown, setShowBookmarkDropdown] = useState(false);
  const [showCompletionDropdown, setShowCompletionDropdown] = useState(false);
  const [bookmarkedProblems, setBookmarkedProblems] = useState<Set<string>>(new Set());
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [hoveredAction, setHoveredAction] = useState<{problemId: string, action: string} | null>(null);

  // Set document title for web
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `Module ${id} - DSA Intuition Teacher`;
    }
  }, [id]);

  // Web: Support Cmd+K / Ctrl+K to focus search
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      const isK = e.key?.toLowerCase() === 'k';
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    loadModuleData();
  }, [id]);

  const loadModuleData = async () => {
    try {
      // Get module info using dynamic service
      const moduleData = await DynamicDataService.getModuleData(id as string);
      if (!moduleData) {
        console.error('Module not found:', id);
        return;
      }
      
      setModuleInfo(moduleData);

      // Get problems for this module using dynamic service
      const problemDataArray = await DynamicDataService.getModuleProblems(id as string);

      // Map problem data to include IDs
      const problemsWithIds = problemDataArray.map((problemData, index) => ({
        id: problemData.problemId || `p${index + 1}`,
        ...problemData,
      }));

      setProblems(problemsWithIds);
    } catch (error) {
      console.error('Error loading module data:', error);
    }
  };

  const handleProblemPress = (problemId: string) => {
    router.push(`/problem/${problemId}`);
  };

  const handlePlaygroundPress = (problemId: string) => {
    if (id === 'sliding-window') {
      router.push(`/practice/sliding-window/${problemId}`);
    } else if (id === 'topological-sort') {
      router.push(`/practice/topological-sort/${problemId}`);
    } else {
      // For other modules, navigate to problem detail
      router.push(`/problem/${problemId}`);
    }
  };

  const getProblemUrl = (problemId: string) => {
    try {
      if (typeof window !== 'undefined' && window.location?.origin) {
        return `${window.location.origin}/problem/${problemId}`;
      }
    } catch {}
    // Fallback deep link for native
    return `dsaintuitionteacher://problem/${problemId}`;
  };

  const shareProblem = async (problemId: string) => {
    const url = getProblemUrl(problemId);
    const message = `Check out this problem:\n${url}`;
    try {
      if (Platform.OS === 'web') {
        // Use Web Share API if available
        const nav: any = typeof navigator !== 'undefined' ? navigator : null;
        if (nav?.share) {
          await nav.share({ title: 'DSA Problem', text: 'Check out this problem', url });
          return;
        }
        if (nav?.clipboard?.writeText) {
          await nav.clipboard.writeText(url);
          alert('Link copied to clipboard');
          return;
        }
        // Last resort
        alert(url);
        return;
      }
      await Share.share({ message: message, url });
    } catch (err) {
      // No-op on cancel or error
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#3BD671'; // Green glow
      case 'medium':
        return '#FFB020'; // Amber
      case 'hard':
        return '#FF5A52'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const getDifficultyGlowColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#10B981'; // Green
      case 'medium':
        return '#F59E0B'; // Yellow/Orange
      case 'hard':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const getDifficultyTime = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '5-10 min';
      case 'medium':
        return '15-20 min';
      case 'hard':
        return '25-30 min';
      default:
        return '>30 min'; // For very hard or unknown difficulties
    }
  };

  const handleDifficultyFilter = (difficulty: string) => {
    setDifficultyFilter(difficulty);
    // Small delay to show the selection before closing
    setTimeout(() => setShowDifficultyDropdown(false), 150);
  };


  const handleBookmarkFilter = (filter: string) => {
    setBookmarkFilter(filter);
    // Small delay to show the selection before closing
    setTimeout(() => setShowBookmarkDropdown(false), 150);
  };

  const toggleBookmark = (problemId: string) => {
    setBookmarkedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const handleCompletionFilter = (filter: string) => {
    setCompletionFilter(filter);
    // Small delay to show the selection before closing
    setTimeout(() => setShowCompletionDropdown(false), 150);
  };

  const toggleCompletion = (problemId: string) => {
    setCompletedProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemId)) {
        newSet.delete(problemId);
      } else {
        newSet.add(problemId);
      }
      return newSet;
    });
  };

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter;
    const matchesBookmark = bookmarkFilter === 'All' || 
                           (bookmarkFilter === 'Bookmarked' && bookmarkedProblems.has(problem.id)) ||
                           (bookmarkFilter === 'Not Bookmarked' && !bookmarkedProblems.has(problem.id));
    const matchesCompletion = completionFilter === 'All' || 
                             (completionFilter === 'Completed' && completedProblems.has(problem.id)) ||
                             (completionFilter === 'Not Completed' && !completedProblems.has(problem.id));
    return matchesSearch && matchesDifficulty && matchesBookmark && matchesCompletion;
  });

  // Get available difficulties for this module
  const availableDifficulties = ['All', ...Array.from(new Set(problems.map(p => p.difficulty)))];
  
  const availableBookmarkFilters = ['All', 'Bookmarked', 'Not Bookmarked'];
  const availableCompletionFilters = ['All', 'Completed', 'Not Completed'];

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

  const getTooltipText = (problemId: string, action: string) => {
    switch (action) {
      case 'bookmark':
        return bookmarkedProblems.has(problemId) ? 'Remove Bookmark' : 'Add Bookmark';
      case 'completion':
        return completedProblems.has(problemId) ? 'Mark as Not Done' : 'Mark as Done';
      case 'share':
        return 'Share Problem';
      default:
        return '';
    }
  };

  const renderTooltip = (problemId: string, action: string) => {
    if (hoveredAction?.problemId === problemId && hoveredAction?.action === action) {
      return (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            {getTooltipText(problemId, action)}
          </Text>
        </View>
      );
    }
    return null;
  };

  if (!moduleInfo) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.loadingText, { color: theme.colors.textPrimary }]}>Loading module...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#080A0D' }]}>
      <TouchableWithoutFeedback onPress={() => {
        setShowDifficultyDropdown(false);
        setShowBookmarkDropdown(false);
        setShowCompletionDropdown(false);
      }}>
        <View style={styles.container}>
          {/* Sticky Top Navigation Bar */}
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
              placeholder="Search problems or code patterns…"
              placeholderTextColor="#B4BCC8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchHint} onPress={() => searchInputRef.current?.focus()}>
              <Text style={styles.searchHintText}>⌘K</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.navRight}>
          {/* Difficulty Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={[styles.dropdownButton, { borderColor: theme.colors.border }]}
              onPress={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
            >
              <Text style={[styles.dropdownLabel, { color: theme.colors.textSecondary }]}>Difficulty</Text>
              <Text style={[styles.dropdownValue, { color: theme.colors.textPrimary }]}>
                {difficultyFilter}
              </Text>
              <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>
                {showDifficultyDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {showDifficultyDropdown && (
              <View style={[styles.dropdownMenu, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {availableDifficulties.map((difficulty) => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.dropdownItem,
                      { backgroundColor: difficulty === difficultyFilter ? theme.colors.primaryLight : 'transparent' }
                    ]}
                    onPress={() => handleDifficultyFilter(difficulty)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      { color: difficulty === difficultyFilter ? theme.colors.primary : theme.colors.textPrimary }
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>


          {/* Bookmark Filter Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={[styles.dropdownButton, { borderColor: theme.colors.border }]}
              onPress={() => setShowBookmarkDropdown(!showBookmarkDropdown)}
            >
              <Text style={[styles.dropdownLabel, { color: theme.colors.textSecondary }]}>Bookmark</Text>
              <Text style={[styles.dropdownValue, { color: theme.colors.textPrimary }]}>
                {bookmarkFilter}
              </Text>
              <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>
                {showBookmarkDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {showBookmarkDropdown && (
              <View style={[styles.dropdownMenu, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {availableBookmarkFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.dropdownItem,
                      { backgroundColor: filter === bookmarkFilter ? theme.colors.primaryLight : 'transparent' }
                    ]}
                    onPress={() => handleBookmarkFilter(filter)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      { color: filter === bookmarkFilter ? theme.colors.primary : theme.colors.textPrimary }
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Completion Filter Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={[styles.dropdownButton, { borderColor: theme.colors.border }]}
              onPress={() => setShowCompletionDropdown(!showCompletionDropdown)}
            >
              <Text style={[styles.dropdownLabel, { color: theme.colors.textSecondary }]}>Status</Text>
              <Text style={[styles.dropdownValue, { color: theme.colors.textPrimary }]}>
                {completionFilter}
              </Text>
              <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>
                {showCompletionDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {showCompletionDropdown && (
              <View style={[styles.dropdownMenu, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                {availableCompletionFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.dropdownItem,
                      { backgroundColor: filter === completionFilter ? theme.colors.primaryLight : 'transparent' }
                    ]}
                    onPress={() => handleCompletionFilter(filter)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      { color: filter === completionFilter ? theme.colors.primary : theme.colors.textPrimary }
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
              {filteredProblems.length}/{problems.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content - Card Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardGridContainer}>
          <View style={styles.problemsGrid}>
            {filteredProblems.map((problem) => (
              <View key={problem.id} style={[styles.problemCard, { 
                backgroundColor: '#111720',
                borderColor: '#1E2632'
              }]}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <Text style={[styles.problemTitle, { color: '#E8ECF2' }]}>
                    {renderHighlighted(problem.title)}
                  </Text>
                  <View style={[styles.difficultyBadge, { 
                    backgroundColor: getDifficultyColor(problem.difficulty)
                  }]}>
                    <Text style={[styles.difficultyText, { color: '#080A0D' }]}>
                      {problem.difficulty}
                    </Text>
                  </View>
                </View>
                
                {/* Meta Row */}
                <View style={styles.metaRow}>
                  <Text style={[styles.metaText, { color: '#B4BCC8' }]}>
                    ⏱ {getDifficultyTime(problem.difficulty)}
                  </Text>
                </View>
                
                {/* Description */}
                <Text style={[styles.problemDescription, { color: '#E8ECF2' }]} numberOfLines={4}>
                  {renderHighlighted(problem.description)}
                </Text>
                
                
                {/* Footer Actions */}
                <View style={styles.cardFooter}>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.primaryButton, { backgroundColor: '#F5D90A' }]}
                      onPress={() => handleProblemPress(problem.id)}
                    >
                      <Text style={[styles.primaryButtonText, { color: '#080A0D' }]}>Open</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.secondaryButton, { borderColor: '#29D3FF' }]}
                      onPress={() => handlePlaygroundPress(problem.id)}
                    >
                      <Text style={[styles.secondaryButtonText, { color: '#29D3FF' }]}>
                        Practice
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.quickActions}>
                    <TouchableOpacity 
                      style={[
                        styles.quickActionButton,
                        { backgroundColor: bookmarkedProblems.has(problem.id) ? 'rgba(245, 217, 10, 0.2)' : '#0C1116' }
                      ]}
                      onPress={() => toggleBookmark(problem.id)}
                      {...(Platform.OS === 'web' && {
                        onMouseEnter: () => setHoveredAction({problemId: problem.id, action: 'bookmark'}),
                        onMouseLeave: () => setHoveredAction(null)
                      })}
                    >
                      <Text style={[
                        styles.quickActionIcon,
                        { color: bookmarkedProblems.has(problem.id) ? '#F5D90A' : '#B4BCC8' }
                      ]}>
                        {bookmarkedProblems.has(problem.id) ? '🔖' : '🔖'}
                      </Text>
                      {renderTooltip(problem.id, 'bookmark')}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.quickActionButton} 
                      onPress={() => shareProblem(problem.id)}
                      {...(Platform.OS === 'web' && {
                        onMouseEnter: () => setHoveredAction({problemId: problem.id, action: 'share'}),
                        onMouseLeave: () => setHoveredAction(null)
                      })}
                    >
                      <Text style={styles.quickActionIcon}>📤</Text>
                      {renderTooltip(problem.id, 'share')}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.quickActionButton,
                        { backgroundColor: completedProblems.has(problem.id) ? 'rgba(16, 185, 129, 0.2)' : '#0C1116' }
                      ]}
                      onPress={() => toggleCompletion(problem.id)}
                      {...(Platform.OS === 'web' && {
                        onMouseEnter: () => setHoveredAction({problemId: problem.id, action: 'completion'}),
                        onMouseLeave: () => setHoveredAction(null)
                      })}
                    >
                      <Text style={[
                        styles.quickActionIcon,
                        { color: completedProblems.has(problem.id) ? '#10B981' : '#B4BCC8' }
                      ]}>
                        {completedProblems.has(problem.id) ? '✅' : '⭕'}
                      </Text>
                      {renderTooltip(problem.id, 'completion')}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
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
    backgroundColor: '#080A0D',
    // Note: React Native doesn't support CSS gradients directly
    // We'll use a solid color that represents the gradient effect
  },
  scrollView: {
    flex: 1,
    paddingTop: 100, // Adjusted for new nav height with proper padding
  },
  problemsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Changed to space-around for equal spacing
    gap: 16, // Gap between cards
  },
  problemCard: {
    width: '32%', // Slightly larger to accommodate bigger cards
    aspectRatio: 1, // Make cards square
    minWidth: 320, // Larger minimum width for bigger cards
    maxWidth: 380, // Increased maximum width
    marginTop: 20, // Added top margin for consistency
    marginBottom: 20, // Bottom margin to match top
    borderRadius: 12, // Slightly more rounded
    borderWidth: 1,
    padding: 20, // Increased internal padding
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderColor: '#1E2632',
    // Note: React Native doesn't support gradients directly
    // We'll use a solid color that represents the gradient effect
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // 8px header bottom margin
  },
  problemTitle: {
    fontSize: 20, // 20px as specified
    fontWeight: '600', // Weight 600 as specified
    flex: 1,
    marginRight: 12,
    lineHeight: 26,
    color: '#E8ECF2', // White color
  },
  problemDescription: {
    fontSize: 14, // Slightly smaller for better fit
    lineHeight: 20,
    marginBottom: 12, // 12px margin bottom
    color: '#E8ECF2', // Light gray with 92% opacity (represented by color)
  },
  highlight: {
    backgroundColor: 'rgba(245, 217, 10, 0.25)',
    borderRadius: 3,
    paddingHorizontal: 2,
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
  difficultyBadge: {
    paddingVertical: 6, // Reduced from 10px
    paddingHorizontal: 10, // Reduced from 14px
    borderRadius: 999, // 999px rounded (pill shape)
  },
  difficultyText: {
    fontSize: 10, // Reduced from 12px
    fontWeight: '700',
    color: '#080A0D', // Black text
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  primaryButton: {
    height: 40, // 40px height
    paddingHorizontal: 16, // Appropriate padding
    borderRadius: 8, // 8px radius as specified
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5D90A', // Bat-gold
    borderWidth: 0, // No border for filled button
  },
  primaryButtonText: {
    fontSize: 14, // 14px font size
    fontWeight: '700', // Bold
    color: '#080A0D', // Black text
  },
  secondaryButton: {
    height: 40, // 40px height
    paddingHorizontal: 16, // Appropriate padding
    borderRadius: 8, // 8px radius as specified
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // 1px border
    borderColor: '#29D3FF', // Cyan border
    backgroundColor: 'transparent', // Transparent background
  },
  secondaryButtonText: {
    fontSize: 14, // 14px font size
    fontWeight: '700', // Bold
    color: '#29D3FF', // Cyan text
  },
  bottomSpacing: {
    height: 100,
  },
  loadingText: {
    fontSize: 18,
  },
  center: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // New styles for the new UI
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 40, // Adjust for safe area
    paddingBottom: 16, // Add bottom padding for proper spacing from border
    paddingHorizontal: 24, // 24px padding as specified
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(41, 211, 255, 0.1)', // Subtle cyan glow
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
  navPillSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1E2632',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 8,
  },
  navPillIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  navPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16, // 16px gap
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 8, // 8px gap
    color: '#29D3FF', // Cyan accent
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  navLinks: {
    flexDirection: 'row',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8, // Match dropdown border radius
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0C1116', // Match dropdown background
    borderWidth: 1,
    borderColor: '#1E2632',
    minWidth: 400, // Wider than dropdowns
    height: 40, // Match dropdown height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 12, // Match dropdown text size
    paddingVertical: 0,
    paddingLeft: 6, // Space for icon
    paddingRight: 50, // Space for ⌘K hint
  },
  searchIcon: {
    fontSize: 14, // Smaller icon to match dropdown style
    marginRight: 8,
    color: '#B4BCC8', // Muted slate color
  },
  searchHint: {
    backgroundColor: '#0A0E13',
    borderRadius: 4, // Smaller radius to match compact design
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#1E2632',
  },
  searchHintText: {
    fontSize: 10, // Smaller text to match dropdown style
    fontWeight: '600',
    color: '#B4BCC8',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#0C1116',
    minWidth: 120,
  },
  dropdownLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginRight: 6,
    textTransform: 'uppercase',
  },
  dropdownValue: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    marginLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    marginBottom: 8, // 8px margin bottom
  },
  metaText: {
    fontSize: 15, // 15px as specified
    color: '#B4BCC8', // Gray color
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom of card
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10, // 10px between buttons as specified
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8, // 8px between icons
  },
  quickActionButton: {
    position: 'relative', // Enable absolute positioning for tooltips
    width: 32, // 32px width
    height: 32, // 32px height
    borderRadius: 8, // 8px radius as specified
    backgroundColor: '#0C1116', // Dark background
    borderWidth: 1,
    borderColor: '#1E2632', // Border color
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 14, // Appropriate icon size
    color: '#B4BCC8', // Muted color
  },
  cardGridContainer: {
    backgroundColor: '#0C1116', // Dark-blue tint with subtle cyan overlay effect
    borderRadius: 12, // Rounded container edges
    marginHorizontal: 40, // Increased margin to make container smaller
    marginTop: 20, // Added top margin
    marginBottom: 20,
    padding: 16, // Reduced padding to make container smaller
    borderWidth: 1,
    borderColor: '#1E2632', // 1px solid border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tooltip: {
    position: 'absolute',
    bottom: -35, // Position below the button
    left: '50%',
    transform: [{ translateX: -50 }], // Center horizontally
    backgroundColor: '#1A1D23',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 80,
  },
  tooltipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#E2E8F0',
    textAlign: 'center',
  },
});
