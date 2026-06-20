import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../theme';

const StreakBadge = ({ streak, longest, size = 'md' }) => {
  const isLarge = size === 'lg';
  
  if (streak === 0) return null;
  
  const getMilestone = (n) => {
    if (n >= 100) return { emoji: '🏆', label: 'Legend' };
    if (n >= 50) return { emoji: '💎', label: 'Diamond' };
    if (n >= 30) return { emoji: '⚡', label: 'Lightning' };
    if (n >= 14) return { emoji: '🌟', label: 'Star' };
    if (n >= 7) return { emoji: '🔥', label: 'On Fire' };
    return { emoji: '✨', label: 'Growing' };
  };

  const milestone = getMilestone(streak);

  return (
    <View style={[styles.container, isLarge && styles.containerLarge]}>
      <Text style={[styles.emoji, isLarge && styles.emojiLarge]}>{milestone.emoji}</Text>
      <View>
        <Text style={[styles.streak, isLarge && styles.streakLarge]}>{streak} day streak</Text>
        {isLarge && (
          <Text style={styles.milestone}>{milestone.label}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B20',
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  containerLarge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: '#F59E0B15',
    borderWidth: 1,
    borderColor: '#F59E0B30',
  },
  emoji: {
    fontSize: 16,
  },
  emojiLarge: {
    fontSize: 28,
  },
  streak: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: '#F59E0B',
  },
  streakLarge: {
    fontSize: typography.sizes.lg,
  },
  milestone: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

export default StreakBadge;
