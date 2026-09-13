import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ADMIN_EMAILS = ['admin@richconnect.ac.za', 'admin@richfield.ac.za'];

export default function RegisterScreen({ navigation, route }) {
  const userType = route?.params?.userType || 'Student';
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    studentNumber: '',
    programme: '',
    campus: '',
    phone: '',
    companyName: '',
    industry: '',
  });

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.name) {
      Alert.alert('Error', 'Please fill in all required fields'); return;
    }
    if (ADMIN_EMAILS.includes(form.email.toLowerCase())) {
      Alert.alert('Not Allowed', 'Admin accounts cannot self-register.'); return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email: form.email, userType,
        createdAt: new Date().toISOString(),
        approved: userType === 'Business' ? false : true,
      });

      await setDoc(doc(db, 'profiles', uid), {
        name: form.name,
        email: form.email,
        studentNumber: form.studentNumber || '',
        programme: form.programme || '',
        campus: form.campus || '',
        phone: form.phone || '',
        companyName: form.companyName || '',
        industry: form.industry || '',
        headline: userType === 'Student' ? 'Student at Richfield' : userType === 'Business' ? 'Business User' : 'Alumni',
        skills: '',
        about: '',
        github: '',
        linkedin: '',
        createdAt: new Date().toISOString(),
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>RichConnect</Text>
        <Text style={styles.tagline}>Create your {userType} account</Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput style={styles.input} value={form.name} onChangeText={t => update('name', t)} placeholder="Your full name" placeholderTextColor="#888"/>

        <Text style={styles.label}>Email *</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={t => update('email', t)} placeholder={userType === 'Student' ? 'student@richfield.ac.za' : 'your@email.com'} placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none"/>

        <Text style={styles.label}>Password *</Text>
        <TextInput style={styles.input} value={form.password} onChangeText={t => update('password', t)} placeholder="Min 6 characters" placeholderTextColor="#888" secureTextEntry/>

        {userType === 'Student' && (
          <>
            <Text style={styles.label}>Student Number</Text>
            <TextInput style={styles.input} value={form.studentNumber} onChangeText={t => update('studentNumber', t)} placeholder="e.g. RGI2022001" placeholderTextColor="#888"/>
            <Text style={styles.label}>Programme</Text>
            <TextInput style={styles.input} value={form.programme} onChangeText={t => update('programme', t)} placeholder="e.g. IT Diploma" placeholderTextColor="#888"/>
            <Text style={styles.label}>Campus</Text>
            <TextInput style={styles.input} value={form.campus} onChangeText={t => update('campus', t)} placeholder="e.g. Richfield Pretoria" placeholderTextColor="#888"/>
          </>
        )}

        {userType === 'Business' && (
          <>
            <Text style={styles.label}>Company Name</Text>
            <TextInput style={styles.input} value={form.companyName} onChangeText={t => update('companyName', t)} placeholder="Your company name" placeholderTextColor="#888"/>
            <Text style={styles.label}>Industry</Text>
            <TextInput style={styles.input} value={form.industry} onChangeText={t => update('industry', t)} placeholder="e.g. Technology, Finance" placeholderTextColor="#888"/>
          </>
        )}

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} value={form.phone} onChangeText={t => update('phone', t)} placeholder="e.g. 0821234567" placeholderTextColor="#888" keyboardType="phone-pad"/>

        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
          <Text style={styles.registerText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003399' },
  scroll: { padding: 24, paddingTop: 48 },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 4, textAlign: 'center' },
  tagline: { fontSize: 13, color: '#aac4ff', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: 'bold', color: '#aac4ff', marginBottom: 6, marginTop: 12, textTransform: 'uppercase' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 14, fontSize: 14, color: '#000', marginBottom: 4 },
  registerBtn: { backgroundColor: '#CC0000', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24, marginBottom: 16 },
  registerText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginText: { color: '#aac4ff', fontSize: 13, textAlign: 'center', marginBottom: 40 },
});
