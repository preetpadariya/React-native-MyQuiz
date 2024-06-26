import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Button,
  GluestackUIProvider,
  Heading,
  Icon,
  Text,
  VStack,
  TrashIcon,
  EditIcon,
} from '@gluestack-ui/themed';
import {getAllUsers, deleteUser} from '../../utils/database';
const Profile = require('../../assets/Profile.png');
import {config} from '@gluestack-ui/config';
import EditUser from './EditUser';
import {useIsFocused} from '@react-navigation/native';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {}, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchUsers();
    }
  }, [isFocused]);

  const fetchUsers = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false); // Set loading state to false once data is fetched
    }
  };

  const handleDeleteUser = id => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          onPress: async () => {
            await deleteUser(id);
            fetchUsers(); // Refresh the users list after deletion
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleEditUser = id => {
    const user = users.find(user => user.id === id);
    setIsModelOpen(true);
    setSelectedUser(user);
  };

  const closeModelHandler = () => {
    fetchUsers();
    setIsModelOpen(false);
  };

  const renderUser = ({item}) => (
    <Card size="lg" variant="elevated" style={styles.card}>
      <View style={styles.row}>
        <Image
          source={item.image ? {uri: item.image} : Profile}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.buttonContainer}>
          <Button
            size="sm"
            variant="solid"
            action="positive"
            onPress={() => handleEditUser(item.id)}
            style={styles.editButton}>
            <Icon as={EditIcon} size="sm" color="white" />
          </Button>
          <Button
            size="sm"
            variant="solid"
            action="negative"
            onPress={() => handleDeleteUser(item.id)}
            style={styles.deleteButton}>
            <Icon as={TrashIcon} size="sm" color="white" />
          </Button>
        </View>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <GluestackUIProvider>
        <View style={styles.mainContainer}>
          <Heading style={styles.heading}>User List</Heading>
          <Text style={styles.noUserText}>No user found.</Text>
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider config={config}>
      <View style={styles.mainContainer}>
        {isModelOpen ? (
          <EditUser user={selectedUser} onModelClose={closeModelHandler} />
        ) : (
          <>
            <Heading style={styles.heading}>User List</Heading>
            <FlatList
              data={users}
              keyExtractor={item => item.id.toString()}
              renderItem={renderUser}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 32,
    alignSelf: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // To make sure the name takes the available space
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 14,
  },
  noUserText: {
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 20,
    color: '#777',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
