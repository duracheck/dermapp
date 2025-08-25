import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import pb from './pb';

const UploadScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Ошибка', 'Требуется доступ к галерее');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri) {
      setError('Сначала выберите изображение');
      return;
    }

    try {
      setUploading(true);
      setError('');

      const formData = new FormData();
      const fileName = imageUri.split('/').pop();
      const fileType = fileName.split('.').pop();

      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType}`,
      });

      formData.append('user', pb.authStore.model.id);

      await pb.collection('photos').create(formData);

      Alert.alert('Успех', 'Фото загружено!');
      setImageUri(null);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Загрузить</Text>

      <Button title="Выбрать фото" onPress={pickImage} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}

      <Button title="Загрузить" onPress={handleUpload} />

      {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  preview: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 12,
  },
  error: { color: 'red', marginTop: 10 },
});

export default UploadScreen;
