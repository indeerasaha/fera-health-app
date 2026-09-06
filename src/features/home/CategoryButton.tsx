import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export const CATEGORY_BUTTON_SIZE = 100; // slightly bigger to fit text comfortably

export interface CategoryButtonProps {
  label: string;
  subtitle: string;
  icon: SymbolViewProps['name'];
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function CategoryButton({ label, subtitle, icon, onPress, style }: CategoryButtonProps) {
  const theme = useTheme();

  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.backgroundElement },
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Log ${label}`}>
        <SymbolView tintColor={theme.categoryIcon} name={icon} size={20} />
        <ThemedText type="small" style={styles.label} numberOfLines={1}>
          {label}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: CATEGORY_BUTTON_SIZE,
    height: CATEGORY_BUTTON_SIZE,
    borderRadius: CATEGORY_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
    fontSize: 12,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 10,
  },
});