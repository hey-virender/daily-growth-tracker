export const colors = {
  background: '#0F0F1A',
  surface: '#1A1A2E',
  card: '#16213E',
  border: '#2A2A4A',
  primary: '#6C63FF',
  primaryLight: '#A78BFA',
  accent: '#10B981',
  accentLight: '#34D399',
  danger: '#EF4444',
  warning: '#F59E0B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',
  white: '#FFFFFF',
  black: '#000000',

  categories: {
    fitness: { bg: '#FF6B6B', light: '#FFB3B3', icon: 'barbell-outline' },
    learning: { bg: '#6C63FF', light: '#C4B5FD', icon: 'book-outline' },
    mindfulness: { bg: '#10B981', light: '#6EE7B7', icon: 'leaf-outline' },
    health: { bg: '#F59E0B', light: '#FCD34D', icon: 'heart-outline' },
    productivity: { bg: '#3B82F6', light: '#93C5FD', icon: 'rocket-outline' },
    social: { bg: '#EC4899', light: '#F9A8D4', icon: 'people-outline' },
  },
};

export const gradients = {
  primary: ['#6C63FF', '#A855F7'],
  accent: ['#10B981', '#059669'],
  warm: ['#F59E0B', '#EF4444'],
  cool: ['#3B82F6', '#6C63FF'],
  dark: ['#1A1A2E', '#0F0F1A'],
};

export const typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    '2xl': 28,
    '3xl': 36,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
};
