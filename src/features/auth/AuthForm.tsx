import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface AuthFormProps {
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function AuthForm({ submitLabel, onSubmit }: AuthFormProps) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Enter an email and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoComplete="password"
        secureTextEntry
        style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }]}
      />

      {error && (
        <ThemedText type="small" themeColor="accent">
          {error}
        </ThemedText>
      )}

      <Pressable
        style={[styles.button, { backgroundColor: theme.text, opacity: isSubmitting ? 0.6 : 1 }]}
        onPress={handleSubmit}
        disabled={isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color={theme.background} />
        ) : (
          <ThemedText type="smallBold" themeColor="background">
            {submitLabel}
          </ThemedText>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    marginTop: Spacing.one,
  },
});
