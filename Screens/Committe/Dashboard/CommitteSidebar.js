
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, SafeAreaView,
  ScrollView, StatusBar, Platform,
} from 'react-native';
import Maindashboard from './Maindashboard';

// ─── constants ───────────────────────────────────────────────────────────────
const { width: SCREEN_W } = Dimensions.get('window');
const SIDEBAR_W = 220;
const IS_LAPTOP = SCREEN_W >= 1024;

const NAV_ITEMS = [
  { key: 'Dashboard',    icon: '▦' },
  { key: 'Analytics',    icon: '▶' },
  { key: 'Institutes',   icon: '▣' },
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

          {/* Download */}
          <TouchableOpacity style={s.downloadBtn}>
            <Text style={s.downloadText}>↓  Download Data</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

// ─── layout wrapper (wraps nav + sidebar) ─────────────────────────────────────
const CommitteSidebar = () => {
  const [activeRoute, setActiveRoute] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(IS_LAPTOP);
  const slideAnim = useRef(new Animated.Value(IS_LAPTOP ? 1 : 0)).current;

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
            style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          >
            <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={s.headerTitle}>Committee Dashboard</Text>
      </View>

      {/* Content + Sidebar */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          {activeRoute === 'Dashboard' ? (
            <Maindashboard />
          ) : (
            <PlaceholderScreen route={{ name: activeRoute }} />
          )}
        </View>

        {/* Sidebar rendered on top of content */}
        {(sidebarOpen || IS_LAPTOP) && (
          <Sidebar
            navigation={{
              navigate: (key) => {
                setActiveRoute(key);
                if (!IS_LAPTOP) closeSidebar();
              },
            }}
            activeRoute={activeRoute}
            slideAnim={slideAnim}
            onClose={closeSidebar}
          />
        )}
      </View>
    </View>
  );
};

export default CommitteSidebar;

// ─── styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:          { flex: 1, flexDirection: 'column' },
  screen:        { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F9' },
  screenTitle:   { fontSize: 28, fontWeight: '600', color: '#1a2744' },
  screenSub:     { fontSize: 15, color: '#888', marginTop: 6 },

  header:        { backgroundColor: '#1a2744', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 56, elevation: 0, shadowOpacity: 0 },
  headerTitle:   { fontSize: 16, fontWeight: '500', color: '#fff', marginLeft: 12 },

  overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 10 },

  sidebar:       { backgroundColor: '#1a2744', width: SIDEBAR_W, zIndex: 20 },
  sidebarLaptop: { position: 'relative' },
  sidebarMobile: { position: 'absolute', top: 0, bottom: 0, left: 0 },

  brand:         { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.12)' },
  brandTitle:    { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 1.2 },
  brandSub:      { color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: 1, marginTop: 2 },

  navItem:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, position: 'relative' },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.08)' },
  navIcon:       { fontSize: 14, color: 'rgba(255,255,255,0.45)', width: 22 },
  navIconActive: { color: '#4fc3a1' },
  navLabel:      { fontSize: 11, letterSpacing: 1.1, color: 'rgba(255,255,255,0.55)', fontWeight: '500' },
  navLabelActive:{ color: '#fff' },
  activeBar:     { position: 'absolute', right: 0, top: 8, bottom: 8, width: 3, backgroundColor: '#4fc3a1', borderRadius: 2 },

  downloadBtn:   { margin: 16, padding: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  downloadText:  { color: '#fff', fontSize: 13 },
});