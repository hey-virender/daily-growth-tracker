import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';

import useStore from './src/store/useStore';
import { colors, typography, spacing, radii } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bottom Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 70,
        paddingBottom: 12,
        paddingTop: 10,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        marginTop: 2,
      },
      tabBarIcon: ({ color, size, focused }) => {
        const icons = {
          Today: focused ? 'home' : 'home-outline',
          Habits: focused ? 'list' : 'list-outline',
          History: focused ? 'calendar' : 'calendar-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        return (
          <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
            <Ionicons name={icons[route.name]} size={size} color={color} />
          </View>
        );
      },
    })}
  >
    <Tab.Screen name="Today" component={HomeScreen} />
    <Tab.Screen name="Habits" component={HabitsScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Profile" component={SettingsScreen} />
  </Tab.Navigator>
);

// Root Stack Navigator (for modal screens)
const RootNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={TabNavigator} />
    <Stack.Screen
      name="AddHabit"
      component={AddHabitScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen
      name="HabitDetail"
      component={HabitDetailScreen}
    />
  </Stack.Navigator>
);

export default function App() {
  const { loadData, isLoaded } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.splash}>
        <View style={styles.splashLogo}>
          <Ionicons name="leaf-outline" size={48} color={colors.primary} />
        </View>
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.primary,
            background: colors.background,
            card: colors.surface,
            text: colors.text,
            border: colors.border,
            notification: colors.primary,
          },
          fonts: {
            regular: { fontFamily: 'System', fontWeight: '400' },
            medium: { fontFamily: 'System', fontWeight: '500' },
            bold: { fontFamily: 'System', fontWeight: '700' },
            heavy: { fontFamily: 'System', fontWeight: '900' },
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 90,
    height: 90,
    borderRadius: radii.xl,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: colors.primary + '20',
  },
});
