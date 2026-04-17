import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar, Dimensions,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import TeacherSidebar from '../Teacher/Dashboard/TeacherSidebar';
import AdminSidebar from '../Admin/Dashboard/AdminSidebar';
import CommitteSidebar from '../Committe/Dashboard/CommitteSidebar';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const TEACHER_CREDENTIALS = { email: '123', password: '123' };
const ADMIN_CREDENTIALS   = { email: '1234', password: '1234' };
const COMMITTE_CREDENTIALS = { email: '12345', password: '12345' };

const LoginStack = createStackNavigator();

// ─── Login form ───────────────────────────────────────────────────────────────
function LoginScreen({ navigation }) {
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [emailFocused,    setEmailFocused]    = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [signInPressed,   setSignInPressed]   = useState(false);
  const [error,           setError]           = useState('');

  const handleSignIn = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    if (email === TEACHER_CREDENTIALS.email && password === TEACHER_CREDENTIALS.password) {
      navigation.replace('TeacherDashboard');
    } else if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      navigation.replace('AdminDashboard');
    } else if (email === COMMITTE_CREDENTIALS.email && password === COMMITTE_CREDENTIALS.password) {
      navigation.replace('CommitteDashboard');
    } else {
      setError('Invalid email or password');
      setPassword('');
    }
  };

  const handleForgotPassword  = () => console.log('Forgot password tapped');
  const handleJoinCollective  = () => console.log('Join the Collective tapped');

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#EEF3F5" animated={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.header}>
          <Text style={styles.brandTitle}>UniVerse</Text>
          <Text style={styles.brandSubtitle}>THE DIGITAL ATELIER</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back...!</Text>
            <Text style={styles.welcomeSubtext}>
              Please enter your credentials to access the curriculum.
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>USERNAME OR EMAIL</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="curator@atelier.edu"
              placeholderTextColor="#B0BEC5"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.passwordRow}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.6}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, passwordFocused && styles.inputFocused]}
              placeholder="••••••••"
              placeholderTextColor="#B0BEC5"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.signInButton, signInPressed && styles.signInButtonPressed]}
            onPress={handleSignIn}
            onPressIn={() => setSignInPressed(true)}
            onPressOut={() => setSignInPressed(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.signInText}>Sign In  →</Text>
          </TouchableOpacity>

          <View style={styles.joinSection}>
            <Text style={styles.joinText}>New to the atelier?{' '}</Text>
            <TouchableOpacity onPress={handleJoinCollective} activeOpacity={0.6}>
              <Text style={styles.joinLink}>Join the Collective</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 THE ACADEMIC CURATOR • PRIVATE INSTITUTION
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Root navigator — single stack, no nested containers ─────────────────────
export default function Login() {
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }}>
      {/* ✅ Unique screen name — avoids "same name nested" warning */}
      <LoginStack.Screen name="LoginScreen"      component={LoginScreen} />
      <LoginStack.Screen name="TeacherDashboard" component={TeacherSidebar} />
      <LoginStack.Screen name="AdminDashboard"   component={AdminSidebar} />
      <LoginStack.Screen name="CommitteDashboard" component={CommitteSidebar} />
    </LoginStack.Navigator>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const cardMaxWidth = isWeb ? 480 : undefined;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#EEF3F5',
    ...(isWeb && { minHeight: '100vh' }),
  },
  scrollView: {
    flex: 1,
    ...(isWeb && { overflow: 'auto' }),
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: isWeb ? 24 : 20,
    paddingTop: isWeb ? 60 : 50,
    paddingBottom: 32,
    backgroundColor: '#EEF3F5',
  },
  header: {
    alignItems: 'center',
    marginBottom: isWeb ? 48 : 36,
    width: '100%',
    maxWidth: cardMaxWidth,
  },
  brandTitle: {
    fontSize: isWeb ? 42 : 34,
    fontWeight: '800',
    color: '#1A2F5A',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, "Times New Roman", serif',
    }),
    letterSpacing: -0.5,
    lineHeight: isWeb ? 52 : 42,
  },
  brandSubtitle: {
    marginTop: 8,
    fontSize: isWeb ? 13 : 11,
    fontWeight: '500',
    color: '#8A9BB0',
    letterSpacing: 4,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Helvetica Neue',
      android: 'sans-serif',
      web: '"Helvetica Neue", Arial, sans-serif',
    }),
  },
  card: {
    width: '100%',
    maxWidth: cardMaxWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: isWeb ? 40 : 24,
    paddingTop: isWeb ? 40 : 32,
    paddingBottom: isWeb ? 36 : 28,
    ...(isWeb
      ? { boxShadow: '0px 4px 20px rgba(26, 47, 90, 0.08)' }
      : {
          shadowColor: '#1A2F5A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 4,
        }),
  },
  welcomeSection: { marginBottom: 28 },
  welcomeTitle: {
    fontSize: isWeb ? 28 : 24,
    fontWeight: '700',
    color: '#1A2F5A',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
    }),
  },
  welcomeSubtext: {
    fontSize: isWeb ? 15 : 14,
    color: '#5A6E85',
    lineHeight: isWeb ? 24 : 22,
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: '"Courier New", Courier, monospace',
    }),
  },
  fieldGroup: { marginBottom: 20 },
  fieldLabel: {
    fontSize: isWeb ? 11 : 10,
    fontWeight: '600',
    color: '#8A9BB0',
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Helvetica Neue',
      android: 'sans-serif',
      web: '"Helvetica Neue", Arial, sans-serif',
    }),
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F4F7F9',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8EDF2',
    paddingHorizontal: 18,
    paddingVertical: isWeb ? 16 : 14,
    fontSize: isWeb ? 15 : 14,
    color: '#1A2F5A',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: '"Courier New", Courier, monospace',
    }),
    ...(isWeb && { outlineStyle: 'none' }),
  },
  inputFocused: {
    borderColor: '#2E6DA4',
    backgroundColor: '#FAFCFF',
  },
  forgotText: {
    fontSize: isWeb ? 13 : 12,
    color: '#2E9E7A',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: '"Courier New", Courier, monospace',
    }),
    letterSpacing: 0.3,
  },
  signInButton: {
    backgroundColor: '#1A2F5A',
    borderRadius: 14,
    paddingVertical: isWeb ? 18 : 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 28,
    ...(isWeb
      ? { boxShadow: '0px 4px 10px rgba(26, 47, 90, 0.3)' }
      : {
          shadowColor: '#1A2F5A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5,
        }),
  },
  signInButtonPressed: {
    backgroundColor: '#122248',
    transform: [{ scale: 0.985 }],
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: isWeb ? 16 : 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
    }),
  },
  joinSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  joinText: {
    fontSize: isWeb ? 14 : 13,
    color: '#1A2F5A',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: '"Courier New", Courier, monospace',
    }),
  },
  joinLink: {
    fontSize: isWeb ? 14 : 13,
    color: '#2E6DA4',
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: '"Courier New", Courier, monospace',
    }),
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: isWeb ? 11 : 10,
    color: '#8A9BB0',
    letterSpacing: 1.5,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Helvetica Neue',
      android: 'sans-serif',
      web: '"Helvetica Neue", Arial, sans-serif',
    }),
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  errorText: {
    fontSize: isWeb ? 13 : 12,
    color: '#C62828',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      web: '"Courier New", Courier, monospace',
    }),
  },
});