import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ButtonText,
  Card,
  Button,
  GluestackUIProvider,
  Heading,
  Input,
  InputField,
} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import {insertQuestion} from '../../utils/database';

const AddQuestion = props => {
  console.log('***************************************');
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1); // Track the selected answer index

  const handleAddQuestion = () => {
    if (
      question &&
      option1 &&
      option2 &&
      option3 &&
      option4 &&
      selectedAnswerIndex !== -1
    ) {
      const options = [option1, option2, option3, option4];
      const correctAnswer = options[selectedAnswerIndex]; // Get the correct answer based on selectedAnswerIndex

      insertQuestion(
        question,
        option1,
        option2,
        option3,
        option4,
        correctAnswer,
      )
        .then(() => {
          Alert.alert('Question added successfully!');
          props.onModelClose();
        })
        .catch(error => {
          console.error('Error adding question: ', error);
          Alert.alert('Failed to add question.');
        });
    } else {
      Alert.alert('Please fill all fields and select a correct answer.');
    }
  };

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.mainContainer}>
          <Card size="lg" variant="elevated" m="$3" style={styles.card}>
            <Heading mb="$5" fontSize={30} alignSelf="center">
              Add Question
            </Heading>
            <Input
              variant="outline"
              size="lg"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              mb="$5"
              style={styles.input}>
              <InputField
                placeholder="Enter Question"
                value={question}
                onChangeText={setQuestion}
                style={styles.inputField}
              />
            </Input>
            <InputWithRadio
              option={option1}
              setOption={setOption1}
              isSelected={selectedAnswerIndex === 0}
              onSelect={() => setSelectedAnswerIndex(0)}
            />
            <InputWithRadio
              option={option2}
              setOption={setOption2}
              isSelected={selectedAnswerIndex === 1}
              onSelect={() => setSelectedAnswerIndex(1)}
            />
            <InputWithRadio
              option={option3}
              setOption={setOption3}
              isSelected={selectedAnswerIndex === 2}
              onSelect={() => setSelectedAnswerIndex(2)}
            />
            <InputWithRadio
              option={option4}
              setOption={setOption4}
              isSelected={selectedAnswerIndex === 3}
              onSelect={() => setSelectedAnswerIndex(3)}
            />
            <Button
              size="md"
              variant="solid"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}
              mt="$10"
              width="$50"
              alignSelf="center"
              borderRadius={20}
              onPress={handleAddQuestion}
              style={styles.SigninButton}>
              <ButtonText>Add Question</ButtonText>
            </Button>
          </Card>
        </View>
      </SafeAreaView>
    </GluestackUIProvider>
  );
};

const InputWithRadio = ({option, setOption, isSelected, onSelect}) => (
  <Input
    variant="outline"
    size="lg"
    isDisabled={false}
    isInvalid={false}
    isReadOnly={false}
    mb="$5"
    style={styles.input}>
    <InputField
      placeholder={`Option ${isSelected ? '✓' : ''}`}
      value={option}
      onChangeText={setOption}
      style={styles.inputField}
    />
    <TouchableOpacity style={styles.radioContainer} onPress={onSelect}>
      <View style={styles.radio}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  </Input>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
  },
  card: {
    padding: 10,
    borderRadius: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  inputField: {
    paddingHorizontal: 10,
    fontSize: 15,
  },
  SigninButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  radioContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
});

export default AddQuestion;
