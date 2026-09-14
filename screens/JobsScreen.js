import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';

const APP_ID = 'de13ea6f';
const APP_KEY = '357e6fec52988c66bb3645e950d9b8af';

const calculateMatch = (jobTitle, userSkills) => {
  const skills = userSkills.toLowerCase().split(',').map(s => s.trim());
  const title = jobTitle.toLowerCase();
  const matches = skills.filter(s => title.includes(s));
  return Math.min(95, 60 + matches.length * 10);
};

export default function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('developer');
  const [loading, setLoading] = useState(false);
  const userSkills = 'javascript, react, python, cybersecurity, firebase';

  useEffect(() => { fetchJobs('developer'); }, []);

  const fetchJobs = async (keyword) => {
    setLoading(true);
    try {
      const url = `https://api.adzuna.com/v1/api/jobs/za/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&what=${keyword}&content-type=application/json`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results) setJobs(data.results);
    } catch (e) { console.log('Adzuna error:', e); }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Listings 🇿🇦</Text>
        <Text style={styles.headerSub}>Real SA jobs — AI matched for you</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.search} placeholder="Search jobs..." value={search} onChangeText={setSearch} onSubmitEditing={() => fetchJobs(search)}/>
        <TouchableOpacity style={styles.searchBtn} onPress={() => fetchJobs(search)}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#003399"/>
          <Text style={styles.loadingText}>Finding jobs...</Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {jobs.length === 0 && <Text style={styles.noJobs}>No jobs found</Text>}
          {jobs.map((job, i) => {
            const match = calculateMatch(job.title, userSkills);
            return (
              <View key={i} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
                  <View style={[styles.matchBadge, { backgroundColor: match >= 80 ? '#00aa44' : '#f0a500' }]}>
                    <Text style={styles.matchText}>{match}%</Text>
                  </View>
                </View>
                <Text style={styles.company}>{job.company?.display_name}</Text>
                <Text style={styles.location}>📍 {job.location?.display_name}</Text>
                {job.salary_min && <Text style={styles.salary}>💰 R{Math.round(job.salary_min).toLocaleString()} - R{Math.round(job.salary_max).toLocaleString()}</Text>}
                <Text style={styles.desc} numberOfLines={2}>{job.description}</Text>
                <TouchableOpacity style={styles.applyBtn} onPress={() => job.redirect_url && require('react-native').Linking.openURL(job.redirect_url)}>
                  <Text style={styles.applyText}>Apply Now →</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  header: { backgroundColor: '#003399', padding: 24, paddingTop: 48 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#aac4ff', fontSize: 13, marginTop: 4 },
  searchContainer: { flexDirection: 'row', padding: 16, gap: 8 },
  search: { flex: 1, backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, elevation: 2 },
  searchBtn: { backgroundColor: '#003399', borderRadius: 8, padding: 12, justifyContent: 'center' },
  searchBtnText: { fontSize: 18 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#003399', marginTop: 12, fontSize: 14 },
  list: { paddingHorizontal: 16 },
  noJobs: { color: '#888', textAlign: 'center', marginTop: 32, fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  jobTitle: { fontSize: 15, fontWeight: 'bold', color: '#003399', flex: 1, marginRight: 8 },
  matchBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  matchText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  company: { color: '#444', fontSize: 13, marginBottom: 4 },
  location: { color: '#888', fontSize: 12, marginBottom: 4 },
  salary: { color: '#00aa44', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  desc: { color: '#666', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  applyBtn: { backgroundColor: '#CC0000', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-end' },
  applyText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
