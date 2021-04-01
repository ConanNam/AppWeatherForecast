import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
  },
});

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Image source={require('./assets/logo.jpg')} style={styles.image}></Image>
      <Text style={styles.text}>Weather Forcast</Text>
    </View>
  );
};

export default SplashScreen;
