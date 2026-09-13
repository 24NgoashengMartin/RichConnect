import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function SettingsScreen({ navigation }) {
  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout', style: 'destructive', onPress: async () => {
          await signOut(auth);
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>👤 Edit Profile</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>🔒 Change Password</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>🔔 Notifications</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>👁️ Profile Visibility</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>🛡️ POPIA Data Rights</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>📱 Version</Text>
            <Text style={styles.menuValue}>1.0.0</Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>🏫 Richfield Hackathon 2026</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { color: '#aac4ff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16 },
  section: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, elevation: 2, overflow: 'hidden' },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#888', padding: 12, paddingBottom: 4, textTransform: 'uppercase' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f4ff' },
  menuText: { fontSize: 14, color: '#333' },
  menuValue: { fontSize: 14, color: '#888' },
  arrow: { fontSize: 18, color: '#888' },
  logoutBtn: { backgroundColor: '#CC0000', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
