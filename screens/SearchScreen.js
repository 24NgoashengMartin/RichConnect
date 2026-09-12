import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'profiles'));
      const results = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u =>
          u.id !== auth.currentUser.uid &&
          (u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.skills?.toLowerCase().includes(search.toLowerCase()) ||
          u.programme?.toLowerCase().includes(search.toLowerCase()))
        );
      setUsers(results);
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  const sendConnection = async (userId, userName) => {
    try {
      await addDoc(collection(db, 'connections'), {
        from: auth.currentUser.uid,
        fromEmail: auth.currentUser.email,
        to: userId,
        toName: userName,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', `Connection request sent to ${userName}!`);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Find People</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, skills, programme..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={searchUsers}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchUsers}>
          <Text style={styles.searchBtnText}>{loading ? '...' : '🔍'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.results}>
        {users.length === 0 && search.length > 0 && !loading && (
          <Text style={styles.noResults}>No users found for "{search}"</Text>
        )}
        {users.map(user => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name || 'Unknown'}</Text>
              <Text style={styles.userRole}>{user.headline || user.programme || ''}</Text>
              <Text style={styles.userSkills}>{user.skills || ''}</Text>
            </View>
            <TouchableOpacity style={styles.connectBtn} onPress={() => sendConnection(user.id, user.name)}>
              <Text style={styles.connectBtnText}>Connect</Text>
            </TouchableOpacity>
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
  searchContainer: { flexDirection: 'row', padding: 16, gap: 8 },
  searchInput: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, elevation: 2 },
  searchBtn: { backgroundColor: '#003399', borderRadius: 8, padding: 12, justifyContent: 'center' },
  searchBtnText: { fontSize: 18 },
  results: { padding: 16 },
  noResults: { color: '#888', textAlign: 'center', marginTop: 32, fontSize: 14 },
  userCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#003399' },
  userRole: { fontSize: 12, color: '#666', marginTop: 2 },
  userSkills: { fontSize: 11, color: '#888', marginTop: 2 },
  connectBtn: { backgroundColor: '#003399', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  connectBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
