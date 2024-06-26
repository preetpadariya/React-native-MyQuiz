import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, FlatList, Image, ActivityIndicator } from 'react-native';
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
  InfoIcon,
} from '@gluestack-ui/themed';
import { getUsersWithResponses } from '../../utils/database';
const Profile = require('../../assets/Profile.png');
import { config } from '@gluestack-ui/config';
import ReportDetails from './ReportDetails';

export default function AdminUserReport() {
  const [users, setUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const usersData = await getUsersWithResponses();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users with responses:', error);
      Alert.alert('Failed to fetch users with responses');
    }finally {
      setIsLoading(false); // Set loading state to false once data is fetched
    }
  };

  const handleReportDetails = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    setIsModelOpen(true);
  };

  const closeModelHandler = () => {
    setIsModelOpen(false);
    fetchUsers(); // Refresh users list after closing modal
  };
  if (isLoading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }
  const renderUser = ({ item }) => (
    <Card size="lg" variant="elevated" style={styles.card}>
      <View style={styles.row}>
        <Image
          source={item.image ? { uri: item.image } : Profile}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.buttonContainer}>
          <Button
            size="sm"
            variant="solid"
            action="positive"
            onPress={() => handleReportDetails(item.id)}
            style={styles.editButton}
          >
            <Icon as={InfoIcon} size="sm" color="white" />
          </Button>
        </View>
      </View>
    </Card>
  );

  if (isModelOpen) {
    return <ReportDetails user={selectedUser} onModelClose={closeModelHandler} />;
  }

  return (
    <GluestackUIProvider config={config}>
      <View style={styles.mainContainer}>
        <Heading style={styles.heading}>User Report List</Heading>
        {users.length === 0 ? (
          <Text style={styles.noUserText}>No users found with responses.</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUser}
            contentContainerStyle={styles.listContainer}
          />
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
    shadowOffset: { width: 0, height: 2 },
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
  deleteButton: {
    backgroundColor: '#ff4d4d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  noUserText: {
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 20,
    color: '#777',
  },
});
