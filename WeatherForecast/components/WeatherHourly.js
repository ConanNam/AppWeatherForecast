import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    marginBottom: 5,
  },
});

const WeatherHourly = ({navigation, route}) => {
  let forcast = route.params.hourlyData;
  let hourly = forcast.hourly;
  return (
    <ImageBackground
      style={styles.container}
      source={require('./assets/blue-sky-2.jpg')}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-start',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <TouchableOpacity
          style={{marginRight: 30, width: 50}}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" color="white" size={30} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 30, fontWeight: '500'}}>
          Weather Hourly
        </Text>
      </View>
      <FlatList
        data={hourly.slice(0, 24)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={hour => {
          const weather = hour.item.weather[0];
          var dt = new Date(hour.item.dt * 1000);
          let dew_point = hour.item.dew_point;
          let feels_like = hour.item.feels_like;
          let humidity = hour.item.humidity;
          let pressure = hour.item.pressure;
          let uvi = hour.item.uvi;
          let visibility = hour.item.visibility;
          let wind_speed = hour.item.wind_speed;

          return (
            <View>
              <View
                style={{
                  borderBottomColor: 'white',
                  borderBottomWidth: 0.5,
                  width: '50%',
                  padding: 10,
                }}>
                <Text style={{color: 'white', fontSize: 20, width: '100%'}}>
                  {dt.toLocaleTimeString().replace(/:\d+ /, ' ')} (
                  {dt.toLocaleDateString('en-GB')})
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottomColor: 'white',
                  borderBottomWidth: 0.5,
                  width: '100%',
                  padding: 10,
                }}>
                <View>
                  <Text style={styles.text}>Điểm sương: {dew_point}</Text>
                  <Text style={styles.text}>Độ ẩm: {humidity}%</Text>
                  <Text style={styles.text}>Tốc độ gió: {wind_speed} m/s</Text>
                  <Text style={styles.text}>
                    Tầm nhìn: {visibility / 1000} km
                  </Text>
                  <Text style={styles.text}>Chỉ số UV: {uvi}</Text>
                  <Text style={styles.text}>Áp suất: {pressure} mb</Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    style={{width: 100, height: 100}}
                    source={{
                      uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                    }}
                  />
                  <Text style={{color: 'white', fontSize: 25}}>
                    {Math.round(hour.item.temp)}°C
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </ImageBackground>
  );
};

export default WeatherHourly;
