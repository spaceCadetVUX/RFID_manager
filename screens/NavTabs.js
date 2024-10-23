// components/NavTabs.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavTabs = ({ activeTab, handleTabChange }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.navTabs}>
      <TouchableOpacity
        style={[styles.navTab, activeTab === 'My Tasks' && styles.navTabActive]}
        onPress={() => navigation.navigate('HomePage')}
      >
        <Text style={[styles.navText, activeTab === 'My Tasks' && styles.navTextActive]}>My Tasks</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.navTab, activeTab === 'Time Recorder' && styles.navTabActive]}
        onPress={() => navigation.navigate('time_recoder')}
      >
        <Text style={[styles.navText, activeTab === 'Time Recorder' && styles.navTextActive]}>In-progress</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={[styles.navTab, activeTab === 'fillter' && styles.navTabActive]}
        onPress={() => navigation.navigate('fillter')}
      >
        <Text style={[styles.navText, activeTab === 'FillTer' && styles.navTextActive]}>fillter</Text>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  navTabs: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  navTab: {
    backgroundColor: '#a7a1a1',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    elevation: 5,  // Higher number means a bigger shadow
  },
  navText: {
    fontSize: 16,
    color: 'black',
  },
  navTabActive: {
    backgroundColor: '#FF4500',
  },
  navTextActive: {
    color: 'white',
    fontWeight:700
  },
});

export default NavTabs;
