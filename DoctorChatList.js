import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import pb from './pb';
import { useNavigation } from '@react-navigation/native';

const DoctorChatList = () => {
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const currentUser = pb.authStore.model;

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const result = await pb.collection('photos').getFullList({
        filter: `user.id != "${currentUser.id}"`,
        expand: 'user',
        sort: '-created',
      });
      setPhotos(result);
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
    }
  };

  const renderItem = ({ item }) => {
    const user = item.expand?.user;
    const name = `${user?.lastName || ''} ${user?.firstName || ''}`.trim() || user?.email;
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ChatScreen', { photoId: item.id })}
      >
        <Text style={styles.title}>Пациент: {name}</Text>
        <Text>Фото ID: {item.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Фото пациентов</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Нет данных</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: { backgroundColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold' },
});

export default DoctorChatList;
