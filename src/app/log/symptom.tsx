import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { FormButton, FormTextInput } from '@/features/home';
import { addSymptomEntry, toDateKey, useSymptomLogForDate } from '@/features/period';
import { useTheme } from '@/hooks/use-theme';

const SEVERITY_LEVELS = [1, 2, 3, 4, 5];

function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export default function LogSymptomScreen() {
  const params = useLocalSearchParams<{ date?: string }>();
  const dateKey = params.date ?? toDateKey(new Date());
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(3);
  const theme = useTheme();
  const entries = useSymptomLogForDate(dateKey);

  const handleAdd = () => {
    if (!symptom.trim()) {
      return;
    }
    addSymptomEntry(dateKey, symptom.trim(), severity);
    setSymptom('');
    setSeverity(3);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Log Symptom</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {formatDateLabel(dateKey)}
        </ThemedText>

        <View style={styles.form}>
          <FormTextInput value={symptom} onChangeText={setSymptom} placeholder="Symptom (e.g. cramps)" />
          <View style={styles.severityRow}>
            {SEVERITY_LEVELS.map((level) => (
              <Pressable
                key={level}
                onPress={() => setSeverity(level)}
                style={[
                  styles.severityPill,
                  { backgroundColor: level === severity ? theme.text : theme.backgroundElement },
                ]}>
                <ThemedText type="small" themeColor={level === severity ? 'background' : 'text'}>
                  {level}
                </ThemedText>
              </Pressable>
            ))}
          </View>
          <FormButton label="Add" onPress={handleAdd} />
        </View>

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.listRow}>
              <ThemedText type="default">{item.symptom}</ThemedText>
              <ThemedText type="default" themeColor="textSecondary">
                Severity {item.severity}
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
  severityRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  severityPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
