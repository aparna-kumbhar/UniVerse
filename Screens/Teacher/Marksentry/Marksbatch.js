import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const Stack = createNativeStackNavigator();

// ── COLOURS ─────────────────────────────────────────────────────────────────
const C = {
  bg:            '#f0f4f2',
  surface:       '#ffffff',
  primary:       '#1a4a3a',
  primaryLight:  '#2d6b54',
  accent:        '#3d9970',
  accentSoft:    '#d4ede4',
  textPrimary:   '#1a2e25',
  textSecondary: '#5a7065',
  textMuted:     '#8fa99e',
  border:        '#e2ece8',
  pendingBg:     '#fff4ec',
  pendingText:   '#c97a35',
  pendingDot:    '#f0914a',
  activeDot:     '#3d9970',
  activeText:    '#1a4a3a',
  activeBg:      '#eaf5ef',
  tagBg:         '#eef7f2',
  tagText:       '#2d6b54',
};

// ── DATA ────────────────────────────────────────────────────────────────────
const BATCHES = [
  {
    id: '1',
    icon: '🧪',
    iconBg: '#d4ede4',
    name: 'Grade 12 – Physics A',
    tags: [
      { label: 'High Performance', accent: true },
      { label: 'Core Curriculum', accent: false },
    ],
    students: 32,
    average: '88.4%',
    status: 'ACTIVE',
  },
  {
    id: '2',
    icon: '∑',
    iconBg: '#c8e8e0',
    name: 'Grade 11 – Advanced Calculus',
    tags: [
      { label: 'Accelerated', accent: true },
      { label: 'STEM Track', accent: false },
    ],
    students: 24,
    average: '76.2%',
    status: 'PENDING',
  },
  {
    id: '3',
    icon: '📜',
    iconBg: '#e8eceb',
    name: 'Grade 12 – Modern History',
    tags: [
      { label: 'Elective', accent: true },
      { label: 'Humanities', accent: false },
    ],
    students: 18,
    average: '91.0%',
    status: 'ACTIVE',
  },
  {
    id: '4',
    icon: '🔬',
    iconBg: '#d0ece3',
    name: 'Grade 10 – Biology B',
    tags: [
      { label: 'Foundation', accent: true },
      { label: 'Core Curriculum', accent: false },
    ],
    students: 45,
    average: '64.8%',
    status: 'ACTIVE',
  },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'batches',   label: 'Batches',   icon: '👥' },
  { id: 'reports',   label: 'Reports',   icon: '📊' },
  { id: 'archive',   label: 'Archive',   icon: '🔄' },
];

// ── COMPONENTS ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const isPending = status === 'PENDING';
  return (
    <View style={[styles.badge, isPending ? styles.badgePending : styles.badgeActive]}>
      <View style={[styles.dot, { backgroundColor: isPending ? C.pendingDot : C.activeDot }]} />
      <Text style={[styles.badgeText, { color: isPending ? C.pendingText : C.activeText }]}>
        {status}
      </Text>
    </View>
  );
};

const Tag = ({ label, accent }) => (
  <View style={[styles.tag, accent ? styles.tagAccent : styles.tagSoft]}>
    <Text style={[styles.tagText, accent ? styles.tagTextAccent : styles.tagTextSoft]}>
      {label}
    </Text>
  </View>
);

const BatchCard = ({ batch, onEnterMarks }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.55} onPress={() => {}}>
    <View style={[styles.batchIcon, { backgroundColor: batch.iconBg }]}>
      <Text style={styles.batchIconText}>{batch.icon}</Text>
    </View>
    <View style={styles.batchInfo}>
      <Text style={styles.batchName} numberOfLines={1}>{batch.name}</Text>
      <View style={styles.tagRow}>
        {batch.tags.map((t, i) => <Tag key={i} label={t.label} accent={t.accent} />)}
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>STUDENTS</Text>
          <Text style={styles.statValue}>{batch.students}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>AVERAGE</Text>
          <Text style={styles.statValue}>{batch.average}</Text>
        </View>
        <StatusBadge status={batch.status} />
      </View>
      <TouchableOpacity style={styles.enterBtn} activeOpacity={0.6} onPress={() => onEnterMarks(batch)}>
        <Text style={styles.enterBtnText}>Enter Marks</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// ── TABLET SIDEBAR ───────────────────────────────────────────────────────────
