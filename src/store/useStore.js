import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTodayKey } from '../utils/dateUtils';

const STORAGE_KEY = '@daily_growth_store';

const DEFAULT_HABITS = [
  {
    id: '1',
    name: 'Morning Workout',
    category: 'fitness',
    icon: 'barbell-outline',
    color: '#FF6B6B',
    description: 'Exercise for at least 30 minutes',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Read 20 Pages',
    category: 'learning',
    icon: 'book-outline',
    color: '#6C63FF',
    description: 'Read a book or article',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Meditate',
    category: 'mindfulness',
    icon: 'leaf-outline',
    color: '#10B981',
    description: '10 minutes of mindful meditation',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Drink 8 Glasses',
    category: 'health',
    icon: 'water-outline',
    color: '#3B82F6',
    description: 'Stay hydrated throughout the day',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Deep Work Session',
    category: 'productivity',
    icon: 'rocket-outline',
    color: '#F59E0B',
    description: '2 hours of focused, distraction-free work',
    createdAt: new Date().toISOString(),
  },
];

const useStore = create((set, get) => ({
  habits: DEFAULT_HABITS,
  completions: {},
  isLoaded: false,

  // Load data from AsyncStorage
  loadData: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { habits, completions } = JSON.parse(saved);
        set({
          habits: habits || DEFAULT_HABITS,
          completions: completions || {},
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      set({ isLoaded: true });
    }
  },

  // Persist current state
  _save: async () => {
    const { habits, completions } = get();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, completions }));
    } catch (e) {}
  },

  // Toggle habit completion for today
  toggleCompletion: (habitId) => {
    const today = getTodayKey();
    const { completions } = get();
    const todayData = completions[today] || {};
    const updated = {
      ...completions,
      [today]: {
        ...todayData,
        [habitId]: !todayData[habitId],
      },
    };
    set({ completions: updated });
    get()._save();
  },

  // Add a new habit
  addHabit: (habit) => {
    const { habits } = get();
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...habits, newHabit];
    set({ habits: updated });
    get()._save();
    return newHabit;
  },

  // Update a habit
  updateHabit: (habitId, updates) => {
    const { habits } = get();
    const updated = habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h));
    set({ habits: updated });
    get()._save();
  },

  // Delete a habit
  deleteHabit: (habitId) => {
    const { habits, completions } = get();
    const updatedHabits = habits.filter((h) => h.id !== habitId);
    // Remove completions for this habit
    const updatedCompletions = Object.fromEntries(
      Object.entries(completions).map(([date, dayData]) => {
        const { [habitId]: _, ...rest } = dayData;
        return [date, rest];
      })
    );
    set({ habits: updatedHabits, completions: updatedCompletions });
    get()._save();
  },

  // Get today's completions
  getTodayCompletions: () => {
    const today = getTodayKey();
    return get().completions[today] || {};
  },

  // Get completion for a specific date
  getDateCompletions: (dateKey) => {
    return get().completions[dateKey] || {};
  },
}));

export default useStore;
