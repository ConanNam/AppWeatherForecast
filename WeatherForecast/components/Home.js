import React, {useState, useEffect, useContext} from 'react';
import {DataContext} from '../components/context/DataContext';
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
let locationArr = [];
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

const formatSrt = str => {
  let desc = str[0].toUpperCase() + str.substring(1, 100);
  return desc;
};

let fLat = 0;
let fLon = 0;

const Home = ({navigation, route}) => {
  const [search, setSearch] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [city, setCity] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const getFirtNameCity = () => {
    if (fLat && fLon) {
      axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${fLat}&lon=${fLon}&appid=${openWeatherKey2}&lang=vi`,
      })
        .then(Response => {
          if (Response.data) {
            console.log(`Response.data.name`, Response.data.name);
            setCity(Response.data.name);
          }
        })
        .catch(Error => {
          // Alert.alert('Lỗi', [
          //   {
          //     text: 'OK',
          //     onPress: () => console.log('Cancel Pressed'),
          //     style: 'cancel',
          //   },
          // ]);
        });
    }
  };

  const {C, kmh, mbar, km, s, handleLocate} = useContext(DataContext);

  console.log(C);
  console.log('drawerContent' + route.params?.s);

  useEffect(() => {
    if (route.params?.s) {
      setSearch(route.params?.s);
    }
  }, [route.params?.s]);

  useEffect(() => {
    setSearch(s);
  }, [s]);

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

            fLat = location.latitude;
            fLon = location.longitude;
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
    getFirtNameCity();
  }, [fLat, fLon]);

  useEffect(() => {
    if (lat && lon) {
      loadForecast();
    }
  }, [lat, lon]);

  console.log(`city`, city);

  useEffect(() => {
    if (search) {
      axios({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${openWeatherKey2}&lang=vi`,
      })
        .then(Response => {
          if (!locationArr.includes(Response.data['name'])) {
            locationArr.push(Response.data['name']);
            handleLocate(locationArr);
          }
          setLat(Response.data['coord'].lat);
          setLon(Response.data['coord'].lon);
          setCity(Response.data['name']);
        })
        .catch(Error => {
          Alert.alert('Lỗi', 'Không tìm thấy địa điểm', [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel ok'),
            },
          ]);
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
      console.log('error');
      // Alert.alert('Lỗi', 'Không tìm thấy địa điểm', [
      //   {
      //     text: 'OK',
      //     onPress: () => console.log('Cancel Pressed'),
      //     style: 'cancel',
      //   },
      // ]);
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
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Icon2 name="menu" size={30} color="white" />
          </TouchableOpacity>
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
              //style={styles.largeIcon}
              source={{
                uri: `https://openweathermap.org/img/wn/${current.icon}@4x.png`,
                width: 200,
                height: 200,
              }}
            />
            <View>
              <Text style={styles.currentTemp}>
                {C === true ? (
                  <Text>{Math.round(forecast.current.temp * 1.8 + 32)}°F</Text>
                ) : (
                  <Text>{Math.round(forecast.current.temp)}°C</Text>
                )}
              </Text>
              <Text style={{fontSize: 15, color: 'white'}}>
                {C === true ? (
                  <Text>
                    Cảm giác như:{' '}
                    {Math.round(forecast.current.feels_like * 1.8 + 32)}°F
                  </Text>
                ) : (
                  <Text>
                    Cảm giác như: {Math.round(forecast.current.feels_like)}°C
                  </Text>
                )}
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
                {forecast.current.dew_point}
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
                {kmh === true ? (
                  <Text>
                    {Math.round(forecast.current.wind_speed * 3.6)} km/h
                  </Text>
                ) : (
                  <Text>{forecast.current.wind_speed} m/s</Text>
                )}
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
                {km === true ? (
                  <Text>{forecast.current.visibility / 1000} km</Text>
                ) : (
                  <Text>{forecast.current.visibility} m</Text>
                )}
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
                {mbar === true ? (
                  <Text>{forecast.current.pressure / 1000} b</Text>
                ) : (
                  <Text>{forecast.current.pressure} mb</Text>
                )}
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
                    {C === true ? (
                      <Text>{Math.round(hour.item.temp * 1.8 + 32)}°F</Text>
                    ) : (
                      <Text>{Math.round(hour.item.temp)}°C</Text>
                    )}
                  </Text>
                  <Image
                    //style={styles.smallIcon}
                    source={{
                      uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                      width: 100,
                      height: 100,
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
                <Text style={styles.dayTemp}>
                  {C === true ? (
                    <Text>{Math.round(d.temp.max * 1.8 + 32)}°F</Text>
                  ) : (
                    <Text>{Math.round(d.temp.max)}°C</Text>
                  )}
                </Text>
                <Image
                  //style={styles.smallIcon}
                  source={{
                    uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
                    width: 100,
                    height: 100,
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
