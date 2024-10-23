import React, { useState } from 'react';
import { View, Text,StatusBar, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseCnfig'; // Adjust the path as necessary
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './regeist_login_style'; // Adjust the path as necessary

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSignIn = () => {
    if (!email || !password) {
      setWarningMessage('Please fill in all fields.');
      return;
    }

    setLoading(true); // Start loading

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // User is signed in
        const user = userCredential.user; // Get the user object
        console.log('User ID:', user.uid); // Optional: Log the UID to the console

        setWarningMessage('');
        navigation.navigate('HomePage'); // Navigate to the next screen
      })
      .catch(error => {
        let errorMessage;
        switch (error.code) {
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          default:
            errorMessage = 'Login failed. Please try again.';
        }
        Alert.alert('Login Failed', errorMessage);
        setPassword(''); // Reset password input field
        setLoading(false); // Stop loading on error
      });
  };

  return (
    <LinearGradient
    colors={['#ffbc24', '#fa9d23', '#f35e22']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

        {warningMessage ? (
          <Text style={styles.warningText}>{warningMessage}</Text>
        ) : null}

        {/* Email */}
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={24} color="white" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="white"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
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
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
            <FontAwesome
              name={showPassword ? 'eye' : 'eye-slash'}
              size={24}
              color="white"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleSignIn} disabled={loading}>
          <Text style={styles.registerButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" color="#ffffff" style={{ marginVertical: 20 }} />}

        {/* Forgot Password */}
        <Text style={styles.termsText}>
          <Text style={styles.link}>Forgot Password</Text>.
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

        {/* Sign Up Link */}
        <Text style={styles.signInText}>
          Don't have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Sign Up
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default SignInScreen;
