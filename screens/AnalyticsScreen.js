import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const stats = [
  { label: 'Profile Views', value: '124', change: '+12%' },
  { label: 'Job Applications', value: '8', change: '+3' },
  { label: 'Connections', value: '47', change: '+5' },
  { label: 'Match Score', value: '89%', change: '+2%' },
];

export default function AnalyticsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>My Analytics</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Your Stats This Month</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Job Match Breakdown</Text>
        <View style={styles.barCard}>
          {[{skill:'JavaScript',pct:90},{skill:'React Native',pct:85},{skill:'Firebase',pct:75},{skill:'Cybersecurity',pct:70}].map((item,i) => (
            <View key={i} style={styles.barRow}>
              <Text style={styles.barLabel}>{item.skill}</Text>
              <View style={styles.barBg}><View style={[styles.barFill,{width:`${item.pct}%`}]} /></View>
              <Text style={styles.barPct}>{item.pct}%</Text>
            </View>
          ))}
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
  content: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '47%', elevation: 2, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#003399' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'center' },
  statChange: { fontSize: 12, color: '#00aa44', marginTop: 4, fontWeight: '600' },
  barCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  barLabel: { width: 100, fontSize: 12, color: '#444' },
  barBg: { flex: 1, backgroundColor: '#e8eeff', borderRadius: 4, height: 8, marginHorizontal: 8 },
  barFill: { backgroundColor: '#003399', borderRadius: 4, height: 8 },
  barPct: { width: 35, fontSize: 12, color: '#003399', fontWeight: '600' },
});
