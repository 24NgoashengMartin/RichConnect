import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

const defaultJobs = [
  { id: '1', title: 'Junior Developer', company: 'TechCo Pretoria', type: 'Full-time', skills: 'JavaScript, React Native', location: 'Pretoria', status: 'Approved' },
  { id: '2', title: 'IT Support Technician', company: 'Vodacom', type: 'Full-time', skills: 'Networking, Windows', location: 'Johannesburg', status: 'Approved' },
  { id: '3', title: 'Cybersecurity Analyst', company: 'FNB', type: 'Graduate', skills: 'Cybersecurity, Python', location: 'Sandton', status: 'Approved' },
  { id: '4', title: 'WIL Placement', company: 'MTN', type: 'Learnership', skills: 'JavaScript, Firebase', location: 'Pretoria', status: 'Approved' },
  { id: '5', title: 'Data Analyst Intern', company: 'Capitec', type: 'Internship', skills: 'Python, Data Analysis', location: 'Cape Town', status: 'Approved' },
];

const calculateMatch = (jobSkills, userSkills) => {
  if (!userSkills) return 0;
  const job = jobSkills.toLowerCase().split(',').map(s => s.trim());
  const user = userSkills.toLowerCase().split(',').map(s => s.trim());
  const matches = job.filter(s => user.some(u => u.includes(s) || s.includes(u)));
  return Math.round((matches.length / job.length) * 100);
};

export default function JobsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState(defaultJobs);
  const [userSkills] = useState('JavaScript, React Native, Firebase, Python, Cybersecurity');

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), where('status', '==', 'Approved'));
      const snapshot = await getDocs(q);
      const firebaseJobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (firebaseJobs.length > 0) setJobs([...defaultJobs, ...firebaseJobs]);
    } catch (e) { console.log(e); }
  };

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Listings</Text>
        <Text style={styles.headerSub}>AI-matched for your profile</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.search} placeholder="Search jobs..." value={search} onChangeText={setSearch}/>
      </View>
      <ScrollView style={styles.list}>
        {filtered.map(job => {
          const match = calculateMatch(job.skills, userSkills);
          return (
            <View key={job.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={[styles.matchBadge, { backgroundColor: match >= 80 ? '#00aa44' : match >= 60 ? '#f0a500' : '#CC0000' }]}>
                  <Text style={styles.matchText}>{match}% match</Text>
                </View>
              </View>
              <Text style={styles.company}>{job.company}</Text>
              <Text style={styles.location}>📍 {job.location}</Text>
              <View style={styles.cardBottom}>
                <View style={styles.typeBadge}><Text style={styles.typeText}>{job.type}</Text></View>
                <TouchableOpacity style={styles.applyBtn}><Text style={styles.applyText}>Apply Now</Text></TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#aac4ff', fontSize: 13, marginTop: 4 },
  searchContainer: { padding: 16 },
  search: { backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, elevation: 2 },
  list: { paddingHorizontal: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', flex: 1 },
  matchBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  matchText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  company: { color: '#444', fontSize: 13, marginTop: 4 },
  location: { color: '#888', fontSize: 12, marginTop: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  typeBadge: { backgroundColor: '#e8eeff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  typeText: { color: '#003399', fontSize: 11, fontWeight: '600' },
  applyBtn: { backgroundColor: '#CC0000', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  applyText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
