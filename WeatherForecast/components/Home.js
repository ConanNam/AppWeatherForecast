import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
  RefreshControl,
  StatusBar,
  TextInput,
  PermissionsAndroid,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialIcons';

const openWeatherKey = `50e84571dbe337604074ef3e73cfa370`;
const openWeatherKey2 = `d2307b5cea109f1be2239d2588f020a0`;
let url = `https://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}&lang=vi`;

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
const styles = StyleSheet.create({
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 42,
    color: 'white',
  },
  subtitle: {
    fontSize: 24,
    marginVertical: 12,
    marginLeft: 4,
    color: 'white',
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  currentDescription: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 24,
    marginBottom: 24,
    color: 'white',
  },
  hour: {
    padding: 6,
    alignItems: 'center',
  },
  day: {
    flexDirection: 'row',
  },
  dayDetails: {
    justifyContent: 'center',
  },
  dayTemp: {
    marginLeft: 12,
    alignSelf: 'center',
    fontSize: 20,
    color: 'white',
  },
  largeIcon: {
    width: 200,
    height: 200,
  },
  smallIcon: {
    width: 100,
    height: 100,
  },
  childrentDetailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.3)',
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
  },
});

// const getFirtNameCity = (lat, lon) => {
//   if (lat !== undefined && lon !== undefined) {
//     axios({
//       method: 'GET',
//       url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherKey2}&lang=vi`,
//     })
//       .then(Response => {
//         return Response.data['name'];
//       })
//       .catch(Error => {
//         // Alert.alert('Lỗi', [
//         //   {
//         //     text: 'OK',
//         //     onPress: () => console.log('Cancel Pressed'),
//         //     style: 'cancel',
//         //   },
//         // ]);
//       });
//   }
// };

const formatSrt = str => {
  let desc = str[0].toUpperCase() + str.substring(1, 100);
  return desc;
};

