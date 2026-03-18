import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../constants/styles';

export default function EventScreen({ attendance, handleAttendanceCheck }) {
  const periods = [
    { key: 'morning', label: '아침', icon: '☀️' },
    { key: 'noon', label: '점심', icon: '🌞' },
    { key: 'evening', label: '저녁', icon: '🌙' },
  ];

  return (
    <View style={styles.eventWrap}>
      <Text style={styles.eventTitle}>출석 체크</Text>
      <View style={styles.attendanceCheckRow}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={styles.attendanceCheckItem}
            onPress={() => handleAttendanceCheck(p.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.attendanceCheckLabel}>{p.label}</Text>
            <Text style={styles.attendanceCheckIcon}>{p.icon}</Text>
            <View
              style={[
                styles.attendanceCheckBox,
                attendance[p.key] && styles.attendanceCheckBoxDone,
              ]}
            >
              {attendance[p.key] ? (
                <Text style={styles.attendanceCheckMark}>✓</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.eventAdBlock}>
        <Text style={styles.eventAdText}>광고</Text>
      </View>
      <View style={styles.eventAdBlock}>
        <Text style={styles.eventAdText}>광고</Text>
      </View>
    </View>
  );
}

