import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import AllPhotosScreen from './AllPhotosScreen';
import StatsScreen from './StatsScreen';
import DoctorChatList from './DoctorChatList';

const Tab = createBottomTabNavigator();

export default function DoctorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Все фото') {
            iconName = 'images-outline';
          } else if (route.name === 'Статистика') {
            iconName = 'stats-chart';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Все фото" component={AllPhotosScreen} />
      <Tab.Screen name="Статистика" component={StatsScreen} />
      <Tab.Screen name="Чаты" component={DoctorChatList} />
    </Tab.Navigator>
  );
}
