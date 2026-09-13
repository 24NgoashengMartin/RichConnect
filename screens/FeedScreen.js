import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, []);

  const createPost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        text: newPost,
        authorEmail: auth.currentUser.email,
        authorId: auth.currentUser.uid,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setNewPost('');
    } catch (e) { Alert.alert('Error', e.message); }
    setPosting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Feed</Text>
      </View>
      <View style={styles.postBox}>
        <TextInput style={styles.postInput} placeholder="Share a professional update..." value={newPost} onChangeText={setNewPost} multiline/>
        <TouchableOpacity style={styles.postBtn} onPress={createPost} disabled={posting}>
          <Text style={styles.postBtnText}>{posting ? '...' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.feed}>
        {posts.length === 0 && <Text style={styles.empty}>No posts yet — be the first! 🚀</Text>}
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{post.authorEmail ? post.authorEmail[0].toUpperCase() : '?'}</Text>
              </View>
              <View>
                <Text style={styles.authorEmail}>{post.authorEmail}</Text>
                <Text style={styles.postTime}>Just now</Text>
              </View>
            </View>
            <Text style={styles.postText}>{post.text}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>👍 Like</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>💬 Comment</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionText}>🔗 Share</Text></TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { color: '#aac4ff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  postBox: { backgroundColor: '#fff', padding: 16, margin: 16, borderRadius: 12, elevation: 2 },
  postInput: { backgroundColor: '#f0f4ff', borderRadius: 8, padding: 12, fontSize: 14, minHeight: 60, textAlignVertical: 'top', marginBottom: 8 },
  postBtn: { backgroundColor: '#003399', padding: 10, borderRadius: 8, alignItems: 'center' },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  feed: { paddingHorizontal: 16 },
  empty: { color: '#888', textAlign: 'center', marginTop: 32, fontSize: 14 },
  postCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  authorEmail: { fontSize: 13, fontWeight: 'bold', color: '#003399' },
  postTime: { fontSize: 11, color: '#888' },
  postText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 12 },
  postActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f4ff', paddingTop: 10, gap: 8 },
  actionBtn: { flex: 1, alignItems: 'center', padding: 6 },
  actionText: { fontSize: 12, color: '#666' },
});
