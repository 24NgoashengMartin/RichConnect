import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function AnalyticsScreen({ navigation }) {
  const [stats, setStats] = useState({
    profileViews: 0,
    connections: 0,
    applications: 0,
    matchScore: 89,
    posts: 0,
  });

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const uid = auth.currentUser.uid;
      const connectionsQ = query(collection(db, 'connections'), where('from', '==', uid), where('status', '==', 'accepted'));
      const postsQ = query(collection(db, 'posts'), where('authorId', '==', uid));
      const [connSnap, postsSnap] = await Promise.all([getDocs(connectionsQ), getDocs(postsQ)]);
      setStats(prev => ({
        ...prev,
        connections: connSnap.size,
        posts: postsSnap.size,
        profileViews: Math.floor(Math.random() * 100) + 20,
        applications: Math.floor(Math.random() * 10) + 1,
      }));
    } catch (e) { console.log(e); }
  };

  const statCards = [
    { label: 'Profile Views', value: stats.profileViews, change: '+12%', icon: '👁️' },
    { label: 'Connections', value: stats.connections, change: '+5', icon: '🤝' },
    { label: 'Applications', value: stats.applications, change: '+3', icon: '📝' },
    { label: 'Match Score', value: stats.matchScore + '%', change: '+2%', icon: '🎯' },
  ];

  const skills = [
    { skill: 'JavaScript', pct: 90 },
    { skill: 'React Native', pct: 85 },
    { skill: 'Firebase', pct: 75 },
    { skill: 'Cybersecurity', pct: 70 },
    { skill: 'Python', pct: 65 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>My Analytics</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {statCards.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statChange}>{stat.change}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Skill Match Breakdown</Text>
        <View style={styles.barCard}>
          {skills.map((item, i) => (
            <View key={i} style={styles.barRow}>
              <Text style={styles.barLabel}>{item.skill}</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${item.pct}%` }]}/>
              </View>
              <Text style={styles.barPct}>{item.pct}%</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Activity Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>📰 Posts Created</Text>
            <Text style={styles.summaryValue}>{stats.posts}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🤝 Connections</Text>
            <Text style={styles.summaryValue}>{stats.connections}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>💼 Applications</Text>
            <Text style={styles.summaryValue}>{stats.applications}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>🎯 Profile Complete</Text>
            <Text style={styles.summaryValue}>75%</Text>
          </View>
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
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 26, fontWeight: 'bold', color: '#003399' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' },
  statChange: { fontSize: 12, color: '#00aa44', marginTop: 4, fontWeight: '600' },
  barCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  barLabel: { width: 100, fontSize: 12, color: '#444' },
  barBg: { flex: 1, backgroundColor: '#e8eeff', borderRadius: 4, height: 8, marginHorizontal: 8 },
  barFill: { backgroundColor: '#003399', borderRadius: 4, height: 8 },
  barPct: { width: 35, fontSize: 12, color: '#003399', fontWeight: '600' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f4ff' },
  summaryLabel: { fontSize: 14, color: '#333' },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#003399' },
});
