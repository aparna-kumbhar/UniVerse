import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import EduPortalDashboard from './dashboardpage';
import Profile from '../Profile/profile';
import Attendance from '../Attendance/Attendance';
import Result from '../Result/score';   
import Finance from '../Finance/finance'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive: sidebar wider on tablet/laptop
const IS_TABLET = SCREEN_WIDTH >= 768;
const IS_MOBILE = SCREEN_WIDTH < 768;
const SIDEBAR_WIDTH = IS_TABLET ? 280 : 240;  
const ANDROID_STATUSBAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '⊞' },
  { id: 'attendance', label: 'Attendance', icon: '📅' },
  { id: 'result',     label: 'Result',     icon: '📊' },
  { id: 'finance',    label: 'Finance',    icon: '💳' },
  { id: 'profile',    label: 'Profile',    icon: '👤' },
];

// ─── Hamburger Icon Component (animated bars → X) ────────────────────────────
const HamburgerIcon = ({ isOpen, color = '#1a1a2e' }) => {
  const topBar    = useRef(new Animated.Value(0)).current;
  const middleBar = useRef(new Animated.Value(1)).current;
  const bottomBar = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(topBar,    { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(middleBar, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(bottomBar, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(topBar,    { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(middleBar, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(bottomBar, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [isOpen]);

  const topRotate      = topBar.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });
  const topTranslateY  = topBar.interpolate({ inputRange: [0, 1], outputRange: [0, 7] });
  const bottomRotate   = bottomBar.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-45deg'] });
  const bottomTranslateY = bottomBar.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });

  return (
    <View style={hamburgerStyles.container}>
      <Animated.View
        style={[
          hamburgerStyles.bar,
          { backgroundColor: color },
          { transform: [{ translateY: topTranslateY }, { rotate: topRotate }] },
        ]}
      />
      <Animated.View
        style={[hamburgerStyles.bar, { backgroundColor: color }, { opacity: middleBar }]}
      />
      <Animated.View
        style={[
          hamburgerStyles.bar,
          { backgroundColor: color },
          { transform: [{ translateY: bottomTranslateY }, { rotate: bottomRotate }] },
        ]}
      />
    </View>
  );
};

const hamburgerStyles = StyleSheet.create({
  container: { width: 24, height: 18, justifyContent: 'space-between' },
  bar:       { width: 24, height: 2.5, borderRadius: 2 },
});

// ─── Sidebar Panel (shared content) ──────────────────────────────────────────
const SidebarPanel = ({ activeItem, onItemPress, onClose, isMobile }) => (
  <View style={sidebarStyles.sidebar}>

    {/* Student Profile Section */}
    <SafeAreaView style={{ flex: 0 }}>
      <View style={sidebarStyles.profileSection}>
        <View style={sidebarStyles.avatarContainer}>
          <View style={sidebarStyles.avatarPlaceholder}>
            <Text style={sidebarStyles.avatarInitials}>AM</Text>
          </View>
          <View style={sidebarStyles.onlineDot} />
        </View>
        <View style={sidebarStyles.profileInfo}>
          <Text style={sidebarStyles.profileName}>Arjun Mercer</Text>
          <Text style={sidebarStyles.profileGrade}>Grade 10-B</Text>
        </View>

        {/* Close button — only on mobile */}
        {isMobile && (
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            style={sidebarStyles.closeBtn}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <Text style={sidebarStyles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>

    {/* Divider */}
    <View style={sidebarStyles.divider} />

    {/* Navigation Items */}
    <ScrollView
      style={sidebarStyles.navSection}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 4 }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeItem === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[sidebarStyles.navItem, isActive && sidebarStyles.navItemActive]}
            activeOpacity={0.7}
            onPress={() => onItemPress(item.id)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive }}
          >
            {isActive && <View style={sidebarStyles.activeIndicator} />}
            <View style={[sidebarStyles.iconContainer, isActive && sidebarStyles.iconContainerActive]}>
              <Text style={sidebarStyles.navIcon}>{item.icon}</Text>
            </View>
            <Text style={[sidebarStyles.navLabel, isActive && sidebarStyles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>

    {/* Footer */}
    <View style={sidebarStyles.footer}>
      <View style={sidebarStyles.divider} />
      <Text style={sidebarStyles.footerText}>EduPortal v2.4.1</Text>
    </View>
  </View>
);

const sidebarStyles = StyleSheet.create({
  sidebar: {
    flex:             1,
    width:            SIDEBAR_WIDTH,
    backgroundColor:  '#ffffff',
    paddingTop:       Platform.select({ ios: 52, android: (StatusBar.currentHeight || 0) + 16, default: 24 }),
    paddingBottom:    20,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f7',
  },
  profileSection: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: 20,
    paddingBottom:  14,
  },
  avatarContainer: {
    position:  'relative',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width:           46,
    height:          46,
    borderRadius:    12,
    backgroundColor: '#ede9fe',
    alignItems:      'center',
    justifyContent:  'center',
  },
  avatarInitials: {
    fontSize:   16,
    fontWeight: '700',
    color:      '#5b5bd6',
  },
  onlineDot: {
    position:        'absolute',
    bottom:          0,
    right:           0,
    width:           11,
    height:          11,
    borderRadius:    6,
    backgroundColor: '#22c55e',
    borderWidth:     2,
    borderColor:     '#fff',
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize:      IS_TABLET ? 16 : 14,
    fontWeight:    '700',
    color:         '#0f0f23',
    letterSpacing: -0.3,
  },
  profileGrade: {
    fontSize:   12,
    color:      '#9999b3',
    marginTop:  2,
    fontWeight: '500',
  },
  closeBtn: {
    width:           34,
    height:          34,
    borderRadius:    8,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: '#f3f0ff',
    marginLeft:      6,
  },
  closeBtnText: {
    fontSize:   14,
    color:      '#6b7280',
    fontWeight: '600',
  },
  divider: {
    height:           1,
    backgroundColor:  '#f0f0f7',
    marginVertical:   12,
    marginHorizontal: 20,
  },
  navSection: {
    flex:             1,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius:   12,
    marginBottom:   4,
    position:       'relative',
    overflow:       'hidden',
  },
  navItemActive:        { backgroundColor: '#f0f0fd' },
  activeIndicator: {
    position:        'absolute',
    left:            0,
    top:             '20%',
    bottom:          '20%',
    width:           3.5,
    backgroundColor: '#5b5bd6',
    borderRadius:    2,
  },
  iconContainer: {
    width:           34,
    height:          34,
    borderRadius:    9,
    backgroundColor: '#f5f5fa',
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     12,
  },
  iconContainerActive: { backgroundColor: '#ddddf8' },
  navIcon:             { fontSize: 16 },
  navLabel: {
    fontSize:   IS_TABLET ? 15 : 14,
    fontWeight: '500',
    color:      '#6e6e8a',
    letterSpacing: 0.1,
  },
  navLabelActive: { color: '#3d3dbd', fontWeight: '700' },
  footer:         { paddingBottom: 24 },
  footerText: {
    textAlign:  'center',
    fontSize:   11,
    color:      '#c0c0d8',
    fontWeight: '500',
  },
});

function ParentDashboardShell() {
  const [activeItem,    setActiveItem]    = useState('dashboard');
  const [modalVisible,  setModalVisible]  = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // Animation values — slide from left
  const slideX   = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Open drawer ─────────────────────────────────────────────────────────
  const openDrawer = () => {
    setModalVisible(true);
    setHamburgerOpen(true);
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(slideX, {
          toValue:         0,
          tension:         65,
          friction:        11,
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

  // ── Close drawer ────────────────────────────────────────────────────────
  const closeDrawer = (afterClose) => {
    setHamburgerOpen(false);
    Animated.parallel([
      Animated.timing(slideX, {
        toValue:         -SIDEBAR_WIDTH,
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

  const handleNavItem = (id) => {
    setActiveItem(id);
    if (IS_MOBILE) closeDrawer();
  };

  const renderActiveContent = () => {
    if (activeItem === 'profile') {
      return <Profile />;
    } else
    if (activeItem === 'attendance') {
      return <Attendance />;
    } else
    if (activeItem === 'result') {
      return <Result />;
    } else
    if (activeItem === 'finance') {
      return <Finance />;
    }

    return <EduPortalDashboard />;
  };
  // ══════════════════════════════════════════════
  // MOBILE — hamburger + animated modal drawer
  // ══════════════════════════════════════════════
  if (IS_MOBILE) {
    return (
      <View style={shellStyles.container}>

        {/* Top bar */}
        <SafeAreaView style={shellStyles.topBarSafeArea}>
          <View style={shellStyles.topBar}>
            <TouchableOpacity
              style={shellStyles.hamburgerButton}
              onPress={openDrawer}
              activeOpacity={0.75}
              accessibilityLabel="Open navigation menu"
              accessibilityRole="button"
            >
              <HamburgerIcon isOpen={hamburgerOpen} color="#1a1a2e" />
            </TouchableOpacity>
            <Text style={shellStyles.topBarTitle}>UniVerse</Text>
          </View>
        </SafeAreaView>

        {/* Page content */}
        <View style={shellStyles.stackContainer}>
          {renderActiveContent()}
        </View>

        {/* Animated left-slide drawer */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={() => closeDrawer()}
        >
          {/* Dark overlay — tap to close */}
          <Animated.View
            style={[StyleSheet.absoluteFill, shellStyles.overlay, { opacity: fadeAnim }]}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeDrawer()}
              accessibilityLabel="Close menu"
            />
          </Animated.View>

          {/* Panel slides in from the left: translateX: -SIDEBAR_WIDTH → 0 */}
          <Animated.View
            style={[shellStyles.drawerContainer, { transform: [{ translateX: slideX }] }]}
          >
            <SidebarPanel
              activeItem={activeItem}
              onItemPress={handleNavItem}
              onClose={() => closeDrawer()}
              isMobile
            />
          </Animated.View>
        </Modal>

      </View>
    );
  }

  // ══════════════════════════════════════════════
  // DESKTOP/TABLET — always-visible sidebar
  // ══════════════════════════════════════════════
  return (
    <View style={[shellStyles.container, { flexDirection: 'row' }]}>

      {/* Persistent sidebar */}
      <SidebarPanel
        activeItem={activeItem}
        onItemPress={handleNavItem}
        isMobile={false}
      />

      {/* Main content */}
      <View style={{ flex: 1 }}>
        <SafeAreaView style={shellStyles.topBarSafeArea}>
          <View style={shellStyles.topBar}>
            <Text style={shellStyles.topBarTitle}>Parent Portal</Text>
          </View>
        </SafeAreaView>

        <View style={shellStyles.stackContainer}>
          {renderActiveContent()}
        </View>
      </View>

    </View>
  );
}

export default function ParentDashboardStack() {
  return <ParentDashboardShell />;
}


// ─── Shell Styles ─────────────────────────────────────────────────────────────
const shellStyles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: '#f6f6fb',
  },
  topBarSafeArea: {
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection:     'row',
    alignItems:        'flex-end',
    paddingHorizontal: 16,
    paddingTop:        Platform.OS === 'android' ? ANDROID_STATUSBAR_HEIGHT + 8 : 18,
    paddingBottom:     14,
    backgroundColor:   '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F7',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 4 },
      web:     { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    }),
  },
  hamburgerButton: {
    width:           44,
    height:          44,
    borderRadius:    12,
    backgroundColor: '#f0f0fd',
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     12,
    marginBottom:    2,
  },
  topBarTitle: {
    fontSize:   28,
    fontWeight: '900',
    color:      '#5B52E5',
      letterSpacing: -0.1,
      margineBottom: 5,
  },
  stackContainer: { flex: 1 },

  // Backdrop overlay
  overlay: {
    backgroundColor: 'rgba(15, 15, 35, 0.55)',
    zIndex: 1,
  },

  // Animated drawer panel
  drawerContainer: {
    position: 'absolute',
    top:      0,
    left:     0,
    bottom:   0,
    width:    SIDEBAR_WIDTH,
    zIndex:   2,
    ...Platform.select({
      ios:     { shadowColor: '#5b5bd6', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.18, shadowRadius: 20 },
      android: { elevation: 20 },
      web:     { boxShadow: '4px 0 24px rgba(91,91,214,0.15)' },
    }),
  },
});
