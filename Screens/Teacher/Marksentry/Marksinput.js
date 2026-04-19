import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET_OR_DESKTOP = SCREEN_WIDTH >= 768;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SUBJECTS = [
  'Applied Mathematics II',
  'Physics I',
  'Chemistry Lab',
  'English Literature',
];

const INITIAL_STUDENTS = [
  { id: '1', studentId: 'SL-2024-081', name: 'James D. Miller', marks: '',   avatarInitials: 'JM', avatarColor: '#4A90D9' },
  { id: '2', studentId: 'SL-2024-112', name: 'Sarah Rose',      marks: '88', avatarInitials: 'SR', avatarColor: '#7B68EE' },
  { id: '3', studentId: 'SL-2024-045', name: 'Arjun Mehta',     marks: '92', avatarInitials: 'AM', avatarColor: '#20B2AA' },
  { id: '4', studentId: 'SL-2024-033', name: 'Priya Sharma',    marks: '76', avatarInitials: 'PS', avatarColor: '#FF7F7F' },
  { id: '5', studentId: 'SL-2024-067', name: "Liam O'Brien",    marks: '',   avatarInitials: 'LO', avatarColor: '#FFA500' },
  { id: '6', studentId: 'SL-2024-099', name: 'Nina Patel',      marks: '85', avatarInitials: 'NP', avatarColor: '#9ACD32' },
  { id: '7', studentId: 'SL-2024-022', name: 'Carlos Reyes',    marks: '91', avatarInitials: 'CR', avatarColor: '#DA70D6' },
  { id: '8', studentId: 'SL-2024-054', name: 'Emma Thornton',   marks: '',   avatarInitials: 'ET', avatarColor: '#4682B4' },
];

// ─── Colour Constants ─────────────────────────────────────────────────────────
const PRIMARY    = '#1A8F78';
const PRIMARY_DK = '#146B5C';
const BG_SCREEN  = '#EDF5F3';
const BG_CARD    = '#FFFFFF';
const TEXT_DARK  = '#1C2B28';
const TEXT_MID   = '#4A6360';
const TEXT_LIGHT = '#8AA8A3';
const BORDER     = '#D0E4DF';

// ─── NavBar ───────────────────────────────────────────────────────────────────
const NavBar = () => (
  <View style={styles.navbar}>
    <View style={styles.navSideSpacer} />

    <Text style={styles.navTitle}>Scholar Ledger</Text>

    <TouchableOpacity activeOpacity={0.8} style={styles.avatarCircle}>
      <Text style={styles.avatarText}>AD</Text>
    </TouchableOpacity>
  </View>
);