const Home = ({navigation, route}) => {
  const [search, setSearch] = useState(null);
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [city, setCity] = useState('search');
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'MyMapApp needs access to your location',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          info => {
            let location = info.coords;
            setLat(location.latitude);
            setLon(location.longitude);
          },
          error => console.log(error),
          {
            enableHighAccuracy: true,
            timeout: 2000,
            maximumAge: 3600000,
          },
        );
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);

  useEffect(() => {
    if (route.params?.s) {
      setSearch(route.params?.s);
    }
  }, [route.params?.s]);

  useEffect(() => {
    loadForecast();
  }, [lat, lon]);

  useEffect(() => {
    if (search !== null) {
      axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${openWeatherKey2}&lang=vi`,
      })
        .then(Response => {
          console.log(
            Response.data['coord'].lat + ' ' + Response.data['coord'].lon,
          );

          setLat(Response.data['coord'].lat);
          setLon(Response.data['coord'].lon);
          setCity(Response.data['name']);
        })
        .catch(Error => {
          console.log(Error);
        });
    }
  }, [search]);

  const loadForecast = async () => {
    setRefreshing(true);
    const response = await fetch(`${url}&lat=${lat}&lon=${lon}`);
    const data = await response.json();
    if (response.ok) {
      setForecast(data);
    } else {
      if (city === null) {
        Alert.alert('Lỗi', 'Không tìm thấy địa điểm', [
          {
            text: 'OK',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ]);
      }
    }
    setRefreshing(false);
  };

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const current = forecast.current.weather[0];
  console.log(current);
  return (
    <ImageBackground
      style={styles.container}
      source={require('./assets/blue-sky.jpg')}>
      <StatusBar hidden={true} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
        }}>
        <View
          style={{
            padding: 10,
            borderRadius: 20,
            height: 50,
            width: '100%',
            marginLeft: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Icon2 name="place" size={30} color="white" />
          <Text
            style={{
              paddingVertical: 0,
              color: 'white',
              fontSize: 22,
              textAlign: 'center',
            }}>
            {city}
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
              height: 40,
              width: 40,
            }}
            onPress={() => navigation.navigate('Search')}>
            <Icon name="search1" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              loadForecast();
            }}
            refreshing={refreshing}
          />
        }>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.3)',
            borderRadius: 10,
            marginTop: 20,
          }}>
          <View style={styles.current}>
            <Image
              style={styles.largeIcon}
              source={{
                uri: `https://openweathermap.org/img/wn/${current.icon}@4x.png`,
              }}
            />
            <View>
              <Text style={styles.currentTemp}>
                {Math.round(forecast.current.temp)}°C
              </Text>
              <Text style={{fontSize: 15, color: 'white'}}>
                Cảm giác như: {Math.round(forecast.current.feels_like)}°C
              </Text>
            </View>
          </View>
          <Text style={styles.currentDescription}>
            {formatSrt(current.description)}
          </Text>
        </View>
        <Text style={styles.subtitle}>Chi tiết</Text>
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={styles.childrentDetailContainer}>
              <Image
                source={require('./assets/humidity.png')}
                style={{width: 40, height: 40, margin: 10}}
              />
              <Text style={{fontSize: 20, color: 'white'}}>
                {forecast.current.humidity}%
              </Text>
              <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
                Độ ẩm
              </Text>
            </View>
            <View style={styles.childrentDetailContainer}>
              <Image
                source={require('./assets/dew-point.png')}
                style={{width: 40, height: 40, margin: 10}}
              />
              <Text style={{fontSize: 20, color: 'white'}}>
                {forecast.current.dew_point}°C
              </Text>
              <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
                Điểm sương
              </Text>
            </View>
            <View style={styles.childrentDetailContainer}>
              <Image
                source={require('./assets/wind.png')}
                style={{width: 40, height: 40, margin: 10}}
              />
              <Text style={{fontSize: 20, color: 'white'}}>
                {forecast.current.wind_speed} m/s
              </Text>
              <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
                Tốc độ gió
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={styles.childrentDetailContainer}>
              <Image
                source={require('./assets/witness.png')}
                style={{width: 40, height: 40, margin: 10}}
              />
              <Text style={{fontSize: 20, color: 'white'}}>
                {forecast.current.visibility / 1000} km
              </Text>
              <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
                Tầm nhìn
              </Text>
            </View>
            <View style={styles.childrentDetailContainer}>
              <Image
                source={require('./assets/ultraviolet.png')}
                style={{width: 40, height: 40, margin: 10}}
              />
              <Text style={{fontSize: 20, color: 'white'}}>
                {forecast.current.uvi}
              </Text>
              <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
                Chỉ số UV
              </Text>
            </View>
            <View style={styles.childrentDetailContainer}>
              <Image
                source={require('./assets/pressure.png')}
                style={{width: 40, height: 40, margin: 10}}
              />
              <Text style={{fontSize: 20, color: 'white'}}>
                {forecast.current.pressure} mb
              </Text>
              <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
                Sức ép
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: 'rgba(52, 52, 52, 0.3)',
            marginTop: 20,
            paddingBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={styles.subtitle}>24 giờ tới</Text>
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={() => {
                navigation.navigate('WeatherHourly', {
                  hourlyData: forecast,
                });
              }}>
              <Image
                source={require('./assets/more.png')}
                style={{width: 30, height: 30, marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={forecast.hourly.slice(0, 24)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={hour => {
              const weather = hour.item.weather[0];
              var dt = new Date(hour.item.dt * 1000);
              let desc =
                weather.description[0].toUpperCase() +
                weather.description.substring(1, 100);
              return (
                <View style={styles.hour}>
                  <Text style={{color: 'white'}}>
                    {dt.toLocaleTimeString().replace(/:\d+ /, ' ')}
                  </Text>
                  <Text style={{color: 'white'}}>
                    {Math.round(hour.item.temp)}°C
                  </Text>
                  <Image
                    style={styles.smallIcon}
                    source={{
                      uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                    }}
                  />
                  <Text style={{color: 'white'}}>{desc}</Text>
                </View>
              );
            }}
          />
        </View>

        <View style={{marginTop: 20, backgroundColor: 'rgba(52, 52, 52, 0.3)'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text style={styles.subtitle}>7 ngày tiếp theo</Text>
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}
              onPress={() =>
                navigation.navigate('WeatherDaily', {
                  dailyData: forecast,
                })
              }>
              <Image
                source={require('./assets/more.png')}
                style={{width: 30, height: 30, marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
          {forecast.daily.slice(0, 7).map(d => {
            //Only want the next 5 days
            const weather = d.weather[0];
            var dt = new Date(d.dt * 1000);
            let desc =
              weather.description[0].toUpperCase() +
              weather.description.substring(1, 100);
            return (
              <View style={styles.day} key={d.dt}>
                <Text style={styles.dayTemp}>{Math.round(d.temp.max)}°C</Text>
                <Image
                  style={styles.smallIcon}
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                  }}
                />
                <View style={styles.dayDetails}>
                  <Text style={{color: 'white'}}>
                    {dt.toLocaleDateString('en-GB', options)}
                  </Text>
                  <Text style={{color: 'white'}}>{desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Home;
