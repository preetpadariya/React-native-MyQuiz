import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Heading } from '@gluestack-ui/themed';

const ShakingElement = () => {
  const shakeRef = useRef(null);

  useEffect(() => {
    // Trigger the shake animation on mount
    if (shakeRef.current) {
      shakeRef.current.shake(800); // 800 is the duration of the shake animation in milliseconds
    }

    // Show loading text after 5 seconds
    const timer = setTimeout(() => {
    }, 5000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

  return (
    <LinearGradient
      colors={['#ffffff', '#00a9ff']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <Animatable.View
          ref={shakeRef}
          animation="bounceInUp"
          iterationCount="infinite"
          style={styles.element}
        >
          <Image
            source={require('../assets/logoo.png')} // Replace with your actual image path
            style={styles.image}
            resizeMode="cover"
          />
        </Animatable.View>
        <Heading style={styles.heading} color='maroon'>My Quiz</Heading>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  element: {
    width: 150,
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: 33,
    fontWeight: 'bold',
    marginTop: 30, // Adjust spacing as needed
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 20, // Adjust bottom spacing as needed
  },
  loadingText: {
    fontSize: 18,
    color: '#333', // Example color
  },
});

export default ShakingElement;
