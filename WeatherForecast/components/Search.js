import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import dataSheet from './data.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});

let cities = dataSheet;
let temp = null;
var value = null;
const Search = ({navigation, route}) => {
  const [tempSreach, setTempSearch] = useState('');

  useEffect(() => {
    temp = cities.filter(item => {
      return item.name.toLowerCase().includes(tempSreach.toLowerCase());
    });
    console.log(`tempSearch: ` + tempSreach);
    console.log(temp.length);
  }, [tempSreach]);
  return (
    <ImageBackground
      style={styles.container}
      source={require('./assets/blue-sky-2.jpg')}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
          padding: 10,
          width: '85%',
        }}>
        <TouchableOpacity
          style={{marginRight: 30, width: 50}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrow-back-ios" color="white" size={30} />
        </TouchableOpacity>
        <TextInput
          placeholder="Tìm kiếm"
          placeholderTextColor="white"
          style={{fontSize: 25, color: 'white', marginRight: 30, width: '70%'}}
          onChangeText={text => {
            setTempSearch(text);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            value = tempSreach;
            if (value !== null) {
              navigation.navigate('Home', {
                s: value,
              });
            }
          }}>
          <Icon2 name="search1" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {temp && (
        <FlatList
          data={temp.slice(0, 18)}
          keyExtractor={(item, index) => index.toString()}
          renderItem={city => {
            return (
              <View style={{marginBottom: 10}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',
                  }}
                  onPress={() => {
                    temp = null;
                    navigation.navigate('Home', {
                      s: city.item.name,
                    });
                  }}>
                  <Icon name="place" size={22} color="white" />
                  <Text style={{fontSize: 22, color: 'white', marginLeft: 10}}>
                    {city.item.name}, {city.item.country}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </ImageBackground>
  );
};

export default Search;
