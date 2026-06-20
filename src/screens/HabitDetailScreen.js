import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import useStore from '../store/useStore';
import StreakBadge from '../components/StreakBadge';
import { colors, typography, spacing, radii, shadows } from '../theme';
import {
  calculateStreak,
  calculateLongestStreak,
  getCompletionRate,
  getWeeklyData,
  formatDate,
} from '../utils/dateUtils';

const { width } = Dimensions.get('window');

const HabitDetailScreen = ({ navigation, route }) => {
  const { habitId } = route.params;
  const { habits, completions } = useStore();
  const habit = habits.find((h) => h.id === habitId);

  if (!habit) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Habit not found</Text>
      </View>
    );
  }

  const streak = calculateStreak(completions, habitId);
  const longest = calculateLongestStreak(completions, habitId);
  const rate7 = getCompletionRate(completions, habitId, 7);
  const rate30 = getCompletionRate(completions, habitId, 30);
  const weekData = getWeeklyData(completions, habitId);

  const chartData = {
    labels: weekData.map((d) => d.label),
    datasets: [{ data: weekData.map((d) => (d.completed ? 1 : 0)) }],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
    labelColor: () => colors.textMuted,
    style: { borderRadius: radii.lg },
    propsForDots: { r: '5', strokeWidth: '2', stroke: colors.primary },
    barPercentage: 0.7,
  };

  const statItems = [
    { label: 'Current Streak', value: `${streak}d`, icon: 'flame-outline', color: '#F59E0B' },
    { label: 'Longest Streak', value: `${longest}d`, icon: 'trophy-outline', color: '#6C63FF' },
    { label: '7-day Rate', value: `${rate7}%`, icon: 'trending-up-outline', color: '#10B981' },
    { label: '30-day Rate', value: `${rate30}%`, icon: 'calendar-outline', color: '#3B82F6' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{habit.name}</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AddHabit', { habitId })}
        >
          <Ionicons name="pencil-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero Card */}
        <View style={[styles.heroCard, { borderColor: habit.color + '40' }]}>
          <View style={[styles.heroIcon, { backgroundColor: habit.color + '20' }]}>
            <Ionicons name={habit.icon} size={40} color={habit.color} />
          </View>
          <Text style={styles.heroName}>{habit.name}</Text>
          {habit.description ? (
            <Text style={styles.heroDesc}>{habit.description}</Text>
          ) : null}
          <View style={[styles.categoryBadge, { backgroundColor: habit.color + '20', borderColor: habit.color + '40' }]}>
            <Ionicons name={habit.icon} size={13} color={habit.color} />
            <Text style={[styles.categoryBadgeText, { color: habit.color }]}>
              {habit.category}
            </Text>
          </View>
          {streak > 0 && <StreakBadge streak={streak} size="lg" style={{ marginTop: spacing.md }} />}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statItems.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>7-Day Overview</Text>
          <Text style={styles.chartSubtitle}>Completion per day this week</Text>
          <BarChart
            data={chartData}
            width={width - spacing.xl * 4}
            height={160}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showBarTops={false}
            withInnerLines={false}
          />

          {/* Day dots */}
          <View style={styles.dayDots}>
            {weekData.map((day) => (
              <View key={day.date} style={styles.dayDot}>
                <View
                  style={[
                    styles.dot,
                    day.completed
                      ? { backgroundColor: habit.color }
                      : { backgroundColor: colors.border },
                  ]}
                />
                <Text style={styles.dotLabel}>{day.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Created at */}
        <Text style={styles.createdAt}>
          Started tracking on {formatDate(habit.createdAt)}
        </Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  notFoundText: { color: colors.textSecondary },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: radii.full,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, color: colors.text,
    marginHorizontal: spacing.md,
  },
  editBtn: {
    width: 36, height: 36, borderRadius: radii.full,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },

  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },

  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing['2xl'],
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    ...shadows.md,
  },
  heroIcon: {
    width: 80, height: 80, borderRadius: radii.xl,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  heroName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroDesc: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  categoryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: spacing.md, paddingVertical: 5,
    borderRadius: radii.full, borderWidth: 1, marginBottom: spacing.md,
  },
  categoryBadgeText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    textTransform: 'capitalize',
  },

  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statIcon: {
    width: 40, height: 40, borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.sizes.xs, color: colors.textMuted, textAlign: 'center',
  },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  chartTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  chart: { borderRadius: radii.md, marginLeft: -spacing.lg },

  dayDots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
  },
  dayDot: { alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: radii.full },
  dotLabel: { fontSize: typography.sizes.xs, color: colors.textMuted },

  createdAt: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default HabitDetailScreen;
