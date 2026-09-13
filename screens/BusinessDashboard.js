import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function BusinessDashboard({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('postedBy', '==', auth.currentUser.uid));
      const snapshot = await getDocs(q);
      const jobList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setJobs(jobList);
    } catch (e) { console.log(e); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>RichConnect</Text>
          <Text style={styles.headerSub}>Business Dashboard 🏢</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.bell}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          {[
            { label: 'Active Jobs', value: jobs.filter(j => j.status === 'Approved').length },
            { label: 'Pending', value: jobs.filter(j => j.status === 'Pending Approval').length },
            { label: 'Total Posted', value: jobs.length },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Your Opportunities</Text>
        {jobs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No jobs posted yet</Text>
          </View>
        ) : jobs.map(job => (
          <View key={job.id} style={styles.card}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobSub}>{job.company} • {job.type}</Text>
            <View style={[styles.badge, { backgroundColor: job.status === 'Approved' ? '#00aa44' : job.status === 'Rejected' ? '#CC0000' : '#f0a500' }]}>
              <Text style={styles.badgeText}>{job.status}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.postBtn} onPress={() => navigation.navigate('PostJob')}>
          <Text style={styles.postBtnText}>+ Post New Opportunity</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#aac4ff', fontSize: 14, marginTop: 4 },
  bell: { fontSize: 24, color: '#fff' },
  content: { padding: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#003399', borderRadius: 10, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#aac4ff', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 10, padding: 24, alignItems: 'center', elevation: 2 },
  emptyText: { color: '#888', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  jobTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399' },
  jobSub: { color: '#666', fontSize: 13, marginTop: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  postBtn: { backgroundColor: '#003399', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8, marginBottom: 40 },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
