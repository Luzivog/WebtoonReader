import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const AuthOverlay = ({ toggleAuthOverlay }: { toggleAuthOverlay: (visible: boolean) => void }) => {
  const [isRegisterScreen, setIsRegisterScreen] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleScreen = () => {
    setIsRegisterScreen((prev) => !prev);
  };

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.overlay}>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.text}>
          {isRegisterScreen ? 'Register' : 'Sign in'} to continue.
        </Text>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={toggleScreen} style={styles.switchButton}>
          <Text style={styles.switchButtonText}>
            Switch to {isRegisterScreen ? 'Sign in' : 'Register'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleAuthOverlay(false)} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  overlay: {
    backgroundColor: '#252525', // Main overlay background color
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'tomato', // Header text color
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: 'white', // Text color
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white', // Input background color
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  switchButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  switchButtonText: {
    color: 'tomato', // Switch button text color
  },
  closeButton: {
    backgroundColor: 'tomato', // Close button background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white', // Close button text color
    fontWeight: 'bold',
  },
});

export default AuthOverlay;