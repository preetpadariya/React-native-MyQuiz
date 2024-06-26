import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GluestackUIProvider, Icon, LockIcon} from '@gluestack-ui/themed';
import Profile from './Profile';
import RespondToQuestions from './RespondToQuestions';
import {useAuth} from '../../utils/AuthContext';
import {config} from '@gluestack-ui/config';

const Tab = createBottomTabNavigator();

export default function UserScreen({navigation}: any) {
  const {logout} = useAuth();
  const [doReload, setDoReaload] = useState(false);
  const nextHandler = () => {
    if (doReload == true) {
      setDoReaload(false);
    }
  };
  const handleLogoutPress = async () => {
    await logout();
    navigation.replace('Signin');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GluestackUIProvider config={config}>
        <Tab.Navigator>
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({color, size}) => (
                <Image
                  source={require('../../assets/Profile.png')}
                  style={{width: size, height: size}}
                />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Start Questions"
            component={RespondToQuestions}
            initialParams={{
              doReload,
              onNext: nextHandler,
            }}
            options={{
              tabBarIcon: ({color, size}) => (
                <Image
                  source={require('../../assets/Start.png')}
                  style={{width: size, height: size}}
                />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Logout"
            component={() => null}
            listeners={{
              tabPress: e => {
                e.preventDefault();
                handleLogoutPress();
              },
            }}
            options={{
              tabBarIcon: ({color, size}) => (
                <Image
                  source={require('../../assets/Logout.png')}
                  style={{width: size-5, height: size-3}}
                />
              ),
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </GluestackUIProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
