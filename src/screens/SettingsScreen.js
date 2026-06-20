import React from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStore from '../store/useStore';
import { colors, typography, spacing, radii, shadows } from '../theme';
import { getLastNDays } from '../utils/dateUtils';

const SettingsScreen = () => {
  const { habits, completions, loadData } = useStore();

  const totalCompletions = Object.values(completions).reduce((sum, day) => {
    return sum + Object.values(day).filter(Boolean).length;
  }, 0);

  const dayTracked = Object.keys(completions).length;

  const handleClearData = () => {
    Alert.alert(
      '⚠️ Clear All Data',
      'This will permanently delete all your habits and completion history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            await loadData();
            Alert.alert('Done', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const badges = [
    { emoji: '🌱', label: 'First Step', desc: 'Added your first habit', unlocked: habits.length > 0 },
    { emoji: '🔥', label: 'On Fire', desc: '7-day streak on any habit', unlocked: false },
    { emoji: '💪', label: 'Dedicated', desc: '30 total completions', unlocked: totalCompletions >= 30 },
    { emoji: '🌟', label: 'Consistent', desc: '14 days tracked', unlocked: dayTracked >= 14 },
    { emoji: '🏆', label: 'Champion', desc: '100 total completions', unlocked: totalCompletions >= 100 },
    { emoji: '💎', label: 'Diamond', desc: '30-day streak', unlocked: false },
  ];

  const settingsItems = [
    {
      icon: 'information-circle-outline',
      label: 'About',
      sublabel: 'Daily Growth Tracker v1.0',
      color: '#6C63FF',
      onPress: () => Alert.alert('Daily Growth Tracker', 'Version 1.0\nBuilt to help you become your best self! 🌱'),
    },
    {
      icon: 'trash-outline',
      label: 'Clear All Data',
      sublabel: 'Permanently delete all habits and history',
      color: colors.danger,
      onPress: handleClearData,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🌱</Text>
          </View>
          <Text style={styles.profileName}>Growth Seeker</Text>
          <Text style={styles.profileSub}>Building one habit at a time</Text>
        </View>

        {/* Overall Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Overall Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{habits.length}</Text>
              <Text style={styles.statLabel}>Habits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCompletions}</Text>
              <Text style={styles.statLabel}>Completions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dayTracked}</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
          </View>
        </View>

        {/* Badges / Achievements */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgesGrid}>
          {badges.map((badge) => (
            <View
              key={badge.label}
              style={[styles.badgeCard, !badge.unlocked && styles.badgeLocked]}
            >
              <Text style={[styles.badgeEmoji, !badge.unlocked && { opacity: 0.3 }]}>
                {badge.emoji}
              </Text>
              <Text style={[styles.badgeLabel, !badge.unlocked && { color: colors.textMuted }]}>
                {badge.label}
              </Text>
              <Text style={styles.badgeDesc}>{badge.desc}</Text>
              {badge.unlocked && (
                <View style={styles.unlockedPill}>
                  <Text style={styles.unlockedText}>Unlocked</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Settings Items */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          {settingsItems.map((item, idx) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.settingsRow} onPress={item.onPress}>
                <View style={[styles.settingsIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <View style={styles.settingsText}>
                  <Text style={[styles.settingsLabel, item.color === colors.danger && { color: colors.danger }]}>
                    {item.label}
                  </Text>
                  <Text style={styles.settingsSublabel}>{item.sublabel}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {idx < settingsItems.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },

  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 90, height: 90,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    ...shadows.md,
  },
  avatarEmoji: { fontSize: 44 },
  profileName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
  },
  profileSub: { fontSize: typography.sizes.sm, color: colors.textSecondary },

  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.extrabold,
    color: colors.text,
  },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textMuted, marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },

  badgesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '30',
    ...shadows.sm,
  },
  badgeLocked: { borderColor: colors.border, opacity: 0.6 },
  badgeEmoji: { fontSize: 32, marginBottom: spacing.sm },
  badgeLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  unlockedPill: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  unlockedText: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: typography.weights.semibold,
  },

  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  settingsIcon: {
    width: 40, height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsText: { flex: 1 },
  settingsLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 2,
  },
  settingsSublabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  separator: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
});

export default SettingsScreen;
