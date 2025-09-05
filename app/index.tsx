import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// @ts-ignore
import { ResizeMode, Video } from 'expo-av';
import { useTheme } from '../src/contexts/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

export default function Index() {
  const { theme } = useTheme();
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'DSA Intuition Teacher - Master Algorithms Through Interactive Learning';
    }
  }, []);

  const features = [
    {
      icon: '🎮',
      title: 'Interactive Playgrounds',
      description: 'Step-by-step visualizations with AI-guided learning'
    },
    {
      icon: '🤖',
      title: 'AI Teaching Assistants',
      description: 'Jarvis & CodeBot guide you through each algorithm'
    },
    {
      icon: '📊',
      title: 'Real-time Visualization',
      description: 'See algorithms in action with dynamic data structures'
    },
    {
      icon: '🎯',
      title: 'Pattern-Based Learning',
      description: 'Master sliding window, two pointers, and more'
    }
  ];

  const userFeedbacks = [
    {
      avatar: '👩‍💻',
      name: 'Tanya Sharma',
      role: 'Software Engineer at Microsoft',
      message: 'बहुत बढ़िया platform है! The interactive playgrounds helped me crack my FAANG interviews. AI guidance is game-changing!'
    },
    {
      avatar: '👨‍💼',
      name: 'Ankush Gussain',
      role: 'Full Stack Developer at Amazon',
      message: 'Finally found a platform that makes DSA concepts crystal clear! The sliding window visualization is simply amazing. Highly recommended!'
    },
    {
      avatar: '👨‍🎓',
      name: 'Prince Sharma',
      role: 'IIT Computer Science Student',
      message: 'Jarvis and CodeBot are like having personal coding mentors. The step-by-step approach helped me understand complex algorithms easily.'
    },
    {
      avatar: '👨‍🔬',
      name: 'Mohit Nautiyal',
      role: 'Data Scientist at Flipkart',
      message: 'The real-time visualizations are outstanding! I can finally see how algorithms work with different data structures. Perfect for interview prep!'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#080A0D' }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Video Background */}
        <View style={styles.heroSection}>
          {/* Video Background */}
          <View style={styles.videoContainer}>
            <Video
              source={require('../assets/video/hero-background.mov')}
              style={styles.heroVideo}
              shouldPlay={true}
              isLooping={true}
              isMuted={isMuted}
              volume={isMuted ? 0 : 1.0}
              resizeMode={ResizeMode.COVER}
              useNativeControls={false}
            />
          </View>
          
          {/* Video Overlay */}
          <View style={styles.heroOverlay} />
          
          {/* Mute/Unmute Button */}
          <TouchableOpacity 
            style={styles.muteButton}
            onPress={() => setIsMuted(!isMuted)}
            activeOpacity={0.8}
          >
            <Text style={styles.muteButtonText}>
              {isMuted ? '🔇' : '🔊'}
            </Text>
          </TouchableOpacity>
          
          {/* Hero Content */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>🎯 DSA Intuition Teacher</Text>
            <Text style={styles.heroSubtitle}>
              Master algorithms through interactive learning with AI-powered visualizations
            </Text>
            <Text style={styles.heroDescription}>
              Transform your coding skills with step-by-step algorithm playgrounds, 
              real-time visualizations, and personalized AI guidance.
            </Text>
            
            <View style={styles.ctaButtons}>
              <TouchableOpacity 
                style={styles.primaryCTA}
                onPress={() => router.push('/home')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryCTAText}>🚀 Start Learning</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>✨ Why Choose DSA Intuition Teacher?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Interactive Demo Preview */}
        <View style={styles.demoSection}>
          <Text style={styles.sectionTitle}>🎮 Interactive Learning Experience</Text>
          <View style={styles.demoCard}>
            <View style={styles.demoHeader}>
              <Text style={styles.demoTitle}>Sliding Window Algorithm</Text>
              <View style={styles.demoBadge}>
                <Text style={styles.demoBadgeText}>Live Demo</Text>
              </View>
            </View>
            <Text style={styles.demoDescription}>
              Experience our interactive playground where you can visualize algorithms 
              step-by-step with AI guidance and real-time feedback.
            </Text>
            <View style={styles.demoFeatures}>
              <View style={styles.demoFeature}>
                <Text style={styles.demoFeatureIcon}>🤖</Text>
                <Text style={styles.demoFeatureText}>AI Teaching Assistants</Text>
              </View>
              <View style={styles.demoFeature}>
                <Text style={styles.demoFeatureIcon}>📊</Text>
                <Text style={styles.demoFeatureText}>Real-time Visualization</Text>
              </View>
              <View style={styles.demoFeature}>
                <Text style={styles.demoFeatureIcon}>💡</Text>
                <Text style={styles.demoFeatureText}>Step-by-step Guidance</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => router.push('/playground/sliding-window/p1')}
              activeOpacity={0.8}
            >
              <Text style={styles.demoButtonText}>Try Interactive Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Feedback Section */}
        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>💬 What Our Learners Say</Text>
          <View style={styles.feedbackGrid}>
            {userFeedbacks.map((feedback, index) => (
              <View key={index} style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userAvatar}>{feedback.avatar}</Text>
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{feedback.name}</Text>
                      <Text style={styles.userRole}>{feedback.role}</Text>
                    </View>
                  </View>
                  <View style={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={styles.star}>⭐</Text>
                    ))}
                  </View>
                </View>
                <Text style={styles.feedbackText}>"{feedback.message}"</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Final CTA */}
        <View style={styles.finalCTA}>
          <Text style={styles.finalCTATitle}>Ready to Master Algorithms?</Text>
          <Text style={styles.finalCTADescription}>
            Join thousands of developers who've transformed their coding skills 
            with our interactive learning platform.
          </Text>
          <TouchableOpacity 
            style={styles.finalCTAButton}
            onPress={() => router.push('/home')}
            activeOpacity={0.8}
          >
            <Text style={styles.finalCTAButtonText}>Start Your Journey</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
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
  
  // Hero Section
  heroSection: {
    height: 600,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroVideo: {
    width: '100%',
    height: '100%',
    marginLeft: 220
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(8, 10, 13, 0.7)',
  },
  muteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  muteButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 800,
    zIndex: 2,
    paddingHorizontal: 24,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#E8ECF2',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(41, 211, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#29D3FF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  heroDescription: {
    fontSize: 18,
    color: '#B4BCC8',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryCTA: {
    backgroundColor: '#F5D90A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCTAText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#080A0D',
  },
  secondaryCTA: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#29D3FF',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  secondaryCTAText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#29D3FF',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    backgroundColor: '#0C1116',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E8ECF2',
    textAlign: 'center',
    marginBottom: 40,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#111720',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E2632',
    alignItems: 'center',
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8ECF2',
    textAlign: 'center',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 14,
    color: '#B4BCC8',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Feedback Section
  feedbackSection: {
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  feedbackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  feedbackCard: {
    width: '48%',
    backgroundColor: '#111720',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E2632',
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E8ECF2',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#B4BCC8',
  },
  rating: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 12,
    marginLeft: 1,
  },
  feedbackText: {
    fontSize: 14,
    color: '#B4BCC8',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Demo Section
  demoSection: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    backgroundColor: '#0C1116',
  },
  demoCard: {
    backgroundColor: '#111720',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E2632',
    shadowColor: '#29D3FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  demoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E8ECF2',
  },
  demoBadge: {
    backgroundColor: '#F5D90A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  demoBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#080A0D',
  },
  demoDescription: {
    fontSize: 16,
    color: '#B4BCC8',
    lineHeight: 24,
    marginBottom: 24,
  },
  demoFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  demoFeature: {
    alignItems: 'center',
  },
  demoFeatureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  demoFeatureText: {
    fontSize: 12,
    color: '#B4BCC8',
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: '#29D3FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#080A0D',
  },

  // Final CTA
  finalCTA: {
    paddingHorizontal: 24,
    paddingVertical: 60,
    alignItems: 'center',
  },
  finalCTATitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E8ECF2',
    textAlign: 'center',
    marginBottom: 16,
  },
  finalCTADescription: {
    fontSize: 18,
    color: '#B4BCC8',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
    maxWidth: 600,
  },
  finalCTAButton: {
    backgroundColor: '#F5D90A',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#F5D90A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  finalCTAButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#080A0D',
  },

  bottomSpacing: {
    height: 40,
  },
});