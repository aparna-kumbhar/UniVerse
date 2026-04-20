import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  bg: '#F2F2F7',
  white: '#FFFFFF',
  indigo: '#4F46E5',
  indigoLight: '#EEF2FF',
  indigoDark: '#3730A3',
  dark: '#1E1B4B',
  text: '#374151',
  muted: '#9CA3AF',
  mutedLight: '#D1D5DB',
  border: '#E5E7EB',
  red: '#EF4444',
  redLight: '#FEE2E2',
  green: '#10B981',
  greenLight: '#D1FAE5',
  amber: '#F59E0B',
  nowCard: '#4F46E5',
  nowText: '#FFFFFF',
  criticalBorder: '#EF4444',
  upcomingBorder: '#D1D5DB',
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const scheduleData = {
  MON: [
    { id: 'm1', time: '09:00 - 10:30', title: 'Advanced Calculus', sub: 'Room 402 • Prof. Zheng', isNow: false, color: '#EEF2FF', accent: '#4F46E5' },
    { id: 'm2', time: '13:00 - 15:00', title: 'Literature Review', sub: 'Library Hall B', isNow: false, color: '#EEF2FF', accent: '#4F46E5' },
  ],
  TUE: [
    { id: 't1', time: '10:00 - 12:30', title: 'Software Workshop', sub: 'Tech Hub Labs', isNow: false, color: '#EEF2FF', accent: '#4F46E5', avatars: true },
  ],
  WED: [
    { id: 'w1', time: '11:00 - 12:30', title: 'Digital Ethics', sub: 'Main Auditorium', isNow: true, color: C.nowCard, accent: '#FFFFFF' },
    { id: 'w2', time: '15:00 - 16:00', title: 'Study Group', sub: 'Cafeteria Hub', isNow: false, color: '#EEF2FF', accent: '#4F46E5' },
  ],
  THU: [
    { id: 'th1', time: '09:00 - 11:00', title: 'Macroeconomics', sub: 'Social Science Wing', isNow: false, color: '#EEF2FF', accent: '#4F46E5' },
    { id: 'th2', time: '14:00 - 16:30', title: 'Data Structures', sub: 'Comp Sci Lab 4', isNow: false, color: '#EEF2FF', accent: '#4F46E5' },
  ],
  FRI: [
    { id: 'f1', time: '', title: 'Field Trip Day', sub: 'No scheduled lectures', isNow: false, color: '#F9FAFB', accent: '#9CA3AF', isFieldTrip: true },
  ],
  SAT: [
    { id: 's1', time: '10:00 - 12:00', title: 'Weekend Workshop', sub: 'Optional Session • Lab 1', isNow: false, color: '#EEF2FF', accent: '#4F46E5' },
  ],
};

// ── All exams (full list shown on "View All") ──
const allExams = [
  { id: 'e1', month: 'OCT', day: '12', title: 'Advanced Calculus', sub: 'Midterm Assessment • Hall 4' },
  { id: 'e2', month: 'OCT', day: '15', title: 'Digital Ethics', sub: 'Final Presentation • Room 20' },
  { id: 'e3', month: 'OCT', day: '21', title: 'Macroeconomics', sub: 'Unit Test • Social Wing 3' },
  { id: 'e4', month: 'NOV', day: '03', title: 'Data Structures', sub: 'Lab Exam • Comp Sci Lab 4' },
  { id: 'e5', month: 'NOV', day: '10', title: 'Literature Review', sub: 'Viva Voce • Library Hall B' },
  { id: 'e6', month: 'NOV', day: '18', title: 'Software Workshop', sub: 'Project Demo • Tech Hub Labs' },
];

const PREVIEW_EXAM_COUNT = 2;

const deadlines = [
  { id: 'd1', tag: 'CRITICAL', tagColor: C.red, due: 'Due in 4h', title: 'Physics Assignment', sub: 'Data Visualization Module', border: C.criticalBorder },
  { id: 'd2', tag: 'UPCOMING', tagColor: C.muted, due: '2 days left', title: 'Maths Homework', sub: 'Renaissance Poetry Analysis', border: C.upcomingBorder },
];

// ── Study Resources tabs data ──
const RESOURCE_TABS = [
  { id: 'pyq', label: 'PYQs' },
  { id: 'notes', label: 'Notes' },
  { id: 'videos', label: 'Videos' },
  { id: 'practice', label: 'Practice' },
];

