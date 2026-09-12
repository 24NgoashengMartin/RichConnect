import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminDashboard({ navigation }) {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({ students: 0, alumni: 0, business: 0, total: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const jobsQuery = query(collection(db, 'jobs'), where('status', '==', 'Pending Approval'));
      const jobsSnap = await getDocs(jobsQuery);
      setPendingJobs(jobsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const usersSnap = await getDocs(collection(db, 'users'));
      const users = usersSnap.docs.map(d => d.data());
      setStats({
        students: users.filter(u => u.userType === 'Student').length,
        alumni: users.filter(u => u.userType === 'Alumni').length,
        business: users.filter(u => u.userType === 'Business').length,
        total: users.length,
      });
      setPendingUsers(users.filter(u => u.userType === 'Business' && !u.approved));
    } catch (e) { console.log(e); }
  };

  const approveJob = async (jobId) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status: 'Approved' });
      Alert.alert('Success', 'Job approved!');
      loadData();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  const rejectJob = async (jobId) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status: 'Rejected' });
      Alert.alert('Done', 'Job rejected.');
      loadData();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RichConnect Admin</Text>
        <Text style={styles.headerSub}>Platform Management</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          {[
            { label: 'Students', value: stats.students },
            { label: 'Alumni', value: stats.alumni },
            { label: 'Business', value: stats.business },
            { label: 'Total', value: stats.total },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Pending Job Approvals ({pendingJobs.length})</Text>
        {pendingJobs.length === 0 ? (
          <View style={styles.emptyCard}><Text style={styles.emptyText}>No pending jobs</Text></View>
        ) : pendingJobs.map(job => (
          <View key={job.id} style={styles.approvalCard}>
            <Text style={styles.approvalName}>{job.title}</Text>
            <Text style={styles.approvalType}>{job.company} • {job.type}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.approveBtn} onPress={() => approveJob(job.id)}>
                <Text style={styles.approveBtnText}>✅ Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectJob(job.id)}>
                <Text style={styles.rejectBtnText}>❌ Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Platform Stats</Text>
        <View style={styles.statsCard}>
          {[
            { label: 'Total Users', value: stats.total },
            { label: 'Pending Jobs', value: pendingJobs.length },
            { label: 'Business Users', value: stats.business },
          ].map((s, i) => (
            <View key={i} style={styles.statsRow2}>
              <Text style={styles.statsLabel}>{s.label}</Text>
              <Text style={styles.statsValue}>{s.value}</Text>
            </View>
          ))}
        </View>
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
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#003399', borderRadius: 10, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#aac4ff', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 14 },
  approvalCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  approvalName: { fontSize: 15, fontWeight: 'bold', color: '#003399' },
  approvalType: { fontSize: 12, color: '#666', marginTop: 4, marginBottom: 12 },
  btnRow: { flexDirection: 'row', gap: 8 },
  approveBtn: { flex: 1, backgroundColor: '#00aa44', padding: 10, borderRadius: 8, alignItems: 'center' },
  approveBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  rejectBtn: { flex: 1, backgroundColor: '#CC0000', padding: 10, borderRadius: 8, alignItems: 'center' },
  rejectBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  statsCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 16, elevation: 2 },
  statsRow2: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f4ff' },
  statsLabel: { fontSize: 14, color: '#333' },
  statsValue: { fontSize: 14, fontWeight: 'bold', color: '#003399' },
});
