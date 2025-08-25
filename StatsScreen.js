import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import pb from './pb';

export default function StatsScreen() {
  const [stats, setStats] = useState({ users: 0, photos: 0 });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const users = await pb.collection('users').getFullList();
      const photos = await pb.collection('photos').getFullList();
      setStats({ users: users.length, photos: photos.length });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.stat}>Всего пациентов: {stats.users}</Text>
      <Text style={styles.stat}>Всего загружено фото: {stats.photos}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stat: { fontSize: 18, marginVertical: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
