import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function StudentDashboard({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const uid = auth.currentUser.uid;

    // Load user name
    getDoc(doc(db, 'profiles', uid)).then(snap => {
      if (snap.exists()) setUserName(snap.data().name || '');
    });

    // Real-time notifications
    const notifQ = query(collection(db, 'connections'), where('to', '==', uid), where('status', '==', 'pending'));
    const unsubNotif = onSnapshot(notifQ, snap => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Real jobs
    const jobsQ = query(collection(db, 'jobs'), where('status', '==', 'Approved'), limit(3));
    const unsubJobs = onSnapshot(jobsQ, snap => {
      setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubNotif(); unsubJobs(); };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>RichConnect</Text>
          <Text style={styles.headerSub}>Welcome, {userName || auth.currentUser?.email?.split('@')[0]} 👋</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 16}}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <View>
              <Text style={styles.bell}>🔔</Text>
              {notifications.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notifications.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.bell}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.feed}>
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Text style={styles.searchText}>🔍 Search people, skills, alumni...</Text>
        </TouchableOpacity>

        {notifications.length > 0 && (
          <TouchableOpacity style={styles.alertCard} onPress={() => navigation.navigate('Connections')}>
            <Text style={styles.alertText}>🤝 You have {notifications.length} pending connection request{notifications.length > 1 ? 's' : ''}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Recommended Jobs</Text>
        {jobs.length === 0 ? (
          <View style={styles.card}><Text style={styles.cardText}>No approved jobs yet</Text></View>
        ) : jobs.map(job => (
          <View key={job.id} style={styles.jobCard}>
            <View>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobCompany}>{job.company}</Text>
            </View>
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
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Feed')}><Text style={styles.navText}>📰 Feed</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Connections')}><Text style={styles.navText}>🤝 Network</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Jobs')}><Text style={styles.navText}>💼 Jobs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}><Text style={styles.navText}>👤 Profile</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chat')}><Text style={styles.navText}>💬 Chat</Text></TouchableOpacity>
        <TouchableOpacity style={styles.analyticsBtn} onPress={() => navigation.navigate('Events')}>
        <Text style={styles.analyticsBtnText}>📅 View Events & Career Fairs</Text>
        </TouchableOpacity>
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
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#CC0000', borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  feed: { padding: 16 },
  searchBar: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, elevation: 2 },
  searchText: { color: '#888', fontSize: 14 },
  alertCard: { backgroundColor: '#CC0000', borderRadius: 10, padding: 14, marginBottom: 16 },
  alertText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2 },
  cardText: { color: '#888', fontSize: 14 },
  jobCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 14, fontWeight: 'bold', color: '#003399' },
  jobCompany: { fontSize: 12, color: '#666', marginTop: 2 },
  applyBtn: { backgroundColor: '#CC0000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  applyText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  analyticsBtn: { backgroundColor: '#003399', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  analyticsBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ddd', paddingVertical: 12 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 11, color: '#003399' },
});
