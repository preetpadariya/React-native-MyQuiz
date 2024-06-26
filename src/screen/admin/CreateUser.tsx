import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
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
  Text,
  Icon,
  EyeOffIcon,
  EyeIcon,
} from '@gluestack-ui/themed'; // Import EyeOffIcon and EyeOnIcon
import { config } from '@gluestack-ui/config';
import { insertUser } from '../../utils/database';
import LinearGradient from 'react-native-linear-gradient';
import {
  launchImageLibrary as _launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const Profile = require('../../assets/Profile.png');

let launchImageLibrary = _launchImageLibrary;

const CreateUser = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [avatarSource, setAvatarSource] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, async (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let source = response.uri || response.assets?.[0]?.uri;
        setAvatarSource(source);
        setImagePath(source);
      }
    });
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validatePassword = (password) => {
    // Regex to match a password with at least one special character and alphanumeric characters
    const regex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/\\~-])(?=.*[a-zA-Z0-9]).{6,20}$/;
    return regex.test(password);
  };

  const handleRegister = () => {
    if (name && validatePhone(phone) && validatePassword(password) && imagePath) {
      // All validations passed, proceed to insert user
      insertUser(name, phone, password, imagePath)
        .then(() => {
          Alert.alert('User registered successfully!');
          // Clear form fields and states
          setName('');
          setPhone('');
          setPassword('');
          setAvatarSource(null);
          setImagePath(null);
          setPhoneError('');
          setPasswordError('');
        })
        .catch((error) => {
          // Handle specific error for duplicate phone number
          if (error.message === 'User with this phone number already exists.') {
            Alert.alert('User with this phone number already exists.');
          } else {
            console.error('Error registering user: ', error);
          }
        });
    } else {
      // Validation failed, show appropriate alerts
      if (!name) {
        Alert.alert('Please enter a name.');
      } else if (!validatePhone(phone)) {
        Alert.alert('Phone number should be 10 digits.');
      } else if (!validatePassword(password)) {
        Alert.alert(
          'Password should be between 6 to 20 characters and should contain at least one special character.',
        );
      } else if (!imagePath) {
        Alert.alert('Please select an image.');
      }
    }
  };

  return (
    <GluestackUIProvider config={config}>
      <LinearGradient
        colors={['#00c6ff', '#0029ff']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
            <Card size="lg" variant="elevated" m="$3" style={styles.card}>
              <Heading mb="$5" fontSize={30} alignSelf="center">
                Create New User
              </Heading>
              <TouchableOpacity onPress={selectImage}>
                <View style={styles.imagePicker}>
                  {avatarSource ? (
                    <Image
                      source={{ uri: avatarSource }}
                      style={styles.cameraIcon}
                    />
                  ) : (
                    <Image
                      source={Profile}
                      style={styles.cameraIcon}
                    />
                  )}
                  <Text style={styles.selectPhotoText}>Select a Photo</Text>
                </View>
              </TouchableOpacity>
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
                  placeholder="Enter Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.inputField}
                />
              </Input>
              <Input
                variant="outline"
                size="lg"
                isDisabled={false}
                isInvalid={phoneError !== ''}
                isReadOnly={false}
                mb="$5"
                style={styles.input}
              >
                <InputField
                  placeholder="Enter Phone"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (!validatePhone(text)) {
                      setPhoneError('Phone number should be 10 digits.');
                    } else {
                      setPhoneError('');
                    }
                  }}
                  keyboardType="numeric"
                  style={styles.inputField}
                />
              </Input>
              {phoneError !== '' && (
                <Text style={styles.errorText}>{phoneError}</Text>
              )}
              <Input
                variant="outline"
                size="lg"
                isDisabled={false}
                isInvalid={passwordError !== ''}
                isReadOnly={false}
                mb="$5"
                style={styles.input}
              >
                <InputField
                  placeholder="Enter Password"
                  type={showPassword ? 'text' : 'password'} // Toggle password visibility based on showPassword state
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  style={styles.inputField}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordIcon}>
                  {showPassword ? (
                    <Icon as={EyeOffIcon} size="md" color="blue" />
                  ) : (
                    <Icon as={EyeIcon} size="md" color="blue" />
                  )}
                </TouchableOpacity>
              </Input>
              {passwordError !== '' && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
              <Button
                size="md"
                variant="solid"
                action="primary"
                isDisabled={
                  !name || !validatePhone(phone) || !validatePassword(password)
                }
                isFocusVisible={false}
                mt="$10"
                width="$25"
                alignSelf="center"
                borderRadius={20}
                onPress={handleRegister}
                style={styles.SigninButton}
              >
                <ButtonText>Add User</ButtonText>
              </Button>
            </Card>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </GluestackUIProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row', // Ensure input and icon are in a row
    alignItems: 'center', // Center align items vertically
  },
  inputField: {
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1, // Take up remaining space in the row
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginTop: -10,
    fontSize: 15,
  },
  SigninButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 1,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  selectPhotoText: {
    fontSize: 18,
    color: 'grey',
  },
  cameraIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginTop: -10,
  },
  passwordIcon: {
    position: 'absolute',
    right: 10, // Adjust as needed for your layout
  },
});

export default CreateUser;
