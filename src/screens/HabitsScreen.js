import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import { colors, typography, spacing, radii, shadows } from '../theme';
import { calculateStreak, getCompletionRate } from '../utils/dateUtils';

const CATEGORY_LIST = ['all', 'fitness', 'learning', 'mindfulness', 'health', 'productivity', 'social'];

const HabitsScreen = ({ navigation }) => {
  const { habits, completions, deleteHabit } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? habits
    : habits.filter((h) => h.category === activeCategory);

  const handleDelete = (habit) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This will remove all completion history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddHabit')}
        >
          <Ionicons name="add" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {CATEGORY_LIST.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterPill,
              activeCategory === cat && styles.filterPillActive,
              activeCategory === cat && cat !== 'all' && {
                backgroundColor: colors.categories[cat]?.bg + '30',
                borderColor: colors.categories[cat]?.bg,
              },
            ]}
            onPress={() => setActiveCategory(cat)}
          >
            {cat !== 'all' && (
              <Ionicons
                name={colors.categories[cat]?.icon}
                size={13}
                color={activeCategory === cat ? (colors.categories[cat]?.bg || colors.primary) : colors.textMuted}
              />
            )}
            <Text
              style={[
                styles.filterText,
                activeCategory === cat && {
                  color: cat === 'all' ? colors.primary : (colors.categories[cat]?.bg || colors.primary),
                },
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((habit) => {
          const streak = calculateStreak(completions, habit.id);
          const rate = getCompletionRate(completions, habit.id, 7);

          return (
            <TouchableOpacity
              key={habit.id}
              style={styles.card}
              onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}
              activeOpacity={0.8}
            >
              <View style={[styles.cardAccent, { backgroundColor: habit.color }]} />
              <View style={[styles.iconWrap, { backgroundColor: habit.color + '20' }]}>
                <Ionicons name={habit.icon} size={26} color={habit.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {habit.description ? (
                  <Text style={styles.habitDesc} numberOfLines={1}>{habit.description}</Text>
                ) : null}
                <View style={styles.statsRow}>
                  {streak > 0 && (
                    <View style={styles.statChip}>
                      <Text style={styles.statChipText}>🔥 {streak}d streak</Text>
                    </View>
                  )}
                  <View style={[styles.statChip, { backgroundColor: colors.accent + '20' }]}>
                    <Text style={[styles.statChipText, { color: colors.accent }]}>
                      {rate}% this week
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('AddHabit', { habitId: habit.id })}
                >
                  <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { marginTop: spacing.xs }]}
                  onPress={() => handleDelete(habit)}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🤔</Text>
            <Text style={styles.emptyText}>No habits in this category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddHabit')}>
              <Text style={styles.emptyLink}>+ Add one now</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },

  filterScroll: { marginBottom: spacing.md },
  filterContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  filterText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },

  listContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm },

  card: {
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
  cardAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginRight: spacing.md,
  },
  cardContent: { flex: 1 },
  habitName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  habitDesc: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  statChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    backgroundColor: '#F59E0B20',
  },
  statChipText: {
    fontSize: typography.sizes.xs,
    color: '#F59E0B',
    fontWeight: typography.weights.medium,
  },

  actions: { marginLeft: spacing.sm, alignItems: 'center' },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { alignItems: 'center', paddingVertical: spacing['4xl'] },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  emptyLink: {
    fontSize: typography.sizes.md,
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
});

export default HabitsScreen;
