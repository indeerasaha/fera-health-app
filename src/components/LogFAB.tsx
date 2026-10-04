import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
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

const FAB_SIZE = 56;
const EDGE_PADDING = Spacing.two;
const DRAG_ACTIVATION_MS = 2000;

export function LogFAB() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const defaultRight = Spacing.four;
  const defaultBottom = BottomTabInset + insets.bottom + Spacing.three;
  const defaultLeft = screenWidth - defaultRight - FAB_SIZE;
  const defaultTop = screenHeight - defaultBottom - FAB_SIZE;

  const minTranslateX = EDGE_PADDING - defaultLeft;
  const maxTranslateX = screenWidth - FAB_SIZE - EDGE_PADDING - defaultLeft;
  const minTranslateY = insets.top + EDGE_PADDING - defaultTop;
  const maxTranslateY = screenHeight - FAB_SIZE - insets.bottom - EDGE_PADDING - defaultTop;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const dragStartY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);

  const handleOpen = () => setOpen(true);

  const tapGesture = Gesture.Tap()
    .maxDuration(DRAG_ACTIVATION_MS)
    .onBegin(() => {
      scale.value = withTiming(0.95, { duration: 100 });
    })
    .onEnd(() => {
      runOnJS(handleOpen)();
    })
    .onFinalize(() => {
      if (!isDragging.value) {
        scale.value = withTiming(1, { duration: 100 });
      }
    });

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(DRAG_ACTIVATION_MS)
    .onStart(() => {
      isDragging.value = true;
      dragStartX.value = translateX.value;
      dragStartY.value = translateY.value;
      scale.value = withSpring(1.15);
    })
    .onUpdate((event) => {
      translateX.value = Math.min(Math.max(dragStartX.value + event.translationX, minTranslateX), maxTranslateX);
      translateY.value = Math.min(Math.max(dragStartY.value + event.translationY, minTranslateY), maxTranslateY);
    })
    .onFinalize(() => {
      isDragging.value = false;
      scale.value = withSpring(1);
    });

  const gesture = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  const handleSelect = (href: (typeof ACTIONS)[number]['href']) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.fab,
            { backgroundColor: theme.text, right: defaultRight, bottom: defaultBottom },
            animatedStyle,
          ]}
          accessibilityLabel="Log an entry. Hold for 2 seconds to drag and reposition."
          accessibilityRole="button">
          <SymbolView tintColor={theme.background} name={{ ios: 'plus', android: 'add', web: 'add' }} size={24} />
        </Animated.View>
      </GestureDetector>

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
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
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
