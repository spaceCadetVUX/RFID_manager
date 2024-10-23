import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { getDatabase, ref, get, child } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';
import NavTabs from './NavTabs';
import { FontAwesome } from '@expo/vector-icons';

const TimeRecorder = ({ navigation }) => {
  const [teacherInfo, setTeacherInfo] = useState({ name: '', ID: '' });
  const [roomInfo, setRoomInfo] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [nonAccessedStudents, setNonAccessedStudents] = useState([]);
  const [accessedStudents, setAccessedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Added refreshing state
  const [activeTab, setActiveTab] = useState('fillter');

  // Fetch teacher info and rooms data from the real-time database
  const fetchTeacherInfo = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const db = getDatabase();
      const dbRef = ref(db);
      try {
        const snapshot = await get(child(dbRef, `teachers/${uid}`));
        if (snapshot.exists()) {
          const teacherData = snapshot.val();
          setTeacherInfo({
            name: teacherData.name,
            ID: teacherData.ID.toString(),
          });

          // Extract room information
          const rooms = [];
          Object.keys(teacherData).forEach((key) => {
            if (key.startsWith('Room_')) {
              rooms.push({
                roomId: key,
                ...teacherData[key],
              });
            }
          });
          setRoomInfo(rooms);
          if (rooms.length > 0) {
            setSelectedRoom(rooms[0].roomId); // Select the first room by default
            separateStudents(rooms[0]);
          }
        } else {
          console.log('No teacher data available');
        }
      } catch (error) {
        console.error('Error fetching teacher data: ', error);
      }
    }
    setLoading(false);
  };

  // Separate students into accessed and non-accessed boards
  const separateStudents = (room) => {
    const nonAccessed = [];
    const accessed = [];
    
    room.student_list.forEach(student => {
      if (student.time_in && student.time_in[0] !== 'placeholder') {
        accessed.push(student);
      } else {
        nonAccessed.push(student);
      }
    });

    setNonAccessedStudents(nonAccessed);
    setAccessedStudents(accessed);
  };

  // Handle room change
  const handleRoomChange = (roomId) => {
    setSelectedRoom(roomId);
    const room = roomInfo.find(r => r.roomId === roomId);
    if (room) {
      separateStudents(room);
    }
  };

  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTeacherInfo();
    setRefreshing(false);
  }, []);

  // Handle tab change
  const handleTabChangeA = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={{ marginRight: 10 }}>
          <Text style={styles.greetingText}>Hello {teacherInfo.name}!</Text>
          <Text style={styles.subText}>Have a nice day.</Text>
        </View>
        <TouchableOpacity style={{ marginRight: 10 }}>
          <FontAwesome name="user-circle-o" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Navigation Tabs */}
      <NavTabs activeTab={activeTab} handleTabChange={handleTabChangeA} />

      {/* Room Selection */}
      <View style={styles.pickerContainer}>
        <Picker
          style={{ color: 'white' }}
          selectedValue={selectedRoom}
          onValueChange={(itemValue) => handleRoomChange(itemValue)}
        >
          {roomInfo.map(room => (
            <Picker.Item key={room.roomId} label={room.roomId} value={room.roomId} />
          ))}
        </Picker>
      </View>

      {/* Student List */}
      <View style={styles.boardCNT}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll}>
          {/* Non-Accessed Students */}
          <View style={styles.boardContainer}>
            <Text style={styles.boardTitle}>Nonaccessed Students</Text>
            <ScrollView>
              {nonAccessedStudents.map((student, index) => (
                <View key={index} style={styles.studentCard}>
                  <Text style={styles.studentText}>ID: {student.Student_ID}</Text>
                  <Text style={styles.studentName}>Name: {student.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Accessed Students */}
          <View style={styles.boardContainer}>
            <Text style={styles.boardTitle}>Accessed Students</Text>
            {accessedStudents.map((student, index) => (
              <View key={index} style={styles.studentCard}>
                <Text style={styles.studentText}>ID: {student.Student_ID}</Text>
                <Text style={styles.studentName}>Name: {student.name}</Text>
                <Text style={styles.accessTime}>Time In: {student.time_in[0]}</Text>
                <Text style={styles.accessTime}>Time Out: {student.time_out[0]}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00224D',
    paddingHorizontal: 10,
  },
  boardCNT: {
    flexDirection: 'row',
    elevation: 5,  
  },
  projectScroll: {
    marginVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  subText: {
    fontSize: 16,
    color: 'white',
  },
  pickerContainer: {
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  boardContainer: {
    marginTop: 20,
    marginBottom: 10,
    height: 500,
    width: 300,
    backgroundColor: '#A0153E',
    padding: 20,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  boardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: '#00224D',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  studentText: {
    fontSize: 16,
    color: 'white',
  },
  studentName: {
    fontSize: 14,
    color: 'white',
  },
  accessTime: {
    fontSize: 12,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00224D',
  },
});

export default TimeRecorder;
