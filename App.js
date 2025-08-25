import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import PatientTabs from './PatientTabs';
import DoctorTabs from './DoctorTabs';
import ChatScreen from './ChatScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="PatientTabs" component={PatientTabs} />
        <Stack.Screen name="DoctorTabs" component={DoctorTabs} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Чат' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
