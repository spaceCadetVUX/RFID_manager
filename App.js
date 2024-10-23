import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import login from './screens/loginForm';
import RegisterScreen from './screens/signUp';
import HomePage from './screens/HomePage';
import progress from './screens/progress';
import time_recoder from './screens/time_record';
import fillter from './screens/fillter';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false, // Hide headers
            animation: 'flip', // Native stack slide animation
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 2000 } },
              close: { animation: 'timing', config: { duration: 2000 } },
            },
          }}
        >
          <Stack.Screen name="Login" component={login} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="progress" component={progress} />
          <Stack.Screen name="time_recoder" component={time_recoder} />
          <Stack.Screen name="fillter" component={fillter} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
