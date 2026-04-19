// Sidebar.js
// ─────────────────────────────────────────────────────────────────────────────
// Universal sidebar — React Native (iOS / Android) + react-native-web
// • Mobile  : hamburger top-left → drawer slides in FROM THE LEFT
// • Desktop : sidebar always visible (no hamburger)
//
// Dependencies:
//   • react-native / react-native-web
//   • react-native-svg  →  npx expo install react-native-svg
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Modal,
  Animated,
  StatusBar,
} from "react-native";
import Svg, { Rect, Path, Line, Circle } from "react-native-svg";
import Dashboard      from "./Dashboardpage";
import Attendance     from "../Attendance/Attendance";
import Timetable      from "../Timetable/timetable";
import Ranking        from "../Ranking/score";
import Fees           from "../Fees/fees";
import Studymaterials from "../Studymaterials/studymaterial";
import Profile        from "../Profile/profile";
import Feedback       from "../Feedback/feedback"; 
import Setting        from "../Setting/setting";  

// ─── Constants ───────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = 240;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_MOBILE = SCREEN_WIDTH <= 768;
const ANDROID_STATUSBAR_HEIGHT = Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0;

// ─── Theme ───────────────────────────────────────────────────────────────────

const T = {
  purple:      "#5b4fcf",
  purpleLight: "#f0eeff",
  gray:        "#6b7280",
  grayLight:   "#9ca3af",
  border:      "#ede9fe",
  borderSoft:  "#f3f0ff",
  ink:         "#1a1a2e",
  white:       "#ffffff",
  overlay:     "rgba(0,0,0,0.45)",
};

// ─── Icons ───────────────────────────────────────────────────────────────────

const HamburgerIcon = ({ color = T.purple }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Line x1="3" y1="6"  x2="21" y2="6"  stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

const CloseIcon = ({ color = T.gray }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Line x1="18" y1="6"  x2="6"  y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    <Line x1="6"  y1="6"  x2="18" y2="18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
  </Svg>
);

const LogoGrid = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect x="3"  y="3"  width="8" height="8" rx="1.5" fill="white" />
    <Rect x="13" y="3"  width="8" height="8" rx="1.5" fill="white" opacity="0.6" />
    <Rect x="3"  y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.6" />
    <Rect x="13" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.3" />
  </Svg>
);

const NavIcons = {
  Dashboard:  ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3"  y="3"  width="7" height="7" rx="1" fill={c} />
      <Rect x="14" y="3"  width="7" height="7" rx="1" fill={c} opacity="0.5" />
      <Rect x="3"  y="14" width="7" height="7" rx="1" fill={c} opacity="0.5" />
      <Rect x="14" y="14" width="7" height="7" rx="1" fill={c} opacity="0.5" />
    </Svg>
  ),
  Attendance: ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth="2" />
      <Line x1="16" y1="2"  x2="16" y2="6"  stroke={c} strokeWidth="2" />
      <Line x1="8"  y1="2"  x2="8"  y2="6"  stroke={c} strokeWidth="2" />
      <Line x1="3"  y1="10" x2="21" y2="10" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Timetable:  ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={c} strokeWidth="2" />
      <Line x1="16" y1="2"  x2="16" y2="6"  stroke={c} strokeWidth="2" />
      <Line x1="8"  y1="2"  x2="8"  y2="6"  stroke={c} strokeWidth="2" />
      <Line x1="3"  y1="10" x2="21" y2="10" stroke={c} strokeWidth="2" />
      <Line x1="9"  y1="16" x2="15" y2="16" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Rankings:   ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M6 9H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"    stroke={c} strokeWidth="2" />
      <Path d="M22 9h-2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"  stroke={c} strokeWidth="2" />
      <Path d="M12 3a4 4 0 0 1 4 4v14H8V7a4 4 0 0 1 4-4z" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Fees:       ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={c} strokeWidth="2" />
      <Line x1="2" y1="10" x2="22" y2="10" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Study:      ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"                                 stroke={c} strokeWidth="2" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Profile:    ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={c} strokeWidth="2" />
      <Circle cx="12" cy="7" r="4" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Feedback:   ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={c} strokeWidth="2" />
    </Svg>
  ),
  Settings:   ({ c }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2" />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
           a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
           A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
           l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
           A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
           l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
           a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
           l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
           a1.65 1.65 0 0 0-1.51 1z"
        stroke={c} strokeWidth="2"
      />
    </Svg>
  ),
};

