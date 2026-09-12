import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function AdminDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RichConnect Admin</Text>
        <Text style={styles.headerSub}>Platform Management ⚙️</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          {[{ label: 'Students', value: '124' }, { label: 'Alumni', value: '89' }, { label: 'Business', value: '23' }, { label: 'Posts', value: '456' }].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Pending Approvals</Text>
        {[
          { name: 'TechCo Pretoria', type: 'Business Registration', action: 'Approve' },
          { name: 'Junior Developer Post', type: 'Job Listing', action: 'Approve' },
          { name: 'John Smith', type: 'Alumni Verification', action: 'Verify' },
        ].map((item, i) => (
          <View key={i} style={styles.approvalCard}>
            <View>
              <Text style={styles.approvalName}>{item.name}</Text>
              <Text style={styles.approvalType}>{item.type}</Text>
            </View>
            <TouchableOpacity style={styles.approveBtn}>
              <Text style={styles.approveBtnText}>{item.action}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Flagged Content</Text>
        {['Inappropriate post by user123', 'Spam job listing - FakeCompany'].map((item, i) => (
          <View key={i} style={styles.flagCard}>
            <Text style={styles.flagText}>{item}</Text>
            <TouchableOpacity style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
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
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#003399', borderRadius: 10, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 11, color: '#aac4ff', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  approvalCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  approvalName: { fontSize: 14, fontWeight: 'bold', color: '#003399' },
  approvalType: { fontSize: 12, color: '#666', marginTop: 2 },
  approveBtn: { backgroundColor: '#00aa44', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  approveBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  flagCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flagText: { color: '#333', fontSize: 13, flex: 1 },
  removeBtn: { backgroundColor: '#CC0000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  removeBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