// ─── Subject Dropdown ─────────────────────────────────────────────────────────
const SubjectDropdown = ({ selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    style={styles.subjectCard}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Select subject, currently ${selected}`}
  >
    <View style={styles.subjectIcon}>
      <Text style={styles.subjectIconText}>📚</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.subjectLabel}>Select Subject</Text>
      <Text style={styles.subjectValue}>{selected}</Text>
    </View>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

// ─── Bulk Upload Zone ─────────────────────────────────────────────────────────
const BulkUploadZone = ({ onUpload }) => (
  <View style={styles.uploadZone}>
    <View style={styles.uploadIconWrap}>
      <Text style={styles.uploadIcon}>⬆</Text>
    </View>
    <Text style={styles.uploadTitle}>Bulk Marks Entry</Text>
    <Text style={styles.uploadSubtitle}>
      Upload student grade sheets for OCR processing
    </Text>
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.uploadBtn}
      onPress={onUpload}
      accessibilityRole="button"
      accessibilityLabel="Upload PDF for bulk marks entry"
    >
      <Text style={styles.uploadBtnText}>Upload PDF</Text>
    </TouchableOpacity>
  </View>
);

// ─── Student Row ──────────────────────────────────────────────────────────────
const StudentRow = ({ student, onChangeMarks }) => (
  <View style={styles.studentRow}>
    {/* Avatar */}
    <View style={[styles.studentAvatar, { backgroundColor: student.avatarColor + '22' }]}>
      <Text style={[styles.studentAvatarText, { color: student.avatarColor }]}>
        {student.avatarInitials}
      </Text>
    </View>

    {/* Name & ID */}
    <View style={styles.studentInfo}>
      <Text style={styles.studentName}>{student.name}</Text>
      <Text style={styles.studentId}>ID: #{student.studentId}</Text>
    </View>

    {/* Marks input */}
    <TextInput
      style={[
        styles.marksInput,
        student.marks ? styles.marksInputFilled : styles.marksInputEmpty,
      ]}
      value={student.marks}
      onChangeText={(v) => {
        const cleaned = v.replace(/[^0-9]/g, '').slice(0, 3);
        onChangeMarks(student.id, cleaned);
      }}
      placeholder="--"
      placeholderTextColor={TEXT_LIGHT}
      keyboardType="numeric"
      maxLength={3}
      accessibilityLabel={`Marks input for ${student.name}`}
    />
  </View>
);

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
const BottomTab = ({ active, onPress }) => {
  const tabs = [
    { key: 'Home',     icon: '🏠' },
    { key: 'Entry',    icon: '✏️' },
    { key: 'Students', icon: '👥' },
    { key: 'Admin',    icon: '⚙️' },
  ];

  return (
    <View style={styles.bottomTab}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          activeOpacity={0.75}
          style={styles.tabItem}
          onPress={() => onPress(tab.key)}
          accessibilityRole="tab"
          accessibilityLabel={tab.key}
          accessibilityState={{ selected: active === tab.key }}
        >
          <View style={[styles.tabIconWrap, active === tab.key && styles.tabIconActive]}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
          </View>
          <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>
            {tab.key}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const EnterMarksScreen = () => {
  const [activeTab, setActiveTab]           = useState('Entry');
  const [selectedSubjectIdx, setSubjectIdx] = useState(0);
  const [students, setStudents]             = useState(INITIAL_STUDENTS);

  const selectedSubject = SUBJECTS[selectedSubjectIdx];
  const enteredCount    = students.filter((s) => s.marks !== '').length;

  const cycleSubject = () =>
    setSubjectIdx((i) => (i + 1) % SUBJECTS.length);

  const handleUpload = () =>
    Alert.alert('Upload PDF', 'PDF upload dialog would open here.');

  const handleSave = () =>
    Alert.alert(
      'Saved',
      `Marks saved for ${enteredCount} of ${students.length} students.`,
      [{ text: 'OK' }]
    );

  const updateMarks = (id, value) =>
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, marks: value } : s))
    );

  const containerStyle = IS_TABLET_OR_DESKTOP
    ? styles.containerDesktop
    : styles.containerMobile;

  const contentStyle = IS_TABLET_OR_DESKTOP
    ? styles.contentDesktop
    : styles.contentMobile;

  return (
    <SafeAreaView style={styles.safe}>
      <NavBar />

      <View style={containerStyle}>
        {/* ── Main scroll area ── */}
        <ScrollView
          style={contentStyle}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Page heading */}
          <Text style={styles.pageTitle}>Enter Marks</Text>
          <View style={styles.batchRow}>
            <Text style={styles.batchLabel}>Batch:</Text>
            <View style={styles.batchBadge}>
              <Text style={styles.batchBadgeText}>
                Advanced Calculus – Section A
              </Text>
            </View>
          </View>

          {/* Subject selector */}
          <SubjectDropdown selected={selectedSubject} onPress={cycleSubject} />

          {/* Bulk upload */}
          <BulkUploadZone onUpload={handleUpload} />

          {/* Student roster header */}
          <View style={styles.rosterHeader}>
            <Text style={styles.rosterTitle}>
              STUDENT ROSTER ({students.length})
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              accessibilityLabel="Filter students"
            >
              <Text style={styles.filterIcon}>⊟</Text>
            </TouchableOpacity>
          </View>

          {/* Student list */}
          <View style={styles.rosterCard}>
            {students.map((student, index) => (
              <View key={student.id}>
                <StudentRow student={student} onChangeMarks={updateMarks} />
                {index < students.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>

          {/* Progress bar */}
          <View style={styles.progressCard}>
            <Text style={styles.progressText}>
              {enteredCount} / {students.length} marks entered
            </Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(enteredCount / students.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Spacer for fixed save button */}
          <View style={{ height: IS_TABLET_OR_DESKTOP ? 24 : 100 }} />
        </ScrollView>

        {/* ── Desktop sidebar ── */}
        {IS_TABLET_OR_DESKTOP && (
          <View style={styles.sidePanel}>
            <View style={styles.sideStat}>
              <Text style={styles.sideStatNum}>{students.length}</Text>
              <Text style={styles.sideStatLabel}>Total students</Text>
            </View>
            <View style={styles.sideStat}>
              <Text style={[styles.sideStatNum, { color: PRIMARY }]}>
                {enteredCount}
              </Text>
              <Text style={styles.sideStatLabel}>Marks entered</Text>
            </View>
            <View style={styles.sideStat}>
              <Text style={[styles.sideStatNum, { color: '#E57373' }]}>
                {students.length - enteredCount}
              </Text>
              <Text style={styles.sideStatLabel}>Pending</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.saveDesktop}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save all changes"
            >
              <Text style={styles.saveBtnText}>Save All Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Mobile: fixed save button ── */}
      {!IS_TABLET_OR_DESKTOP && (
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.saveMobile}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save all changes"
        >
          <Text style={styles.saveBtnText}>Save All Changes</Text>
        </TouchableOpacity>
      )}

      {/* Bottom tab bar */}
      <BottomTab active={activeTab} onPress={setActiveTab} />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_SCREEN,
  },

  // Navbar
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 14,
    paddingBottom: 14,
    backgroundColor: BG_CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  navSideSpacer: {
    width: 40,
    height: 40,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    letterSpacing: 0.3,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
  },

  // Layout
  containerMobile: {
    flex: 1,
  },
  containerDesktop: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  contentMobile: {
    flex: 1,
  },
  contentDesktop: {
    flex: 1,
  },
  scrollContent: {
    padding: IS_TABLET_OR_DESKTOP ? 32 : 20,
  },

  // Page heading
  pageTitle: {
    fontSize: IS_TABLET_OR_DESKTOP ? 34 : 28,
    fontWeight: '800',
    color: PRIMARY,
    marginBottom: 10,
  },
  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  batchLabel: {
    fontSize: 15,
    color: TEXT_MID,
    fontWeight: '500',
  },
  batchBadge: {
    backgroundColor: PRIMARY + '18',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  batchBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
  },

  // Subject dropdown
  subjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG_CARD,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 14,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: PRIMARY + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectIconText: {
    fontSize: 18,
  },
  subjectLabel: {
    fontSize: 12,
    color: TEXT_LIGHT,
    marginBottom: 2,
  },
  subjectValue: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  chevron: {
    fontSize: 24,
    color: TEXT_LIGHT,
    transform: [{ rotate: '90deg' }],
  },

  // Upload zone
  uploadZone: {
    borderWidth: 2,
    borderColor: PRIMARY + '55',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    padding: 28,
    marginBottom: 24,
    backgroundColor: PRIMARY + '08',
  },
  uploadIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIcon: {
    fontSize: 22,
    color: PRIMARY,
  },
  uploadTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 6,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: TEXT_MID,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 20,
  },
  uploadBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 36,
    paddingVertical: 13,
    borderRadius: 30,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  // Roster
  rosterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rosterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_MID,
    letterSpacing: 1.2,
  },
  filterIcon: {
    fontSize: 20,
    color: TEXT_MID,
  },
  rosterCard: {
    backgroundColor: BG_CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    marginBottom: 16,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  studentAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 3,
  },
  studentId: {
    fontSize: 12,
    color: TEXT_LIGHT,
  },
  marksInput: {
    width: 58,
    height: 44,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    borderWidth: 1.5,
  },
  marksInputEmpty: {
    backgroundColor: '#F2F6F5',
    borderColor: BORDER,
    color: TEXT_LIGHT,
  },
  marksInputFilled: {
    backgroundColor: PRIMARY + '14',
    borderColor: PRIMARY + '55',
    color: PRIMARY_DK,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: 16,
  },

  // Progress
  progressCard: {
    backgroundColor: BG_CARD,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 13,
    color: TEXT_MID,
    marginBottom: 10,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 4,
    backgroundColor: BORDER,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },

  // Save button - mobile
  saveMobile: {
    backgroundColor: PRIMARY_DK,
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Desktop side panel
  sidePanel: {
    width: 240,
    padding: 24,
    gap: 16,
    borderLeftWidth: 1,
    borderLeftColor: BORDER,
    backgroundColor: BG_CARD,
  },
  sideStat: {
    backgroundColor: BG_SCREEN,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  sideStatNum: {
    fontSize: 32,
    fontWeight: '800',
    color: TEXT_DARK,
    lineHeight: 38,
  },
  sideStatLabel: {
    fontSize: 12,
    color: TEXT_MID,
    marginTop: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  saveDesktop: {
    backgroundColor: PRIMARY_DK,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },

  // Bottom tab bar
  bottomTab: {
    flexDirection: 'row',
    backgroundColor: BG_CARD,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabIconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    backgroundColor: PRIMARY + '22',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 11,
    color: TEXT_LIGHT,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: PRIMARY,
    fontWeight: '700',
  },
});

export default Marksinput;