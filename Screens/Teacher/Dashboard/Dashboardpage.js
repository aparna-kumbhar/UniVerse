import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_LAPTOP = SCREEN_WIDTH >= 1024;
const IS_TABLET = SCREEN_WIDTH >= 768 && SCREEN_WIDTH < 1024;
const IS_WEB = Platform.OS === 'web';

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  bg: '#F4F3EE',
  cardBg: '#FFFFFF',
  navBg: '#FFFFFF',
  darkCard: '#1A2B3C',
  accent: '#2ECC8B',
  accentDark: '#27AE72',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textLight: '#FFFFFF',
  border: '#E5E7EB',
  tagBg: '#F0FDF4',
  tagText: '#166534',
  warningBg: '#FEF9C3',
  progressBg: '#E5E7EB',
  progressAlpha: '#2ECC8B',
  progressBeta: '#2ECC8B',
  progressGamma: '#2ECC8B',
  badgeBg: '#ECFDF5',
  badgeText: '#065F46',
  tipBg: '#F9FAFB',
  tipBorder: '#2ECC8B',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const col = (n, gap = 16) => {
  const cols = IS_LAPTOP ? 12 : IS_TABLET ? 8 : 4;
  const totalGap = gap * (cols - 1);
  const unit = (SCREEN_WIDTH - 32 - totalGap) / cols;
  return unit * n + gap * (n - 1);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const TopBar = () => (
  <View style={styles.topBar}>
   
    
  </View>
);

const HeroCard = () => (
  <View style={styles.heroCard}>
    <View style={styles.heroLeft}>
      <Text style={styles.heroTitle}>Welcome, Professor Aris</Text>
     
    </View>
    <View style={styles.heroRight}>
      <View style={styles.avatarStack}>
        {['#FFB347', '#87CEEB', '#DDA0DD'].map((color, i) => (
          <View
            key={i}
            style={[styles.stackAvatar, { backgroundColor: color, left: i * 18 }]}
          >
            <Text style={styles.stackAvatarText}>{['S', 'T', 'U'][i]}</Text>
          </View>
        ))}
        <View style={[styles.stackAvatar, styles.stackAvatarCount, { left: 54 }]}>
          <Text style={styles.stackCountText}>+28</Text>
        </View>
      </View>
      <Text style={styles.heroOnline}>Active Students Online</Text>
    </View>
  </View>
);

const StatCard = ({ icon, label, value }) => (
  <TouchableOpacity activeOpacity={0.75} style={styles.statCard}>
    <View style={styles.statIcon}>
      <Text style={styles.statIconText}>{icon}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </TouchableOpacity>
);

const LectureCard = ({ time, period, title, venue, batch, tag }) => (
  <TouchableOpacity activeOpacity={0.75} style={[styles.lectureCard, tag && styles.lectureCardHighlight]}>
    <View style={styles.lectureTime}>
      <Text style={styles.lectureTimeText}>{time}</Text>
      <Text style={styles.lectureTimePeriod}>{period}</Text>
    </View>
    <View style={styles.lectureInfo}>
      <Text style={styles.lectureTitle}>{title}</Text>
      <View style={styles.lectureMeta}>
        <Text style={styles.lectureMetaText}>📍 {venue}</Text>
        <Text style={styles.lectureDot}> • </Text>
        <Text style={styles.lectureMetaText}>{batch}</Text>
      </View>
    </View>
    {tag && (
      <View style={styles.lectureTag}>
        <Text style={styles.lectureTagText}>{tag}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const ProgressBar = ({ label, percent, color }) => (
  <View style={styles.progressRow}>
    <View style={styles.progressLabelRow}>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressPercent}>{percent}%</Text>
    </View>
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color || C.accent }]} />
    </View>
  </View>
);

const InsightCard = () => (
  <View style={styles.insightCard}>
    <View style={styles.insightHeader}>
      <Text style={styles.insightStar}>✦</Text>
      <Text style={styles.insightStarSmall}>✦</Text>
    </View>
    <Text style={styles.insightTitle}>Curator's Insight</Text>
    <Text style={styles.insightBody}>
      "Based on last night's assignment submissions, Batch Alpha 24 is struggling
      with 'Wave-Particle Duality'. Consider using the Asymmetric Drawer for a
      focused deep-dive in today's 9:00 AM session."
    </Text>
    <TouchableOpacity activeOpacity={0.75} style={styles.insightBtn}>
      <Text style={styles.insightBtnText}>Apply Strategy  →</Text>
    </TouchableOpacity>
  </View>
);

