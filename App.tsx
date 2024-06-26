import React, { Fragment, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { initDatabase } from './src/utils/database';
import { useAuth } from './src/utils/AuthContext';
import AdminScreen from './src/screen/admin/AdminHome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import UserScreen from './src/screen/user/UserHome';
import Signin from './src/screen/signin';
import { StyledProvider, createConfig } from '@gluestack-style/react';
import { AuthProvider } from './src/utils/AuthContext';
import Loading from './src/utils/loading';

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <Signin navigation={undefined} />
      ) : user.user_type === 1 ? (
        <AdminScreen />
      ) : (
        <UserScreen />
      )}
    </NavigationContainer>
  );
};

const config = createConfig({
  // Your theme configuration
});

const App = () => {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Initialize database and other async tasks
    const initializeApp = async () => {
      await initDatabase(); // Assuming initDatabase returns a Promise or is async
      // Simulate minimum loading time (5 seconds)
      setTimeout(() => {
        setAppLoading(false);
      }, 5000); // Adjust time as needed
    };

    initializeApp();
  }, []);

  // Show loading screen until appLoading is false
  if (appLoading) {
    return <Loading />;
  }

  return (
    <StyledProvider config={config}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </GestureHandlerRootView>
    </StyledProvider>
  );
};

export default App;
