// StudentProfile.js
// ─────────────────────────────────────────────────────────────────────────────
// Student Profile page — React Native (iOS / Android / Web)
// Matches the design in the screenshot.
// No sidebar — drop this inside your existing layout's main content area.
//
// Dependencies:
//   • react-native / react-native-web
//   • react-native-svg  →  npx expo install react-native-svg
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  Alert,
} from "react-native";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";

// ─── Responsive helpers ───────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get("window");
const IS_MOBILE = SCREEN_W < 768;

// ─── Theme ───────────────────────────────────────────────────────────────────

const T = {
  purple:       "#5b4fcf",
  purpleLight:  "#f0eeff",
  purpleMid:    "#7c6cf0",
  purpleDark:   "#3d34a0",
  gray:         "#6b7280",
  grayLight:    "#9ca3af",
  grayBg:       "#f3f4f6",
  grayBorder:   "#e5e7eb",
  ink:          "#111827",
  subtext:      "#6b7280",
  white:        "#ffffff",
  pageBg:       "#f9fafb",
  green:        "#16a34a",
  labelColor:   "#9ca3af",
};

// ─── Tiny SVG icons ───────────────────────────────────────────────────────────

const EditIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke={T.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={T.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const CameraIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={T.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke={T.white} strokeWidth="2" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={T.grayLight} strokeWidth="2" />
    <Line x1="16" y1="2" x2="16" y2="6" stroke={T.grayLight} strokeWidth="2" strokeLinecap="round" />
    <Line x1="8"  y1="2" x2="8"  y2="6" stroke={T.grayLight} strokeWidth="2" strokeLinecap="round" />
    <Line x1="3"  y1="10" x2="21" y2="10" stroke={T.grayLight} strokeWidth="2" />
  </Svg>
);

const LockIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={T.purple} strokeWidth="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={T.purple} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const BellIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke={T.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={T.purple} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ChevronRight = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={T.grayLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={T.grayLight} strokeWidth="2" />
    <Line x1="12" y1="8" x2="12" y2="12" stroke={T.grayLight} strokeWidth="2" strokeLinecap="round" />
    <Line x1="12" y1="16" x2="12.01" y2="16" stroke={T.grayLight} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// ─── Avatar placeholder (initials) ───────────────────────────────────────────

const AvatarPlaceholder = ({ size = 100 }) => (
  <View
    style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: T.purpleLight,
      alignItems: "center", justifyContent: "center",
    }}
  >
    <Text style={{ fontSize: size * 0.32, fontWeight: "700", color: T.purple }}>AR</Text>
  </View>
);

// ─── Reusable field label ─────────────────────────────────────────────────────

const FieldLabel = ({ text }) => (
  <Text style={styles.fieldLabel}>{text}</Text>
);

// ─── Read-only / editable input ───────────────────────────────────────────────

