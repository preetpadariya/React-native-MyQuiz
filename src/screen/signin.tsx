import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import {
  ButtonText,
  Card,
  Button,
  GluestackUIProvider,
  Heading,
  Input,
  InputField,
  Text,
  Icon,
  EyeOffIcon,
  EyeIcon,
} from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { useAuth } from '../utils/AuthContext';
import Admin from './admin/AdminHome';
import User from './user/UserHome';

export default function Login({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    setPhone('');
    setPassword('');
    setErrorMessage('');
  }, []);

  const handleSignin = async () => {
    if (phone && password) {
      try {
        let user = await login(phone, password);
        if (!user) {
          setErrorMessage('Incorrect Phone or password');
        } else {
          setPhone('');
          setPassword('');
          setErrorMessage('');
          if (user.user_type === 1) {
            navigation.navigate('AdminHome');
          } else {
            navigation.navigate('UserHome');
          }
        }
      } catch (error) {
        console.error('Error during login: ', error);
        setErrorMessage('An error occurred during login. Please try again.');
        setPhone('');
        setPassword('');
      }
    } else {
      setErrorMessage('Please fill all fields');
      setPhone('');
      setPassword('');
    }
  };

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.halfCircleTop} />
        <View style={styles.mainContainer}>
          <Card size="lg" variant="elevated" m="$3" style={styles.card}>
            <Heading mb="$5" fontSize={30} alignSelf="center" fontWeight='bold' fontStyle='italic'>
              Login
            </Heading>
            <Input
              variant="outline"
              size="lg"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              mb="$5"
              style={styles.input}
            >
              <InputField
                placeholder="Enter Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.inputField}
              />
            </Input>

            <Input
              variant="outline"
              size="lg"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              mb="$5"
              style={styles.input}
            >
              <InputField
                placeholder="Enter Password"
                type={showPassword ? 'text' : 'password'} // Toggle password visibility based on showPassword state
                value={password}
                onChangeText={setPassword}
                style={styles.inputField}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
                {showPassword ? (
                  <Icon as={EyeOffIcon} size="md" color="blue" style={styles.eyeIcon} />
                ) : (
                  <Icon as={EyeIcon} size="md" color="blue" style={styles.eyeIcon} />
                )}
              </TouchableOpacity>
            </Input>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <Button
              size="md"
              variant="solid"
              action="primary"
              isDisabled={false}
              isFocusVisible={false}
              mt="$10"
              width="$25"
              alignSelf="center"
              borderRadius={20}
              onPress={handleSignin}
              style={styles.signinButton}
            >
              <ButtonText>Login</ButtonText>
            </Button>
          </Card>
        </View>
      </SafeAreaView>
      <View style={styles.halfCircleBottom} />
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  halfCircleTop: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 500,
    borderBottomRightRadius: 500,
    backgroundColor: '#00c6ff',
    position: 'absolute',
    top: 0,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20, // Adjust this value based on the height of the top half-circle
  },
  halfCircleBottom: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 500,
    borderTopRightRadius: 500,
    backgroundColor: '#00c6ff',
    position: 'absolute',
    bottom: 0,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    zIndex: 10000,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 10,
    position: 'relative', // Ensure the container is relative for absolute positioning of the icon
  },
  inputField: {
    padding: 10,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginVertical: 5,
  },
  signinButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 1,
  },
  passwordIcon: {
    position: 'absolute',
    right: 10,
    top: '50%', // Center vertically
    transform: [{ translateY: 0 }], // Adjust icon position vertically to center with input
  },
  eyeIcon: {
    marginTop: -12, // Adjust icon position vertically to center with input
  },
});
