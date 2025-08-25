import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import pb from './pb';

const ChatScreen = ({ route }) => {
  const { photoId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = pb.authStore.model;

  useEffect(() => {
    console.log('photoId в ChatScreen:', photoId);
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const records = await pb.collection('messages').getFullList({
        filter: `photo.id = "${photoId}"`,
        expand: 'sender',
        sort: 'created',
      });
      setMessages(records);
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить чат');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await pb.collection('messages').create({
        text: newMessage.trim(),
        photo: photoId,
        sender: currentUser.id,
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }
  };

  const renderItem = ({ item }) => {
    const isMine = item.sender === currentUser.id;
    const name = item.expand?.sender?.lastName || item.expand?.sender?.email || 'Неизвестно';
    return (
      <View style={[styles.message, isMine ? styles.myMessage : styles.otherMessage]}>
        <Text style={styles.sender}>{isMine ? 'Вы' : name}</Text>
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Сообщение..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.button}>
          <Text style={styles.buttonText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  message: { padding: 10, margin: 10, borderRadius: 8 },
  myMessage: { backgroundColor: '#dcf8c6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#f1f0f0', alignSelf: 'flex-start' },
  sender: { fontWeight: 'bold', marginBottom: 4 },
  inputContainer: {
    flexDirection: 'row', borderTopWidth: 1,
    borderColor: '#ccc', padding: 8,
  },
  input: { flex: 1, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  button: {
    marginLeft: 8, backgroundColor: '#4caf50',
    paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ChatScreen;
