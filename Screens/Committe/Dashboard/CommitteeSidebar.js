import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, SafeAreaView,
  ScrollView, StatusBar, Platform,
} from 'react-native';
import Maindashboard from './Maindashboard';
import Permissions from '../Permissions/Permission';
import AddInstitute from '../AddInstitute/AddInstitute';
import Register from '../AddInstitute/Register';

// ─── constants ───────────────────────────────────────────────────────────────
const { width: SCREEN_W } = Dimensions.get('window');
const SIDEBAR_W = 280;
const IS_LAPTOP = SCREEN_W >= 1024;

const NAV_ITEMS = [
  { key: 'Dashboard',    icon: '▦' },
  { key: 'Add Institutes',   icon: '▣' },
  { key: 'Permissions', icon: '⊞' },
  { key: 'Registration', icon: '⊞' },
  { key: 'Settings',     icon: '⚙' },
];

// ─── placeholder screens ──────────────────────────────────────────────────────
const PlaceholderScreen = ({ route }) => (
  <View style={s.screen}>
    <Text style={s.screenTitle}>{route.name}</Text>
    <Text style={s.screenSub}>Module content goes here.</Text>
  </View>
);

// ─── sidebar component ────────────────────────────────────────────────────────
const Sidebar = ({ navigation, activeRoute, slideAnim, onClose }) => {
  const translate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SIDEBAR_W, 0],
  });

  const handleNav = (key) => {
    navigation.navigate(key);
    if (!IS_LAPTOP) onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!IS_LAPTOP && (
        <Animated.View
          style={[s.overlay, { opacity: slideAnim }]}
          pointerEvents={'auto'}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
      )}

      <Animated.View
        style={[
          s.sidebar,
          IS_LAPTOP ? s.sidebarLaptop : s.sidebarMobile,
          IS_LAPTOP ? null : { transform: [{ translateX: translate }] },
        ]}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* Brand */}
          <View style={s.brand}>
            <Text style={s.brandTitle}>CURATOR ADMIN</Text>
            <Text style={s.brandSub}>EXECUTIVE PORTAL</Text>
          </View>

          {/* Nav items */}
          <ScrollView style={{ flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const active = activeRoute === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[s.navItem, active && s.navItemActive]}
                  activeOpacity={0.7}
                  onPress={() => handleNav(item.key)}
                >
                  <Text style={[s.navIcon, active && s.navIconActive]}>
                    {item.icon}
                  </Text>
                  <Text style={[s.navLabel, active && s.navLabelActive]}>
                    {item.key.toUpperCase()}
                  </Text>
                  {active && <View style={s.activeBar} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

        </SafeAreaView>
      </Animated.View>
    </>
  );
};

// ─── layout wrapper (wraps nav + sidebar) ─────────────────────────────────────
const CommitteSidebar = () => {
  const [activeRoute, setActiveRoute] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(IS_LAPTOP);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const slideAnim = useRef(new Animated.Value(IS_LAPTOP ? 1 : 0)).current;

  const handleRouteChange = (key) => {
    setActiveRoute(key);
    if (key !== 'Add Institutes') {
      setSelectedInstitute(null);
    }
  };

  const renderActiveContent = () => {
    switch (activeRoute) {
      case 'Dashboard':
        return (
          <Maindashboard
            onViewDirectory={() => setActiveRoute('Add Institutes')}
            onInstituteClick={(institute) => {
              setActiveRoute('Add Institutes');
              setSelectedInstitute(institute);
            }}
          />
        );
      case 'Add Institutes':
        return (
          <AddInstitute
            onInstituteClick={setSelectedInstitute}
            selectedInstitute={selectedInstitute}
          />
        );
      case 'Permissions':
        return <Permissions />;
      case 'Registration':
        return (
          <Register
            onSubmit={() => setActiveRoute('Add Institutes')}
            onCancel={() => setActiveRoute('Dashboard')}
          />
        );
      case 'Settings':
        return <PlaceholderScreen route={{ name: 'Settings' }} />;
      default:
        return <PlaceholderScreen route={{ name: activeRoute }} />;
    }
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(slideAnim, {
      toValue: 1, duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: 0, duration: 240,
      useNativeDriver: true,
    }).start(() => setSidebarOpen(false));
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        {!IS_LAPTOP && (
          <TouchableOpacity
            onPress={openSidebar}
            style={s.hamburgerBtn}
            activeOpacity={0.7}
          >
            <View style={s.hamburgerLine} />
            <View style={s.hamburgerLine} />
            <View style={s.hamburgerLine} />
          </TouchableOpacity>
        )}
        <Text style={s.headerTitle}>Committee Dashboard</Text>
      </View>

      {/* Content + Sidebar */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar */}
        {(sidebarOpen || IS_LAPTOP) && (
          <Sidebar
            navigation={{
              navigate: (key) => {
                handleRouteChange(key);
                if (!IS_LAPTOP) closeSidebar();
              },
            }}
            activeRoute={activeRoute}
            slideAnim={slideAnim}
            onClose={closeSidebar}
          />
        )}

        {/* Main content */}
        <View style={{ flex: 1 }}>
          {renderActiveContent()}
        </View>
      </View>
    </View>
  );
};

export default CommitteSidebar;

// ─── styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:          { flex: 1, flexDirection: 'column', backgroundColor: '#F4F6F9' },
  screen:        { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F9' },
  screenTitle:   { fontSize: 28, fontWeight: '600', color: '#1a2744' },
  screenSub:     { fontSize: 15, color: '#888', marginTop: 6 },

  // ── header (light theme) ──
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 14,
    paddingBottom: 14,
    height: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 56 : 70,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
    
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a2744',
    letterSpacing: 0.3,
    marginLeft: 12,
  },

  // ── hamburger (moved lower via paddingTop in header) ──
  hamburgerBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#1a2744',
    borderRadius: 2,
    marginVertical: 2,
  },

  overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 10 },

  // ── sidebar (light theme, wider) ──
  sidebar: {
    backgroundColor: '#FFFFFF',
    width: SIDEBAR_W,
    zIndex: 20,
    borderRightWidth: 1,
    borderRightColor: '#E8ECF0',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  sidebarLaptop: { position: 'relative' },
  sidebarMobile: { position: 'absolute', top: 0, bottom: 0, left: 0 },

  // ── brand ──
  brand: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
    backgroundColor: '#F8F9FB',
  },
  brandTitle:    { color: '#1a2744', fontSize: 14, fontWeight: '700', letterSpacing: 1.2 },
  brandSub:      { color: '#8A96A8', fontSize: 10, letterSpacing: 1, marginTop: 3 },

  // ── nav items ──
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 24,
    position: 'relative',
    marginHorizontal: 10,
    marginVertical: 2,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: '#EAF4FF',
  },
  navIcon:        { fontSize: 15, color: '#A0AAB8', width: 26 },
  navIconActive:  { color: '#2B6CB0' },
  navLabel:       { fontSize: 12, letterSpacing: 1, color: '#6B7A8F', fontWeight: '500' },
  navLabelActive: { color: '#1a2744', fontWeight: '700' },
  activeBar: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: '#2B6CB0',
    borderRadius: 2,
  },
});