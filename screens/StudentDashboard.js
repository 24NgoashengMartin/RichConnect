import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function StudentDashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RichConnect</Text>
        <Text style={styles.headerSub}>Student Dashboard 🎓</Text>
      </View>
      <ScrollView style={styles.feed}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {['New job match: Junior Developer 92%', 'Lerato connected with you', 'Your profile was viewed 5 times'].map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardText}>{item}</Text>
          </View>
        ))}
        <Text style={styles.sectionTitle}>Recommended Jobs</Text>
        {['Junior Developer - TechCo 92%', 'WIL Placement - MTN 88%', 'IT Support - Vodacom 85%'].map((item, i) => (
          <View key={i} style={styles.jobCard}>
            <Text style={styles.jobText}>{item}</Text>
            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>🏠 Home</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>👤 Profile</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Jobs')}><Text style={styles.navText}>💼 Jobs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}><Text style={styles.navText}>💬 Chat</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#aac4ff', fontSize: 14, marginTop: 4 },
  feed: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  cardText: { color: '#333', fontSize: 14 },
  jobCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobText: { color: '#003399', fontSize: 13, fontWeight: '600', flex: 1 },
  applyBtn: { backgroundColor: '#CC0000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  applyText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', paddingVertical: 12 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 12, color: '#003399' },
});
