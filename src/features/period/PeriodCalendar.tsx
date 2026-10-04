import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { toDateKey } from '@/features/period/date';
import { useLoggedDates } from '@/features/period/symptomLogStore';
import { useTheme } from '@/hooks/use-theme';

const YEAR = 2026;
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTHS = Array.from({ length: 12 }, (_, monthIndex) => ({
  key: `${YEAR}-${monthIndex}`,
  monthIndex,
}));

function buildDayCells(monthIndex: number): (number | null)[] {
  const leadingBlanks = new Date(YEAR, monthIndex, 1).getDay();
  const daysInMonth = new Date(YEAR, monthIndex + 1, 0).getDate();

  const cells: (number | null)[] = Array.from({ length: leadingBlanks }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

function MonthSection({ monthIndex }: { monthIndex: number }) {
  const router = useRouter();
  const theme = useTheme();
  const loggedDates = useLoggedDates();
  const cells = useMemo(() => buildDayCells(monthIndex), [monthIndex]);
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const handlePressDay = (day: number) => {
    router.push({ pathname: '/log/symptom', params: { date: toDateKey(new Date(YEAR, monthIndex, day)) } });
  };

  return (
    <View style={styles.month}>
      <ThemedText type="subtitle" style={styles.monthTitle}>
        {MONTH_NAMES[monthIndex]} {YEAR}
      </ThemedText>
      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label, index) => (
          <ThemedText key={index} type="small" themeColor="textSecondary" style={styles.weekdayLabel}>
            {label}
          </ThemedText>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, index) => {
          if (day === null) {
            return <View key={index} style={styles.dayCell} />;
          }
          const dateKey = toDateKey(new Date(YEAR, monthIndex, day));
          const hasLog = Boolean(loggedDates[dateKey]?.length);
          const isToday = dateKey === todayKey;
          return (
            <Pressable
              key={index}
              style={styles.dayCell}
              onPress={() => handlePressDay(day)}
              accessibilityRole="button"
              accessibilityLabel={`Log symptoms for ${MONTH_NAMES[monthIndex]} ${day}`}>
              <View
                style={[
                  styles.dayCircle,
                  hasLog && { backgroundColor: theme.backgroundSelected },
                  isToday && { borderWidth: 1.5, borderColor: theme.accent },
                ]}>
                <ThemedText type="small">{day}</ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function PeriodCalendar() {
  return (
    <FlatList
      data={MONTHS}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => <MonthSection monthIndex={item.monthIndex} />}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={5}
      removeClippedSubviews
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: Spacing.six,
  },
  month: {
    marginBottom: Spacing.four,
  },
  monthTitle: {
    marginBottom: Spacing.two,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
