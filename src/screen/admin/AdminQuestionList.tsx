import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Button,
  GluestackUIProvider,
  Heading,
  ButtonText,
  Icon,
  TrashIcon,
  EditIcon,
} from '@gluestack-ui/themed';
import {getAllQuestions, deleteQuestion} from '../../utils/database'; // Import database functions
import EditQuestion from './EditQuestion';
import AddQuestion from './AddQuestion';

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isModelOpenAdd, setIsModelOpenAdd] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const fetchedQuestions = await getAllQuestions();
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Alert.alert('Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteQuestion(id);
      Alert.alert('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      Alert.alert('Failed to delete question');
    }
  };

  const handleEditQuestion = id => {
    const question = questions.find(question => question.id === id);
    setIsModelOpen(true);
    setSelectedQuestion(question);
  };

  const closeModelHandler = () => {
    fetchQuestions();
    setIsModelOpen(false);
  };

  const handleNewQuestion = () => {
    setIsModelOpenAdd(true);
  };

  const closeModelHandlerAdd = () => {
    fetchQuestions();
    setIsModelOpenAdd(false);
  };

  const renderItem = ({item}) => (
    <Card size="lg" variant="elevated" style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.questionText}>{item.question}</Text>
        <View style={styles.buttonContainer}>
          <Button
            size="sm"
            variant="solid"
            action="positive"
            onPress={() => handleEditQuestion(item.id)}
            style={styles.editButton}>
            <Icon as={EditIcon} size="sm" color="white" />
          </Button>
          <Button
            size="sm"
            variant="solid"
            action="negative"
            onPress={() => handleDelete(item.id)}
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

  if (questions.length === 0 && !isModelOpenAdd) {
    return (
      <GluestackUIProvider>
        <View style={styles.mainContainer}>
          <Heading style={styles.heading}>Question List</Heading>
          <Text style={styles.noQuestionsText}>No questions found.</Text>
          <TouchableOpacity
            style={styles.roundedButton}
            onPress={handleNewQuestion}>
            <ButtonText style={styles.buttonText}>Add Question</ButtonText>
          </TouchableOpacity>
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    // <GluestackUIProvider>
    <View style={styles.mainContainer}>
      {isModelOpen && (
        <EditQuestion
          question={selectedQuestion}
          onModelClose={closeModelHandler}
        />
      )}
      {console.log('222222222222222222222222222222222 ', isModelOpenAdd)}
      {isModelOpenAdd && <AddQuestion onModelClose={closeModelHandlerAdd} />}
      {!isModelOpen && !isModelOpenAdd && (
        <>
          <Heading style={styles.heading}>Question List</Heading>
          <FlatList
            data={questions}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingBottom: 20}}
          />
          <TouchableOpacity
            style={styles.roundedButton}
            onPress={handleNewQuestion}>
            <ButtonText style={styles.buttonText}>Add Question</ButtonText>
          </TouchableOpacity>
        </>
      )}
    </View>
    // </GluestackUIProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 32,
    alignSelf: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  noQuestionsText: {
    alignSelf: 'center',
    fontSize: 20,
    marginBottom: 20,
    color: '#777',
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
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // To make sure the text takes the available space
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
  roundedButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
  },
});

export default QuestionsList;
