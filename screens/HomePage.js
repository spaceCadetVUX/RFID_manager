  import React, { useState, useEffect } from 'react';
  import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
  import { getAuth } from 'firebase/auth';
  import { getDatabase, ref, get, child } from 'firebase/database';
  import { FontAwesome } from '@expo/vector-icons'; // For icons
  import NavTabs from './NavTabs';
  import { LinearGradient } from 'expo-linear-gradient';

  const DashboardScreen = ({ navigation }) => {
    const [teacherInfo, setTeacherInfo] = useState({ name: '', ID: '' });
    const [activeTab, setActiveTab] = useState('My Tasks');
    const [roomInfo, setRoomInfo] = useState([]);
    const [searchQuery, setSearchQuery] = useState({});
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);

    // Toggle the visibility of the menu
    const toggleMenu = () => {
      setMenuVisible(!menuVisible);
    };

    // Close the menu
    const closeMenu = () => {
      setMenuVisible(false);
    };

    const handleTabChangeA = (tab) => {
      setActiveTab(tab);
    };

    // Fetch teacher info from the real-time database
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
          <ActivityIndicator size="large" color="#FF7F50" />
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
          <NavTabs activeTab={activeTab} handleTabChange={handleTabChangeA} />
        </View>

        {/* Class Information */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll}>
          {roomInfo.length > 0 ? (
            roomInfo.map((room) => (

                <View style={styles.projectCard}>
                  <Text style={styles.projectTitle}>{room.roomId}</Text>
                  <Text style={styles.projectDate}>Access Time: <Text style={{color:'white', fontWeight:'200'}}>{room.access_time}</Text></Text>
                  <Text style={styles.projectDate}>Date:                 <Text style={{color:'white', fontWeight:'200'}}>{room.date}</Text></Text>

                  {/* Search Bar */}
                  <View style={styles.searchContainer}>
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search Student"
                      placeholderTextColor={'#9c9797'}
                      value={searchQuery[room.roomId] || ''}
                      onChangeText={(text) => handleSearch(room.roomId, text)}
                    />
                  </View>

                  {/* Scrollable student list with a limit of 5 students */}
                  <ScrollView style={styles.studentScroll} nestedScrollEnabled={true}>
                    {room.student_list ? (
                      room.student_list
                        .filter((student) => {
                          const query = searchQuery[room.roomId]?.toLowerCase() || '';
                          const studentID = student.Student_ID.toString().toLowerCase();
                          const studentName = student.name.toLowerCase();
                          return studentID.includes(query) || studentName.includes(query);
                        })
                        .slice(0, 5)
                        .map((student) => (
                          <View key={student.Student_ID} style={styles.studentCard}>
                            <Text style={styles.studentText}>Student ID: <Text style={{fontWeight:'300'}}>{student.Student_ID}</Text></Text>
                            <Text style={styles.studentText}>Name:          <Text style={{fontWeight:'300'}}>{student.name}</Text></Text>
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
              <FontAwesome name="calendar" size={24} color="#FF7F50" />
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
      paddingHorizontal: 0,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#00224D'
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
      color: 'white',
      marginLeft:10,
    },
    subText: {
      fontSize: 16,
      color: 'white',
      marginLeft:20,
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
      color:'white'
    },
    navTabs: {
      justifyContent:'center',
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
      padding:10,
    },
    projectCard: {
      backgroundColor: '#A0153E',
      padding: 20,
      borderRadius: 15,
      marginRight: 10,
      width: 250,
      height:500,
      elevation: 5,  // Higher number means a bigger shadow
    },
    projectTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    projectDate: {
      color: 'white',
      fontWeight:'bold'
  
    },
    studentScroll: {
      maxHeight: 300, // Limit the scroll height for the student list

    },
    studentCard: {
      backgroundColor: '#00224D',
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    studentText: {
      color: 'white',
      fontWeight:'bold'
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
    padding:10,
    marginTop: 30,
  },
  progressTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderRadius:20,
    elevation: 5,  // Higher number means a bigger shadow
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
