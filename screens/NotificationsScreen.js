import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser.uid;
    const q = query(collection(db, 'connections'), where('to', '==', uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(notifs);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications 🔔</Text>
      </View>
      <ScrollView style={styles.content}>
        {notifications.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
        {notifications.map(notif => (
          <View key={notif.id} style={styles.notifCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{notif.fromEmail ? notif.fromEmail[0].toUpperCase() : '?'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.notifText}>
                <Text style={styles.bold}>{notif.fromEmail}</Text>
                {notif.status === 'pending' ? ' sent you a connection request' : notif.status === 'accepted' ? ' accepted your connection' : ' declined your connection'}
              </Text>
              <View style={[styles.badge, { backgroundColor: notif.status === 'pending' ? '#f0a500' : notif.status === 'accepted' ? '#00aa44' : '#CC0000' }]}>
                <Text style={styles.badgeText}>{notif.status}</Text>
              </View>
            </View>
            {notif.status === 'pending' && (
              <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate('Connections')}>
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
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
  emptyCard: { backgroundColor: '#fff', borderRadius: 10, padding: 32, alignItems: 'center', elevation: 2 },
  emptyText: { color: '#888', fontSize: 14 },
  notifCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 },
  notifText: { fontSize: 13, color: '#333', lineHeight: 18 },
  bold: { fontWeight: 'bold', color: '#003399' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 6 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  viewBtn: { backgroundColor: '#003399', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  viewBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
