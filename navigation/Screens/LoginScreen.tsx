import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import { LoginScreenNavigationProp } from '../stacks/WebtoonStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { config } from '../config';

function LoginScreen({ navigation } : {navigation: LoginScreenNavigationProp}): JSX.Element {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Track password visibility

    const handleLogin = () => {
        // Implement form validation and sign-up logic here
    };

    const handleRegister = () => {
        navigation.navigate('RegisterScreen');
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={40} color="tomato" />
            </TouchableOpacity>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    secureTextEntry={!isPasswordVisible} // Toggle secureTextEntry based on visibility
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={togglePasswordVisibility} // Toggle password visibility on press
                >
                    <Icon
                        name={isPasswordVisible ? 'eye' : 'eye-slash'}
                        size={20}
                        color="#333"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#252525',
    },
    backButton: {
        marginTop: config.StatusBarHeight,
        position: 'absolute',
        top: 10,
        left: 10,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        padding: 10,
    },
    eyeIcon: {
        padding: 10,
    },
    loginButton: {
        backgroundColor: 'tomato',
        width: '80%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 25,
    },
    loginText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerButton: {
        backgroundColor: '#555555',
        width: '80%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    registerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    termsText: {
        fontSize: 14,
        color: '#fff',
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
