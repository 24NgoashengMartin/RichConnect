import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function EndorsementsScreen({ navigation, route }) {
  const [endorsements, setEndorsements] = useState([]);
  const [profile, setProfile] = useState(null);
  const userId = route?.params?.userId || auth.currentUser.uid;
  const isOwnProfile = userId === auth.currentUser.uid;

  const skills = ['JavaScript', 'React Native', 'Firebase', 'Python', 'Cybersecurity', 'Node.js', 'SQL', 'Leadership'];

  useEffect(() => { loadEndorsements(); }, []);

  const loadEndorsements = async () => {
    try {
      const q = query(collection(db, 'endorsements'), where('toUser', '==', userId));
      const snap = await getDocs(q);
      setEndorsements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.log(e); }
  };

  const endorse = async (skill) => {
    if (isOwnProfile) { Alert.alert('Error', 'You cannot endorse yourself'); return; }
    try {
      const existing = endorsements.find(e => e.skill === skill && e.fromUser === auth.currentUser.uid);
      if (existing) { Alert.alert('Already endorsed', 'You already endorsed this skill'); return; }
      await addDoc(collection(db, 'endorsements'), {
        skill,
        fromUser: auth.currentUser.uid,
        fromEmail: auth.currentUser.email,
        toUser: userId,
        createdAt: serverTimestamp(),
      });
      Alert.alert('✅', `You endorsed ${skill}!`);
      loadEndorsements();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const getEndorseCount = (skill) => endorsements.filter(e => e.skill === skill).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>{isOwnProfile ? 'My Endorsements' : 'Endorse Skills'}</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Skills & Endorsements</Text>
        {skills.map((skill, i) => (
          <View key={i} style={styles.skillCard}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill}</Text>
              <Text style={styles.endorseCount}>{getEndorseCount(skill)} endorsements</Text>
            </View>
            {!isOwnProfile && (
              <TouchableOpacity style={styles.endorseBtn} onPress={() => endorse(skill)}>
                <Text style={styles.endorseBtnText}>👍 Endorse</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {endorsements.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Endorsements</Text>
            {endorsements.slice(0, 5).map(e => (
              <View key={e.id} style={styles.endorseCard}>
                <Text style={styles.endorseText}>
                  <Text style={styles.bold}>{e.fromEmail}</Text> endorsed <Text style={styles.bold}>{e.skill}</Text>
                </Text>
              </View>
            ))}
          </>
        )}
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
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  skillCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 8, elevation: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skillInfo: { flex: 1 },
  skillName: { fontSize: 14, fontWeight: 'bold', color: '#003399' },
  endorseCount: { fontSize: 12, color: '#888', marginTop: 2 },
  endorseBtn: { backgroundColor: '#003399', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  endorseBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  endorseCard: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, elevation: 1 },
  endorseText: { fontSize: 13, color: '#333' },
  bold: { fontWeight: 'bold', color: '#003399' },
});
