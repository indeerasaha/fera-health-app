import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { AuthForm, signUpWithEmail } from '@/features/auth';

export default function SignUpScreen() {
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    await signUpWithEmail(email, password);
    setConfirmationSent(true);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title">Create account</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Track eating, exercise, and your cycle in one place.
          </ThemedText>
        </View>

        {confirmationSent ? (
          <ThemedText type="default">
            Check your email to confirm your account, then sign in.
          </ThemedText>
        ) : (
          <AuthForm submitLabel="Sign up" onSubmit={handleSubmit} />
        )}

        <View style={styles.footer}>
          <ThemedText type="small" themeColor="textSecondary">
            Already have an account?
          </ThemedText>
          <Link href="/sign-in" replace>
            <ThemedText type="small" themeColor="accent">
              Sign in
            </ThemedText>
          </Link>
        </View>
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
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
  },
});