const Sidebar = ({ activeNav, setActiveNav }) => (
  <View style={styles.sidebar}>
    <View style={styles.sidebarBrand}>
      <Text style={styles.brandName}>Modern Scholar</Text>
      <Text style={styles.brandSub}>BATCH MANAGEMENT</Text>
    </View>
    <View style={styles.navList}>
      {NAV_ITEMS.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[styles.navItem, activeNav === item.id && styles.navItemActive]}
          activeOpacity={0.55}
          onPress={() => setActiveNav(item.id)}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={[styles.navLabel, activeNav === item.id && styles.navLabelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <TouchableOpacity style={styles.newBatchBtn} activeOpacity={0.6}>
      <Text style={styles.newBatchBtnText}>＋  New Batch</Text>
    </TouchableOpacity>
    <View style={styles.sidebarFooter}>
      {['Help', 'Sign Out'].map(label => (
        <TouchableOpacity key={label} style={styles.navItem} activeOpacity={0.55}>
          <Text style={styles.navIcon}>{label === 'Help' ? '❓' : '↪️'}</Text>
          <Text style={styles.navLabel}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// ── MARKS INPUT SCREEN ───────────────────────────────────────────────────────
function MarksinputScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { batch } = route.params || {};
  
  const [marks, setMarks] = useState({});
  const [studentNames, setStudentNames] = useState(
    Array(20).fill().map((_, i) => `Student ${i + 1}`)
  );

  const handleMarkChange = (index, value) => {
    // Allow only numbers
    if (value === '' || /^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      if (value === '' || (numValue >= 0 && numValue <= 100)) {
        setMarks({ ...marks, [index]: value });
      }
    }
  };

  const handleSubmit = () => {
    const validMarks = Object.values(marks).filter(m => m !== '' && m !== null);
    if (validMarks.length === 0) {
      Alert.alert('Error', 'Please enter at least one student\'s marks');
      return;
    }
    
    Alert.alert(
      'Success',
      `Marks saved for ${validMarks.length} students in ${batch?.name}`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const calculateAverage = () => {
    const validMarks = Object.values(marks)
      .filter(m => m !== '' && m !== null)
      .map(m => parseInt(m, 10));
    if (validMarks.length === 0) return 'N/A';
    const avg = validMarks.reduce((a, b) => a + b, 0) / validMarks.length;
    return `${avg.toFixed(1)}%`;
  };

  return (
    <SafeAreaView style={styles.marksContainer}>
      <View style={styles.marksHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Batches</Text>
        </TouchableOpacity>
        <Text style={styles.marksTitle}>Enter Student Marks</Text>
        <Text style={styles.batchName}>{batch?.name || 'Select Batch'}</Text>
        <View style={styles.statsSummary}>
          <Text style={styles.statsSummaryText}>
            Students: {studentNames.length} | Average: {calculateAverage()}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.marksContent}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.studentNameCell]}>Student Name</Text>
          <Text style={[styles.headerCell, styles.marksCell]}>Marks (0-100)</Text>
        </View>

        {studentNames.map((name, index) => (
          <View key={index} style={styles.marksRow}>
            <Text style={[styles.cell, styles.studentNameCell]}>{name}</Text>
            <View style={[styles.cell, styles.marksCell]}>
              <TextInput
                style={styles.marksInput}
                keyboardType="numeric"
                placeholder="Enter marks"
                placeholderTextColor={C.textMuted}
                value={marks[index] || ''}
                onChangeText={(value) => handleMarkChange(index, value)}
                maxLength={3}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Marks</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── MAIN BATCH SCREEN ──────────────────────────────────────────────────────
function MarksbatchScreen() {
  const [activeNav, setActiveNav] = useState('batches');
  const [search, setSearch] = useState('');
  const filtered = BATCHES.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />
      <View style={styles.topbar}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search registry…"
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.topbarActions} />
      </View>
      <View style={styles.layout}>
        {isTablet && <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />}
        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Select Batch</Text>
        
          {filtered.map(batch => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onEnterMarks={(b) => navigation.navigate('Marksinput', { batch: b })}
            />
          ))}
          <Text style={styles.pageFooter}>
            Viewing {filtered.length} active scholarship batches. Page 1 of 1.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ── ROOT NAVIGATOR ───────────────────────────────────────────────────────────
// REMOVED the NavigationContainer wrapper - now just exports the Stack Navigator
export default function Marksbatch() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BatchList" component={MarksbatchScreen} />
      <Stack.Screen name="Marksinput" component={MarksinputScreen} />
    </Stack.Navigator>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Existing styles
  safeArea: { flex: 1, backgroundColor: C.surface },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 10,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  brandName: { fontSize: isTablet ? 17 : 14, fontWeight: '700', color: C.primary, letterSpacing: -0.3 },
  brandSub: { fontSize: 9, fontWeight: '600', color: C.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
    borderRadius: 50, paddingHorizontal: 12, height: 36, gap: 6,
  },
  searchIcon: { fontSize: 12 },
  searchInput: { flex: 1, fontSize: 13, color: C.textPrimary, paddingVertical: 0 },
  topbarActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  layout: { flex: 1, flexDirection: 'row', backgroundColor: C.bg },
  sidebar: {
    width: 220, backgroundColor: C.surface,
    borderRightWidth: 1, borderRightColor: C.border,
    paddingTop: 20, paddingBottom: 16,
  },
  sidebarBrand: { paddingHorizontal: 16, marginBottom: 20 },
  navList: { paddingHorizontal: 10, flex: 1 },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 2 },
  navItemActive: { backgroundColor: C.accentSoft },
  navIcon: { fontSize: 15 },
  navLabel: { fontSize: 14, fontWeight: '500', color: C.textSecondary },
  navLabelActive: { color: C.primary, fontWeight: '600' },
  newBatchBtn: { margin: 12, backgroundColor: C.primary, borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  newBatchBtnText: { color: '#fff', fontWeight: '700', fontSize: 13.5 },
  sidebarFooter: { paddingHorizontal: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border },
  main: { flex: 1 },
  mainContent: { padding: isTablet ? 32 : 16, paddingBottom: isTablet ? 40 : 20 },
  pageTitle: { fontSize: isTablet ? 30 : 24, fontWeight: '800', color: C.textPrimary, marginBottom: 8, letterSpacing: -0.5 },
  pageDesc: { fontSize: 13.5, color: C.textSecondary, lineHeight: 21, marginBottom: 24, maxWidth: 480 },
  card: {
    backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    padding: isTablet ? 20 : 16, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 14,
    ...Platform.select({
      ios:     { shadowColor: '#1a4a3a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4 },
      android: { elevation: 1 },
    }),
  },
  batchIcon: { width: isTablet ? 52 : 44, height: isTablet ? 52 : 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  batchIconText: { fontSize: isTablet ? 22 : 18 },
  batchInfo: { flex: 1, gap: 6 },
  batchName: { fontSize: isTablet ? 16 : 15, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 20, paddingVertical: 3, paddingHorizontal: 10 },
  tagAccent: { backgroundColor: C.tagBg },
  tagSoft: { backgroundColor: '#f0f7f4' },
  tagText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.2 },
  tagTextAccent: { color: C.tagText },
  tagTextSoft: { color: C.textSecondary },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6, flexWrap: 'wrap' },
  stat: { alignItems: 'flex-start' },
  statLabel: { fontSize: 9.5, fontWeight: '700', color: C.textMuted, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 2 },
  statValue: { fontSize: isTablet ? 18 : 16, fontWeight: '800', color: C.textPrimary },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingVertical: 5, paddingHorizontal: 11 },
  badgeActive:  { backgroundColor: C.activeBg },
  badgePending: { backgroundColor: C.pendingBg },
  dot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  enterBtn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 18, alignSelf: 'flex-start', marginTop: 8 },
  enterBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  pageFooter: { marginTop: 16, textAlign: 'center', fontSize: 13, color: C.textMuted },

  // Marks input screen styles
  marksContainer: {
    flex: 1,
    backgroundColor: C.bg,
  },
  marksHeader: {
    backgroundColor: C.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: C.primary,
    fontWeight: '600',
  },
  marksTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: C.textPrimary,
    marginBottom: 8,
  },
  batchName: {
    fontSize: 16,
    color: C.textSecondary,
    marginBottom: 12,
  },
  statsSummary: {
    backgroundColor: C.accentSoft,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  statsSummaryText: {
    fontSize: 14,
    color: C.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  marksContent: {
    flex: 1,
    padding: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: C.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  marksRow: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  cell: {
    fontSize: 14,
    color: C.textPrimary,
  },
  studentNameCell: {
    flex: 2,
  },
  marksCell: {
    flex: 1,
  },
  marksInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: C.bg,
  },
  submitButton: {
    backgroundColor: C.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});