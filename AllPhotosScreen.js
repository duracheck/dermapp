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

const AllPhotosScreen = () => {
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const records = await pb.collection('photos').getFullList({
        expand: 'user',
        sort: '-created',
      });
      setPhotos(records);
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
    }
  };

  const handleOpenChat = (photo) => {
    try {
      if (!photo?.id) {
        Alert.alert('Ошибка', 'Невозможно открыть чат — фото не найдено');
        return;
      }
      navigation.navigate('ChatScreen', { photoId: photo.id });
    } catch (error) {
      console.error('Ошибка перехода в чат:', error?.response || error);
      Alert.alert('Ошибка', 'Не удалось открыть чат');
    }
  };

  const renderItem = ({ item }) => {
    const filename = Array.isArray(item.file) ? item.file[0] : item.file;
    const imageUrl = filename ? pb.files.getURL(item, filename) : null;

    return (
      <View style={styles.card}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text style={{ color: 'red', marginBottom: 10 }}>Нет изображения</Text>
        )}
        <Text style={styles.name}>
          Пациент: {item.expand?.user?.email || 'Неизвестно'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => handleOpenChat(item)}>
          <Text style={styles.buttonText}>Открыть чат</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  image: {
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AllPhotosScreen;
