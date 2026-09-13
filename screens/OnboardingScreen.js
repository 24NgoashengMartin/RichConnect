import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const slides = [
  { icon: '🎓', title: 'Welcome to RichConnect', desc: 'The professional networking platform built specifically for Richfield graduates and students.' },
  { icon: '💼', title: 'Find Your Dream Job', desc: 'AI-powered job matching connects you with opportunities that match your skills and profile.' },
  { icon: '🤝', title: 'Build Your Network', desc: 'Connect with fellow students, alumni, and businesses in the Richfield community.' },
  { icon: '🤖', title: 'Meet RichAssist', desc: 'Your AI career guide helps you build the perfect profile and prepare for interviews.' },
  { icon: '🚀', title: 'Start Your Journey', desc: 'Complete your profile to get the best job matches and connect with the right people.' },
];

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigation.navigate('StudentDashboard');
    }
  };

  const skip = () => navigation.navigate('StudentDashboard');

  const slide = slides[current];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.icon}>{slide.icon}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]}/>
        ))}
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={next}>
        <Text style={styles.nextBtnText}>{current === slides.length - 1 ? 'Get Started 🚀' : 'Next →'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#003399', alignItems: 'center', justifyContent: 'center', padding: 32 },
  skip: { position: 'absolute', top: 48, right: 24 },
  skipText: { color: '#aac4ff', fontSize: 14 },
  content: { alignItems: 'center', marginBottom: 48 },
  icon: { fontSize: 80, marginBottom: 32 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 15, color: '#aac4ff', textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 48 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#aac4ff' },
  dotActive: { backgroundColor: '#CC0000', width: 24 },
  nextBtn: { width: '100%', backgroundColor: '#CC0000', padding: 16, borderRadius: 12, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
