import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login/Login';
import Sidebar from './Screens/Teacher/Dashboard/sidebar';

// Teacher credentials
const TEACHER_CREDENTIALS = {
  email: 'teacher@atelier.edu',
  password: 'Teacher123',
};

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email, password) => {
    // Validate credentials
    if (
      email === TEACHER_CREDENTIALS.email &&
      password === TEACHER_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {!isAuthenticated ? (
          // Login Stack
          <Stack.Screen
            name="Login"
            options={{
              animationTypeForReplace: isAuthenticated ? 'spring' : 'fade',
            }}
          >
            {(props) => (
              <Login {...props} onLogin={handleLogin} />
            )}
          </Stack.Screen>
        ) : (
          // Dashboard/Sidebar Stack
          <Stack.Screen
            name="Dashboard"
            options={{
              animationTypeForReplace: isAuthenticated ? 'spring' : 'fade',
            }}
          >
            {(props) => (
              <Sidebar {...props} onLogout={handleLogout} />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
