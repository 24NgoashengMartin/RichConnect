import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function PostJobScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Learnership', 'WIL'];

  const postJob = async () => {
    if (!title || !company || !skills) { Alert.alert('Error', 'Please fill in all required fields'); return; }
    setLoading(true);
    try {
      await addDoc(collection(db, 'jobs'), {
        title, company, location, type, skills, description,
        postedBy: auth.currentUser.uid,
        status: 'Pending Approval',
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Job posted! Waiting for admin approval.');
      navigation.goBack();
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Post Opportunity</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Job Title *</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Junior Developer"/>
        <Text style={styles.label}>Company *</Text>
        <TextInput style={styles.input} value={company} onChangeText={setCompany} placeholder="Company name"/>
        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Pretoria"/>
        <Text style={styles.label}>Job Type</Text>
        <View style={styles.typeRow}>
          {jobTypes.map(t => (
            <TouchableOpacity key={t} style={[styles.typeBtn, type === t && styles.typeBtnActive]} onPress={() => setType(t)}>
              <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Required Skills *</Text>
        <TextInput style={styles.input} value={skills} onChangeText={setSkills} placeholder="e.g. JavaScript, React, Firebase"/>
        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Job description..." multiline numberOfLines={4}/>
        <TouchableOpacity style={styles.postBtn} onPress={postJob} disabled={loading}>
          <Text style={styles.postBtnText}>{loading ? 'Posting...' : 'Submit for Approval'}</Text>
        </TouchableOpacity>
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
  label: { fontSize: 13, fontWeight: 'bold', color: '#003399', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, color: '#333', elevation: 1 },
  textArea: { height: 100, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#003399' },
  typeBtnActive: { backgroundColor: '#003399' },
  typeText: { color: '#003399', fontSize: 12 },
  typeTextActive: { color: '#fff', fontWeight: 'bold' },
  postBtn: { backgroundColor: '#CC0000', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, marginBottom: 40 },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
