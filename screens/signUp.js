import React, { useState } from 'react';
import { View , StatusBar,Platform , Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { LinearGradient } from 'expo-linear-gradient';
import styles from './regeist_login_style';
import { auth } from '../firebaseCnfig'; // Import the auth object from firebaseConfig
import { createUserWithEmailAndPassword } from 'firebase/auth';


const CreateAccountScreen = ({ navigation }) => {
    const USER_REGEX = /^[a-zA-Z0-9._%+-]+@locker\.com$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
    const [warningMessage, setWarningMessage] = useState('');
    const [warningMessagePwd, setWarningMessagePwd] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!USER_REGEX.test(username)) {
            setWarningMessage('Username must be like abc@locker.com');
            return;
        }

        if (!PWD_REGEX.test(password)) {
            setWarningMessagePwd('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        if (password !== confirmPassword) {
            setWarningMessagePwd('Passwords do not match');
            return;
        }

        setWarningMessage('');
        setWarningMessagePwd('');

        setLoading(true); // Show loading indicator

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, username, password);
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('HomePage'); // Navigate to the home screen or another screen
        } catch (error) {
            let message;
            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'The email address is already in use by another account.';
                    break;
                case 'auth/invalid-email':
                    message = 'The email address is not valid.';
                    break;
                case 'auth/weak-password':
                    message = 'The password is too weak.';
                    break;
                default:
                    message = error.message; // Fallback to the default message
            }
            Alert.alert('Error', message);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        
        <LinearGradient
            colors={['#ffbc24', '#fa9d23', '#f35e22']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={styles.container}>
            <StatusBar backgroundColor="black" barStyle="light-content" />
                <Text style={styles.title}>Create Account</Text>

                {/* Username */}
                <View style={styles.inputContainer}>
                    <FontAwesome name="user" size={24} color="white" />
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="white"
                        value={username}
                        onChangeText={setUsername}
                    />
                    {warningMessage ? <Text style={styles.warningText}>{warningMessage}</Text> : null}
                </View>

                {/* Password */}
                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={24} color="white" />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="white"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        onPressIn={() => setShowPassword(true)}
                        onPressOut={() => setShowPassword(false)}
                    >
                        <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={24} color="white" />
                    </TouchableOpacity>
                    {warningMessagePwd ? <Text style={styles.warningText}>{warningMessagePwd}</Text> : null}
                </View>

                {/* Confirm Password */}
                <View style={styles.inputContainer}>
                    <FontAwesome name="lock" size={24} color="white" />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="white"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                {/* Register Button */}
                <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
                    <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>

                {/* Loading Indicator */}
                {loading && <ActivityIndicator size="large" color="#fff" />}

                {/* Terms and Privacy */}
                <Text style={styles.termsText}>
                    By registering, you confirm that you accept our{' '}
                    <Text style={styles.link}>Terms of Use</Text> and{' '}
                    <Text style={styles.link}>Privacy Policy</Text>.
                </Text>

                {/* Social Buttons */}
                {/* <TouchableOpacity style={styles.facebookButton}>
                    <FontAwesome name="facebook" size={24} color="white" />
                    <Text style={styles.facebookButtonText}>Sign In with Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.googleButton}>
                    <FontAwesome name="google" size={24} color="red" />
                    <Text style={styles.googleButtonText}>Sign In with Google</Text>
                </TouchableOpacity> */}

                {/* Sign In Link */}
                <Text style={styles.signInText}>
                    Already have an account?{' '}
                    <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                        Sign In
                    </Text>
                </Text>
            </View>
        </LinearGradient>
    );
};

export default CreateAccountScreen;