const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",      Icon: NavIcons.Dashboard  },
  { id: "attendance", label: "Attendance",     Icon: NavIcons.Attendance },
  { id: "timetable",  label: "Timetable",      Icon: NavIcons.Timetable  },
  { id: "rankings",   label: "Rankings",       Icon: NavIcons.Rankings   },
  { id: "fees",       label: "Fees",           Icon: NavIcons.Fees       },
  { id: "study",      label: "Study Material", Icon: NavIcons.Study      },
  { id: "profile",    label: "Profile",        Icon: NavIcons.Profile    },
  { id: "feedback",   label: "Feedback",       Icon: NavIcons.Feedback   },
  { id: "settings",   label: "Settings",       Icon: NavIcons.Settings   },
];

// ─── Sidebar panel (shared by mobile drawer + desktop) ───────────────────────

const SidebarPanel = ({ activeId, onItemPress, onClose, isMobile }) => (
  <View style={styles.sidebarPanel}>

    {/* Logo row */}
    <View style={styles.logoRow}>
      <View style={styles.logoBox}><LogoGrid /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.logoTitle}>UniVerse</Text>
        <Text style={styles.logoSub}>STUDENT PORTAL</Text>
      </View>
      {isMobile && (
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          style={styles.closeBtn}
          accessibilityLabel="Close menu"
          accessibilityRole="button"
        >
          <CloseIcon color={T.gray} />
        </TouchableOpacity>
      )}
    </View>

    {/* Nav items */}
    <ScrollView
      style={styles.navScroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 12 }}
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = activeId === id;
        return (
          <TouchableOpacity
            key={id}
            activeOpacity={0.7}
            onPress={() => onItemPress(id)}
            style={[styles.navItem, active && styles.navItemActive]}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
          >
            <View style={styles.iconWrap}>
              <Icon c={active ? T.purple : T.gray} />
            </View>
            <Text
              style={[styles.navLabel, active && styles.navLabelActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>

    {/* User footer */}
    <TouchableOpacity style={styles.userRow} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AJ</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>Alex Johnson</Text>
        <Text style={styles.userId}>ID: EDU-2024-089</Text>
      </View>
    </TouchableOpacity>

  </View>
);

// ─── Main export ──────────────────────────────────────────────────────────────

export default function Sidebar({ onNavigate }) {
  const [activeId,     setActiveId]     = useState("dashboard");
  const [modalVisible, setModalVisible] = useState(false);

  // starts fully off-screen to the LEFT (-SIDEBAR_WIDTH), slides to 0
  const slideX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Open ────────────────────────────────────────────────────────────────
  const openDrawer = () => {
    setModalVisible(true);
    // Small delay ensures the Modal has mounted before we animate
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideX, {
          toValue:         0,          // slide to x = 0 (fully visible on left)
          duration:        270,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue:         1,
          duration:        270,
          useNativeDriver: true,
        }),
      ]).start();
    }, 10);
  };

  // ── Close ───────────────────────────────────────────────────────────────
  const closeDrawer = (afterClose) => {
    Animated.parallel([
      Animated.timing(slideX, {
        toValue:         -SIDEBAR_WIDTH,  // slide back off-screen to the left
        duration:        230,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue:         0,
        duration:        230,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      afterClose?.();
    });
  };

  const handleNavPress = (id) => {
    setActiveId(id);
    onNavigate?.(id);
    if (IS_MOBILE) closeDrawer();
  };

  const renderScreen = () => {
    switch (activeId) {
      case "study":      return <Studymaterials />;
      case "fees":       return <Fees />;
      case "rankings":   return <Ranking />;
      case "timetable":  return <Timetable />;
      case "attendance": return <Attendance />;
      case "profile":    return <Profile />;
      case "feedback":   return <Feedback />;
      case "settings":   return <Setting />;
      default:           return <Dashboard />;
    }
  };

  // ══════════════════════════════════════════════
  // MOBILE
  // ══════════════════════════════════════════════
  if (IS_MOBILE) {
    return (
      <View style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.mobileHeader}>

          {/* ── HAMBURGER — three bars TouchableOpacity ── */}
          <TouchableOpacity
            onPress={openDrawer}
            activeOpacity={0.7}
            style={styles.hamburgerBtn}
            accessibilityLabel="Open navigation menu"
            accessibilityRole="button"
          >
            <HamburgerIcon color={T.purple} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>UniVerse</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Page content */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {renderScreen()}
        </ScrollView>

        {/* ── LEFT-SLIDE DRAWER ── */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="none"        // ← must be "none" — we do the animation
          statusBarTranslucent
          onRequestClose={() => closeDrawer()}
        >
          {/* Animated dark backdrop — tap to close */}
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: fadeAnim }]}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeDrawer()}
              accessibilityLabel="Close menu"
            />
          </Animated.View>

          {/* Panel slides in from left: translateX goes -240 → 0 */}
          <Animated.View
            style={[
              styles.drawerContainer,
              { transform: [{ translateX: slideX }] },
            ]}
          >
            <SidebarPanel
              activeId={activeId}
              onItemPress={handleNavPress}
              onClose={() => closeDrawer()}
              isMobile
            />
          </Animated.View>
        </Modal>

      </View>
    );
  }

  // ══════════════════════════════════════════════
  // DESKTOP — always-visible sidebar
  // ══════════════════════════════════════════════
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <SidebarPanel
        activeId={activeId}
        onItemPress={handleNavPress}
        isMobile={false}
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {renderScreen()}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  // Mobile header
  mobileHeader: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    backgroundColor:   T.white,
    paddingTop:        Platform.select({ ios: 52, android: ANDROID_STATUSBAR_HEIGHT + 10, default: 16 }),
    paddingBottom:     12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    zIndex: 10,
    ...Platform.select({
      ios:     { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 4 },
      web:     { boxShadow: "0 2px 8px rgba(0,0,0,0.07)" },
    }),
  },

  // Hamburger button (three bars)
  hamburgerBtn: {
    width:           44,
    height:          44,
    borderRadius:    12,
    backgroundColor: T.purpleLight,
    alignItems:      "center",
    justifyContent:  "center",
  },

  headerTitle: {
    fontSize:      17,
    fontWeight:    "700",
    color:         T.ink,
    letterSpacing: -0.3,
  },

  // Backdrop
  backdrop: {
    backgroundColor: T.overlay,
    zIndex: 1,
  },

  // The animated drawer panel — starts off-screen left, slides to x=0
  drawerContainer: {
    position: "absolute",
    top:      0,
    left:     0,          // anchored to left edge
    bottom:   0,
    width:    SIDEBAR_WIDTH,
    zIndex:   2,
    ...Platform.select({
      ios:     { shadowColor: "#000", shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.18, shadowRadius: 16 },
      android: { elevation: 16 },
      web:     { boxShadow: "4px 0 24px rgba(0,0,0,0.15)" },
    }),
  },

  // Sidebar panel body
  sidebarPanel: {
    flex:             1,
    backgroundColor:  T.white,
    paddingTop:       Platform.select({ ios: 52, android: ANDROID_STATUSBAR_HEIGHT + 10, default: 24 }),
    paddingBottom:    20,
    borderRightWidth: 1,
    borderRightColor: T.border,
  },

  // Logo
  logoRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 20,
    paddingBottom:     22,
    borderBottomWidth: 1,
    borderBottomColor: T.borderSoft,
  },
  logoBox: {
    width:           36,
    height:          36,
    borderRadius:    10,
    backgroundColor: T.purple,
    alignItems:      "center",
    justifyContent:  "center",
    marginRight:     10,
  },
  logoTitle: {
    fontWeight:    "700",
    fontSize:      13,
    color:         T.ink,
    letterSpacing: -0.2,
    ...Platform.select({
      ios:     { fontFamily: "Georgia" },
      android: { fontFamily: "serif"   },
      web:     { fontFamily: "'DM Sans', Georgia, serif" },
    }),
  },
  logoSub: {
    fontSize:      9,
    fontWeight:    "600",
    color:         T.grayLight,
    letterSpacing: 0.9,
  },
  closeBtn: {
    width:           34,
    height:          34,
    borderRadius:    8,
    alignItems:      "center",
    justifyContent:  "center",
    backgroundColor: T.borderSoft,
    marginLeft:      6,
  },

  // Nav
  navScroll: { flex: 1 },
  navItem: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingVertical:   11,
    paddingHorizontal: 20,
  },
  navItemActive: {
    backgroundColor:  T.purpleLight,
    borderRightWidth: 3,
    borderRightColor: T.purple,
  },
  iconWrap: { marginRight: 12 },
  navLabel: {
    flex:       1,
    fontSize:   13.5,
    fontWeight: "500",
    color:      T.gray,
    ...Platform.select({ web: { fontFamily: "'DM Sans', sans-serif", userSelect: "none" } }),
  },
  navLabelActive: { color: T.purple, fontWeight: "700" },

  // Footer
  userRow: {
    flexDirection:     "row",
    alignItems:        "center",
    paddingHorizontal: 20,
    paddingTop:        16,
    borderTopWidth:    1,
    borderTopColor:    T.borderSoft,
  },
  avatar: {
    width:           34,
    height:          34,
    borderRadius:    17,
    backgroundColor: T.purple,
    alignItems:      "center",
    justifyContent:  "center",
    marginRight:     10,
  },
  avatarText: { color: T.white, fontWeight: "700", fontSize: 12 },
  userName:   { fontSize: 12.5, fontWeight: "700", color: T.ink },
  userId:     { fontSize: 10.5, color: T.grayLight },
});