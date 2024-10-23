import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, RefreshControl, ActivityIndicator} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, child } from 'firebase/database';
import { FontAwesome } from '@expo/vector-icons'; // For icons
import { Picker } from '@react-native-picker/picker';
import NavTabs from './NavTabs';



const TimeRecorder = ({ navigation }) => {
  const [teacherInfo, setTeacherInfo] = useState({ name: '', ID: '' });
  const [activeTab, setActiveTab] = useState('Time Recorder');
  const [roomInfo, setRoomInfo] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

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
          if (rooms.length > 0) {
            setSelectedRoom(rooms[0].roomId);  // Select the first room by default
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

  const handleTabChangeA = (tab) => {
    setActiveTab(tab);

  };
 
  
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
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5ACD" />
      </View>
    );
  }

  const filteredRecords = (room) => {
    return room.time_record.filter(record => record.includes(searchQuery));
  };

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

      <View style={styles.navTabs}>
        <NavTabs activeTab={activeTab} handleTabChange={handleTabChangeA} />
      </View>
      
      {/* Room Selection */}
      <View style={styles.pickerContainer}>
        <Picker
        style={{color:'white'}}
          selectedValue={selectedRoom}
          onValueChange={(itemValue) => setSelectedRoom(itemValue)}
        >
          {roomInfo.map(room => (
            <Picker.Item key={room.roomId} label={room.roomId} value={room.roomId} />
          ))}
        </Picker>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ID"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={"#9c9797"}
          
        />
      </View>

      {/* Time Records */}
      {roomInfo.filter(room => room.roomId === selectedRoom).map(room => (
        <View key={room.roomId} style={styles.recordsContainer}>
          {filteredRecords(room).map((record, index) => (
            <View key={index} style={styles.recordCard}>
              <Text style={styles.recordText}>{record.split(' - ')[0]} - {record.split(' - ')[1]}</Text>
              <Text style={styles.recordID}>ID: {record.split(' - ')[2]}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00224D',
    paddingHorizontal: 5,
  },
  navTabs: {
    justifyContent:'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },

  navTabActive: {
    color: '#FFF',
    fontWeight: 'bold',
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
  pickerContainer: {
    marginVertical: 10,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
   
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    color:'white',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    color:'white'
  },
  recordsContainer: {
    marginTop: 20,
  },
  recordCard: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    
  },
  recordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recordID: {
    fontSize: 14,
    color: '#666',
  },
});

export default TimeRecorder;
