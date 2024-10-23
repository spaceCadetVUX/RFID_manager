import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database';
import { FontAwesome } from '@expo/vector-icons'; // For icons

const DashboardScreen = ({ navigation }) => {
  const [teacherInfo, setTeacherInfo] = useState({ name: '', ID: '' });
  const [activeTab, setActiveTab] = useState('My Tasks');
  const [roomInfo, setRoomInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch teacher info from the real-time database
  const fetchTeacherInfo = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser; // get current user
    if (user) {
      const uid = user.uid;         // get uid of user
      const db = getDatabase();     // get realtime databse
      const dbRef = ref(db);
      try {
        const snapshot = await get(child(dbRef, `teachers/${uid}`));   // find database annd store it to snapshot
        if (snapshot.exists()) {
          const teacherData = snapshot.val();   // get all the values from [teachers] 
          setTeacherInfo({                      
            name: teacherData.name,
            ID: teacherData.ID.toString(),
          });
          // store all the room data in [rooms]
          const rooms = [];
          Object.keys(teacherData).forEach((key) => {        // travel through all the object in the [uid] of teacher -> [room_id]
            if (key.startsWith('Room_')) {
              rooms.push({
                roomId: key,
                ...teacherData[key],
              });
            }
          });
          setRoomInfo(rooms);
        } else {
          console.log('No teacher data available');
        }
      } catch (error) {
        console.error('Error fetching teacher data: ', error);
      }
    }
    setLoading(false);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeacherInfo();
    setRefreshing(false);
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle search
  const handleSearch = (roomId, query) => {
    setSearchQuery(prevState => ({
      ...prevState,
      [roomId]: query,
    }));
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
      {/* Task Navigation */}
      <View style={styles.navTabs}>
        <TouchableOpacity
          style={[styles.navTab, activeTab === 'My Tasks' && styles.navTabActive]}
          onPress={() => handleTabChange('My Tasks')}
        >
          <Text style={[styles.navText, activeTab === 'My Tasks' && styles.navTextActive]}>My Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navTab, activeTab === 'In Progress' && styles.navTabActive]}
          onPress={() => navigation.navigate('progress')}
        >
          <Text style={[styles.navText, activeTab === 'In Progress' && styles.navTextActive]}>In-progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navTab, activeTab === 'Completed' && styles.navTabActive]}
          onPress={() => navigation.navigate('time_recoder')}
        >
          <Text style={[styles.navText, activeTab === 'Completed' && styles.navTextActive]}>Completed</Text>
        </TouchableOpacity>
      </View>
      {/* Class Information */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll}>
        {roomInfo.length > 0 ? (
          roomInfo.map((room) => (
            <View key={room.roomId} style={styles.projectCard}>
              <Text style={styles.projectTitle}>{room.roomId}</Text>
              <Text style={styles.projectDate}>Access Time: {room.access_time}</Text>
              <Text style={styles.projectDate}>Date: {room.date}</Text>
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search Student ID"
                  placeholderTextColor={'white'}
                  value={searchQuery[room.roomId] || ''}
                  onChangeText={(text) => handleSearch(room.roomId, text)}
                />
              </View>
              {/* Scrollable student list with a limit of 5 students */}
              <ScrollView style={styles.studentScroll} nestedScrollEnabled={true}>
                {room.student_list ? (
                  room.student_list
                    .filter(student => student.Student_ID.toString().includes(searchQuery[room.roomId] || ''))
                    .slice(0, 5)
                    .map((student) => (
                      <View key={student.Student_ID} style={styles.studentCard}>
                        <Text style={styles.studentText}>Student ID: {student.Student_ID}</Text>
                      </View>
                    ))
                ) : (
                  <Text style={styles.noStudentsText}>No students available</Text>
                )}
              </ScrollView>
            </View>
          ))
        ) : (
          <Text style={styles.noRoomsText}>No rooms available</Text>
        )}
      </ScrollView>
      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>Progress</Text>
        {roomInfo.map(room => (
          <View key={room.roomId} style={styles.progressCard}>
            <FontAwesome name="calendar" size={24} color="#6A5ACD" />
            <View>
              <Text style={styles.progressText}>{room.roomId}</Text>
              <Text style={styles.progressDate}>Date: {room.date}</Text>
              <Text style={styles.progressDate}>Access Time: {room.access_time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00224D',
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop:10,
    paddingBottom:5,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#888',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  navTabs: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  navTab: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  navTabActive: {

    color: '#FFF',
    fontWeight: 'bold',
  },
  projectScroll: {
    marginVertical: 10,
  },
  projectCard: {
    backgroundColor: '#6A5ACD',
    padding: 20,
    borderRadius: 15,
    marginRight: 10,
    width: 200,
  },
  projectTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  projectDate: {
    color: '#DDD',
    marginTop: 10,
  },
  studentScroll: {
    maxHeight: 200, // Limit the scroll height for the student list
  },
  studentCard: {
    backgroundColor: '#F8F9FD',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  studentText: {
    color: '#333',
  },

noStudentsText: {
  color: '#FFF',
  marginTop: 10,
},
noRoomsText: {
  color: '#333',
  textAlign: 'center',
  marginTop: 20,
},
progressSection: {
  marginTop: 30,
},
progressTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10,
},
progressCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F8F9FD',
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
},
progressText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginLeft: 10,
},
progressDate: {
  fontSize: 14,
  color: '#888',
  marginLeft: 10,
},
});

export default DashboardScreen;
