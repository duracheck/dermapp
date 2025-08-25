import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import pb from './pb';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      pb.authStore.save(authData.token, authData.record);
      Alert.alert('Успех', 'Вход выполнен успешно');

      const role = authData.record.role;
      if (role === 'doctor') {
        navigation.reset({ index: 0, routes: [{ name: 'DoctorTabs' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'PatientTabs' }] });
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      Alert.alert('Ошибка', 'Неверная почта или пароль');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        style={styles.input}
        placeholder="Почта"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Войти" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  registerLink: { marginTop: 20, color: 'blue', textAlign: 'center' },
});
