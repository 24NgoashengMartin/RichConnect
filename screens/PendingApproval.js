import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function PendingApproval({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⏳</Text>
      <Text style={styles.title}>Account Pending Approval</Text>
      <Text style={styles.message}>Your business account is being reviewed by our admin team. You will receive access once approved.</Text>
      <Text style={styles.sub}>This usually takes 24-48 hours.</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  message: { fontSize: 14, color: '#aac4ff', textAlign: 'center', lineHeight: 22, marginBottom: 12 },
  sub: { fontSize: 13, color: '#aac4ff', textAlign: 'center', marginBottom: 32 },
  logoutBtn: { backgroundColor: '#CC0000', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