const resourceContent = {
  pyq: [
    { id: 'p1', title: 'Advanced Calculus — 2022', sub: '40 Questions • 3 hr paper', badge: 'PDF' },
    { id: 'p2', title: 'Digital Ethics — 2022', sub: '30 Questions • 2 hr paper', badge: 'PDF' },
    { id: 'p3', title: 'Data Structures — 2021', sub: '35 Questions • 2.5 hr paper', badge: 'PDF' },
    { id: 'p4', title: 'Macroeconomics — 2021', sub: '50 Questions • 3 hr paper', badge: 'PDF' },
    { id: 'p5', title: 'Literature Review — 2020', sub: '20 Questions • 1.5 hr paper', badge: 'PDF' },
  ],
  notes: [
    { id: 'n1', title: 'Calculus — Limits & Derivatives', sub: 'Prof. Zheng • 12 pages', badge: 'DOC' },
    { id: 'n2', title: 'Ethics in AI Systems', sub: 'Main Auditorium Transcript • 8 pages', badge: 'DOC' },
    { id: 'n3', title: 'Keynesian Economics Overview', sub: 'Social Science Wing • 15 pages', badge: 'DOC' },
    { id: 'n4', title: 'Binary Trees & Graphs', sub: 'Comp Sci Lab Notes • 10 pages', badge: 'DOC' },
  ],
  videos: [
    { id: 'v1', title: 'Integral Calculus Walkthrough', sub: '45 min • Prof. Zheng', badge: 'MP4' },
    { id: 'v2', title: 'Digital Ethics — Guest Lecture', sub: '1 hr 10 min • Main Auditorium', badge: 'MP4' },
    { id: 'v3', title: 'Graph Traversal Algorithms', sub: '30 min • TA Session', badge: 'MP4' },
  ],
  practice: [
    { id: 'pr1', title: 'Calculus Practice Set A', sub: '25 Questions • Auto-graded', badge: 'QUIZ' },
    { id: 'pr2', title: 'Ethics Case Studies', sub: '10 Scenarios • Essay type', badge: 'QUIZ' },
    { id: 'pr3', title: 'DSA Mock Test', sub: '50 Questions • 3 hr timed', badge: 'QUIZ' },
    { id: 'pr4', title: 'Macro Problem Sets', sub: '20 Problems • Mixed type', badge: 'QUIZ' },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopNav({ onBack, backLabel }) {
  return (
    <View style={styles.topNav}>
      {onBack ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>{'←'}</Text>
          <Text style={styles.backLabel}>{backLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.navTitleBlock}>
        </View>
      )}
      {isTablet && !onBack && (
        <View style={styles.navLinks}>
          {['Calendar', 'Reports', 'Settings'].map((label) => (
            <TouchableOpacity key={label} activeOpacity={0.7} style={styles.navLinkBtn}>
              <Text style={styles.navLink}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.navIcons} />
    </View>
  );
}

function ClassCard({ item }) {
  const isNow = item.isNow;
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[
        styles.classCard,
        { backgroundColor: isNow ? C.nowCard : C.white },
        isNow && styles.classCardNow,
      ]}
    >
      {isNow && (
        <View style={styles.nowBadge}>
          <Text style={styles.nowBadgeText}>NOW</Text>
        </View>
      )}
      {item.time ? (
        <Text style={[styles.classTime, { color: isNow ? 'rgba(255,255,255,0.7)' : C.indigo }]}>
          {item.time}
        </Text>
      ) : null}
      <Text style={[styles.classTitle, { color: isNow ? C.white : C.dark }]}>
        {item.title}
      </Text>
      <Text style={[styles.classSub, { color: isNow ? 'rgba(255,255,255,0.75)' : C.muted }]}>
        {item.sub}
      </Text>
      {item.avatars && (
        <View style={styles.avatarRow}>
          {['👤', '👤'].map((a, i) => (
            <View key={i} style={[styles.miniAvatar, { marginLeft: i === 0 ? 0 : -8 }]}>
              <Text style={{ fontSize: 12 }}>{a}</Text>
            </View>
          ))}
          <View style={[styles.miniAvatar, styles.miniAvatarCount, { marginLeft: -8 }]}>
            <Text style={styles.miniAvatarCountText}>+12</Text>
          </View>
        </View>
      )}
      {isNow && <View style={styles.nowProgressBar} />}
    </TouchableOpacity>
  );
}

function DayColumn({ day, isActive, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.dayTab, isActive && styles.dayTabActive]}
    >
      <Text style={[styles.dayTabText, isActive && styles.dayTabTextActive]}>{day}</Text>
    </TouchableOpacity>
  );
}

function WeeklySchedule() {
  const [activeDay, setActiveDay] = useState('WED');

  const renderMobile = () => (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayTabsScroll}>
        <View style={styles.dayTabsRow}>
          {DAYS.map((d) => (
            <DayColumn key={d} day={d} isActive={activeDay === d} onPress={() => setActiveDay(d)} />
          ))}
        </View>
      </ScrollView>
      <View style={styles.classesCol}>
        {(scheduleData[activeDay] || []).map((item) => (
          <ClassCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );

  const renderTablet = () => (
    <View style={styles.card}>
      <View style={styles.scheduleGrid}>
        {DAYS.map((day) => (
          <View key={day} style={styles.scheduleCol}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.dayTabTablet, day === 'WED' && styles.dayTabTabletActive]}
            >
              <Text style={[styles.dayTabTextTablet, day === 'WED' && styles.dayTabTextTabletActive]}>
                {day}
              </Text>
            </TouchableOpacity>
            <View style={styles.classesCol}>
              {(scheduleData[day] || []).map((item) => (
                <ClassCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return isTablet ? renderTablet() : renderMobile();
}

function ExamCard({ item }) {
  return (
    <TouchableOpacity activeOpacity={0.75} style={styles.examCard}>
      <View style={styles.examDateBox}>
        <Text style={styles.examMonth}>{item.month}</Text>
        <Text style={styles.examDay}>{item.day}</Text>
      </View>
      <View style={styles.examInfo}>
        <Text style={styles.examTitle}>{item.title}</Text>
        <Text style={styles.examSub}>{item.sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

function DeadlineCard({ item }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.deadlineCard, { borderLeftColor: item.border }]}
    >
      <View style={styles.deadlineTop}>
        <Text style={[styles.deadlineTag, { color: item.tagColor }]}>{item.tag}</Text>
        <Text style={styles.deadlineDue}>{item.due}</Text>
      </View>
      <Text style={styles.deadlineTitle}>{item.title}</Text>
      <Text style={styles.deadlineSub}>{item.sub}</Text>
    </TouchableOpacity>
  );
}

function AttendanceEfficiency() {
  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.card, styles.efficiencyCard]}>
      <View style={styles.efficiencyLeft}>
        <Text style={styles.efficiencyLabel}>Attendance{'\n'}Efficiency</Text>
        <View style={styles.efficiencyValRow}>
          <Text style={styles.efficiencyVal}>94%</Text>
          <View style={styles.efficiencyBadge}>
            <Text style={styles.efficiencyBadgeText}>↑ +2.4%</Text>
          </View>
        </View>
        <Text style={styles.efficiencyNote}>Tracked since September 1st</Text>
      </View>
      <View style={styles.efficiencyRing}>
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <Text style={styles.ringIcon}>✦</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ProTip() {
  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.card, styles.proTipCard]}>
      <View style={styles.proTipIcon}>
        <Text style={{ fontSize: 20 }}>✦</Text>
      </View>
      <View style={styles.proTipContent}>
        <Text style={styles.proTipTitle}>Pro Tip: Study Blocks</Text>
        <Text style={styles.proTipBody}>
          Based on your performance, studying 45-minute blocks for Calculus on Tuesday afternoons
          is highly efficient.
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Study Resources Screen ───────────────────────────────────────────────────

function ResourceItem({ item }) {
  const badgeColors = {
    PDF: { bg: '#FEE2E2', text: C.red },
    DOC: { bg: C.indigoLight, text: C.indigo },
    MP4: { bg: '#D1FAE5', text: C.green },
    QUIZ: { bg: '#FEF3C7', text: C.amber },
  };
  const bc = badgeColors[item.badge] || { bg: C.bg, text: C.muted };

  return (
    <TouchableOpacity activeOpacity={0.75} style={styles.resourceItem}>
      <View style={styles.resourceInfo}>
        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceSub}>{item.sub}</Text>
      </View>
      <View style={[styles.resourceBadge, { backgroundColor: bc.bg }]}>
        <Text style={[styles.resourceBadgeText, { color: bc.text }]}>{item.badge}</Text>
      </View>
    </TouchableOpacity>
  );
}

function StudyResourcesScreen({ onBack }) {
  const [activeTab, setActiveTab] = useState('pyq');
  const items = resourceContent[activeTab] || [];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <TopNav onBack={onBack} backLabel="Dashboard" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Study Resources</Text>
            <Text style={styles.pageSub}>Previous Year Questions & More</Text>
          </View>
        </View>

        {/* Tab Bar */}
        <View style={styles.resourceTabBar}>
          {RESOURCE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.resourceTab, activeTab === tab.id && styles.resourceTabActive]}
            >
              <Text style={[styles.resourceTabText, activeTab === tab.id && styles.resourceTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle} numberOfLines={1}>
            {RESOURCE_TABS.find((t) => t.id === activeTab)?.label}
          </Text>
          <View style={{ marginTop: 12 }}>
            {items.map((item) => (
              <ResourceItem key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Study Resources Card (on Dashboard) ─────────────────────────────────────

function StudyResourcesCard({ onExplore }) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.studyCard} onPress={onExplore}>
      <View style={styles.studyOverlay} />
      <View style={styles.studyContent}>
        <Text style={styles.studyTitle}>Study Resources</Text>
        <Text style={styles.studySub}>Previous Year Questions (PYQs)</Text>
        <TouchableOpacity activeOpacity={0.8} style={styles.studyBtn} onPress={onExplore}>
          <Text style={styles.studyBtnText}>Explore Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function Dashboard({ onExploreResources }) {
  const [showAllExams, setShowAllExams] = useState(false);
  const [scheduleTab, setScheduleTab] = useState('My Classes');

  const displayedExams = showAllExams ? allExams : allExams.slice(0, PREVIEW_EXAM_COUNT);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <TopNav />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Weekly Schedule</Text>
            <Text style={styles.pageSub}>Academic Year 2023-2024 • Semester 2</Text>
          </View>
          <View style={styles.tabToggle}>
            {['My Classes'].map((tab) => (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setScheduleTab(tab)}
                style={[styles.toggleBtn, scheduleTab === tab && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleBtnText, scheduleTab === tab && styles.toggleBtnTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main grid */}
        <View style={[styles.mainGrid, !isTablet && styles.mainGridColumn]}>
          {/* Left: Schedule */}
          <View style={isTablet ? styles.scheduleWrapper : styles.fullWidth}>
            <WeeklySchedule />
            <View style={[styles.bottomRow, !isTablet && styles.bottomRowColumn]}>
              <AttendanceEfficiency />
              <ProTip />
            </View>
          </View>

          {/* Right panel */}
          <View style={isTablet ? styles.rightPanel : styles.fullWidth}>

            {/* ── Upcoming Exams ── */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Exams</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setShowAllExams((prev) => !prev)}
                >
                  <Text style={styles.viewAll}>
                    {showAllExams ? 'SHOW LESS' : `VIEW ALL (${allExams.length})`}
                  </Text>
                </TouchableOpacity>
              </View>
              {displayedExams.map((e) => (
                <ExamCard key={e.id} item={e} />
              ))}
              {showAllExams && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowAllExams(false)}
                  style={styles.collapseBtn}
                >
                  <Text style={styles.collapseBtnText}>Collapse ↑</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Deadlines ── */}
            <View style={[styles.card, { marginTop: 16 }]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Deadlines</Text>
                <View style={styles.deadlineDot} />
              </View>
              {deadlines.map((d) => (
                <DeadlineCard key={d.id} item={d} />
              ))}
            </View>

            {/* ── Study Resources Card ── */}
            <StudyResourcesCard onExplore={onExploreResources} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Root Navigator ───────────────────────────────────────────────────────────

export default function CuratorDashboard() {
  const [screen, setScreen] = useState('dashboard'); // 'dashboard' | 'resources'

  if (screen === 'resources') {
    return <StudyResourcesScreen onBack={() => setScreen('dashboard')} />;
  }

  return <Dashboard onExploreResources={() => setScreen('resources')} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Top Nav ──
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  navTitleBlock: {
    marginRight: 4,
  },
  navTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.indigo,
    lineHeight: 16,
  },
  navTitleBold: {
    fontSize: 15,
    fontWeight: '800',
    color: C.indigo,
    lineHeight: 18,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backArrow: {
    fontSize: 18,
    color: C.indigo,
    fontWeight: '600',
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.indigo,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  navLinkBtn: { padding: 4 },
  navLink: {
    fontSize: 14,
    color: C.text,
    fontWeight: '500',
  },
  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    padding: isTablet ? 24 : 16,
    gap: 16,
  },

  // ── Page Header ──
  pageHeader: {
    flexDirection: isTablet ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: isTablet ? 'center' : 'flex-start',
    gap: 12,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: isTablet ? 32 : 26,
    fontWeight: '800',
    color: C.dark,
    letterSpacing: -0.8,
  },
  pageSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 2,
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 24,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleBtnActive: {
    backgroundColor: C.indigo,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.muted,
  },
  toggleBtnTextActive: {
    color: C.white,
  },

  // ── Layout ──
  mainGrid: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  mainGridColumn: {
    flexDirection: 'column',
  },
  scheduleWrapper: {
    flex: 2,
  },
  rightPanel: {
    flex: 1,
    minWidth: 260,
  },
  fullWidth: { width: '100%' },

  // ── Card ──
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },

  // ── Day Tabs (mobile) ──
  dayTabsScroll: { marginBottom: 14 },
  dayTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
  },
  dayTabActive: {
    backgroundColor: C.indigo,
    borderColor: C.indigo,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.5,
  },
  dayTabTextActive: {
    color: C.white,
  },

  // ── Day Tabs (tablet) ──
  scheduleGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  scheduleCol: {
    flex: 1,
    gap: 8,
  },
  dayTabTablet: {
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.bg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 6,
  },
  dayTabTabletActive: {
    backgroundColor: C.indigo,
    borderColor: C.indigo,
  },
  dayTabTextTablet: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    letterSpacing: 0.5,
  },
  dayTabTextTabletActive: {
    color: C.white,
  },

  // ── Class Cards ──
  classesCol: { gap: 10 },
  classCard: {
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
    gap: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  classCardNow: {
    borderColor: C.indigoDark,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  nowBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  nowBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.white,
    letterSpacing: 1,
  },
  classTime: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  classTitle: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 17,
  },
  classSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.indigoLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.white,
  },
  miniAvatarCount: {
    backgroundColor: C.indigo,
  },
  miniAvatarCountText: {
    fontSize: 8,
    color: C.white,
    fontWeight: '700',
  },
  nowProgressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },

  // ── Bottom Row ──
  bottomRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
  },
  bottomRowColumn: {
    flexDirection: 'column',
  },

  // ── Efficiency Card ──
  efficiencyCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  efficiencyLeft: { flex: 1 },
  efficiencyLabel: {
    fontSize: 13,
    color: C.text,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 6,
  },
  efficiencyValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  efficiencyVal: {
    fontSize: 32,
    fontWeight: '800',
    color: C.dark,
    letterSpacing: -1,
  },
  efficiencyBadge: {
    backgroundColor: C.greenLight,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  efficiencyBadgeText: {
    fontSize: 11,
    color: C.green,
    fontWeight: '700',
  },
  efficiencyNote: {
    fontSize: 11,
    color: C.muted,
    marginTop: 4,
  },
  efficiencyRing: {
    marginLeft: 12,
  },
  ringOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: C.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: C.mutedLight,
  },
  ringInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.indigoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringIcon: {
    fontSize: 16,
    color: C.indigo,
  },

  // ── Pro Tip Card ──
  proTipCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  proTipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.indigoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  proTipContent: { flex: 1 },
  proTipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.dark,
    marginBottom: 6,
  },
  proTipBody: {
    fontSize: 12,
    color: C.text,
    lineHeight: 18,
  },

  // ── Right Panel ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: C.dark,
  },
  viewAll: {
    fontSize: 11,
    fontWeight: '700',
    color: C.indigo,
    letterSpacing: 0.5,
  },
  deadlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.red,
  },

  // ── Collapse button ──
  collapseBtn: {
    marginTop: 10,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.indigoLight,
  },
  collapseBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.indigo,
  },

  // ── Exam Card ──
  examCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.bg,
  },
  examDateBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: C.indigoLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: C.indigo,
    letterSpacing: 0.5,
  },
  examDay: {
    fontSize: 18,
    fontWeight: '800',
    color: C.indigo,
    lineHeight: 22,
  },
  examInfo: { flex: 1 },
  examTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.dark,
  },
  examSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },

  // ── Deadline Card ──
  deadlineCard: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingRight: 12,
  },
  deadlineTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deadlineTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  deadlineDue: {
    fontSize: 11,
    color: C.muted,
    fontWeight: '500',
  },
  deadlineTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: C.dark,
  },
  deadlineSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },

  // ── Study Resources Card (dashboard) ──
  studyCard: {
    marginTop: 16,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#2D2060',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  studyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(45,32,96,0.6)',
  },
  studyContent: {
    padding: 18,
  },
  studyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.white,
  },
  studySub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    marginBottom: 12,
  },
  studyBtn: {
    alignSelf: 'flex-start',
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  studyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.indigoDark,
  },

  // ── Study Resources Screen ──
  resourceTabBar: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 4,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  resourceTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
  },
  resourceTabActive: {
    backgroundColor: C.indigo,
  },
  resourceTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.muted,
  },
  resourceTabTextActive: {
    color: C.white,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.bg,
    gap: 12,
  },
  resourceInfo: { flex: 1 },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.dark,
  },
  resourceSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },
  resourceBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resourceBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});