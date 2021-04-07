/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useState, useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import SplashScreen from './components/SplashScreen';
import Navigation from './components/Navigation';
import DataContextProvider from './components/context/DataContext';
const App = () => {
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  }, []);
  if (splash) {
    return <SplashScreen />;
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <DataContextProvider>
        <Navigation />
      </DataContextProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
