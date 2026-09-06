import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="discover" options={{ presentation: 'card', title: 'Discover' }} />
        <Stack.Screen
          name="log/meal"
          options={{ presentation: 'modal', title: 'Log Meal' }}
        />
        <Stack.Screen
          name="log/exercise"
          options={{ presentation: 'modal', title: 'Log Exercise' }}
        />
        <Stack.Screen
          name="log/symptom"
          options={{ presentation: 'modal', title: 'Log Symptom' }}
        />
        <Stack.Screen
          name="log/water"
          options={{ presentation: 'modal', title: 'Log Water' }}
        />
      </Stack>
    </ThemeProvider>
  );
}
