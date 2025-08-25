import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import pb from './pb';
import { useNavigation } from '@react-navigation/native';

const PatientChatList = () => {
  const [photos, setPhotos] = useState([]);
  const navigation = useNavigation();
  const currentUser = pb.authStore.model;

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const result = await pb.collection('photos').getFullList({
        filter: `user.id = "${currentUser.id}"`,
        sort: '-created',
      });
      setPhotos(result);
    } catch (error) {
      console.error('Ошибка загрузки фото пациента:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('ChatScreen', { photoId: item.id })}
    >
      <Text style={styles.title}>Фото ID: {item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Мои чаты</Text>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Пока нет чатов</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: { backgroundColor: '#f2f2f2', padding: 12, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold' },
});

export default PatientChatList;
