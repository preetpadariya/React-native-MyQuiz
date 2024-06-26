import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  CloseCircleIcon,
  InfoIcon,
} from '@gluestack-ui/themed';
import {getAllQuestions, getUserResponses} from '../../utils/database';
import {CheckCircleIcon} from '@gluestack-ui/themed';

const ReportDetails = ({user, onModelClose}) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      if (user && user.id) {
        const fetchedResponses = await getUserResponses(user.id);
        const fetchedQuestions = await getAllQuestions();
        setResponses(fetchedResponses);
        setQuestions(fetchedQuestions);
      }
    };

    fetchReportData();
  }, [user]);

  const reportData = questions.map(q => {
    const response = responses.find(r => r.questionId === q.id);
    return {
      ...q,
      status: response ? (response.userAnswer === '1' ? 0 : 1) : 2, // 0: Correct, 1: Incorrect, 2: Not Answered
    };
  });

  const icons = [CheckCircleIcon, CloseCircleIcon, InfoIcon];
  const actions = ['success', 'error', 'muted'];

  const renderItem = ({item}) => (
    <Card style={styles.card}>
      <Alert action={actions[item.status]} style={{borderRadius: 16}}>
        <AlertIcon as={icons[item.status]} style={{marginRight: 13}} />
        <VStack>
          <Text styled={{fontWeight: 'bold', fontSize: 'md'}}>
            {item.question}
          </Text>
        </VStack>
      </Alert>
    </Card>
  );

  const backHandler = () => {
    console.log('Back button pressed');
    onModelClose();
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={backHandler} style={styles.backButton}>
          <Image
            source={require('../../assets/Back.png')}
            style={{width: 25, height: 20, marginRight: 10}}
          />
        </TouchableOpacity>
        <Heading style={styles.heading}>Report</Heading>
      </View>
      <FlatList
        data={reportData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: 'green',
    zIndex: 10000,
  },
  heading: {
    fontSize: 32,
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -50,
    // backgroundColor: 'red',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 10,
    padding: 4,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ReportDetails;
