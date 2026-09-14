import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const defaultEvents = [
  { id: 'e1', title: 'Career Fair 2026', date: '2026-10-15', location: 'Richfield Pretoria', type: 'Career Fair', description: 'Meet top employers from IT, Finance and Engineering.' },
  { id: 'e2', title: 'CV Writing Workshop', date: '2026-09-25', location: 'Online', type: 'Workshop', description: 'Learn to write a winning CV with our career coaches.' },
  { id: 'e3', title: 'Networking Evening', date: '2026-10-01', location: 'Richfield Pretoria', type: 'Networking', description: 'Connect with alumni and industry professionals.' },
];

export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    try {
      const q = query(collection(db, 'events'), orderBy('date', 'asc'));
      return onSnapshot(q, snap => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    } catch(e) {}
  }, []);

  const allEvents = [...defaultEvents, ...events];
  const getColor = (type) => type === 'Career Fair' ? '#003399' : type === 'Workshop' ? '#CC0000' : '#00aa44';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Events & Career Fairs</Text>
      </View>
      <ScrollView style={styles.content}>
        {allEvents.map(event => (
          <View key={event.id} style={styles.card}>
            <View style={[styles.typeBadge, { backgroundColor: getColor(event.type) }]}><Text style={styles.typeText}>{event.type}</Text></View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>📅 {event.date}</Text>
            <Text style={styles.eventLocation}>📍 {event.location}</Text>
            <Text style={styles.eventDesc}>{event.description}</Text>
            <TouchableOpacity style={styles.registerBtn}><Text style={styles.registerBtnText}>Register Interest</Text></TouchableOpacity>
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 10 },
  typeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  eventTitle: { fontSize: 17, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  eventDate: { fontSize: 13, color: '#666', marginBottom: 4 },
  eventLocation: { fontSize: 13, color: '#666', marginBottom: 8 },
  eventDesc: { fontSize: 13, color: '#444', lineHeight: 20, marginBottom: 12 },
  registerBtn: { backgroundColor: '#003399', padding: 10, borderRadius: 8, alignItems: 'center' },
  registerBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
