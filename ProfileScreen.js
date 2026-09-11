import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      <ScrollView>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MN</Text>
          </View>
          <Text style={styles.name}>Martin Ngoasheng</Text>
          <Text style={styles.role}>IT Student • Richfield Graduate Institute</Text>
          <Text style={styles.location}>📍 Tembisa, Gauteng</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.sectionText}>Final-year IT Diploma student passionate about cybersecurity, fintech and tech entrepreneurship.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillRow}>
            {['JavaScript', 'React Native', 'Firebase', 'Python', 'Cybersecurity'].map(skill => (
              <View key={skill} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text style={styles.eduTitle}>IT Diploma — Richfield Graduate Institute</Text>
          <Text style={styles.eduSub}>2022 – 2026 • Tembisa Campus</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.eduTitle}>Tech Entrepreneur</Text>
          <Text style={styles.eduSub}>LaunchPad • 2025 – Present</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { color: '#aac4ff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
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
});