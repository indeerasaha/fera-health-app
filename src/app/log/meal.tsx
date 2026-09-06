import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { addMealEntry, FormButton, FormTextInput, useDailyLog } from '@/features/home';
import { useTheme } from '@/hooks/use-theme';
import type { MealCategory } from '@/types';

const CATEGORIES: { key: MealCategory; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

function isMealCategory(value: unknown): value is MealCategory {
  return value === 'breakfast' || value === 'lunch' || value === 'dinner' || value === 'snacks';
}

export default function LogMealScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [category, setCategory] = useState<MealCategory>(
    isMealCategory(params.category) ? params.category : 'breakfast'
  );
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const theme = useTheme();
  const { meals } = useDailyLog();

  const entries = useMemo(() => meals.filter((meal) => meal.category === category), [meals, category]);
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  const handleAdd = () => {
    const parsedCalories = parseInt(calories, 10);
    if (!name.trim() || !Number.isFinite(parsedCalories) || parsedCalories <= 0) {
      return;
    }
    addMealEntry(category, name.trim(), parsedCalories);
    setName('');
    setCalories('');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Log Meal</ThemedText>

        <View style={styles.categoryRow}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              style={[
                styles.categoryPill,
                { backgroundColor: c.key === category ? theme.text : theme.backgroundElement },
              ]}>
              <ThemedText type="small" themeColor={c.key === category ? 'background' : 'text'}>
                {c.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText type="small" themeColor="textSecondary">
          {totalCalories} kcal logged for {CATEGORIES.find((c) => c.key === category)?.label.toLowerCase()}
        </ThemedText>

        <View style={styles.form}>
          <FormTextInput value={name} onChangeText={setName} placeholder="Food name" />
          <FormTextInput
            value={calories}
            onChangeText={setCalories}
            placeholder="Calories"
            keyboardType="number-pad"
          />
          <FormButton label="Add" onPress={handleAdd} />
        </View>

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listRow}>
              <ThemedText type="default">{item.name}</ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                {item.calories} kcal
              </ThemedText>
            </View>
          )}
          ListEmptyComponent={
            <ThemedText type="small" themeColor="textSecondary">
              Nothing logged yet.
            </ThemedText>
          }
        />
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
  categoryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  categoryPill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
  },
  form: {
    gap: Spacing.two,
  },
  list: {
    flex: 1,
  },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000022',
  },
});
