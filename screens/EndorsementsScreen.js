import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const skills = ['JavaScript', 'React Native', 'Firebase', 'Python', 'Cybersecurity', 'Node.js', 'SQL', 'Leadership'];

export default function EndorsementsScreen({ navigation, route }) {
  const [endorsements, setEndorsements] = useState([]);
  const userId = route?.params?.userId || auth.currentUser.uid;
  const isOwn = userId === auth.currentUser.uid;

  useEffect(() => {
    getDocs(query(collection(db, 'endorsements'), where('toUser', '==', userId))).then(snap => setEndorsements(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const endorse = async (skill) => {
    if (isOwn) { Alert.alert('Error', 'Cannot endorse yourself'); return; }
    try {
      await addDoc(collection(db, 'endorsements'), { skill, fromUser: auth.currentUser.uid, fromEmail: auth.currentUser.email, toUser: userId, createdAt: serverTimestamp() });
      Alert.alert('✅', `Endorsed ${skill}!`);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Endorsements</Text>
      </View>
      <ScrollView style={styles.content}>
        {skills.map((skill, i) => (
          <View key={i} style={styles.skillCard}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill}</Text>
              <Text style={styles.count}>{endorsements.filter(e => e.skill === skill).length} endorsements</Text>
            </View>
            {!isOwn && <TouchableOpacity style={styles.endorseBtn} onPress={() => endorse(skill)}><Text style={styles.endorseBtnText}>👍 Endorse</Text></TouchableOpacity>}
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
  content: { padding: 16 },
  skillCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 8, elevation: 1, flexDirection: 'row', alignItems: 'center' },
  skillInfo: { flex: 1 },
  skillName: { fontSize: 14, fontWeight: 'bold', color: '#003399' },
  count: { fontSize: 12, color: '#888', marginTop: 2 },
  endorseBtn: { backgroundColor: '#003399', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  endorseBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
