import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const articles = [
  { id: 1, title: '10 Most In-Demand IT Skills in SA 2026', category: 'Career Advice', readTime: '5 min', date: 'Sep 10, 2026', summary: 'Cybersecurity, cloud computing, and React Native top the list.', content: 'The SA IT sector is booming. Employers seek graduates with Firebase, React Native, Python, and cybersecurity skills.', color: '#003399' },
  { id: 2, title: 'How to Land Your WIL Placement', category: 'WIL Guide', readTime: '4 min', date: 'Sep 8, 2026', summary: 'WIL placements are competitive. Here is how to stand out.', content: 'MTN, Vodacom, FNB offer WIL placements yearly. Complete your RichConnect profile and connect with alumni.', color: '#CC0000' },
  { id: 3, title: 'Graduate Salaries in SA 2026', category: 'Salary Guide', readTime: '3 min', date: 'Sep 5, 2026', summary: 'Entry-level IT salaries increased 12% in 2026.', content: 'Junior Developers earn R180k-R280k. Cybersecurity analysts command R250k+ at entry level.', color: '#00aa44' },
  { id: 4, title: 'Top 5 Companies Hiring IT Graduates in Pretoria', category: 'Job Market', readTime: '4 min', date: 'Sep 3, 2026', summary: 'These companies are actively recruiting IT graduates.', content: '1. Deloitte Digital 2. SITA 3. BCX 4. Accenture 5. Allan Gray — all hiring IT graduates now.', color: '#f0a500' },
  { id: 5, title: 'SETA Learnerships for IT Graduates 2026', category: 'Learnerships', readTime: '3 min', date: 'Aug 28, 2026', summary: 'MICT SETA announced new learnerships with R3,500-R7,500 stipends.', content: 'MICT SETA learnerships are 12-month programmes. Applications open October 2026.', color: '#6B4EFF' },
];

export default function ArticlesScreen({ navigation }) {
  const [selected, setSelected] = useState(null);

  if (selected) return (
    <View style={styles.container}>
      <View style={[styles.articleHeader, { backgroundColor: selected.color }]}>
        <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.category}>{selected.category}</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.articleTitle}>{selected.title}</Text>
        <Text style={styles.meta}>{selected.date} • {selected.readTime}</Text>
        <Text style={styles.body}>{selected.content}</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: selected.color }]} onPress={() => navigation.navigate('Jobs')}>
          <Text style={styles.btnText}>🔍 Find Related Jobs</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Career Articles</Text>
      </View>
      <ScrollView style={styles.content}>
        {articles.map(a => (
          <TouchableOpacity key={a.id} style={styles.card} onPress={() => setSelected(a)}>
            <View style={[styles.cardTop, { backgroundColor: a.color }]}>
              <Text style={styles.cardCategory}>{a.category}</Text>
              <Text style={styles.cardRead}>{a.readTime}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{a.title}</Text>
              <Text style={styles.cardSummary}>{a.summary}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48, flexDirection: 'row', alignItems: 'center', gap: 16 },
  articleHeader: { padding: 24, paddingTop: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: '#fff', fontSize: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  category: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, elevation: 2, overflow: 'hidden' },
  cardTop: { padding: 12, flexDirection: 'row', justifyContent: 'space-between' },
  cardCategory: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  cardRead: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  cardSummary: { fontSize: 13, color: '#666', lineHeight: 20 },
  articleTitle: { fontSize: 20, fontWeight: 'bold', color: '#003399', marginBottom: 8 },
  meta: { fontSize: 12, color: '#888', marginBottom: 16 },
  body: { fontSize: 14, color: '#333', lineHeight: 24, marginBottom: 24 },
  btn: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
