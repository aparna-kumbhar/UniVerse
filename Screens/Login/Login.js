import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [signInPressed, setSignInPressed] = useState(false);

  const handleSignIn = () => {
    console.log('Sign in with:', email, password);
    // Add your authentication logic here
  };

  const handleForgotPassword = () => {
    console.log('Forgot password tapped');
  };

  const handleJoinCollective = () => {
    console.log('Join the Collective tapped');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#EEF3F5" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>The Academic Curator</Text>
          <Text style={styles.brandSubtitle}>THE DIGITAL ATELIER</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSubtext}>
              Please enter your credentials to access the curriculum.
            </Text>
          </View>

          {/* Email Field */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>USERNAME OR EMAIL</Text>
            <TextInput
              style={[
                styles.input,
                emailFocused && styles.inputFocused,
              ]}
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

          {/* Password Field */}
          <View style={styles.fieldGroup}>
            <View style={styles.passwordRow}>
              <Text style={styles.fieldLabel}>PASSWORD</Text>
              <TouchableOpacity
                onPress={handleForgotPassword}
                activeOpacity={0.6}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                passwordFocused && styles.inputFocused,
              ]}
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

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.signInButton,
              signInPressed && styles.signInButtonPressed,
            ]}
            onPress={handleSignIn}
            onPressIn={() => setSignInPressed(true)}
            onPressOut={() => setSignInPressed(false)}
            activeOpacity={0.85}
          >
            <Text style={styles.signInText}>Sign In  →</Text>
          </TouchableOpacity>

          {/* Join Section */}
          <View style={styles.joinSection}>
            <Text style={styles.joinText}>New to the atelier?{' '}</Text>
            <TouchableOpacity
              onPress={handleJoinCollective}
              activeOpacity={0.6}
            >
              <Text style={styles.joinLink}>Join the Collective</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 THE ACADEMIC CURATOR • PRIVATE INSTITUTION
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const cardMaxWidth = isWeb ? 480 : undefined;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#EEF3F5',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: isWeb ? 24 : 20,
    paddingTop: isWeb ? 60 : 50,
    paddingBottom: 32,
    backgroundColor: '#EEF3F5',
  },

  // ─── Header ───────────────────────────────────────────────
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

  // ─── Card ─────────────────────────────────────────────────
  card: {
    width: '100%',
    maxWidth: cardMaxWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: isWeb ? 40 : 24,
    paddingTop: isWeb ? 40 : 32,
    paddingBottom: isWeb ? 36 : 28,
    shadowColor: '#1A2F5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  // ─── Welcome ──────────────────────────────────────────────
  welcomeSection: {
    marginBottom: 28,
  },
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

  // ─── Form Fields ──────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
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

  // ─── Sign In Button ───────────────────────────────────────
  signInButton: {
    backgroundColor: '#1A2F5A',
    borderRadius: 14,
    paddingVertical: isWeb ? 18 : 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 28,
    shadowColor: '#1A2F5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
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

  // ─── Join Section ─────────────────────────────────────────
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

  // ─── Footer ───────────────────────────────────────────────
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
});