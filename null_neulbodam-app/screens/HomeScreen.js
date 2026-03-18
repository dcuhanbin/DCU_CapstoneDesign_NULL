import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../constants/styles';

export default function HomeScreen({
  cashBalance,
  stepCount,
  isPedometerAvailable,
  setMainTab,
}) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  return (
    <View style={styles.homeWrap}>
      <View style={styles.homeTopBar}>
        <View style={styles.homeTopBarLeft}>
          <Text style={styles.homeCashIcon}>🪙</Text>
          <Text style={styles.homeCashText}>
            {cashBalance.toLocaleString()} 캐시
          </Text>
        </View>
        <TouchableOpacity
          style={styles.homeTopBarRight}
          onPress={() => setMainTab('attendance')}
          activeOpacity={0.8}
        >
          <Text style={styles.homeEventIcon}>✅</Text>
          <Text style={styles.homeEventText}>출석체크</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeStepsSection}>
        <Text style={styles.homeStepsLabel}>오늘의 걸음수</Text>
        <View style={styles.homeStepsCircle}>
          <Text style={styles.homeStepsValue}>
            {stepCount.toLocaleString()}
          </Text>
        </View>
        {!isPedometerAvailable && (
          <Text style={styles.homeStepsUnsupportedText}>
            이 기기는 걸음수 측정을 지원하지 않습니다
          </Text>
        )}
      </View>

      <View style={styles.homeMapSection}>
        <Text style={styles.homeMapTitle}>현재 위치</Text>
        {location ? (
          <MapView
            style={{ width: '100%', height: 160, borderRadius: 16 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="현재 위치"
            />
          </MapView>
        ) : (
          <View style={styles.homeMapPlaceholder}>
            <Text style={styles.homeMapPlaceholderText}>
              📍 위치 불러오는 중...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

