import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const fields = [
  { key: 'name', label: 'Full Name', points: 10 },
  { key: 'headline', label: 'Professional Headline', points: 10 },
  { key: 'about', label: 'About Summary', points: 15 },
  { key: 'skills', label: 'Skills', points: 20 },
  { key: 'programme', label: 'Programme', points: 10 },
  { key: 'campus', label: 'Campus', points: 10 },
  { key: 'github', label: 'GitHub Link', points: 10 },
  { key: 'linkedin', label: 'LinkedIn Link', points: 10 },
  { key: 'phone', label: 'Phone Number', points: 5 },
];

export default function ProfileCompletenessScreen({ navigation }) {
  const [profile, setProfile] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const snap = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        const total = fields.reduce((acc, f) => acc + (data[f.key] ? f.points : 0), 0);
        setScore(total);
      }
    } catch (e) { console.log(e); }
  };

  const getColor = () => score >= 80 ? '#00aa44' : score >= 50 ? '#f0a500' : '#CC0000';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Strength</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Profile Completeness</Text>
          <Text style={[styles.score, { color: getColor() }]}>{score}%</Text>
          <View style={styles.barBg}>
            <View style={[styles.barFill, { width: `${score}%`, backgroundColor: getColor() }]}/>
          </View>
          <Text style={styles.scoreDesc}>
            {score >= 80 ? '🔥 Excellent! Your profile stands out to employers' :
             score >= 50 ? '⚡ Good progress! Add more details to attract employers' :
             '💡 Complete your profile to get better job matches'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Profile Checklist</Text>
        {fields.map((f, i) => (
          <View key={i} style={styles.checkItem}>
            <Text style={styles.checkIcon}>{profile[f.key] ? '✅' : '❌'}</Text>
            <View style={styles.checkInfo}>
              <Text style={styles.checkLabel}>{f.label}</Text>
              <Text style={styles.checkPoints}>+{f.points} points</Text>
            </View>
            {!profile[f.key] && (
              <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            )}
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
  scoreCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, marginBottom: 16, elevation: 2, alignItems: 'center' },
  scoreLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  score: { fontSize: 56, fontWeight: 'bold', marginBottom: 16 },
  barBg: { width: '100%', backgroundColor: '#e8eeff', borderRadius: 8, height: 12, marginBottom: 16 },
  barFill: { borderRadius: 8, height: 12 },
  scoreDesc: { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 12 },
  checkItem: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8, elevation: 1, flexDirection: 'row', alignItems: 'center' },
  checkIcon: { fontSize: 20, marginRight: 12 },
  checkInfo: { flex: 1 },
  checkLabel: { fontSize: 14, color: '#333', fontWeight: '600' },
  checkPoints: { fontSize: 11, color: '#888', marginTop: 2 },
  addBtn: { backgroundColor: '#003399', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
