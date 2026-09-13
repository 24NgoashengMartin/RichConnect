import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function CVUploadScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(null);

  const simulateNLPParsing = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    const extractedData = {
      name: 'Martin Ngoasheng',
      skills: ['JavaScript', 'React Native', 'Firebase', 'Python', 'Cybersecurity', 'Node.js'],
      experience: ['IT Intern - TechCo (2024)', 'Freelance Developer (2023)'],
      education: 'IT Diploma - Richfield Graduate Institute (2022-2026)',
      certifications: ['CompTIA Security+', 'Google IT Support'],
    };
    setParsed(extractedData);
    setLoading(false);
  };

  const saveToProfile = async () => {
    if (!parsed) return;
    setLoading(true);
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'profiles', user.uid), {
        name: parsed.name,
        skills: parsed.skills.join(', '),
        cvParsed: true,
        cvData: parsed,
        updatedAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'CV data saved to your profile!');
      navigation.navigate('Profile');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>CV Upload & Parser</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🤖 AI-Powered CV Parser</Text>
          <Text style={styles.infoText}>Upload your CV and our NLP engine will automatically extract your skills, experience, and qualifications to complete your profile.</Text>
        </View>

        {!parsed ? (
          <TouchableOpacity style={styles.uploadBtn} onPress={simulateNLPParsing} disabled={loading}>
            <Text style={styles.uploadIcon}>📄</Text>
            <Text style={styles.uploadTitle}>{loading ? 'Parsing CV with AI...' : 'Upload & Parse CV'}</Text>
            <Text style={styles.uploadSub}>{loading ? 'Extracting skills and experience...' : 'Supports PDF, DOC, DOCX'}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>✅ CV Parsed Successfully!</Text>
              <Text style={styles.resultLabel}>Name</Text>
              <Text style={styles.resultValue}>{parsed.name}</Text>
              <Text style={styles.resultLabel}>Skills Extracted</Text>
              <View style={styles.skillRow}>
                {parsed.skills.map((skill, i) => (
                  <View key={i} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.resultLabel}>Experience</Text>
              {parsed.experience.map((exp, i) => (
                <Text key={i} style={styles.resultValue}>• {exp}</Text>
              ))}
              <Text style={styles.resultLabel}>Education</Text>
              <Text style={styles.resultValue}>{parsed.education}</Text>
              <Text style={styles.resultLabel}>Certifications</Text>
              {parsed.certifications.map((cert, i) => (
                <Text key={i} style={styles.resultValue}>• {cert}</Text>
              ))}
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={saveToProfile} disabled={loading}>
              <Text style={styles.saveBtnText}>{loading ? 'Saving...' : 'Save to Profile'}</Text>
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
  infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#003399' },
  infoTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#666', lineHeight: 20 },
  uploadBtn: { backgroundColor: '#fff', borderRadius: 12, padding: 32, alignItems: 'center', elevation: 2, borderWidth: 2, borderColor: '#003399', borderStyle: 'dashed' },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  uploadSub: { fontSize: 13, color: '#888' },
  resultCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', color: '#00aa44', marginBottom: 16 },
  resultLabel: { fontSize: 12, fontWeight: 'bold', color: '#003399', marginTop: 12, marginBottom: 4, textTransform: 'uppercase' },
  resultValue: { fontSize: 13, color: '#333', marginBottom: 4 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  skillBadge: { backgroundColor: '#e8eeff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  skillText: { color: '#003399', fontSize: 12, fontWeight: '600' },
  saveBtn: { backgroundColor: '#CC0000', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
