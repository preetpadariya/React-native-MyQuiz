import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {
  Card,
  GluestackUIProvider,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  CheckCircleIcon,
  CloseCircleIcon,
  InfoIcon,
} from '@gluestack-ui/themed';
import {useAuth} from '../../utils/AuthContext';
import {getAllQuestions, getUserResponses} from '../../utils/database';
import {config} from '@gluestack-ui/config';

const Report = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const {user} = useAuth();

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
  }, []);

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
    <Card
      style={{
        marginVertical: 10,
        padding: 4,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}>
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

  return (
    <GluestackUIProvider config={config}>
      <View style={styles.mainContainer}>
        <Heading style={styles.heading}>Report</Heading>
        <FlatList
          data={reportData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
        <Heading alignSelf="center">All Question Attempted</Heading>
      </View>
    </GluestackUIProvider>
  );
};

export default Report;

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
});
