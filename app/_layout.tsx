import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { ThemeProvider } from '../src/contexts/ThemeContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the splash screen after the resources have been loaded
    SplashScreen.hideAsync();
    
    // Set default document title for web
    if (typeof document !== 'undefined') {
      document.title = 'DSA Intuition Teacher';
    }
  }, []);

  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" backgroundColor="#080A0D" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen 
          name="module" 
          options={{ 
            headerShown: false,
            title: "All Modules"
          }} 
        />
        <Stack.Screen 
          name="module/[id]" 
          options={{ 
            headerShown: false,
            title: "Module Details"
          }} 
        />
        <Stack.Screen 
          name="problem/[id]" 
          options={{ 
            headerShown: false,
            title: "Problem Details"
          }} 
        />
        <Stack.Screen name="playground" options={{ headerShown: false }} />
        <Stack.Screen 
          name="playground/[topic]/[id]" 
          options={{ 
            headerShown: false,
            title: "Redirecting...",
            presentation: 'card'
          }} 
        />
        <Stack.Screen 
          name="practice/[module]/[id]" 
          options={{ 
            headerShown: false,
            title: "Playground",
            headerTitle: "Playground",
            presentation: 'card'
          }} 
        />
        <Stack.Screen 
          name="practice/[topic]/[id]" 
          options={{ 
            headerShown: false,
            title: "Playground",
            headerTitle: "Playground",
            presentation: 'card'
          }} 
        />
        <Stack.Screen 
          name="[id]" 
          options={{ 
            headerShown: false,
            title: "Playground",
            headerTitle: "Playground",
            presentation: 'card'
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
