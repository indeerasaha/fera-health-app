import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { CalorieRing } from '@/features/home/CalorieRing';
import { CATEGORY_BUTTON_SIZE, CategoryButton } from '@/features/home/CategoryButton';
import { useDailyLog } from '@/features/home/dailyLogStore';
import type { MealCategory } from '@/types';

const CONTAINER_SIZE = 400;
const ORBIT_RADIUS = 150;


type SectorKey = MealCategory | 'exercise' | 'water';

interface Sector {
  key: SectorKey;
  label: string;
  angleDeg: number;
  icon: SymbolViewProps['name'];
}

const SECTORS: Sector[] = [
  { key: 'breakfast', label: 'Breakfast', angleDeg: -90, icon: { ios: 'sunrise.fill', android: 'breakfast_dining', web: 'breakfast_dining' } },
  { key: 'lunch', label: 'Lunch', angleDeg: -30, icon: { ios: 'fork.knife', android: 'lunch_dining', web: 'lunch_dining' } },
  { key: 'dinner', label: 'Dinner', angleDeg: 30, icon: { ios: 'moon.stars.fill', android: 'dinner_dining', web: 'dinner_dining' } },
  { key: 'snacks', label: 'Snacks', angleDeg: 90, icon: { ios: 'bag.fill', android: 'fastfood', web: 'fastfood' } },
  { key: 'exercise', label: 'Exercise', angleDeg: 150, icon: { ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' } },
  { key: 'water', label: 'Water', angleDeg: 210, icon: { ios: 'drop.fill', android: 'water_drop', web: 'water_drop' } },
];

function positionForAngle(angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const center = CONTAINER_SIZE / 2;
  return {
    left: center + ORBIT_RADIUS * Math.cos(angleRad) - CATEGORY_BUTTON_SIZE / 2,
    top: center + ORBIT_RADIUS * Math.sin(angleRad) - CATEGORY_BUTTON_SIZE / 2,
  };
}

function isMealCategory(key: SectorKey): key is MealCategory {
  return key === 'breakfast' || key === 'lunch' || key === 'dinner' || key === 'snacks';
}

export function DailyDashboard() {
  const router = useRouter();
  const { caloriesByCategory, caloriesConsumed, calorieGoal, caloriesBurned, waterMl, waterGoalMl } = useDailyLog();

  const subtitleFor = (key: SectorKey) => {
    if (isMealCategory(key)) {
      return `${caloriesByCategory[key]} kcal`;
    }
    if (key === 'exercise') {
      return `${caloriesBurned} kcal`;
    }
    return `${Math.round(waterMl / 250)}/${Math.round(waterGoalMl / 250)} cups`;
  };

  const handlePress = (key: SectorKey) => {
    if (key === 'exercise') {
      router.push('/log/exercise');
    } else if (key === 'water') {
      router.push('/log/water');
    } else {
      router.push({ pathname: '/log/meal', params: { category: key } });
    }
  };

  return (
    <View style={styles.container}>
      <CalorieRing consumed={caloriesConsumed} goal={calorieGoal} />
      {SECTORS.map((sector) => (
        <CategoryButton
          key={sector.key}
          label={sector.label}
          subtitle={subtitleFor(sector.key)}
          icon={sector.icon}
          onPress={() => handlePress(sector.key)}
          style={[styles.buttonSlot, positionForAngle(sector.angleDeg)]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSlot: {
    position: 'absolute',
  },
});
