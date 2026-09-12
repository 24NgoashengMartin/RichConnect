import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const botReplies = {
  'hi': 'Hello! I am RichAssist, your AI career guide. How can I help you today?',
  'hello': 'Hi there! Ready to help you land your dream job 🚀',
  'jobs': 'Based on your profile, I found 5 matching jobs! You are 92% match for Junior Developer at TechCo Pretoria.',
  'cv': 'Upload your CV and I will auto-fill your profile and suggest improvements!',
  'wil': 'I can match you with WIL placement opportunities near Pretoria. Want me to search?',
  'interview': 'I can help you practice interview questions! What role are you applying for?',
  'default': 'I am still learning! Try asking about jobs, CV, WIL placement or interview tips 😊',
};

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I am RichAssist 🤖 Your AI career guide. Ask me about jobs, CV tips, or WIL placements!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: messages.length + 1, text: input, sender: 'user' };
    const key = input.toLowerCase().trim();
    const replyText = botReplies[key] || botReplies['default'];
    const botMsg = { id: messages.length + 2, text: replyText, sender: 'bot' };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RichAssist AI</Text>
      </View>
      <ScrollView style={styles.messages}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.bubbleText, msg.sender === 'user' ? styles.userText : styles.botText]}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask RichAssist..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
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
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 12 },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', elevation: 1 },
  userBubble: { backgroundColor: '#003399', alignSelf: 'flex-end' },
  botText: { color: '#333', fontSize: 14 },
  userText: { color: '#fff', fontSize: 14 },
  bubbleText: { lineHeight: 20 },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd' },
  input: { flex: 1, backgroundColor: '#f0f4ff', borderRadius: 8, padding: 10, fontSize: 14, marginRight: 8 },
  sendBtn: { backgroundColor: '#CC0000', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});