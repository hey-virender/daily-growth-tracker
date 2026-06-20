import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii, shadows } from '../theme';

const HabitCheckItem = ({ habit, completed, onToggle, streak = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: completed ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [completed]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
    ]).start();
    onToggle(habit.id);
  };

  const checkScale = checkAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.2, 1],
  });

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.container,
          completed && { borderColor: habit.color + '60', backgroundColor: habit.color + '10' },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: habit.color }]} />

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: habit.color + '20' }]}>
          <Ionicons name={habit.icon} size={22} color={habit.color} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.name, completed && styles.nameCompleted]}>{habit.name}</Text>
          <View style={styles.meta}>
            <View style={[styles.categoryPill, { backgroundColor: habit.color + '20' }]}>
              <Text style={[styles.categoryText, { color: habit.color }]}>
                {habit.category}
              </Text>
            </View>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={styles.streakCount}>{streak}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Checkbox */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            completed && { backgroundColor: habit.color, borderColor: habit.color },
          ]}
          onPress={handlePress}
        >
          <Animated.View style={{ transform: [{ scale: checkScale }] }}>
            {completed && <Ionicons name="checkmark" size={16} color="#fff" />}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  nameCompleted: {
    color: colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  categoryText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textTransform: 'capitalize',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  streakFire: {
    fontSize: 12,
  },
  streakCount: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
});

export default HabitCheckItem;
