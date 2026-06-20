import { format, isToday, isYesterday, subDays, startOfDay, differenceInCalendarDays } from 'date-fns';

export const getTodayKey = () => format(new Date(), 'yyyy-MM-dd');

export const formatDate = (date) => format(new Date(date), 'MMM dd, yyyy');

export const formatDateShort = (date) => format(new Date(date), 'MMM dd');

export const getDayLabel = (date) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE');
};

export const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return days;
};

export const getWeekDays = () => getLastNDays(7);

export const calculateStreak = (completions, habitId) => {
  let streak = 0;
  let current = startOfDay(new Date());

  while (true) {
    const key = format(current, 'yyyy-MM-dd');
    const dayData = completions[key];
    if (!dayData || !dayData[habitId]) break;
    streak++;
    current = subDays(current, 1);
  }

  return streak;
};

export const calculateLongestStreak = (completions, habitId) => {
  const keys = Object.keys(completions).sort();
  let longest = 0;
  let current = 0;

  for (let i = 0; i < keys.length; i++) {
    const dayData = completions[keys[i]];
    if (dayData && dayData[habitId]) {
      current++;
      if (i > 0) {
        const diff = differenceInCalendarDays(new Date(keys[i]), new Date(keys[i - 1]));
        if (diff > 1) current = 1;
      }
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
};

export const getCompletionRate = (completions, habitId, days = 7) => {
  const dayKeys = getLastNDays(days);
  let completed = 0;
  dayKeys.forEach((key) => {
    if (completions[key] && completions[key][habitId]) completed++;
  });
  return Math.round((completed / days) * 100);
};

export const getWeeklyData = (completions, habitId) => {
  const days = getLastNDays(7);
  return days.map((key) => ({
    date: key,
    label: format(new Date(key), 'EEE'),
    completed: !!(completions[key] && completions[key][habitId]),
  }));
};
