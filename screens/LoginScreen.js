import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Student');
  const [loading, setLoading] = useState(false);
  const userTypes = ['Student', 'Alumni', 'Business', 'Admin'];

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please enter email and password'); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please enter email and password'); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Register Failed', error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.logo}>RichConnect</Text>
      <Text style={styles.tagline}>Empowering Graduate Employability</Text>
      <View style={styles.typeRow}>
        {userTypes.map(type => (
          <TouchableOpacity key={type} style={[styles.typeBtn, userType === type && styles.typeBtnActive]} onPress={() => setUserType(type)}>
            <Text style={[styles.typeText, userType === type && styles.typeTextActive]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry/>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginText}>{loading ? 'Loading...' : 'Login as ' + userType}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  tagline: { fontSize: 13, color: '#aac4ff', marginBottom: 32 },
  typeRow: { flexDirection: 'row', marginBottom: 24, gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  typeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#aac4ff' },
  typeBtnActive: { backgroundColor: '#CC0000', borderColor: '#CC0000' },
  typeText: { color: '#aac4ff', fontSize: 12 },
  typeTextActive: { color: '#fff', fontWeight: 'bold' },
  input: { width: '100%', backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 15, color: '#000' },
  loginBtn: { width: '100%', backgroundColor: '#CC0000', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  registerBtn: { marginTop: 8 },
  registerText: { color: '#aac4ff', fontSize: 13 },
});
