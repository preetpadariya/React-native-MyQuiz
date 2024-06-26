import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, Alert} from 'react-native';
import {
  Button,
  ButtonText,
  Card,
  Heading,
  View,
  GluestackUIProvider,
} from '@gluestack-ui/themed';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addResponse,
  areAllQuestionsAttempted,
  getUnansweredQuestions,
} from '../../utils/database';
import Report from './Report';
import {useAuth} from '../../utils/AuthContext';
import {config} from '@gluestack-ui/config';
import LinearGradient from 'react-native-linear-gradient';

const Quiz = ({route, navigation}) => {
  const {user} = useAuth(); // Assuming useAuth hook provides authenticated user information
  const [selectedAns, setSelectedAns] = useState(null);
  const [questionNo, setQuestionNo] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchUnansweredQuestions();
  }, []);

  const fetchUnansweredQuestions = async () => {
    try {
      const unansweredQuestions = await getUnansweredQuestions(user.id);
      setQuestions(unansweredQuestions);
      if (unansweredQuestions.length > 0) {
        setCurrentQuestion(unansweredQuestions[0]);
      }
    } catch (error) {
      console.error('Error fetching unanswered questions:', error);
    }
  };

  const handleNext = async () => {
    try {
      const isCorrect = selectedAns === currentQuestion.answer;
      await addResponse(currentQuestion.id, user.id, isCorrect ? 1 : 0);
      route.params.onNext();

      if (questionNo + 1 === questions.length) {
        setQuizCompleted(true);
      } else {
        setQuestionNo(questionNo + 1);
        setCurrentQuestion(questions[questionNo + 1]);
        setSelectedAns(null);
        setShowNextButton(false);
      }

      let alertMessage = isCorrect
        ? 'Correct!'
        : `Incorrect! \nCorrect answer is ${currentQuestion.answer}`;
      Alert.alert(
        'Answer Feedback',
        alertMessage,
        [{text: 'OK', onPress: () => {}}],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error handling next question: ', error);
    }
  };

  const handleAnswerSelect = answer => {
    setSelectedAns(answer);
    setShowNextButton(true);
  };

  if (!currentQuestion) {
    return <Report />;
  }

  if (quizCompleted) {
    return <Report />;
  }

  return (
    <GluestackUIProvider config={config}>
      <LinearGradient
        colors={['#ffffff', '#00a9ff']}
        style={styles.gradientBackground}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={styles.container}>
          <Card size="lg" variant="elevated" m="$1">
            <Heading mb="$1" size="xl">
              {currentQuestion.question}
            </Heading>
          </Card>
          <TouchableOpacity
            onPress={() => handleAnswerSelect(currentQuestion.option1)}>
            <Card
              style={
                selectedAns === currentQuestion.option1
                  ? styles.selectedOption
                  : styles.default
              }
              size="md"
              variant="elevated"
              m="$1"
              mt="$10">
              <Heading mb="$1" size="lg">
                A. {currentQuestion.option1}
              </Heading>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAnswerSelect(currentQuestion.option2)}>
            <Card
              style={
                selectedAns === currentQuestion.option2
                  ? styles.selectedOption
                  : styles.default
              }
              size="md"
              variant="elevated"
              m="$1"
              mt="$3">
              <Heading mb="$1" size="lg">
                B. {currentQuestion.option2}
              </Heading>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAnswerSelect(currentQuestion.option3)}>
            <Card
              style={
                selectedAns === currentQuestion.option3
                  ? styles.selectedOption
                  : styles.default
              }
              size="md"
              variant="elevated"
              m="$1"
              mt="$3">
              <Heading mb="$1" size="lg">
                C. {currentQuestion.option3}
              </Heading>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAnswerSelect(currentQuestion.option4)}>
            <Card
              style={
                selectedAns === currentQuestion.option4
                  ? styles.selectedOption
                  : styles.default
              }
              size="md"
              variant="elevated"
              m="$1"
              mt="$3">
              <Heading mb="$1" size="lg">
                D. {currentQuestion.option4}
              </Heading>
            </Card>
          </TouchableOpacity>
          {showNextButton && (
            <Button
              bgColor="white"
              rounded="$full"
              alignSelf="center"
              w="$2/3"
              mt="$16"
              onPress={handleNext}>
              <ButtonText color="green" fontWeight="bold">
                Next
              </ButtonText>
            </Button>
          )}
        </View>
      </LinearGradient>
    </GluestackUIProvider>
  );
};

export default Quiz;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    margin: 32,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: 'green',
  },
  default: {
    borderWidth: 0,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