const WeeklyTip = () => (
  <View style={styles.tipCard}>
    <Text style={styles.tipLabel}>💡  WEEKLY TIP</Text>
    <Text style={styles.tipBody}>
      "The Digital Atelier thrives on pause. Introduce a 2-minute 'silent
      reflection' block midway through virtual sessions to increase content
      retention by 22%."
    </Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function Dashboardpage() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.navBg} />
      
      

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        
      >
        {/* Hero */}
        <HeroCard />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard icon="◈" label="ACTIVE BATCHES" value="12" />
          <StatCard icon="👤" label="TOTAL STUDENTS" value="482" />
          <StatCard icon="📊" label="AVG. ATTENDANCE" value="94.2%" />
        </View>

        {/* Content Grid */}
        <View style={[styles.grid, IS_LAPTOP && styles.gridLaptop]}>

          {/* Left Column */}
          <View style={[styles.gridLeft, IS_LAPTOP && styles.gridLeftLaptop]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Lectures</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.sectionLink}>Full Calendar  ›</Text>
              </TouchableOpacity>
            </View>

            <LectureCard
              time="09:00"
              period="AM"
              title="Advanced Quantum Mechanics"
              venue="Hall B-12"
              batch="Batch Alpha 24"
            />
            <LectureCard
              time="11:30"
              period="AM"
              title="Theoretical Epistemology"
              venue="Virtual Session"
              batch="Batch Gamma-9"
              tag="Starting soon"
            />
            <LectureCard
              time="02:00"
              period="PM"
              title="Curriculum Planning Review"
              venue="Faculty Lounge"
              batch="Department"
            />
          </View>

          {/* Right Column */}
          <View style={[styles.gridRight, IS_LAPTOP && styles.gridRightLaptop]}>
            {/* Batch Performance */}
            <View style={styles.perfCard}>
              <Text style={styles.perfTitle}>Batch Performance</Text>
              <ProgressBar label="Alpha 24 – Quantum" percent={88} />
              <ProgressBar label="Beta 12 – Logic" percent={72} color="#60A5FA" />
              <ProgressBar label="Gamma-9 – Ethics" percent={94} />
            </View>

            {/* Insight */}
            <InsightCard />

            {/* Weekly Tip */}
            <WeeklyTip />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
 root: {
  flex: 1,
  backgroundColor: C.bg,
  ...(IS_WEB && {
    height: '100vh',
    maxHeight: '100vh',   // ✅ prevents overflow breaking scroll
    overflow: 'hidden',   // ✅ VERY IMPORTANT
    display: 'flex',
    flexDirection: 'column',
  }),
},

  // ✅ FIXED: height: 0 forces the flex child to be constrained,
  // making overflowY: 'auto' actually trigger on laptop/web.
 scrollView: {
  flex: 1,
  ...(IS_WEB && {
    height: 0,
    flexGrow: 1,          // ✅ REQUIRED for proper scroll
    overflowY: 'auto',
  }),
},

  // ── Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.navBg,
    paddingHorizontal: IS_LAPTOP ? 32 : 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  topBarBrand: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: IS_LAPTOP ? 14 : 12,
    fontWeight: '700',
    letterSpacing: 3,
    color: C.textPrimary,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 16 },
  avatarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.bg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 24,
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#fff', fontWeight: '700', fontSize: 13 },
  avatarName: { fontSize: 12, fontWeight: '700', color: C.textPrimary },
  avatarRole: { fontSize: 10, color: C.textSecondary },

  // ── Scroll
 scrollContent: {
  paddingHorizontal: IS_LAPTOP ? 32 : 16,
  paddingTop: 10,   // reduce from 20 → 10
  paddingBottom: 40,
  flexGrow: 1,
},

  // ── Hero
  heroCard: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: IS_LAPTOP ? 28 : 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  heroLeft: { flex: 1, paddingRight: 12 },
  heroTitle: {
    fontSize: IS_LAPTOP ? 22 : 18,
    fontWeight: '800',
    color: C.textPrimary,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: IS_LAPTOP ? 14 : 13,
    color: C.textSecondary,
    lineHeight: 20,
  },
  heroRight: { alignItems: 'center', gap: 8 },
  avatarStack: {
    width: 100,
    height: 36,
    position: 'relative',
  },
  stackAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackAvatarText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  stackAvatarCount: { backgroundColor: C.accent },
  stackCountText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  heroOnline: { fontSize: 11, color: C.textSecondary, textAlign: 'center', marginTop: 4 },

  // ── Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: C.cardBg,
    borderRadius: 14,
    padding: IS_LAPTOP ? 18 : 14,
    alignItems: 'flex-start',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.tagBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIconText: { fontSize: 16 },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: C.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: IS_LAPTOP ? 24 : 20,
    fontWeight: '800',
    color: C.textPrimary,
  },

  // ── Grid
  grid: { gap: 16 },
  gridLaptop: { flexDirection: 'row', alignItems: 'flex-start' },
  gridLeft: { gap: 10 },
  gridLeftLaptop: { flex: 1.4 },
  gridRight: { gap: 12, marginTop: 0 },
  gridRightLaptop: { flex: 1 },

  // ── Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: IS_LAPTOP ? 17 : 15,
    fontWeight: '800',
    color: C.textPrimary,
  },
  sectionLink: {
    fontSize: 13,
    color: C.accent,
    fontWeight: '600',
  },

  // ── Lecture Card
  lectureCard: {
    backgroundColor: C.cardBg,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  lectureCardHighlight: {
    borderColor: C.accent,
    backgroundColor: '#F0FDF9',
  },
  lectureTime: {
    width: 44,
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 8,
    paddingVertical: 6,
  },
  lectureTimeText: { fontSize: 14, fontWeight: '800', color: C.textPrimary },
  lectureTimePeriod: { fontSize: 10, color: C.textMuted, fontWeight: '600' },
  lectureInfo: { flex: 1 },
  lectureTitle: {
    fontSize: IS_LAPTOP ? 15 : 13,
    fontWeight: '700',
    color: C.textPrimary,
    marginBottom: 4,
  },
  lectureMeta: { flexDirection: 'row', alignItems: 'center' },
  lectureMetaText: { fontSize: 11, color: C.textSecondary },
  lectureDot: { color: C.textMuted, fontSize: 11 },
  lectureTag: {
    backgroundColor: C.accent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lectureTagText: { fontSize: 10, fontWeight: '700', color: '#fff' },

  // ── Batch Performance
  perfCard: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    padding: IS_LAPTOP ? 20 : 16,
    gap: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
    }),
  },
  perfTitle: {
    fontSize: IS_LAPTOP ? 16 : 14,
    fontWeight: '800',
    color: C.textPrimary,
  },
  progressRow: { gap: 6 },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: { fontSize: 12, color: C.textSecondary, fontWeight: '500' },
  progressPercent: { fontSize: 12, fontWeight: '700', color: C.textPrimary },
  progressTrack: {
    height: 6,
    backgroundColor: C.progressBg,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  // ── Insight Card
  insightCard: {
    backgroundColor: C.darkCard,
    borderRadius: 16,
    padding: IS_LAPTOP ? 22 : 18,
    gap: 10,
  },
  insightHeader: {
    flexDirection: 'row',
    gap: 4,
  },
  insightStar: { fontSize: 18, color: C.accent },
  insightStarSmall: { fontSize: 10, color: C.accent, alignSelf: 'flex-start', marginTop: 4 },
  insightTitle: {
    fontSize: IS_LAPTOP ? 18 : 16,
    fontWeight: '800',
    color: '#fff',
  },
  insightBody: {
    fontSize: IS_LAPTOP ? 13 : 12,
    color: '#A0AEC0',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  insightBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.accent,
    marginTop: 4,
  },
  insightBtnText: {
    color: C.accent,
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Tip Card
  tipCard: {
    backgroundColor: C.cardBg,
    borderRadius: 14,
    padding: IS_LAPTOP ? 18 : 14,
    borderLeftWidth: 3,
    borderLeftColor: C.accent,
    gap: 6,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 1 },
    }),
  },
  tipLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: C.textMuted,
  },
  tipBody: {
    fontSize: IS_LAPTOP ? 13 : 12,
    color: C.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
});