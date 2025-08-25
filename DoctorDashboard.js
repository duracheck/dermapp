import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import pb from './pb';

export default function DoctorDashboard() {
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const user = pb.authStore.model;

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const data = await pb.collection('photos').getFullList({
        expand: 'user,doctor',
        sort: '-created',
      });
      setPhotos(data);
    } catch (error) {
      Alert.alert('Ошибка загрузки', error.message || 'Не удалось загрузить фото');
    }
  };

  const assignDoctorIfNeeded = async (photo) => {
    try {
      if (!photo.doctor) {
        await pb.collection('photos').update(photo.id, {
          doctor: user.id,
        });
        fetchPhotos();
      }
    } catch (err) {
      console.error('Ошибка назначения врача:', err);
    }
  };

  const openChat = (photoId) => {
    navigation.navigate('ChatScreen', { photoId });
  };

  const renderItem = ({ item }) => {
    assignDoctorIfNeeded(item);

    const imageUrl = item.file ? pb.files.getURL(item, item.file) : null;

    return (
      <TouchableOpacity style={styles.item} onPress={() => openChat(item.id)}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={{ color: 'red', marginBottom: 8 }}>Нет изображения</Text>
        )}
        <Text style={styles.caption}>Пациент: {item.expand?.user?.email || 'Неизвестно'}</Text>
        <Text style={styles.date}>
          {new Date(item.created).toLocaleDateString()}
        </Text>
        <Text style={styles.chatLink}>Открыть чат</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Фото пациентов</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Нет фото для отображения</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { marginBottom: 20, alignItems: 'center' },
  image: { width: '100%', height: 250, borderRadius: 10 },
  caption: { marginTop: 8, fontSize: 16 },
  date: { color: 'gray', fontSize: 12, marginTop: 4 },
  chatLink: {
    marginTop: 10,
    color: '#007BFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  empty: { textAlign: 'center', marginTop: 30, fontSize: 16, color: 'gray' },
});
