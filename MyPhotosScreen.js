import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import pb from './pb';

export default function MyPhotosScreen() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const userId = pb.authStore.model?.id;
        if (!userId) {
          console.warn('Пользователь не авторизован');
          return;
        }

        const result = await pb.collection('photos').getFullList({
          filter: `user.id = "${userId}"`,
          sort: '-created',
        });

        setPhotos(result);
      } catch (error) {
        console.error('Ошибка загрузки фото:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={{ uri: `${pb.baseUrl}/api/files/photos/${item.id}/${item.file}` }}
        style={styles.image}
      />
      <Text style={styles.comment}>
        Комментарий врача: {item.comment ? item.comment : 'ещё не добавлен'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photos.length === 0 ? (
        <Text>Вы ещё не загружали фото</Text>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  comment: {
    marginTop: 8,
    fontStyle: 'italic',
  },
});
