import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Dashboardpage from './Dashboardpage';
import Attendancebatch from '../Attendance/Attendancebatch';
import Notes from '../Notes/Notes';
import Test from '../Test/Test';
import Teacherattendance from '../Teacherattendance/Teacherattendance';
import Marksbatch from '../Marksentry/Marksbatch';
import Schedule from '../Schedule/Schedule';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = 220;
const IS_TABLET = SCREEN_WIDTH >= 768;
const IS_WEB = Platform.OS === 'web';

// ── Icons ─────────────────────────────────────────────────────────────────────
const icons = {
  logo: '🎓',
  dashboard: '⊞',
  schedules: '📅',
  batches: '👥',
  analytics: '📈',
  settings: '⚙️',
  support: '❓',
  menu: '☰',
  close: '✕',
  plus: '+',
};

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
  { key: 'attendance marking', label: 'Attendance Marking', icon: icons.schedules },
  { key: 'notes', label: 'Notes', icon: icons.batches },
  { key: 'test', label: 'Test', icon: icons.analytics },
  { key: 'teacher attendance', label: 'Teacher Attendance', icon: '📝' },
  { key: 'marks entry', label: 'Marks Entry', icon: '📊' },
  { key: 'schedule', label: 'Schedule', icon: '📆' },

];

const BOTTOM_ITEMS = [
  { key: 'settings', label: 'Settings', icon: icons.settings },
  { key: 'support', label: 'Support', icon: icons.support },
];

