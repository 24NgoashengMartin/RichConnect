import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ADMIN_EMAILS = ['admin@richconnect.ac.za', 'admin@richfield.ac.za'];

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Student');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const userTypes = ['Student', 'Alumni', 'Business'];

  const getDashboard = (type) => {
    if (type === 'Business') return 'BusinessDashboard';
    if (type === 'Admin') return 'AdminDashboard';
    return 'StudentDashboard';
  };

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please enter email and password'); return; }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const savedType = userDoc.exists() ? userDoc.data().userType : userType;
      if (savedType === 'Business' && userDoc.exists() && !userDoc.data().approved) {
        navigation.navigate('PendingApproval');
      } else {
        navigation.navigate(getDashboard(savedType));
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please enter email and password'); return; }
    if (ADMIN_EMAILS.includes(email.toLowerCase())) {
      Alert.alert('Not Allowed', 'Admin accounts cannot self-register.'); return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email, userType, createdAt: new Date().toISOString(),
        approved: userType === 'Business' ? false : true
      });
      if (userType === 'Business') {
        navigation.navigate('PendingApproval');
      } else if (userType === 'Alumni') {
        navigation.navigate('AlumniVerification');
      } else {
        navigation.navigate('Onboarding');
      }
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
      <TouchableOpacity style={styles.loginBtn} onPress={isLogin ? handleLogin : handleRegister} disabled={loading}>
        <Text style={styles.loginText}>{loading ? 'Loading...' : isLogin ? 'Login' : 'Register as ' + userType}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.registerText}>{isLogin ? "Don't have an account? Register" : "Already have an account? Login"}</Text>
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
  registerText: { color: '#aac4ff', fontSize: 13 },
});
