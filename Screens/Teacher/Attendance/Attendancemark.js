import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export const isLaptop = Dimensions.get('window').width >= 768;
const { width } = Dimensions.get('window');
const IS_WEB = Platform.OS === 'web';



// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_STUDENTS = [
  { id: '1', studentId: '2024-F-3902', name: 'Elias Vance',   role: 'Graduate Researcher', avatar: '#3A3A3A', status: 'present' },
  { id: '2', studentId: '2024-F-4105', name: 'Selina Chen',   role: 'Honors Fellow',        avatar: '#7B6EA6', status: 'absent'  },
  { id: '3', studentId: '2024-F-3811', name: 'Marcus Kael',   role: 'Teaching Assistant',   avatar: '#4A4A4A', status: 'late'    },
  { id: '4', studentId: '2024-F-4022', name: 'Lyra Sterling', role: 'PhD Candidate',        avatar: '#6B7280', status: null      },
  { id: '5', studentId: '2024-F-3756', name: 'Omar Hassan',   role: 'Graduate Researcher',  avatar: '#8B5E3C', status: null      },
  { id: '6', studentId: '2024-F-4301', name: 'Priya Nair',    role: 'Honors Fellow',        avatar: '#C2856B', status: null      },
  { id: '7', studentId: '2024-F-4412', name: 'Jonas Ritter',  role: 'PhD Candidate',        avatar: '#2D6A4F', status: null      },
  { id: '8', studentId: '2024-F-4530', name: 'Amara Osei',    role: 'Graduate Researcher',  avatar: '#B5451B', status: null      },
];

// ─── Avatar Component ─────────────────────────────────────────────────────────

const Avatar = ({ color, name, hasOnlineDot, size = 70 }) => {
  const initials = name.split(' ').map((n) => n[0]).join('');
  return (
    <View style={styles.avatarWrapper}>
      <View style={[styles.avatar, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.avatarInitials, { fontSize: size * 0.34 }]}>{initials}</Text>
      </View>
      {hasOnlineDot && (
        <View style={[styles.onlineDot, { width: size * 0.2, height: size * 0.2, borderRadius: size * 0.1, bottom: size * 0.04, right: size * 0.04 }]} />
      )}
    </View>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const config = {
    present: { bg: '#DCFCE7', text: '#15803D', label: 'Present' },
    absent:  { bg: '#FEE2E2', text: '#B91C1C', label: 'Absent'  },
    late:    { bg: '#DBEAFE', text: '#1D4ED8', label: 'Late'    },
  };
  const c = config[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{c.label}</Text>
    </View>
  );
};

// ─── Student Card ─────────────────────────────────────────────────────────────

const StudentCard = ({ student, onStatusChange }) => (
  <View style={[styles.card, isLaptop && styles.cardLaptop]}>
    <View style={styles.cardTopRow}>
      <Avatar color={student.avatar} name={student.name} hasOnlineDot={student.status === 'present'} size={54} />
      <View style={styles.cardInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <Text style={styles.studentId}>{student.studentId}</Text>
        <Text style={styles.studentRole}>{student.role}</Text>
      </View>
      <StatusBadge status={student.status} />
    </View>

    <View style={styles.cardDivider} />

    <View style={styles.statusRow}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onStatusChange(student.id, 'present')}
        style={[styles.statusBtn, student.status === 'present' && styles.statusBtnPresent]}
      >
        <Text style={[styles.statusBtnText, student.status === 'present' && { color: '#15803D' }]}>✓ Present</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onStatusChange(student.id, 'absent')}
        style={[styles.statusBtn, student.status === 'absent' && styles.statusBtnAbsent]}
      >
        <Text style={[styles.statusBtnText, student.status === 'absent' && { color: '#B91C1C' }]}>✕ Absent</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onStatusChange(student.id, 'late')}
        style={[styles.statusBtn, student.status === 'late' && styles.statusBtnLate]}
      >
        <Text style={[styles.statusBtnText, student.status === 'late' && { color: '#1D4ED8' }]}>🕐 Late</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ value, label, color, icon }) => (
  <View style={styles.statCard}>
    <Text style={styles.statCardIcon}>{icon}</Text>
    <Text style={[styles.statCardNumber, { color }]}>{value}</Text>
    <Text style={styles.statCardLabel}>{label}</Text>
  </View>
);

