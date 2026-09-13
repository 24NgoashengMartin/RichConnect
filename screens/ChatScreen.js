import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { GROQ_API_KEY } from '../config';

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I am RichAssist 🤖 Your AI career guide powered by Groq AI. Ask me about jobs, CV tips, interview prep, or WIL placements!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are RichAssist, an AI career guide for RichConnect - a professional networking platform for South African graduates from Richfield Graduate Institute. Help students with job searching, CV writing, interview preparation, WIL placements, career advice, and professional networking. Keep responses concise and relevant to South African job market. Be encouraging and professional.'
            },
            { role: 'user', content: userInput }
          ],
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || 'Sorry, I could not process that. Please try again.';
      setMessages(prev => [...prev, { id: prev.length + 1, text: botReply, sender: 'bot' }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: prev.length + 1, text: 'Connection error. Please check your internet and try again.', sender: 'bot' }]);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>RichAssist AI 🤖</Text>
          <Text style={styles.headerSub}>Powered by Groq AI</Text>
        </View>
      </View>
      <ScrollView style={styles.messages}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.bubbleText, msg.sender === 'user' ? styles.userText : styles.botText]}>{msg.text}</Text>
          </View>
        ))}
        {loading && (
          <View style={styles.botBubble}>
            <Text style={styles.botText}>RichAssist is thinking... 🤔</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask RichAssist anything..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          editable={!loading}
        />
        <TouchableOpacity style={[styles.sendBtn, loading && {opacity: 0.5}]} onPress={sendMessage} disabled={loading}>
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
  headerSub: { color: '#aac4ff', fontSize: 11 },
  messages: { flex: 1, padding: 16 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 12 },
  botBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', elevation: 1 },
  userBubble: { backgroundColor: '#003399', alignSelf: 'flex-end' },
  botText: { color: '#333', fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  bubbleText: {},
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd' },
  input: { flex: 1, backgroundColor: '#f0f4ff', borderRadius: 8, padding: 10, fontSize: 14, marginRight: 8 },
  sendBtn: { backgroundColor: '#CC0000', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
