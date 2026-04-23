import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Platform,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

const { width } = Dimensions.get('window');
const isLargeScreen = width >= 768;

const SUBJECTS = [
  'Quantum Mechanics',
  'Classical Mechanics',
  'Thermodynamics',
  'Electrodynamics',
  'Optics',
  'Nuclear Physics',
  'Astrophysics',
];

const STUDENTS = [
  { id: 'PHY-2024-001', name: 'Aria Abbott', initials: 'AA', color: '#4ECDC4' },
  { id: 'PHY-2024-002', name: 'Benjamin Miller', initials: 'BM', color: '#B0BEC5' },
  { id: 'PHY-2024-003', name: 'Chloe Laurent', initials: 'CL', color: '#B0BEC5' },
  { id: 'PHY-2024-004', name: 'David Wu', initials: 'DW', color: '#B0BEC5' },
  { id: 'PHY-2024-005', name: 'Elena Sokolov', initials: 'ES', color: '#B0BEC5' },
  { id: 'PHY-2024-006', name: 'Felix Nguyen', initials: 'FN', color: '#B0BEC5' },
  { id: 'PHY-2024-007', name: 'Grace Kim', initials: 'GK', color: '#B0BEC5' },
];

// Simple date picker modal (day/month/year selectors)
const SimpleDatePicker = ({ visible, date, onConfirm, onCancel }) => {
  const today = new Date();
  const [day, setDay] = useState(String(date.getDate()).padStart(2, '0'));
  const [month, setMonth] = useState(String(date.getMonth() + 1).padStart(2, '0'));
  const [year, setYear] = useState(String(date.getFullYear()));

  const months = [
    '01 - Jan', '02 - Feb', '03 - Mar', '04 - Apr',
    '05 - May', '06 - Jun', '07 - Jul', '08 - Aug',
    '09 - Sep', '10 - Oct', '11 - Nov', '12 - Dec',
  ];

  const years = Array.from({ length: 10 }, (_, i) => String(today.getFullYear() - 5 + i));
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleConfirm = () => {
    const d = new Date(`${year}-${month.slice(0, 2)}-${day}`);
    onConfirm(isNaN(d) ? new Date() : d);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={dateStyles.overlay}>
        <View style={[dateStyles.container, isLargeScreen && dateStyles.containerLarge]}>
          <Text style={dateStyles.title}>Select Assessment Date</Text>

          <View style={dateStyles.row}>
            {/* Day */}
            <View style={dateStyles.col}>
              <Text style={dateStyles.label}>Day</Text>
              <ScrollView style={dateStyles.scroll} showsVerticalScrollIndicator={false}>
                {days.map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[dateStyles.item, day === d && dateStyles.itemSelected]}
                    onPress={() => setDay(d)}
                  >
                    <Text style={[dateStyles.itemText, day === d && dateStyles.itemTextSelected]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Month */}
            <View style={[dateStyles.col, { flex: 2 }]}>
              <Text style={dateStyles.label}>Month</Text>
              <ScrollView style={dateStyles.scroll} showsVerticalScrollIndicator={false}>
                {months.map((m, idx) => {
                  const mNum = String(idx + 1).padStart(2, '0');
                  return (
                    <TouchableOpacity
                      key={mNum}
                      style={[dateStyles.item, month === mNum && dateStyles.itemSelected]}
                      onPress={() => setMonth(mNum)}
                    >
                      <Text style={[dateStyles.itemText, month === mNum && dateStyles.itemTextSelected]}>{m}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Year */}
            <View style={dateStyles.col}>
              <Text style={dateStyles.label}>Year</Text>
              <ScrollView style={dateStyles.scroll} showsVerticalScrollIndicator={false}>
                {years.map(y => (
                  <TouchableOpacity
                    key={y}
                    style={[dateStyles.item, year === y && dateStyles.itemSelected]}
                    onPress={() => setYear(y)}
                  >
                    <Text style={[dateStyles.itemText, year === y && dateStyles.itemTextSelected]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={dateStyles.btnRow}>
            <TouchableOpacity style={dateStyles.cancelBtn} onPress={onCancel}>
              <Text style={dateStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dateStyles.confirmBtn} onPress={handleConfirm}>
              <Text style={dateStyles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Marksinput() {
  const [selectedSubject, setSelectedSubject] = useState('Quantum Mechanics');
  const [assessmentDate, setAssessmentDate] = useState(new Date(2024, 4, 24));
  const [subjectDropdownVisible, setSubjectDropdownVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [scores, setScores] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [published, setPublished] = useState(false);

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (subjectDropdownVisible) {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setSubjectDropdownVisible(false));
    } else {
      setSubjectDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const selectSubject = (subject) => {
    setSelectedSubject(subject);
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setSubjectDropdownVisible(false));
  };

  const formatDate = (d) => {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScoreChange = (id, value) => {
    const num = value.replace(/[^0-9]/g, '');
    if (num === '' || (parseInt(num) >= 0 && parseInt(num) <= 100)) {
      setScores(prev => ({ ...prev, [id]: num }));
    }
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 2000);
  };

  const filledCount = Object.values(scores).filter(v => v !== '').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4F8" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── Header ── */}
        <View style={[styles.header, isLargeScreen && styles.headerLarge]}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <Text style={styles.headerTitle}>Marks Entry</Text>
          </View>
          <TouchableOpacity style={styles.publishTopBtn} onPress={handlePublish} activeOpacity={0.8}>
            <Text style={styles.publishTopText}>{published ? '✓ PUBLISHED' : 'PUBLISH'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, isLargeScreen && styles.scrollContentLarge]}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Batch Info Card ── */}
          <View style={[styles.card, isLargeScreen && styles.cardLarge]}>
            <Text style={styles.cardLabel}>TARGET BATCH</Text>
            <Text style={styles.batchTitle}>Grade 12 - Physics A</Text>
            <Text style={[styles.cardLabel, { marginTop: 12 }]}>ACADEMIC SUBJECT</Text>
            <View style={styles.subjectRow}>
              <Text style={styles.subjectName}>{selectedSubject}</Text>
              <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.75}>
                <Text style={styles.uploadIcon}>📄</Text>
                <Text style={styles.uploadText}>Upload PDF</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Search + Filter ── */}
          <View style={[styles.searchRow, isLargeScreen && styles.searchRowLarge]}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Find student..."
                placeholderTextColor="#9AA5B4"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={[styles.filterBtn, filterVisible && styles.filterBtnActive]}
              onPress={() => setFilterVisible(v => !v)}
              activeOpacity={0.8}
            >
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* ── Selectors Row ── */}
          <View style={[styles.selectorsRow, isLargeScreen && styles.selectorsRowLarge]}>

            {/* Subject Dropdown */}
            <View style={styles.selectorWrapper}>
              <Text style={styles.selectorLabel}>SUBJECT SELECTION</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={toggleDropdown}
                activeOpacity={0.8}
              >
                <Text style={styles.dropdownValue} numberOfLines={1}>
                  {selectedSubject.length > 14 ? selectedSubject.slice(0, 14) + '…' : selectedSubject}
                </Text>
                <Text style={[styles.chevron, subjectDropdownVisible && styles.chevronUp]}>▼</Text>
              </TouchableOpacity>

              {/* Animated Dropdown List */}
              {subjectDropdownVisible && (
                <Animated.View
                  style={[
                    styles.dropdownList,
                    {
                      opacity: dropdownAnim,
                      transform: [{
                        translateY: dropdownAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      }],
                    },
                  ]}
                >
                  {SUBJECTS.map((subj) => (
                    <TouchableOpacity
                      key={subj}
                      style={[styles.dropdownItem, subj === selectedSubject && styles.dropdownItemActive]}
                      onPress={() => selectSubject(subj)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.dropdownItemText, subj === selectedSubject && styles.dropdownItemTextActive]}>
                        {subj}
                      </Text>
                      {subj === selectedSubject && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>

            {/* Date Picker */}
            <View style={styles.selectorWrapper}>
              <Text style={styles.selectorLabel}>ASSESSMENT DATE</Text>
              <TouchableOpacity
                style={styles.dateTrigger}
                onPress={() => setDatePickerVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dateValue}>{formatDate(assessmentDate)}</Text>
                <Text style={styles.calIcon}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Progress Banner ── */}
          {filledCount > 0 && (
            <View style={[styles.progressBanner, isLargeScreen && styles.progressBannerLarge]}>
              <Text style={styles.progressText}>
                {filledCount} / {filteredStudents.length} scores entered
              </Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(filledCount / filteredStudents.length) * 100}%` }]} />
              </View>
            </View>
          )}

          {/* ── Student List ── */}
          <View style={isLargeScreen && styles.gridWrapper}>
            {filteredStudents.map((student) => (
              <View
                key={student.id}
                style={[
                  styles.studentCard,
                  isLargeScreen && styles.studentCardLarge,
                  scores[student.id] && styles.studentCardFilled,
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: student.color }]}>
                  <Text style={styles.avatarText}>{student.initials}</Text>
                </View>

                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentId}>ID: #{student.id}</Text>
                </View>

                <View style={styles.scoreWrapper}>
                  <Text style={styles.scoreMax}> / 100</Text>
                  <TextInput
                    style={[
                      styles.scoreInput,
                      scores[student.id] ? styles.scoreInputFilled : null,
                    ]}
                    placeholder="Score"
                    placeholderTextColor="#9AA5B4"
                    keyboardType="numeric"
                    maxLength={3}
                    value={scores[student.id] || ''}
                    onChangeText={(v) => handleScoreChange(student.id, v)}
                    returnKeyType="next"
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Bottom Actions ── */}
        <View style={[styles.bottomBar, isLargeScreen && styles.bottomBarLarge]}>
          <TouchableOpacity style={styles.draftBtn} activeOpacity={0.75}>
            <Text style={styles.draftText}>Draft</Text>
            <Text style={styles.draftText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.savePublishBtn} onPress={handlePublish} activeOpacity={0.85}>
            <Text style={styles.savePublishIcon}>🛡️</Text>
            <Text style={styles.savePublishText}>{published ? 'Published!' : 'Save & Publish'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Date Picker Modal ── */}
        <SimpleDatePicker
          visible={datePickerVisible}
          date={assessmentDate}
          onConfirm={(d) => {
            setAssessmentDate(d);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────
// Styles
// ─────────────────────────────────────────
const TEAL = '#1A5C52';
const TEAL_LIGHT = '#4ECDC4';
const NAVY = '#0D2D4E';
const BG = '#F0F4F8';
const WHITE = '#FFFFFF';
const BORDER = '#DDE3EA';
const TEXT_MAIN = '#1A2C3D';
const TEXT_MUTED = '#6B7C93';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerLarge: {
    paddingHorizontal: 40,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: TEAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: { fontSize: 20 },
  headerTitle: {
    fontSize: isLargeScreen ? 24 : 20,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: 0.3,
  },
  publishTopBtn: {
    backgroundColor: NAVY,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  publishTopText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },

  // ── Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  scrollContentLarge: { paddingHorizontal: 40 },

  // ── Card
  card: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLarge: { padding: 24 },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  batchTitle: {
    fontSize: isLargeScreen ? 22 : 18,
    fontWeight: '700',
    color: NAVY,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  subjectName: {
    fontSize: 16,
    color: TEXT_MAIN,
    fontWeight: '500',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  uploadIcon: { fontSize: 16 },
  uploadText: {
    color: TEAL,
    fontWeight: '600',
    fontSize: 14,
  },

  // ── Search
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  searchRowLarge: { gap: 14 },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  filterIcon: { fontSize: 18 },

  // ── Selectors
  selectorsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    zIndex: 100,
  },
  selectorsRowLarge: { gap: 20 },
  selectorWrapper: {
    flex: 1,
    zIndex: 100,
  },
  selectorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: 1.1,
    marginBottom: 6,
  },

  // Dropdown trigger
  dropdownTrigger: {
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownValue: {
    fontSize: 14,
    color: TEXT_MAIN,
    fontWeight: '500',
    flex: 1,
  },
  chevron: {
    fontSize: 10,
    color: TEXT_MUTED,
    marginLeft: 4,
    transition: 'transform 0.2s',
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
    color: TEAL,
  },

  // Dropdown list
  dropdownList: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    zIndex: 999,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  dropdownItemActive: {
    backgroundColor: '#E8F5F3',
  },
  dropdownItemText: {
    fontSize: 14,
    color: TEXT_MAIN,
  },
  dropdownItemTextActive: {
    color: TEAL,
    fontWeight: '700',
  },
  checkmark: {
    color: TEAL,
    fontSize: 14,
    fontWeight: '700',
  },

  // Date trigger
  dateTrigger: {
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateValue: {
    fontSize: 14,
    color: TEXT_MAIN,
    fontWeight: '500',
  },
  calIcon: { fontSize: 16 },

  // ── Progress Banner
  progressBanner: {
    backgroundColor: '#E8F5F3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: TEAL_LIGHT,
  },
  progressBannerLarge: { padding: 16 },
  progressText: {
    fontSize: 13,
    color: TEAL,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#B2DFDB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    backgroundColor: TEAL,
    borderRadius: 2,
  },

  // ── Student Cards
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  studentCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  studentCardLarge: {
    width: '47%',
    marginBottom: 0,
  },
  studentCardFilled: {
    borderColor: TEAL_LIGHT,
    borderWidth: 1.5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 15,
  },
  studentInfo: { flex: 1 },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_MAIN,
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  scoreWrapper: {
    alignItems: 'flex-end',
  },
  scoreMax: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginBottom: 4,
  },
  scoreInput: {
    width: 72,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#F7FAFB',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_MAIN,
  },
  scoreInputFilled: {
    borderColor: TEAL_LIGHT,
    backgroundColor: '#E8F5F3',
    color: TEAL,
  },

  // ── Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  bottomBarLarge: {
    paddingHorizontal: 40,
  },
  draftBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftText: {
    color: TEAL,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  savePublishBtn: {
    flex: 1,
    backgroundColor: NAVY,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
    shadowColor: NAVY,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  savePublishIcon: { fontSize: 18 },
  savePublishText: {
    color: WHITE,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});

// ─────────────────────────────────────────
// Date Picker Styles
// ─────────────────────────────────────────
const dateStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  containerLarge: {
    borderRadius: 24,
    marginHorizontal: 80,
    marginBottom: 80,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    height: 180,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 6,
  },
  scroll: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  itemSelected: {
    backgroundColor: '#E8F5F3',
  },
  itemText: {
    fontSize: 13,
    color: TEXT_MAIN,
  },
  itemTextSelected: {
    color: TEAL,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: TEXT_MUTED,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: NAVY,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 15,
    color: WHITE,
    fontWeight: '700',
  },
});