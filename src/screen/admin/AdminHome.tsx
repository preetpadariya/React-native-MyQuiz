import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Icon,
  MenuIcon,
  AddIcon,
  GluestackUIProvider,
  LockIcon,
  InfoIcon,
  HelpCircleIcon,
} from '@gluestack-ui/themed';
import AdminUserList from '../admin/AdminUserList';
import Report from '../admin/Report';
import AdminQuestionList from '../admin/AdminQuestionList';
import {useAuth} from '../../utils/AuthContext';
import {config} from '@gluestack-ui/config';
import CreateUser from './CreateUser';

const Tab = createBottomTabNavigator();

export default function Admin({navigation}: any) {
  const {logout} = useAuth();

  const handleLogoutPress = async () => {
    await logout();
    navigation.replace('Signin');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <GluestackUIProvider config={config}>
        <Tab.Navigator>
          <Tab.Screen
            name="User list"
            component={AdminUserList}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon as={MenuIcon} size="md" color="blue" />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Add User"
            component={CreateUser}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon as={AddIcon} size="md" color="blue" />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Question List"
            component={AdminQuestionList}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon as={HelpCircleIcon} size="md" color="blue" />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Report"
            component={Report}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon as={InfoIcon} size="md" color="blue" />
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
                <Icon as={LockIcon} size="md" color="blue" />
              ),
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </GluestackUIProvider>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
// });
