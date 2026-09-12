import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ConnectionsScreen({ navigation }) {
  const [pending, setPending] = useState([]);
  const [connected, setConnected] = useState([]);

  useEffect(() => { loadConnections(); }, []);

  const loadConnections = async () => {
    try {
      const uid = auth.currentUser.uid;
      const pendingQ = query(collection(db, 'connections'), where('to', '==', uid), where('status', '==', 'pending'));
      const connectedQ = query(collection(db, 'connections'), where('status', '==', 'accepted'), where('to', '==', uid));
      const connectedQ2 = query(collection(db, 'connections'), where('status', '==', 'accepted'), where('from', '==', uid));
      const [pendingSnap, connSnap, connSnap2] = await Promise.all([getDocs(pendingQ), getDocs(connectedQ), getDocs(connectedQ2)]);
      setPending(pendingSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setConnected([...connSnap.docs.map(d => ({ id: d.id, ...d.data() })), ...connSnap2.docs.map(d => ({ id: d.id, ...d.data() }))]);
    } catch (e) { console.log(e); }
  };

  const respond = async (connId, status) => {
    try {
      await updateDoc(doc(db, 'connections', connId), { status });
      Alert.alert('Done', status === 'accepted' ? 'Connection accepted!' : 'Request declined.');
      loadConnections();
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>My Network</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Pending Requests ({pending.length})</Text>
        {pending.length === 0 && <View style={styles.emptyCard}><Text style={styles.emptyText}>No pending requests</Text></View>}
        {pending.map(conn => (
          <View key={conn.id} style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{conn.fromEmail ? conn.fromEmail[0].toUpperCase() : '?'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{conn.fromEmail}</Text>
              <Text style={styles.sub}>wants to connect</Text>
            </View>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.acceptBtn} onPress={() => respond(conn.id, 'accepted')}>
                <Text style={styles.btnText}>✅</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineBtn} onPress={() => respond(conn.id, 'declined')}>
                <Text style={styles.btnText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>My Connections ({connected.length})</Text>
        {connected.length === 0 && <View style={styles.emptyCard}><Text style={styles.emptyText}>No connections yet — search for people!</Text></View>}
        {connected.map(conn => (
          <View key={conn.id} style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{conn.fromEmail ? conn.fromEmail[0].toUpperCase() : '?'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{conn.fromEmail}</Text>
              <Text style={styles.sub}>Connected ✅</Text>
            </View>
            <TouchableOpacity style={styles.msgBtn} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.msgBtnText}>💬</Text>
            </TouchableOpacity>
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
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 12, marginTop: 8 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, alignItems: 'center' },
  emptyText: { color: '#888', fontSize: 13 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: 'bold', color: '#003399' },
  sub: { fontSize: 12, color: '#666', marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 8 },
  acceptBtn: { backgroundColor: '#00aa44', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  declineBtn: { backgroundColor: '#CC0000', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 14 },
  msgBtn: { backgroundColor: '#003399', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  msgBtnText: { fontSize: 16 },
});
