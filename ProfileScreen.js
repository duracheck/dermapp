import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Ошибка выхода', error.message);
    } else {
      navigation.replace('Вход');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <Button title="Выйти из аккаунта" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});
