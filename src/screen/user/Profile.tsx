import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  ButtonText,
  Card,
  Button,
  GluestackUIProvider,
  Heading,
  Text,
} from '@gluestack-ui/themed';
import {
  launchImageLibrary as _launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import { useAuth } from '../../utils/AuthContext'; // Import the useAuth hook
import { config } from '@gluestack-ui/config';

const Profile = require('../../assets/Profile.png');
let launchImageLibrary = _launchImageLibrary;

const EditUserProfile = () => {
  const { user} = useAuth();
  const [avatarSource, setAvatarSource] = useState(user.image);
  const [imagePath, setImagePath] = useState(user.image);

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

  return (
    <GluestackUIProvider config={config}>
      <LinearGradient
        colors={['#ffffff', '#00a9ff']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
            <Card size="lg" variant="elevated" m="$3" style={styles.card}>
              <Heading mb="$5" fontSize={30} alignSelf="center">
                {user.name}            
              </Heading>
                <View style={styles.imagePicker}>
                  {/* {avatarSource ? ( */}
                    <Image
                      source={{ uri: avatarSource }}
                      style={styles.cameraIcon}
                    />
                  {/* // ) : (
                  //   <Image source={Profile} style={styles.cameraIcon} />
                  // )} */}
                </View>
                <View style={styles.textCenter}>
              <Text style={styles.userInfo}>Phone: {user.phone}</Text>
              <Text style={styles.userInfo}>ID: {user.id}</Text>
              <Text style={styles.userInfo}>Password: {user.password}</Text>
              </View>
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
    paddingHorizontal: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: -10,
  },
  textCenter: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'left',
    marginBottom: 10,
  },
});

export default EditUserProfile;
