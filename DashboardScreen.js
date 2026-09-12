import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RichConnect</Text>
        <Text style={styles.headerSub}>Welcome, Martin 👋</Text>
      </View>
      <ScrollView style={styles.feed}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {['Lerato connected with you', 'New job: Junior Developer at TechCo', 'Sipho viewed your profile'].map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Connections')}><Text style={styles.navText}>🤝 Network</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>👤 Profile</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>💼 Jobs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Text style={styles.navText}>💬 Chat</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{marginTop: 8}}>
        <Text style={{color: '#aac4ff', fontSize: 13}}>🔍 Find People</Text>
        </TouchableOpacity>
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  cardText: { color: '#333', fontSize: 14 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', paddingVertical: 12 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 12, color: '#003399' },
});