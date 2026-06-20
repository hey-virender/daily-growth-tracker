import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import { colors, typography, spacing, radii, shadows } from '../theme';

const CATEGORIES = [
  { id: 'fitness', label: 'Fitness', icon: 'barbell-outline', color: '#FF6B6B' },
  { id: 'learning', label: 'Learning', icon: 'book-outline', color: '#6C63FF' },
  { id: 'mindfulness', label: 'Mindfulness', icon: 'leaf-outline', color: '#10B981' },
  { id: 'health', label: 'Health', icon: 'heart-outline', color: '#F59E0B' },
  { id: 'productivity', label: 'Productivity', icon: 'rocket-outline', color: '#3B82F6' },
  { id: 'social', label: 'Social', icon: 'people-outline', color: '#EC4899' },
];

const ICONS = [
  'barbell-outline', 'book-outline', 'leaf-outline', 'heart-outline', 'rocket-outline',
  'people-outline', 'water-outline', 'moon-outline', 'sun-outline', 'bicycle-outline',
  'musical-notes-outline', 'nutrition-outline', 'walk-outline', 'school-outline',
  'flame-outline', 'star-outline', 'trophy-outline', 'bulb-outline',
];

const AddHabitScreen = ({ navigation, route }) => {
  const { habits, addHabit, updateHabit } = useStore();
  const editingId = route.params?.habitId;
  const editingHabit = editingId ? habits.find((h) => h.id === editingId) : null;

  const [name, setName] = useState(editingHabit?.name || '');
  const [description, setDescription] = useState(editingHabit?.description || '');
  const [category, setCategory] = useState(editingHabit?.category || 'fitness');
  const [icon, setIcon] = useState(editingHabit?.icon || 'barbell-outline');
  const [color, setColor] = useState(editingHabit?.color || '#FF6B6B');

  const selectedCategory = CATEGORIES.find((c) => c.id === category);

  const handleCategorySelect = (cat) => {
    setCategory(cat.id);
    setColor(cat.color);
    setIcon(cat.icon);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Oops!', 'Please enter a habit name.');
      return;
    }

    if (editingId) {
      updateHabit(editingId, { name: name.trim(), description: description.trim(), category, icon, color });
    } else {
      addHabit({ name: name.trim(), description: description.trim(), category, icon, color });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editingId ? 'Edit Habit' : 'New Habit'}</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Preview */}
          <View style={[styles.preview, { borderColor: color + '40', backgroundColor: color + '10' }]}>
            <View style={[styles.previewIcon, { backgroundColor: color + '30' }]}>
              <Ionicons name={icon} size={36} color={color} />
            </View>
            <Text style={[styles.previewName, { color }]}>{name || 'Habit Name'}</Text>
            <Text style={styles.previewCategory}>{selectedCategory?.label}</Text>
          </View>

          {/* Name */}
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Morning Run"
            placeholderTextColor={colors.textMuted}
            maxLength={50}
          />

          {/* Description */}
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="What does this habit involve?"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            maxLength={150}
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  category === cat.id && {
                    backgroundColor: cat.color + '25',
                    borderColor: cat.color,
                  },
                ]}
                onPress={() => handleCategorySelect(cat)}
              >
                <Ionicons
                  name={cat.icon}
                  size={18}
                  color={category === cat.id ? cat.color : colors.textMuted}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat.id && { color: cat.color },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Icon Picker */}
          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconGrid}>
            {ICONS.map((ic) => (
              <TouchableOpacity
                key={ic}
                style={[
                  styles.iconOption,
                  icon === ic && { backgroundColor: color + '30', borderColor: color },
                ]}
                onPress={() => setIcon(ic)}
              >
                <Ionicons name={ic} size={22} color={icon === ic ? color : colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
    fontSize: typography.sizes.sm,
  },

  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl },

  preview: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    borderRadius: radii.xl,
    marginBottom: spacing['2xl'],
    borderWidth: 1,
  },
  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  previewName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  previewCategory: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },

  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },

  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default AddHabitScreen;