// ─── Bottom Tab ───────────────────────────────────────────────────────────────

const BottomTab = ({ icon, label, active, onPress }) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.tabItem}>
    <Text style={styles.tabIcon}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    {active && <View style={styles.tabActiveBar} />}
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const Attendancemark = () => {
    const navigation = useNavigation();
  const [students, setStudents]       = useState(INITIAL_STUDENTS);
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Attendancebatch');
  };

  

  const handleStatusChange = useCallback((id, status) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }, []);

  const handleMarkAllPresent = () => setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })));
  const handleReset          = () => setStudents((prev) => prev.map((s) => ({ ...s, status: null })));

  const handleSubmit = () => {
    const unmarked = students.filter((s) => s.status === null).length;
    if (unmarked > 0) {
      Alert.alert(
        'Incomplete Attendance',
        `${unmarked} student(s) have not been marked. Do you want to submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', style: 'destructive', onPress: () => Alert.alert('Success', 'Attendance submitted successfully!') },
        ]
      );
    } else {
      Alert.alert('Success', 'Attendance submitted successfully!');
    }
  };

  const enrolled      = students.length;
  const presentCount  = students.filter((s) => s.status === 'present').length;
  const absentCount   = students.filter((s) => s.status === 'absent').length;
  const lateCount     = students.filter((s) => s.status === 'late').length;
  const marked        = students.filter((s) => s.status !== null).length;
  const pending       = enrolled - marked;

  const filtered = students.filter((s) => {
    const matchesSearch  = s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter  = filterStatus === 'all' ? true : s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { label: 'All',       value: 'all'     },
    { label: '✓ Present', value: 'present' },
    { label: '✕ Absent',  value: 'absent'  },
    { label: '🕐 Late',   value: 'late'    },
    { label: '— Pending', value: null      },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        {/* FIX 1: removed animated={false} to avoid native driver conflict */}
        <StatusBar barStyle="dark-content" backgroundColor="#F0F4F8" />

        <View style={[styles.container, isLaptop && styles.containerLaptop]}>

      {/* ── Header ── */}
<View style={[styles.header, isLaptop && styles.headerLaptop]}>
  <View style={styles.headerLeft}>
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.backBtn}
      onPress={handleBackPress}
    >
      <Text style={styles.backIcon}>←</Text>
    </TouchableOpacity>

    <Text style={styles.headerTitle}>Attendance</Text>
  </View>
</View>
          

          {/* FIX 2: flex:1 on ScrollView so it fills space and scrolls on laptop/web */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              isLaptop && styles.scrollContentLaptop,
            ]}
          >
            {/* ── Session Info ── */}
         
              <View style={styles.sessionIdRow}>
               
              <Text style={styles.sessionTitle} numberOfLines={1} ellipsizeMode="tail">
                Advanced Fluid Mechanics
              </Text>
              <View style={styles.dateRow}>
                <Text style={styles.dateIcon}>🗓</Text>
        
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
            </View>

            {/* ── Stat Cards ── */}
            {/* FIX 3: removed scrollEventThrottle — no onScroll handler present */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={styles.statsScroll}
              contentContainerStyle={styles.statsScrollContent}
            >
              <StatCard value={enrolled}     label="ENROLLED" color="#2563EB" icon="👥" />
              <StatCard value={presentCount} label="PRESENT"  color="#15803D" icon="✅" />
              <StatCard value={absentCount}  label="ABSENT"   color="#B91C1C" icon="❌" />
              <StatCard value={lateCount}    label="LATE"     color="#1D4ED8" icon="🕐" />
              <StatCard value={pending}      label="PENDING"  color="#D97706" icon="⏳" />
            </ScrollView>

            {/* ── Progress Bar ── */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Completion</Text>
                <Text style={styles.progressPct}>
                  {enrolled > 0 ? Math.round((marked / enrolled) * 100) : 0}%
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${enrolled > 0 ? (marked / enrolled) * 100 : 0}%` }]} />
              </View>
            </View>

            {/* ── Action Buttons ── */}
            <View style={styles.actionRow}>
              <TouchableOpacity activeOpacity={0.75} onPress={handleReset} style={styles.resetBtn}>
                <Text style={styles.resetIcon}>↺</Text>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.75} onPress={handleMarkAllPresent} style={styles.markAllBtn}>
                <Text style={styles.markAllIcon}>✓</Text>
                <Text style={styles.markAllText}>Mark All Present</Text>
              </TouchableOpacity>
            </View>

            {/* ── Search ── */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIconText}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or ID..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={styles.searchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Filter Chips ── */}
            {/* FIX 3 applied here too: removed scrollEventThrottle */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterScrollContent}
            >
              {filterOptions.map((opt) => (
                <TouchableOpacity
                  key={String(opt.value)}
                  activeOpacity={0.7}
                  onPress={() => setFilterStatus(opt.value)}
                  style={[styles.filterChip, filterStatus === opt.value && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, filterStatus === opt.value && styles.filterChipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Result Count ── */}
            <Text style={styles.resultCount}>
              Showing {filtered.length} of {enrolled} students
            </Text>

            {/* ── Student Cards ── */}
            <View style={[styles.cardGrid, isLaptop && styles.cardGridLaptop]}>
              {filtered.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyText}>No students found</Text>
                  <Text style={styles.emptySubtext}>Try adjusting your search or filter</Text>
                </View>
              ) : (
                filtered.map((student) => (
                  <StudentCard key={student.id} student={student} onStatusChange={handleStatusChange} />
                ))
              )}
            </View>

            {/* ── Bottom padding inside scroll ── */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* FIX 4: Submit button is now OUTSIDE ScrollView, below it in the flex column.
                    On laptop this renders inline (no absolute positioning).
                    On mobile it still sits above the tab bar. */}
          <View style={[styles.submitWrapper, isLaptop && styles.submitWrapperLaptop]}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.submitBtn, isLaptop && styles.submitBtnLaptop]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitIcon}>⬆</Text>
              <Text style={styles.submitText}>SUBMIT ATTENDANCE</Text>
              <View style={styles.submitBadge}>
                <Text style={styles.submitBadgeText}>{marked}/{enrolled}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ── Bottom Tab Bar (mobile only) ── */}
         

          {/* ── Laptop Tab Row ── */}
                 </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_WIDTH = isLaptop ? (width - 96) / 3 : width - 48;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },

  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  containerLaptop: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },

  // ── Header ──
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,   // reduced
  paddingVertical: 10,     // reduced
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
},
  headerLaptop: {
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
 headerLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
  menuBtn: {
    padding: 6,
  },
  menuIcon: {
    fontSize: 20,
    color: '#374151',
  },
  headerTitle: {
    fontSize: isLaptop ? 20 : 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 1,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },

  // ── Scroll ──
  // FIX: flex:1 makes the ScrollView fill available height and scroll properly on laptop/web
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  scrollContentLaptop: {
    paddingHorizontal: 32,
  },

  // ── Session ──
  sessionSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sessionIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sessionBar: {
    width: 28,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  sessionIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 1.5,
  },
  sessionTitle: {
    fontSize: isLaptop ? 28 : 20,
    fontWeight: '800',
    color: '#111827',
    lineHeight: isLaptop ? 34 : 26,
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateIcon: { fontSize: 14 },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginLeft: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1,
  },

  // ── Stat Cards ──
  statsScroll: {
    marginBottom: 16,
    marginHorizontal: -20,
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 1, overflow: 'hidden' },
      web:     { boxShadow: '0px 1px 4px rgba(0,0,0,0.04)' },
    }),
  },
  statCardIcon:   { fontSize: 18, marginBottom: 4 },
  statCardNumber: { fontSize: 22, fontWeight: '800' },
  statCardLabel:  { fontSize: 9, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1.1, marginTop: 2 },

  // ── Progress ──
  progressSection: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  progressPct:   { fontSize: 12, fontWeight: '800', color: '#1D4ED8' },
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1D4ED8',
    borderRadius: 3,
  },

  // ── Action Buttons ──
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
  },
  resetIcon: { fontSize: 15, color: '#374151' },
  resetText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  markAllBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1D4ED8',
  },
  markAllIcon: { fontSize: 15, color: '#FFF', fontWeight: '700' },
  markAllText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  // ── Search ──
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  searchIconText: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  searchClear:  { fontSize: 13, color: '#9CA3AF', padding: 2 },

  // ── Filter Chips ──
  filterScroll: {
    marginBottom: 12,
    marginHorizontal: -20,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterChipActive:     { backgroundColor: '#EFF6FF', borderColor: '#2563EB' },
  filterChipText:       { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  filterChipTextActive: { color: '#1D4ED8' },

  // ── Result Count ──
  resultCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 14,
  },

  // ── Card Grid ──
  cardGrid: { gap: 12 },
  cardGridLaptop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  // ── Student Card ──
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: CARD_WIDTH,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2, overflow: 'hidden' },
      web:     { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' },
    }),
  },
  cardLaptop: {
    width: (width - 96 - 32) / 3,
    minWidth: 260,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  cardInfo:    { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  studentId:   { fontSize: 11, color: '#9CA3AF', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 2 },
  studentRole: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  // ── Badge ──
  badge:     { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  // ── Card Divider ──
  cardDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 12 },

  // ── Status Row ──
  statusRow: { flexDirection: 'row', gap: 8 },
  statusBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  statusBtnPresent: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  statusBtnAbsent:  { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  statusBtnLate:    { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' },
  statusBtnText:    { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.3 },

  // ── Avatar ──
  avatarWrapper: { position: 'relative' },
  avatar:        { alignItems: 'center', justifyContent: 'center' },
  avatarInitials:{ fontWeight: '700', color: '#FFF' },
  onlineDot: {
    position: 'absolute',
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // ── Empty State ──
  emptyState:   { alignItems: 'center', paddingVertical: 48, width: '100%' },
  emptyIcon:    { fontSize: 36, marginBottom: 12 },
  emptyText:    { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 4 },
  emptySubtext: { fontSize: 13, color: '#9CA3AF' },

  // ── Submit ──
  // FIX: no longer position:absolute — sits naturally below ScrollView in flex column
  submitWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F0F4F8',
  },
  // On laptop, align to the right and limit width
  submitWrapperLaptop: {
    paddingHorizontal: 32,
    alignItems: 'flex-end',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    paddingVertical: 18,
    ...Platform.select({
      ios:     { shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14 },
      android: { elevation: 8, overflow: 'hidden' },
      web:     { boxShadow: '0px 6px 14px rgba(29,78,216,0.4)' },
    }),
  },
  submitBtnLaptop: {
    width: 360,
    paddingHorizontal: 40,
  },
  submitIcon:      { fontSize: 18, color: '#FFF', fontWeight: '700' },
  submitText:      { fontSize: 14, fontWeight: '800', color: '#FFF', letterSpacing: 1.8 },
  submitBadge:     { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 4 },
  submitBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },

  // ── Bottom Tab Bar (mobile) ──
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tabItem:      { flex: 1, alignItems: 'center', gap: 3, position: 'relative' },
  tabIcon:      { fontSize: 20 },
  tabLabel:     { fontSize: 9, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8 },
  tabLabelActive: { color: '#1D4ED8' },
  tabActiveBar: { position: 'absolute', top: -9, width: 28, height: 3, backgroundColor: '#1D4ED8', borderRadius: 2 },

  // ── Laptop Tabs ──
  laptopTabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    gap: 4,
  },
  laptopTab:         { paddingHorizontal: 28, paddingVertical: 9, borderRadius: 8 },
  laptopTabActive:   { backgroundColor: '#EFF6FF' },
  laptopTabText:     { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1.2 },
  laptopTabTextActive: { color: '#1D4ED8' },

backBtn: {
  padding: 6,
  marginRight: 8,   // spacing between icon and title
},

backIcon: {
  fontSize: 20,
  color: '#111827',
  fontWeight: '600',
},
});

export default Attendancemark;