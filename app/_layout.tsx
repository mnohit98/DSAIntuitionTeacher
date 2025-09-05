import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
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
          name="playground/sliding-window/[id]" 
          options={{ 
            headerShown: false,
            title: "Sliding Window Playground",
            headerTitle: "Sliding Window Playground",
            presentation: 'card'
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
