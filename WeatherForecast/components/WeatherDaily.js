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

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

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

const WeatherDaily = ({navigation, route}) => {
  let forcast = route.params.dailyData;
  let daily = forcast.daily;
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
          Weather Daily
        </Text>
      </View>
      <FlatList
        data={daily.slice(0, 7)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={daily => {
          const weather = daily.item.weather[0];
          var dt = new Date(daily.item.dt * 1000);

          let dew_point = daily.item.dew_point;
          let min = daily.item.temp.min;
          let max = daily.item.temp.max;
          let humidity = daily.item.humidity;
          let pressure = daily.item.pressure;
          let uvi = daily.item.uvi;
          let wind_speed = daily.item.wind_speed;
          let sunrise = new Date(daily.item.sunrise * 1000);
          let sunset = new Date(daily.item.sunset * 1000);

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
                  {dt.toLocaleDateString('en-GB')}
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

                  <Text style={styles.text}>Chỉ số UV: {uvi}</Text>
                  <Text style={styles.text}>Áp suất: {pressure} mb</Text>
                  <Text style={styles.text}>
                    Bình minh{' '}
                    {sunrise.toLocaleTimeString().replace(/:\d+ /, ' ')}
                  </Text>
                  <Text style={styles.text}>
                    Hoàng hôn{' '}
                    {sunset.toLocaleTimeString().replace(/:\d+ /, ' ')}
                  </Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    style={{width: 100, height: 100}}
                    source={{
                      uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                    }}
                  />
                  <Text style={{color: 'white', fontSize: 25}}>
                    {Math.round(min)} ~ {Math.round(max)}°C
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

export default WeatherDaily;
