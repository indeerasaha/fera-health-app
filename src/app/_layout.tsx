import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/features/auth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {isLoading ? (
          <ThemedView style={{ flex: 1 }} />
        ) : (
          <Stack>
            <Stack.Protected guard={!session}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!!session}>
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
            </Stack.Protected>
          </Stack>
        )}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
