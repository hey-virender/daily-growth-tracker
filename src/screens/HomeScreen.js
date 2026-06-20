import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import HabitCheckItem from '../components/HabitCheckItem';
import ProgressRing from '../components/ProgressRing';
import { colors, typography, spacing, radii, shadows } from '../theme';
import { calculateStreak } from '../utils/dateUtils';

const HomeScreen = ({ navigation }) => {
  const { habits, completions, toggleCompletion, getTodayCompletions } = useStore();
  const todayCompletions = getTodayCompletions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const completedCount = habits.filter((h) => todayCompletions[h.id]).length;
  const progress = habits.length > 0 ? completedCount / habits.length : 0;
  const today = format(new Date(), 'EEEE, MMMM d');

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good Morning' : greetingHour < 17 ? 'Good Afternoon' : 'Good Evening';

  const motivationalMessages = [
    "Every day is a new chance to grow 🌱",
    "Small steps lead to big changes 💪",
    "Consistency is the key to mastery 🗝️",
    "You're building the best version of yourself ✨",
  ];
  const message = motivationalMessages[new Date().getDate() % motivationalMessages.length];

  // Group habits by category
  const categoryGroups = habits.reduce((acc, habit) => {
    if (!acc[habit.category]) acc[habit.category] = [];
    acc[habit.category].push(habit);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddHabit')}
          >
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>

        {/* Progress Card */}
        <Animated.View style={[styles.progressCard, { opacity: fadeAnim }]}>
          <View style={styles.progressLeft}>
            <ProgressRing
              progress={progress}
              size={130}
              strokeWidth={10}
              label="Done"
              sublabel={`${completedCount}/${habits.length}`}
            />
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.motivationalMsg}>{message}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{habits.length - completedCount}</Text>
                <Text style={styles.statLabel}>Left</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{habits.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Habits by Category */}
        {Object.entries(categoryGroups).map(([category, categoryHabits]) => (
          <Animated.View key={category} style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name={colors.categories[category]?.icon || 'star-outline'}
                size={18}
                color={colors.categories[category]?.bg || colors.primary}
              />
              <Text style={styles.sectionTitle}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
              <Text style={styles.sectionCount}>
                {categoryHabits.filter((h) => todayCompletions[h.id]).length}/{categoryHabits.length}
              </Text>
            </View>
            {categoryHabits.map((habit) => (
              <HabitCheckItem
                key={habit.id}
                habit={habit}
                completed={!!todayCompletions[habit.id]}
                onToggle={toggleCompletion}
                streak={calculateStreak(completions, habit.id)}
              />
            ))}
          </Animated.View>
        ))}

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>Start your growth journey!</Text>
            <Text style={styles.emptySubtitle}>Add your first habit to begin tracking daily progress.</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddHabit')}
            >
              <Text style={styles.emptyButtonText}>Add First Habit</Text>
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
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  date: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    width: 46,
    height: 46,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },

  progressCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    ...shadows.lg,
  },
  progressLeft: { marginRight: spacing.xl },
  progressRight: { flex: 1 },
  progressTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 6,
  },
  motivationalMsg: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },

  section: { marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  sectionCount: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.xl },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    borderRadius: radii.full,
    ...shadows.md,
  },
  emptyButtonText: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.md,
  },
});

export default HomeScreen;
