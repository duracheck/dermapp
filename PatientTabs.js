import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UploadScreen from './UploadScreen';
import MyPhotosScreen from './MyPhotosScreen';
import { Ionicons } from '@expo/vector-icons';
import PatientChatList from './PatientChatList';

const Tab = createBottomTabNavigator();

export default function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Загрузить') {
            iconName = 'cloud-upload';
          } else if (route.name === 'Мои фото') {
            iconName = 'images';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Загрузить" component={UploadScreen} />
      <Tab.Screen name="Мои фото" component={MyPhotosScreen} />
      <Tab.Screen name="Мои чаты" component={PatientChatList} />
      </Tab.Navigator>
  );
}