const ProfileInput = ({ value, onChangeText, editable = false, icon, multiline = false }) => (
  <View style={[styles.inputWrapper, multiline && { height: 90, alignItems: "flex-start" }]}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline={multiline}
      style={[
        styles.input,
        multiline && { height: 80, textAlignVertical: "top", paddingTop: 10 },
        !editable && { color: T.ink },
      ]}
      placeholderTextColor={T.grayLight}
    />
    {icon && <View style={styles.inputIcon}>{icon}</View>}
  </View>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentProfile() {
  const [editing, setEditing] = useState(false);

  // Form state
  const [fullName,    setFullName]    = useState("Alex Rivera");
  const [email,       setEmail]       = useState("alex.rivera@editorial.academ");
  const [phone,       setPhone]       = useState("+1 (555) 000-1234");
  const [dob,         setDob]         = useState("May 14, 2001");
  const [address,     setAddress]     = useState(
    "128 Curated Lane, Studio District, San Francisco, CA 94103"
  );

  const handleSave = () => {
    setEditing(false);
    Alert.alert("Saved", "Your profile has been updated.");
  };

  const handleDiscard = () => {
    setEditing(false);
    // Reset fields if needed
  };

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
    >

      {/* ── Page header ── */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Student Profile</Text>
        <Text style={styles.pageSubtitle}>
          Manage your personal information, contact details, and account preferences
          through our curated profile interface.
        </Text>
      </View>

      {/* ── Main card row ── */}
      <View style={[styles.cardRow, IS_MOBILE && { flexDirection: "column" }]}>

        {/* ── Left card: avatar + enrollment ── */}
        <View style={[styles.leftCol, IS_MOBILE && { width: "100%", marginBottom: 16 }]}>

          {/* Avatar card */}
          <View style={styles.card}>
            {/* Avatar with camera button */}
            <View style={styles.avatarArea}>
              <View style={styles.avatarRing}>
                <AvatarPlaceholder size={IS_MOBILE ? 90 : 100} />
              </View>
              {/* Camera overlay button */}
              <TouchableOpacity
                style={styles.cameraBtn}
                activeOpacity={0.8}
                onPress={() => Alert.alert("Upload", "Choose a profile photo")}
                accessibilityLabel="Change profile photo"
                accessibilityRole="button"
              >
                <CameraIcon />
              </TouchableOpacity>
            </View>

            <Text style={styles.studentName}>Alex Rivera</Text>
            <Text style={styles.studentMajor}>Visual Communication Design</Text>

            {/* Badges */}
            <View style={styles.badgeRow}>
            </View>
          </View>

          {/* Enrollment details card */}
          <View style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.enrollTitle}>Enrollment Details</Text>
            <View style={styles.enrollRow}>
              <Text style={styles.enrollLabel}>SEMESTER</Text>
              <Text style={styles.enrollValue}>Fall 2023</Text>
            </View>
            <View style={styles.enrollRow}>
              <Text style={styles.enrollLabel}>MAJOR</Text>
              <Text style={styles.enrollValue}>Design Strategy</Text>
            </View>
            <View style={[styles.enrollRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.enrollLabel}>GPA</Text>
              <Text style={[styles.enrollValue, { color: T.purple, fontWeight: "700" }]}>3.92</Text>
            </View>
          </View>

        </View>

        {/* ── Right card: personal info form ── */}
        <View style={[styles.card, styles.rightCol, IS_MOBILE && { width: "100%" }]}>

          {/* Card header */}
          <View style={styles.formHeader}>
            <View>
              <Text style={styles.formTitle}>Personal Information</Text>
              <Text style={styles.formSubtitle}>Keep your academic records up to date.</Text>
            </View>
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.8}
              onPress={() => setEditing(!editing)}
              accessibilityLabel="Edit profile"
              accessibilityRole="button"
            >
              <EditIcon />
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Two-column fields (single column on mobile) */}
          <View style={[styles.fieldGrid, IS_MOBILE && { flexDirection: "column" }]}>
            <View style={[styles.fieldCol, IS_MOBILE && { width: "100%" }]}>
              <FieldLabel text="FULL NAME" />
              <ProfileInput value={fullName} onChangeText={setFullName} editable={editing} />
            </View>
            <View style={[styles.fieldCol, IS_MOBILE && { width: "100%" }]}>
              <FieldLabel text="EMAIL ADDRESS" />
              <ProfileInput value={email} onChangeText={setEmail} editable={editing} />
            </View>
          </View>

          <View style={[styles.fieldGrid, IS_MOBILE && { flexDirection: "column" }]}>
            <View style={[styles.fieldCol, IS_MOBILE && { width: "100%" }]}>
              <FieldLabel text="PHONE NUMBER" />
              <ProfileInput value={phone} onChangeText={setPhone} editable={editing} />
            </View>
            <View style={[styles.fieldCol, IS_MOBILE && { width: "100%" }]}>
              <FieldLabel text="DATE OF BIRTH" />
              <ProfileInput
                value={dob}
                onChangeText={setDob}
                editable={editing}
                icon={<CalendarIcon />}
              />
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <FieldLabel text="RESIDENTIAL ADDRESS" />
            <ProfileInput
              value={address}
              onChangeText={setAddress}
              editable={editing}
              multiline
            />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Footer: last updated + action buttons */}
          <View style={[styles.formFooter, IS_MOBILE && { flexDirection: "column", gap: 12 }]}>
            <View style={styles.lastUpdated}>
              <InfoIcon />
              <Text style={styles.lastUpdatedText}>Last updated on Oct 24, 2023</Text>
            </View>

            <View style={styles.actionBtns}>
              {/* Discard */}
              <TouchableOpacity
                style={styles.discardBtn}
                activeOpacity={0.7}
                onPress={handleDiscard}
                accessibilityLabel="Discard changes"
                accessibilityRole="button"
              >
                <Text style={styles.discardText}>Discard</Text>
              </TouchableOpacity>

              {/* Save Changes */}
              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.8}
                onPress={handleSave}
                accessibilityLabel="Save changes"
                accessibilityRole="button"
              >
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </View>

      {/* ── Bottom quick-links ── */}
      <View style={[styles.quickLinks, IS_MOBILE && { flexDirection: "column" }]}>

        {/* Account Security */}
        <TouchableOpacity
          style={styles.quickCard}
          activeOpacity={0.8}
          onPress={() => Alert.alert("Account Security", "Manage passwords & 2FA")}
          accessibilityLabel="Account Security"
          accessibilityRole="button"
        >
          <View style={styles.quickIconBox}>
            <LockIcon />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.quickTitle}>Account Security</Text>
            <Text style={styles.quickSub}>Manage passwords &amp; 2FA</Text>
          </View>
          <ChevronRight />
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.quickCard}
          activeOpacity={0.8}
          onPress={() => Alert.alert("Notifications", "Preference for email & SMS")}
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <View style={styles.quickIconBox}>
            <BellIcon />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.quickTitle}>Notifications</Text>
            <Text style={styles.quickSub}>Preference for email &amp; SMS</Text>
          </View>
          <ChevronRight />
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  page: {
    flex: 1,
    backgroundColor: T.pageBg,
  },
  pageContent: {
    padding: IS_MOBILE ? 16 : 32,
    paddingBottom: 40,
  },

  // ── Page header
  pageHeader: {
    marginBottom: 28,
  },
  pageTitle: {
    fontSize:    IS_MOBILE ? 26 : 34,
    fontWeight:  "800",
    color:       T.ink,
    letterSpacing: -0.5,
    marginBottom: 6,
    ...Platform.select({
      ios:     { fontFamily: "Georgia" },
      android: { fontFamily: "serif"   },
      web:     { fontFamily: "'Georgia', serif" },
    }),
  },
  pageSubtitle: {
    fontSize:   14,
    color:      T.subtext,
    lineHeight: 22,
    maxWidth:   560,
  },

  // ── Card row layout
  cardRow: {
    flexDirection: "row",
    gap:           16,
    marginBottom:  16,
  },
  leftCol: {
    width: 200,
    flexShrink: 0,
  },
  rightCol: {
    flex: 1,
  },

  // ── Generic card
  card: {
    backgroundColor:  T.white,
    borderRadius:     16,
    padding:          20,
    borderWidth:      1,
    borderColor:      T.grayBorder,
    ...Platform.select({
      ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
      web:     { boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
    }),
  },

  // ── Avatar
  avatarArea: {
    alignItems:    "center",
    marginBottom:  14,
    position:      "relative",
  },
  avatarRing: {
    borderWidth:  3,
    borderColor:  T.purple,
    borderRadius: 999,
    padding:      3,
  },
  cameraBtn: {
    position:        "absolute",
    bottom:          4,
    right:           IS_MOBILE ? "28%" : "22%",
    width:           32,
    height:          32,
    borderRadius:    16,
    backgroundColor: T.purple,
    alignItems:      "center",
    justifyContent:  "center",
    borderWidth:     2,
    borderColor:     T.white,
  },
  studentName: {
    fontSize:   17,
    fontWeight: "700",
    color:      T.ink,
    textAlign:  "center",
    marginBottom: 4,
  },
  studentMajor: {
    fontSize:   13,
    color:      T.subtext,
    textAlign:  "center",
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection:  "row",
    justifyContent: "center",
    gap:            8,
    flexWrap:       "wrap",
  },
  badge: {
    backgroundColor: T.purpleLight,
    borderRadius:    20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeOutline: {
    backgroundColor: T.white,
    borderWidth:     1,
    borderColor:     T.purple,
  },
  badgeText: {
    fontSize:      10,
    fontWeight:    "700",
    color:         T.purple,
    letterSpacing: 0.6,
  },

  // ── Enrollment
  enrollTitle: {
    fontSize:     14,
    fontWeight:   "700",
    color:        T.ink,
    marginBottom: 12,
  },
  enrollRow: {
    flexDirection:    "row",
    justifyContent:   "space-between",
    alignItems:       "center",
    paddingVertical:  9,
    borderBottomWidth: 1,
    borderBottomColor: T.grayBorder,
  },
  enrollLabel: {
    fontSize:      11,
    fontWeight:    "600",
    color:         T.labelColor,
    letterSpacing: 0.5,
  },
  enrollValue: {
    fontSize:   13,
    fontWeight: "600",
    color:      T.ink,
  },

  // ── Form header
  formHeader: {
    flexDirection:   "row",
    justifyContent:  "space-between",
    alignItems:      "flex-start",
    marginBottom:    20,
    flexWrap:        "wrap",
    gap:             10,
  },
  formTitle: {
    fontSize:   18,
    fontWeight: "700",
    color:      T.ink,
    marginBottom: 3,
  },
  formSubtitle: {
    fontSize: 13,
    color:    T.subtext,
  },
  editBtn: {
    flexDirection:   "row",
    alignItems:      "center",
    gap:             6,
    backgroundColor: T.purpleLight,
    borderRadius:    10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth:     1,
    borderColor:     T.border,
  },
  editBtnText: {
    fontSize:   13,
    fontWeight: "600",
    color:      T.purple,
  },

  // ── Field grid
  fieldGrid: {
    flexDirection: "row",
    gap:           14,
    marginBottom:  16,
  },
  fieldCol: {
    flex: 1,
  },
  fieldLabel: {
    fontSize:      11,
    fontWeight:    "600",
    color:         T.labelColor,
    letterSpacing: 0.7,
    marginBottom:  6,
  },
  inputWrapper: {
    flexDirection:   "row",
    alignItems:      "center",
    backgroundColor: T.grayBg,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     T.grayBorder,
    paddingHorizontal: 12,
    height:          44,
  },
  input: {
    flex:     1,
    fontSize: 14,
    color:    T.ink,
    ...Platform.select({
      web: { outlineStyle: "none" },
    }),
  },
  inputIcon: {
    marginLeft: 8,
  },

  // ── Divider
  divider: {
    height:          1,
    backgroundColor: T.grayBorder,
    marginBottom:    16,
  },

  // ── Form footer
  formFooter: {
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "space-between",
  },
  lastUpdated: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  lastUpdatedText: {
    fontSize:    12,
    color:       T.labelColor,
    fontStyle:   "italic",
  },
  actionBtns: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           12,
  },
  discardBtn: {
    paddingHorizontal: 18,
    paddingVertical:   11,
  },
  discardText: {
    fontSize:   14,
    fontWeight: "600",
    color:      T.gray,
  },
  saveBtn: {
    backgroundColor:   T.purple,
    borderRadius:      12,
    paddingHorizontal: 24,
    paddingVertical:   12,
    ...Platform.select({
      ios:     { shadowColor: T.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
      android: { elevation: 4 },
      web:     { boxShadow: "0 4px 14px rgba(91,79,207,0.35)" },
    }),
  },
  saveBtnText: {
    fontSize:   14,
    fontWeight: "700",
    color:      T.white,
  },

  // ── Quick-link cards
  quickLinks: {
    flexDirection: "row",
    gap:           16,
    marginTop:     4,
  },
  quickCard: {
    flex:            1,
    flexDirection:   "row",
    alignItems:      "center",
    gap:             14,
    backgroundColor: T.white,
    borderRadius:    16,
    padding:         18,
    borderWidth:     1,
    borderColor:     T.grayBorder,
    ...Platform.select({
      ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 },
      web:     { boxShadow: "0 2px 12px rgba(0,0,0,0.05)" },
    }),
  },
  quickIconBox: {
    width:           44,
    height:          44,
    borderRadius:    12,
    backgroundColor: T.purpleLight,
    alignItems:      "center",
    justifyContent:  "center",
  },
  quickTitle: {
    fontSize:   14,
    fontWeight: "700",
    color:      T.ink,
    marginBottom: 3,
  },
  quickSub: {
    fontSize: 12,
    color:    T.subtext,
  },
});