import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function StudentDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>RichConnect</Text>
          <Text style={styles.headerSub}>Student Dashboard</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.bell}>🔔</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.feed}>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.searchText}>🔍 Search people, skills, alumni...</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {['New job match: Junior Developer 92%', 'Connection request received', 'Your profile was viewed 5 times'].map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardText}>{item}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Recommended Jobs</Text>
        {['Junior Developer - TechCo 92%', 'WIL Placement - MTN 88%', 'IT Support - Vodacom 85%'].map((item, i) => (
          <View key={i} style={styles.jobCard}>
            <Text style={styles.jobText}>{item}</Text>
            <TouchableOpacity style={styles.applyBtn} onPress={() => navigation.navigate('Jobs')}>
              <Text style={styles.applyText}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.analyticsBtn} onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.analyticsBtnText}>📊 View My Analytics</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>🏠 Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Connections')}><Text style={styles.navText}>🤝 Network</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Jobs')}><Text style={styles.navText}>💼 Jobs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>👤 Profile</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}><Text style={styles.navText}>💬 Chat</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#aac4ff', fontSize: 14, marginTop: 4 },
  bell: { fontSize: 24, color: '#fff' },
  feed: { padding: 16 },
  searchBar: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, elevation: 2 },
  searchText: { color: '#888', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  cardText: { color: '#333', fontSize: 14 },
  jobCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobText: { color: '#003399', fontSize: 13, fontWeight: '600', flex: 1 },
  applyBtn: { backgroundColor: '#CC0000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  applyText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  analyticsBtn: { backgroundColor: '#003399', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  analyticsBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', paddingVertical: 12 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 11, color: '#003399' },
});
