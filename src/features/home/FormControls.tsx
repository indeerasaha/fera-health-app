import { Pressable, StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function FormTextInput(props: TextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      {...props}
      style={[styles.input, { color: theme.text, borderColor: theme.backgroundElement }, props.style]}
    />
  );
}

export interface FormButtonProps {
  label: string;
  onPress: () => void;
}

export function FormButton({ label, onPress }: FormButtonProps) {
  const theme = useTheme();

  return (
    <Pressable style={[styles.button, { backgroundColor: theme.text }]} onPress={onPress}>
      <ThemedText type="smallBold" themeColor="background">
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  button: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});
