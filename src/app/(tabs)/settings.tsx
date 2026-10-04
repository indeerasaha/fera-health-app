import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { signOut, useAuth } from '@/features/auth';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const { session } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Settings</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Account, preferences, and notification settings will go here.
        </ThemedText>

        {session && (
          <ThemedText type="small" themeColor="textSecondary">
            Signed in as {session.user.email}
          </ThemedText>
        )}

        <Pressable style={[styles.button, { backgroundColor: theme.backgroundElement }]} onPress={signOut}>
          <ThemedText type="smallBold">Sign out</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  button: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});