// ── NavItem Component ─────────────────────────────────────────────────────────
function NavItem({ item, isActive, onPress, collapsed }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
 const bgAnim = useRef(new Animated.Value(0)).current;
useEffect(() => {
  return () => {
    bgAnim.stopAnimation();
    scaleAnim.stopAnimation();
    bgAnim.setValue(0);     // ✅ reset
    scaleAnim.setValue(1);  // ✅ reset
  };
}, []);

useEffect(() => {
  const animation = Animated.timing(bgAnim, {
    toValue: isActive ? 1 : 0,
    duration: 200,
    useNativeDriver: false,
  });

  animation.start();

  return () => {
    animation.stop(); // ✅ important cleanup
  };
}, [isActive]);

const handlePressIn = () => {
  scaleAnim.stopAnimation(); // ✅ ADD THIS
  Animated.spring(scaleAnim, {
    toValue: 0.94,
    useNativeDriver: true,
  }).start();
};

const handlePressOut = () => {
  scaleAnim.stopAnimation(); // ✅ ADD THIS
  Animated.spring(scaleAnim, {
    toValue: 1,
    useNativeDriver: true,
  }).start();
};

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.12)'],
  });

  return (
    <TouchableOpacity
      onPress={() => onPress(item.key)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      accessibilityLabel={item.label}
      accessibilityRole="button"
    >
      <Animated.View
        style={[
          styles.navItem,
          collapsed && styles.navItemCollapsed,
          {
            backgroundColor: bgColor,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
        {!collapsed && (
          <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
            {item.label}
          </Text>
        )}
        {isActive && !collapsed && <View style={styles.activePill} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Sidebar Content ───────────────────────────────────────────────────────────
function SidebarContent({ activeKey, onNavPress, collapsed, onToggleCollapse, onNewSession, onLogoutPress }) {
  return (
    <View style={styles.sidebarInner}>
      {/* Header */}
      <View style={[styles.header, collapsed && styles.headerCollapsed]}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>{icons.logo}</Text>
        </View>
        {!collapsed && (
          <View style={styles.brandText}>
            <Text style={styles.brandTitle}>UniVerse</Text>
            
          </View>
        )}
        {IS_TABLET && (
          <TouchableOpacity
            onPress={onToggleCollapse}
            style={styles.collapseBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.collapseBtnText}>{collapsed ? '›' : '‹'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* Main Nav */}
      <View style={styles.navSection}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            isActive={activeKey === item.key}
            onPress={onNavPress}
            collapsed={collapsed}
          />
        ))}
      </View>

      <View style={styles.flex1} />

      {/* New Session CTA */}
     

      <View style={styles.divider} />

      {/* Bottom Nav */}
      <View style={styles.navSection}>
        {BOTTOM_ITEMS.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            isActive={activeKey === item.key}
            onPress={onNavPress}
            collapsed={collapsed}
          />
        ))}
      </View>

      {/* User Badge */}
      {!collapsed && (
        <TouchableOpacity onPress={onLogoutPress} activeOpacity={0.7}>
          <View style={styles.userBadge}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>AT</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Dr. Aris Thorne</Text>
              <Text style={styles.userRole}>Tap to logout</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Mobile Drawer Overlay ─────────────────────────────────────────────────────
function MobileDrawer({ visible, activeKey, onNavPress, onClose, onNewSession, onLogoutPress }) {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: visible ? 0 : -SIDEBAR_WIDTH,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }),
      Animated.timing(overlayAnim, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View
        style={[styles.overlay, { opacity: overlayAnim }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      <Animated.View
        style={[styles.mobileDrawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <SafeAreaView style={styles.flex1}>
          <SidebarContent
            activeKey={activeKey}
            onNavPress={(key) => { onNavPress(key); onClose(); }}
            collapsed={false}
            onToggleCollapse={() => {}}
            onNewSession={() => { onNewSession(); onClose(); }}
            onLogoutPress={() => { onLogoutPress(); onClose(); }}
          />
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

// ── Mobile Bottom Bar ─────────────────────────────────────────────────────────
function MobileBottomBar({ activeKey, onNavPress, onMenuPress }) {
  const visibleItems = NAV_ITEMS.slice(0, 4);

  return (
    <View style={styles.bottomBar}>
      {visibleItems.map((item) => {
        const isActive = activeKey === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.bottomBarItem}
            onPress={() => onNavPress(item.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.bottomBarIconWrap, isActive && styles.bottomBarIconActive]}>
              <Text style={styles.bottomBarIcon}>{item.icon}</Text>
            </View>
            <Text style={[styles.bottomBarLabel, isActive && styles.bottomBarLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.bottomBarItem} onPress={onMenuPress} activeOpacity={0.7}>
        <View style={styles.bottomBarIconWrap}>
          <Text style={styles.bottomBarIcon}>{icons.menu}</Text>
        </View>
        <Text style={styles.bottomBarLabel}>More</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function TeacherSidebar({ navigation }) {
  const [activeKey, setActiveKey] = useState('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleNewSession = () => {
    console.log('New session triggered');
  };

  const handleLogout = () => {
    navigation?.replace('Login');
  };

  const renderContent = () => {
    switch (activeKey) {
      case 'dashboard':
        return <Dashboardpage />;
      case 'attendance marking':
        return <Attendancebatch />;
      case 'notes':
        return <Notes />;
      case 'test':
        return <Test />;
      case 'teacher attendance':
        return <Teacherattendance/>
      case 'marks entry':
        return <Marksbatch />
      case 'schedule':
        return <Schedule />
      default:
        return <Dashboardpage />;
    }
  };

  // ── TABLET / LAPTOP LAYOUT ──────────────────────────────────────────────────
  if (IS_TABLET) {
    return (
      <SafeAreaView style={styles.tabletRoot}>
        <StatusBar barStyle="light-content" backgroundColor="#1a2744" animated={false} />

        {/* Fixed Sidebar */}
        <Animated.View style={[styles.sidebar, collapsed && styles.sidebarCollapsed]}>
          <SidebarContent
            activeKey={activeKey}
            onNavPress={setActiveKey}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            onNewSession={handleNewSession}
            onLogoutPress={handleLogout}
          />
        </Animated.View>

        {/* ✅ FIX: mainContent must allow its children to scroll on web.
            On web, flex:1 inside a flex row doesn't scroll by default —
            we need overflow:'hidden' on the container so the child ScrollView
            gets the correct height and can scroll independently. */}
        <View style={styles.mainContent}>
          {renderContent()}
        </View>
      </SafeAreaView>
    );
  }

  // ── MOBILE LAYOUT ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.mobileRoot}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f6fb" animated={false} />

      {/* Top Header Bar */}
      <View style={styles.mobileHeader}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} activeOpacity={0.7}>
          <Text style={styles.menuIconText}>{icons.menu}</Text>
        </TouchableOpacity>
        <View style={styles.mobileHeaderBrand}>
          <Text style={styles.logoIcon}>🎓</Text>
          <Text style={styles.mobileHeaderTitle}>UniVerse</Text>
        </View>
        <View style={styles.avatarCircleSmall}>
          <Text style={styles.avatarInitialsSmall}>AT</Text>
        </View>
      </View>

      {/* ✅ FIX: mobileMainContent needs flex:1 + overflow:hidden so child pages scroll */}
      <View style={styles.mobileMainContent}>
        {renderContent()}
      </View>

      {/* Bottom Navigation Bar */}
     

      {/* Slide-out Drawer */}
      <MobileDrawer
        visible={drawerOpen}
        activeKey={activeKey}
        onNavPress={setActiveKey}
        onClose={() => setDrawerOpen(false)}
        onNewSession={handleNewSession}
        onLogoutPress={handleLogout}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const SIDEBAR_BG = '#1a2744';
const ACCENT = '#4ecdc4';
const ACCENT_DARK = '#38b2ac';
const TEXT_PRIMARY = '#ffffff';
const TEXT_MUTED = 'rgba(255,255,255,0.55)';
const DIVIDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  flex1: { flex: 1 },

  // ── Tablet ────────────────────────────────────────────────────────────────
  tabletRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f6fb',
    // ✅ FIX: overflow hidden on the root row so each child can scroll independently
    
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: SIDEBAR_BG,
    // ✅ FIX: sidebar should not scroll horizontally or stretch on web
    ...(IS_WEB
      ? { boxShadow: '4px 0px 16px rgba(0,0,0,0.18)', flexShrink: 0 }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 12,
        }),
  },
  sidebarCollapsed: {
    width: 72,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    // ✅ KEY FIX: This is the most important fix for web scrolling.
    // Without overflow:'hidden', the flex child expands to fit all content
    // and the inner ScrollView never gets a bounded height to scroll within.
    
  },

  // ── Sidebar Inner ─────────────────────────────────────────────────────────
  sidebarInner: {
    flex: 1,
    paddingVertical: 8,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 10,
  },
  headerCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(78,205,196,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: { fontSize: 20 },
  brandText: { flex: 1 },
  brandTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: ACCENT,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: -2,
  },
  collapseBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapseBtnText: {
    color: TEXT_MUTED,
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Divider ───────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: DIVIDER,
    marginHorizontal: 16,
    marginVertical: 6,
  },

  // ── Nav Items ─────────────────────────────────────────────────────────────
  navSection: {
    paddingHorizontal: 10,
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 12,
    position: 'relative',
    marginVertical: 1,
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    gap: 0,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: ACCENT,
  },
  iconText: { fontSize: 14 },
  navLabel: {
    fontSize: 13.5,
    color: TEXT_MUTED,
    fontWeight: '500',
    flex: 1,
  },
  navLabelActive: {
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
  activePill: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: ACCENT,
    position: 'absolute',
    right: -10,
  },

  // ── New Session ───────────────────────────────────────────────────────────
  newSessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: ACCENT,
    gap: 10,
    ...(IS_WEB
      ? { boxShadow: '0px 4px 10px rgba(78,205,196,0.35)' }
      : {
          shadowColor: ACCENT,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 6,
        }),
  },
  newSessionBtnCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    gap: 0,
  },
  newSessionIcon: {
    fontSize: 18,
    color: '#1a2744',
    fontWeight: '800',
  },
  newSessionLabel: {
    fontSize: 13.5,
    color: '#1a2744',
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // ── User Badge ────────────────────────────────────────────────────────────
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#1a2744',
    fontSize: 13,
    fontWeight: '800',
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 12.5,
    color: TEXT_PRIMARY,
    fontWeight: '600',
  },
  userRole: {
    fontSize: 11,
    color: TEXT_MUTED,
  },

  // ── Mobile ────────────────────────────────────────────────────────────────
  mobileRoot: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    // ✅ FIX: Same overflow fix for mobile web layout
  
  },
  mobileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ecf4',
    gap: 12,
  },
  menuIconText: {
    fontSize: 22,
    color: '#1a2744',
  },
  mobileHeaderBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  mobileHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a2744',
  },
  avatarCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitialsSmall: {
    color: '#1a2744',
    fontSize: 11,
    fontWeight: '800',
  },
  // ✅ FIX: mobileMainContent needs overflow hidden so inner ScrollViews work
  mobileMainContent: {
    flex: 1,
   
  },

  // ── Bottom Bar ────────────────────────────────────────────────────────────
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8ecf4',
    paddingBottom: Platform.OS === 'ios' ? 20 : 4,
    paddingTop: 4,
    ...(IS_WEB
      ? { boxShadow: '0px -4px 12px rgba(0,0,0,0.06)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 10,
        }),
  },
  bottomBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  bottomBarIconWrap: {
    width: 40,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarIconActive: {
    backgroundColor: 'rgba(78,205,196,0.15)',
  },
  bottomBarIcon: { fontSize: 18 },
  bottomBarLabel: {
    fontSize: 10,
    color: '#8892a4',
    marginTop: 2,
    fontWeight: '500',
  },
  bottomBarLabelActive: {
    color: ACCENT_DARK,
    fontWeight: '700',
  },

  // ── Mobile Drawer ─────────────────────────────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,18,40,0.55)',
  },
  mobileDrawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: SIDEBAR_BG,
    ...(IS_WEB
      ? { boxShadow: '6px 0px 20px rgba(0,0,0,0.25)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 6, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 20,
        }),
  },
});