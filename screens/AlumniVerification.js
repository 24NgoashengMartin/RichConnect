import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function AlumniVerification({ navigation }) {
  const [studentNumber, setStudentNumber] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [programme, setProgramme] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(false);

  const submitVerification = async () => {
    if (!studentNumber || !graduationYear || !programme) {
      Alert.alert('Error', 'Please fill in all required fields'); return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        alumniVerification: { studentNumber, graduationYear, programme, linkedin, status: 'pending', submittedAt: new Date().toISOString() }
      });
      Alert.alert('Submitted!', 'Your alumni verification is under review. You will be notified within 24 hours.');
      navigation.navigate('StudentDashboard');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alumni Verification</Text>
        <Text style={styles.headerSub}>Verify your Richfield graduate status</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why verify?</Text>
          <Text style={styles.infoText}>As an alumni you no longer have your student email. We verify your identity using your student number and graduation details.</Text>
        </View>
        <Text style={styles.label}>Student Number *</Text>
        <TextInput style={styles.input} value={studentNumber} onChangeText={setStudentNumber} placeholder="e.g. RGI2020001"/>
        <Text style={styles.label}>Graduation Year *</Text>
        <TextInput style={styles.input} value={graduationYear} onChangeText={setGraduationYear} placeholder="e.g. 2024" keyboardType="numeric"/>
        <Text style={styles.label}>Programme Studied *</Text>
        <TextInput style={styles.input} value={programme} onChangeText={setProgramme} placeholder="e.g. IT Diploma"/>
        <Text style={styles.label}>LinkedIn Profile (optional)</Text>
        <TextInput style={styles.input} value={linkedin} onChangeText={setLinkedin} placeholder="linkedin.com/in/yourname"/>
        <TouchableOpacity style={styles.submitBtn} onPress={submitVerification} disabled={loading}>
          <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit for Verification'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#aac4ff', fontSize: 13, marginTop: 4 },
  content: { padding: 16 },
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#003399' },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#666', lineHeight: 20 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#003399', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, color: '#333', elevation: 1 },
  submitBtn: { backgroundColor: '#CC0000', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
