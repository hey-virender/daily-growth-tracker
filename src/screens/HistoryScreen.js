import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns';
import useStore from '../store/useStore';
import { colors, typography, spacing, radii, shadows } from '../theme';

const HistoryScreen = () => {
  const { habits, completions } = useStore();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [viewMonth, setViewMonth] = useState(new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay(); // 0=Sun
  const blanks = Array(firstDayOfWeek).fill(null);

  const getDayCompletionRate = (dateKey) => {
    const dayData = completions[dateKey] || {};
    if (habits.length === 0) return 0;
    const done = habits.filter((h) => dayData[h.id]).length;
    return done / habits.length;
  };

  const selectedDayData = completions[selectedDate] || {};
  const selectedDayCompletions = habits.filter((h) => selectedDayData[h.id]);
  const selectedDayMissed = habits.filter((h) => !selectedDayData[h.id]);

  const getHeatColor = (rate) => {
    if (rate === 0) return colors.border;
    if (rate < 0.33) return '#FF6B6B40';
    if (rate < 0.66) return '#F59E0B60';
    if (rate < 1) return '#10B98180';
    return '#10B981';
  };

  const prevMonth = () => setViewMonth((m) => subDays(startOfMonth(m), 1));
  const nextMonth = () => {
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1);
    if (next <= new Date()) setViewMonth(next);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Track your journey over time</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          {/* Month Nav */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {format(viewMonth, 'MMMM yyyy')}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <Text key={d} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {blanks.map((_, i) => <View key={`blank-${i}`} style={styles.dayCell} />)}
            {monthDays.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const rate = getDayCompletionRate(key);
              const isSelected = key === selectedDate;
              const isFuture = day > new Date();

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.dayCell,
                    { backgroundColor: isFuture ? 'transparent' : getHeatColor(rate) },
                    isSelected && styles.selectedCell,
                  ]}
                  onPress={() => !isFuture && setSelectedDate(key)}
                  disabled={isFuture}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      isSelected && styles.selectedCellText,
                      isFuture && { color: colors.textMuted },
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendLabel}>Less</Text>
            {['#33333380', '#FF6B6B40', '#F59E0B60', '#10B98180', '#10B981'].map((c) => (
              <View key={c} style={[styles.legendDot, { backgroundColor: c }]} />
            ))}
            <Text style={styles.legendLabel}>More</Text>
          </View>
        </View>

        {/* Selected Day Details */}
        <View style={styles.dayDetail}>
          <Text style={styles.dayDetailTitle}>
            {format(new Date(selectedDate + 'T00:00:00'), 'EEEE, MMMM d')}
          </Text>
          <Text style={styles.dayDetailSub}>
            {selectedDayCompletions.length}/{habits.length} habits completed
          </Text>

          {selectedDayCompletions.length > 0 && (
            <View style={styles.completedList}>
              <Text style={styles.listGroupTitle}>✅ Completed</Text>
              {selectedDayCompletions.map((habit) => (
                <View key={habit.id} style={styles.habitRow}>
                  <View style={[styles.habitDot, { backgroundColor: habit.color }]} />
                  <Text style={styles.habitRowText}>{habit.name}</Text>
                </View>
              ))}
            </View>
          )}

          {selectedDayMissed.length > 0 && (
            <View style={styles.missedList}>
              <Text style={styles.listGroupTitle}>⏭ Skipped</Text>
              {selectedDayMissed.map((habit) => (
                <View key={habit.id} style={styles.habitRow}>
                  <View style={[styles.habitDot, { backgroundColor: colors.border }]} />
                  <Text style={[styles.habitRowText, { color: colors.textMuted }]}>{habit.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },

  content: { paddingHorizontal: spacing.xl },

  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },

  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  navBtn: {
    width: 36, height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },

  dayHeaders: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
    padding: 2,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + '30',
  },
  dayCellText: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  selectedCellText: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },

  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  legendDot: {
    width: 14, height: 14,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },

  dayDetail: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  dayDetailTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  dayDetailSub: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  completedList: { marginBottom: spacing.lg },
  missedList: {},
  listGroupTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  habitDot: { width: 8, height: 8, borderRadius: radii.full },
  habitRowText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
});

export default HistoryScreen;
