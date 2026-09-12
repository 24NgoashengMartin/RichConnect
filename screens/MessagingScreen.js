import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function MessagingScreen({ navigation, route }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatId = [auth.currentUser.uid, route?.params?.userId || 'general'].sort().join('_');

  useEffect(() => {
    const q = query(collection(db, 'messages', chatId, 'chats'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await addDoc(collection(db, 'messages', chatId, 'chats'), {
        text: input,
        sender: auth.currentUser.uid,
        senderEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });
      setInput('');
    } catch (e) { console.log(e); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <ScrollView style={styles.messages}>
        {messages.length === 0 && (
          <Text style={styles.noMessages}>No messages yet — say hello! 👋</Text>
        )}
        {messages.map(msg => {
          const isMe = msg.sender === auth.currentUser.uid;
          return (
            <View key={msg.id} style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
              {!isMe && <Text style={styles.senderEmail}>{msg.senderEmail}</Text>}
              <Text style={[styles.bubbleText, isMe ? styles.myText : styles.theirText]}>{msg.text}</Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Type a message..." value={input} onChangeText={setInput} onSubmitEditing={sendMessage}/>
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { color: '#aac4ff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  messages: { flex: 1, padding: 16 },
  noMessages: { color: '#888', textAlign: 'center', marginTop: 32, fontSize: 14 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 12 },
  myBubble: { backgroundColor: '#003399', alignSelf: 'flex-end' },
  theirBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', elevation: 1 },
  senderEmail: { fontSize: 10, color: '#888', marginBottom: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  myText: { color: '#fff' },
  theirText: { color: '#333' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd' },
  input: { flex: 1, backgroundColor: '#f0f4ff', borderRadius: 8, padding: 10, fontSize: 14, marginRight: 8 },
  sendBtn: { backgroundColor: '#CC0000', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
