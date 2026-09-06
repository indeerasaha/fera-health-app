import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ACTIONS = [
  { label: 'Log Meal', href: '/log/meal' },
  { label: 'Log Exercise', href: '/log/exercise' },
  { label: 'Log Symptom', href: '/log/symptom' },
] as const;

export function LogFAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleSelect = (href: (typeof ACTIONS)[number]['href']) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.fab,
          { backgroundColor: theme.text, bottom: BottomTabInset + insets.bottom + Spacing.three },
        ]}
        accessibilityLabel="Log an entry"
        accessibilityRole="button">
        <SymbolView tintColor={theme.background} name={{ ios: 'plus', android: 'add', web: 'add' }} size={24} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable onPress={() => {}}>
            <ThemedView
              type="backgroundElement"
              style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.three }]}>
              {ACTIONS.map((action) => (
                <Pressable key={action.href} style={styles.option} onPress={() => handleSelect(action.href)}>
                  <ThemedText type="default">{action.label}</ThemedText>
                </Pressable>
              ))}
              <Pressable style={styles.option} onPress={() => setOpen(false)}>
                <ThemedText type="default" themeColor="textSecondary">
                  Cancel
                </ThemedText>
              </Pressable>
            </ThemedView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    paddingTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  option: {
    paddingVertical: Spacing.three,
  },
});
