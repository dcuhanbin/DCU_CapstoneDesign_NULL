import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import styles from '../constants/styles';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function StatsScreen({ stepCount }) {
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity) => `rgba(234, 88, 12, ${opacity})`,
    labelColor: (opacity) => `rgba(107, 114, 128, ${opacity})`,
    style: { borderRadius: 12 },
    propsForDots: { r: '5', strokeWidth: '2', stroke: '#ea580c' },
  };

  const lineChartData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [{ data: [1, 0.5, 1.5, 2, 1, 0.7, 0.7] }],
  };

  return (
    <View style={styles.statsWrap}>
      <View style={styles.statsCircleSection}>
        <Text style={styles.statsCircleTitle}>오늘의 걸음수</Text>
        <View style={styles.statsCircle}>
          <Text style={styles.statsCircleValue}>
            {stepCount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.statsMetricRow}>
          <View style={styles.statsMetricItem}>
            <Text style={styles.statsMetricIcon}>📍</Text>
            <Text style={styles.statsMetricValue}>
              {(stepCount * 0.0007).toFixed(2)}
            </Text>
            <Text style={styles.statsMetricUnit}>Km</Text>
          </View>
          <View style={styles.statsMetricItem}>
            <Text style={styles.statsMetricIcon}>🔥</Text>
            <Text style={styles.statsMetricValue}>
              {Math.round(stepCount * 0.04)}
            </Text>
            <Text style={styles.statsMetricUnit}>kcal</Text>
          </View>
          <View style={styles.statsMetricItem}>
            <Text style={styles.statsMetricIcon}>⏱️</Text>
            <Text style={styles.statsMetricValue}>
              {Math.floor(stepCount / 100) + 'h ' + (stepCount % 100) + 'm'}
            </Text>
            <Text style={styles.statsMetricUnit}>보행시간</Text>
          </View>
        </View>
      </View>
      <View style={styles.statsGraphSection}>
        <Text style={styles.statsGraphTitle}>주간 그래프</Text>
        <LineChart
          data={lineChartData}
          width={SCREEN_WIDTH - 48}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 12, marginLeft: -16 }}
        />
        <Text style={styles.statsGraphNote}>
          단위: 보행 시간(h) · 센서 연동 후 실제 데이터로 대체됩니다
        </Text>
      </View>
    </View>
  );
}

