import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ProfileScreen({ navigation }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Martin Ngoasheng',
    headline: 'Final-year IT Student | Aspiring Cybersecurity Expert',
    programme: 'IT Diploma',
    campus: 'Richfield Pretoria',
    skills: 'JavaScript, React Native, Firebase, Python, Cybersecurity',
    github: 'github.com/24NgoashengMartin',
    linkedin: 'linkedin.com/in/martin-ngoasheng',
    about: 'Final-year IT Diploma student passionate about cybersecurity, fintech and tech entrepreneurship.',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProfile(docSnap.data());
    } catch (e) { console.log(e); }
  };

  const saveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      await setDoc(doc(db, 'profiles', user.uid), profile);
      Alert.alert('Success', 'Profile saved!');
      setEditing(false);
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => editing ? saveProfile() : setEditing(true)}>
          <Text style={styles.editBtn}>{editing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MN</Text>
          </View>
          {editing ? (
            <>
              <TextInput style={styles.editInput} value={profile.name} onChangeText={t => setProfile({...profile, name: t})} placeholder="Full Name"/>
              <TextInput style={styles.editInput} value={profile.headline} onChangeText={t => setProfile({...profile, headline: t})} placeholder="Professional Headline"/>
            </>
          ) : (
            <>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.role}>{profile.headline}</Text>
            </>
          )}
          <Text style={styles.location}>📍 {profile.campus}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {editing ? (
            <TextInput style={styles.editInput} value={profile.about} onChangeText={t => setProfile({...profile, about: t})} multiline placeholder="About you"/>
          ) : (
            <Text style={styles.sectionText}>{profile.about}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {editing ? (
            <TextInput style={styles.editInput} value={profile.skills} onChangeText={t => setProfile({...profile, skills: t})} placeholder="Skills (comma separated)"/>
          ) : (
            <View style={styles.skillRow}>
              {profile.skills.split(',').map((skill, i) => (
                <View key={i} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {editing ? (
            <>
              <TextInput style={styles.editInput} value={profile.programme} onChangeText={t => setProfile({...profile, programme: t})} placeholder="Programme"/>
              <TextInput style={styles.editInput} value={profile.campus} onChangeText={t => setProfile({...profile, campus: t})} placeholder="Campus"/>
            </>
          ) : (
            <>
              <Text style={styles.eduTitle}>{profile.programme} — {profile.campus}</Text>
              <Text style={styles.eduSub}>2022 – 2026</Text>
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
              <Text style={styles.linkText}>🔗 {profile.github}</Text>
              <Text style={styles.linkText}>💼 {profile.linkedin}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  section: { backgroundColor: '#fff', margin: 16, marginTop: 0, borderRadius: 12, padding: 16, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  sectionText: { color: '#444', fontSize: 13, lineHeight: 20 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: '#e8eeff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillText: { color: '#003399', fontSize: 12, fontWeight: '600' },
  eduTitle: { color: '#333', fontSize: 14, fontWeight: '600' },
  eduSub: { color: '#888', fontSize: 12, marginTop: 2 },
  linkText: { color: '#003399', fontSize: 13, marginBottom: 8 },
  editInput: { backgroundColor: '#f0f4ff', borderRadius: 8, padding: 10, marginBottom: 8, fontSize: 13, color: '#333', borderWidth: 1, borderColor: '#ddd' },
});
