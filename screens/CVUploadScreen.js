import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function CVUploadScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);

  const simulateNLP = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setParsed({ name: 'Your Name', skills: ['JavaScript', 'React Native', 'Firebase', 'Python'], experience: ['IT Intern (2024)', 'Freelance Developer (2023)'], education: 'IT Diploma - Richfield' });
    setLoading(false);
  };

  const saveToProfile = async () => {
    try {
      await updateDoc(doc(db, 'profiles', auth.currentUser.uid), { skills: parsed.skills.join(', '), cvParsed: true });
      Alert.alert('Success', 'CV saved to profile!');
      navigation.navigate('Profile');
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>CV Parser</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🤖 AI-Powered CV Parser</Text>
          <Text style={styles.infoText}>Upload your CV and our NLP engine extracts your skills automatically.</Text>
        </View>
        {!parsed ? (
          <TouchableOpacity style={styles.uploadBtn} onPress={simulateNLP} disabled={loading}>
            <Text style={styles.uploadIcon}>📄</Text>
            <Text style={styles.uploadTitle}>{loading ? 'Parsing CV...' : 'Upload & Parse CV'}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>✅ CV Parsed!</Text>
              <Text style={styles.label}>Skills Extracted</Text>
              <View style={styles.skillRow}>{parsed.skills.map((s, i) => <View key={i} style={styles.skillBadge}><Text style={styles.skillText}>{s}</Text></View>)}</View>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={saveToProfile}>
              <Text style={styles.saveBtnText}>Save to Profile</Text>
            </TouchableOpacity>
          </View>
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
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  infoTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#666' },
  uploadBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center', elevation: 2, borderWidth: 2, borderColor: '#003399', borderStyle: 'dashed' },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399' },
  resultCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#00aa44', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: '#e8eeff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  skillText: { color: '#003399', fontSize: 12 },
  saveBtn: { backgroundColor: '#CC0000', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
