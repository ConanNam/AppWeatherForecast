import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import IconF from 'react-native-vector-icons/FontAwesome5';
import IconA from 'react-native-vector-icons/AntDesign';
import IconFe from 'react-native-vector-icons/Feather';
import {DataContext} from '../components/context/DataContext';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

const DrawerContent = ({props, navigation}) => {
  const {
    C,
    kmh,
    mbar,
    km,
    locate,
    toggleSwitchC,
    toggleSwitchKmh,
    toggleSwitchMbar,
    toggleSwitchKm,
  } = useContext(DataContext);
  return (
    <ImageBackground
      style={{flex: 1, padding: 10}}
      source={require('./assets/blue-sky-2.jpg')}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomColor: 'white',
          borderBottomWidth: 0.5,
          padding: 10,
        }}>
        <Avatar.Image source={require('./assets/logo.jpg')} />
        <Text style={{fontSize: 20, color: 'white', marginLeft: 5}}>
          Weather Forecast
        </Text>
      </View>
      <DrawerContentScrollView {...props}>
        <View>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 0.5,
              paddingBottom: 10,
            }}>
            <Text
              style={{
                color: 'yellow',
                marginTop: 20,
                fontSize: 20,
              }}>
              History
            </Text>
            {/* <FlatList
              data={locate}
              keyExtractor={(item, index) => index.toString()}
              renderItem={lc => {
                return (
                  <View>
                    <TouchableOpacity
                      style={{flexDirection: 'row', marginTop: 20}}
                      onPress={() => {
                        navigation.navigate('Home', {
                          s: lc.item,
                        });
                      }}>
                      <IconFe name="map-pin" size={22} color="white" />
                      <Text
                        style={{fontSize: 16, color: 'white', marginLeft: 10}}>
                        {lc.item}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            /> */}
            {locate.map((lc, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', marginTop: 20}}
                    onPress={() => {
                      navigation.navigate('Home', {
                        s: lc,
                      });
                    }}>
                    <IconFe name="map-pin" size={22} color="white" />
                    <Text
                      style={{fontSize: 16, color: 'white', marginLeft: 10}}>
                      {lc}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <Text
            style={{
              color: 'yellow',
              marginTop: 20,
              fontSize: 20,
            }}>
            Điều chỉnh các đơn vị
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <IconF name="temperature-high" size={25} color="white" />
              <Text style={{fontSize: 16, color: 'white', marginLeft: 5}}>
                Nhiệt độ (C or F)
              </Text>
            </View>
            <Switch value={C} onValueChange={toggleSwitchC} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <IconF name="wind" size={25} color="white" />
              <Text style={{fontSize: 16, color: 'white', marginLeft: 5}}>
                Gió (m/s or km/h)
              </Text>
            </View>
            <Switch value={kmh} onValueChange={toggleSwitchKmh} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <IconA name="dashboard" size={25} color="white" />
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  marginLeft: 5,
                  textAlign: 'center',
                }}>
                Áp suất (mbar or bar)
              </Text>
            </View>
            <Switch value={mbar} onValueChange={toggleSwitchMbar} />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <IconA name="eyeo" size={25} color="white" />
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  marginLeft: 5,
                  textAlign: 'center',
                }}>
                Tầm nhìn (m or km)
              </Text>
            </View>
            <Switch value={km} onValueChange={toggleSwitchKm} />
          </View>
        </View>
      </DrawerContentScrollView>
    </ImageBackground>
  );
};

export default DrawerContent;
