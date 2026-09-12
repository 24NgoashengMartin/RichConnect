import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function BusinessDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RichConnect</Text>
        <Text style={styles.headerSub}>Business Dashboard 🏢</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Your Opportunities</Text>
        {[
          { title: 'Junior Developer', applicants: 12, status: 'Active' },
          { title: 'IT Support Intern', applicants: 8, status: 'Pending Approval' },
        ].map((job, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobSub}>👥 {job.applicants} applicants</Text>
            <View style={[styles.badge, { backgroundColor: job.status === 'Active' ? '#00aa44' : '#f0a500' }]}>
              <Text style={styles.badgeText}>{job.status}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.postBtn} onPress={() => navigation.navigate('PostJob')}>
          <Text style={styles.postBtnText}>+ Post New Opportunity</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Top Candidates</Text>
        {['Martin N — 92% match', 'Precious M — 88% match', 'Lerato K — 85% match'].map((c, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardText}>{c}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#aac4ff', fontSize: 14, marginTop: 4 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  cardText: { color: '#333', fontSize: 14 },
  jobTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399' },
  jobSub: { color: '#666', fontSize: 13, marginTop: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  postBtn: { backgroundColor: '#003399', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
