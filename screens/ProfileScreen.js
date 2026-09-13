import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ProfileScreen({ navigation }) {
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    headline: '',
    programme: '',
    campus: '',
    skills: '',
    github: '',
    linkedin: '',
    about: '',
  });

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const docSnap = await getDoc(doc(db, 'profiles', user.uid));
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setEditing(true);
      }
      setLoaded(true);
    } catch (e) { console.log(e); setLoaded(true); }
  };

  const saveProfile = async () => {
    if (!profile.name) { Alert.alert('Error', 'Please enter your name'); return; }
    try {
      const user = auth.currentUser;
      if (!user) return;
      await setDoc(doc(db, 'profiles', user.uid), {
        ...profile,
        email: user.email,
        updatedAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Profile saved!');
      setEditing(false);
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  if (!loaded) return (
    <View style={styles.loading}>
      <Text style={styles.loadingText}>Loading profile...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => editing ? saveProfile() : setEditing(true)}>
          <Text style={styles.editBtn}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {editing ? (
            <>
              <TextInput style={styles.editInput} value={profile.name} onChangeText={t => setProfile({...profile, name: t})} placeholder="Full Name *"/>
              <TextInput style={styles.editInput} value={profile.headline} onChangeText={t => setProfile({...profile, headline: t})} placeholder="Professional Headline"/>
            </>
          ) : (
            <>
              <Text style={styles.name}>{profile.name || 'Add your name'}</Text>
              <Text style={styles.role}>{profile.headline || 'Add your headline'}</Text>
            </>
          )}
          <Text style={styles.location}>📍 {profile.campus || 'Add your campus'}</Text>
          <Text style={styles.email}>✉️ {auth.currentUser?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {editing ? (
            <TextInput style={styles.editInput} value={profile.about} onChangeText={t => setProfile({...profile, about: t})} multiline placeholder="Tell employers about yourself..."/>
          ) : (
            <Text style={styles.sectionText}>{profile.about || 'Add a professional summary'}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {editing ? (
            <TextInput style={styles.editInput} value={profile.skills} onChangeText={t => setProfile({...profile, skills: t})} placeholder="e.g. JavaScript, Python, Firebase"/>
          ) : profile.skills ? (
            <View style={styles.skillRow}>
              {profile.skills.split(',').map((skill, i) => (
                <View key={i} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill.trim()}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.placeholder}>Add your skills</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {editing ? (
            <>
              <TextInput style={styles.editInput} value={profile.programme} onChangeText={t => setProfile({...profile, programme: t})} placeholder="Programme e.g. IT Diploma"/>
              <TextInput style={styles.editInput} value={profile.campus} onChangeText={t => setProfile({...profile, campus: t})} placeholder="Campus e.g. Richfield Pretoria"/>
            </>
          ) : (
            <>
              <Text style={styles.eduTitle}>{profile.programme || 'Add your programme'}</Text>
              <Text style={styles.eduSub}>{profile.campus || 'Add your campus'}</Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Links</Text>
          {editing ? (
            <>
              <TextInput style={styles.editInput} value={profile.github} onChangeText={t => setProfile({...profile, github: t})} placeholder="GitHub URL"/>
              <TextInput style={styles.editInput} value={profile.linkedin} onChangeText={t => setProfile({...profile, linkedin: t})} placeholder="LinkedIn URL"/>
            </>
          ) : (
            <>
              <Text style={styles.linkText}>🔗 {profile.github || 'Add GitHub'}</Text>
              <Text style={styles.linkText}>💼 {profile.linkedin || 'Add LinkedIn'}</Text>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.cvBtn} onPress={() => navigation.navigate('CVUpload')}>
          <Text style={styles.cvBtnText}>📄 Upload & Parse CV with AI</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f4ff' },
  loadingText: { color: '#003399', fontSize: 16 },
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#aac4ff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  editBtn: { color: '#CC0000', fontSize: 16, fontWeight: 'bold' },
  profileCard: { backgroundColor: '#fff', alignItems: 'center', padding: 24, margin: 16, borderRadius: 12, elevation: 2 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#003399' },
  role: { fontSize: 13, color: '#666', marginTop: 4, textAlign: 'center' },
  location: { fontSize: 13, color: '#888', marginTop: 4 },
  email: { fontSize: 12, color: '#aac4ff', marginTop: 4 },
  section: { backgroundColor: '#fff', margin: 16, marginTop: 0, borderRadius: 12, padding: 16, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  sectionText: { color: '#444', fontSize: 13, lineHeight: 20 },
  placeholder: { color: '#aaa', fontSize: 13, fontStyle: 'italic' },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: '#e8eeff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillText: { color: '#003399', fontSize: 12, fontWeight: '600' },
  eduTitle: { color: '#333', fontSize: 14, fontWeight: '600' },
  eduSub: { color: '#888', fontSize: 12, marginTop: 2 },
  linkText: { color: '#003399', fontSize: 13, marginBottom: 8 },
  editInput: { backgroundColor: '#f0f4ff', borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 13, color: '#333', borderWidth: 1, borderColor: '#ddd' },
  cvBtn: { backgroundColor: '#003399', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  cvBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
