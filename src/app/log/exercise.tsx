import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { addExerciseEntry, FormButton, FormTextInput, useDailyLog } from '@/features/home';

export default function LogExerciseScreen() {
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const { exercises, caloriesBurned: totalBurned } = useDailyLog();

  const handleAdd = () => {
    const durationMinutes = parseInt(duration, 10);
    const calories = parseInt(caloriesBurned, 10);
    if (
      !activity.trim() ||
      !Number.isFinite(durationMinutes) ||
      durationMinutes <= 0 ||
      !Number.isFinite(calories) ||
      calories <= 0
    ) {
      return;
    }
    addExerciseEntry(activity.trim(), durationMinutes, calories);
    setActivity('');
    setDuration('');
    setCaloriesBurned('');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Log Exercise</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {totalBurned} kcal burned today
        </ThemedText>

        <View style={styles.form}>
          <FormTextInput value={activity} onChangeText={setActivity} placeholder="Activity" />
          <FormTextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="Duration (minutes)"
            keyboardType="number-pad"
          />
          <FormTextInput
            value={caloriesBurned}
            onChangeText={setCaloriesBurned}
            placeholder="Calories burned"
            keyboardType="number-pad"
          />
          <FormButton label="Add" onPress={handleAdd} />
        </View>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listRow}>
              <ThemedText type="default">{item.activity}</ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                {item.durationMinutes} min · {item.caloriesBurned} kcal
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
