import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AuthOverlay = ({ toggleAuthOverlay } : {
    toggleAuthOverlay: (visible: boolean) => void;
}) => {
  return (
    <View style={styles.overlayContainer}>
      <View style={styles.overlay}>
        <Text style={styles.header}>Welcome!</Text>
        <Text style={styles.text}>Sign in or register to continue.</Text>
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
