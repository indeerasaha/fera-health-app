import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { addWaterEntry, FormButton, FormTextInput, useDailyLog } from '@/features/home';
import { useTheme } from '@/hooks/use-theme';

const QUICK_AMOUNTS_ML = [125, 250, 500];

export default function LogWaterScreen() {
  const [customAmount, setCustomAmount] = useState('');
  const theme = useTheme();
  const { waterMl, waterGoalMl } = useDailyLog();

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount, 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }
    addWaterEntry(amount);
    setCustomAmount('');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Log Water</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {waterMl} / {waterGoalMl} ml today
        </ThemedText>

        <View style={styles.quickRow}>
          {QUICK_AMOUNTS_ML.map((amount) => (
            <Pressable
              key={amount}
              onPress={() => addWaterEntry(amount)}
              style={[styles.quickButton, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="smallBold">+{amount}ml</ThemedText>
            </Pressable>
          ))}
        </View>

        <View style={styles.form}>
          <FormTextInput
            value={customAmount}
            onChangeText={setCustomAmount}
            placeholder="Custom amount (ml)"
            keyboardType="number-pad"
          />
          <FormButton label="Add" onPress={handleCustomAdd} />
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
    padding: Spacing.four,
    gap: Spacing.three,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  form: {
    gap: Spacing.two,
  },
});
