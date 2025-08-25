// PatientDashboard.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function PatientDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Добро пожаловать, Пациент!</Text>

      <Button
        title="Загрузить фото"
        onPress={() => navigation.navigate('Upload')}
      />

      {/* 👇 вот сюда вставляем кнопку "Мои фото" */}
      <View style={{ marginTop: 15 }}>
        <Button
          title="Мои фото"
          onPress={() => navigation.navigate('MyPhotos')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});
