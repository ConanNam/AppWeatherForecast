import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from './Home';
import WeatherHourly from './WeatherHourly';
import WeatherDaily from './WeatherDaily';
import Search from './Search';
import DrawerContent from './DrawerContent';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerRoute = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={DrawerRoute}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WeatherHourly"
          component={WeatherHourly}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WeatherDaily"
          component={WeatherDaily}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DrawerContent"
          component={DrawerContent}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
