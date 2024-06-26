import React, {useState} from 'react';
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
} from '@gluestack-ui/themed';
import {
  launchImageLibrary as _launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {updateUser} from '../../utils/database'; // Import the updateUser function
import {config} from '@gluestack-ui/config';

const Profile = require('../../assets/Profile.png');
let launchImageLibrary = _launchImageLibrary;

const EditUser = ({user, onModelClose}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState(user.password);
  const [avatarSource, setAvatarSource] = useState(user.image);
  const [imagePath, setImagePath] = useState(user.image);
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

  const handleUpdate = async () => {
    try {
      if (name && phone && password) {
        await updateUser(
          user.id,
          name,
          phone,
          password,
          imagePath || avatarSource,
        );
        Alert.alert('User updated successfully!');
        onModelClose();
      } else {
        Alert.alert('Please fill all fields.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Alert.alert('Failed to update user.');
    }
  };

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.mainContainer}>
          <Card size="lg" variant="elevated" m="$3" style={styles.card}>
            <Heading mb="$5" fontSize={30} alignSelf="center">
              Edit User
            </Heading>
            <TouchableOpacity onPress={selectImage}>
              <View style={styles.imagePicker}>
                {avatarSource ? (
                  <Image
                    source={{uri: avatarSource}}
                    style={styles.cameraIcon}
                  />
                ) : (
                  <Image source={Profile} style={styles.cameraIcon} />
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
              style={styles.input}>
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
              isInvalid={false}
              isReadOnly={false}
              mb="$5"
              style={styles.input}>
              <InputField
                placeholder="Enter Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
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
              style={styles.input}>
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
              onPress={handleUpdate}
              style={styles.updateButton}>
              <ButtonText>Update User</ButtonText>
            </Button>
          </Card>
        </View>
      </SafeAreaView>
    </GluestackUIProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
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
  },
  inputField: {
    paddingHorizontal: 10,
    fontSize: 15,
  },
  updateButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginTop: -10,
  },
  selectPhotoText: {
    fontSize: 18,
    color: 'grey',
  },
  passwordIcon: {
    position: 'absolute',
    right: 10,
    top: '50%', // Center vertically
    transform: [{ translateY: 0 }], // Adjust icon position vertically to center with input
  },
  eyeIcon: {
    marginTop: -10, // Adjust icon position vertically to center with input
  },
});

export default EditUser;
