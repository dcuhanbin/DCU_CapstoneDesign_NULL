import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../constants/styles';

const SectionCard = ({ title, badge, badgeType = 'outline', children }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {badge ? (
        <View
          style={
            badgeType === 'filled' ? styles.badgeFilled : styles.badgeOutline
          }
        >
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
    {children}
  </View>
);

export default function AlarmScreen({
  alarmHistory,
  alarmFilter,
  setAlarmFilter,
}) {
  const filteredAlarms = alarmHistory.filter((item) => {
    if (alarmFilter === '전체') return true;
    if (alarmFilter === '출석 알림') return item.type === 'attendance';
    if (alarmFilter === '보호자 알림') return item.type === 'guardian';
    if (alarmFilter === '시스템 공지') return item.type === 'system';
    return true;
  });

  return (
    <SectionCard
      title="알림 내역"
      badge="출석 · 보호자 · 시스템"
      badgeType="outline"
    >
      <View style={styles.historyFilters}>
        {['전체', '출석 알림', '보호자 알림', '시스템 공지'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.historyFilter,
              alarmFilter === f && styles.historyFilterActive,
            ]}
            onPress={() => setAlarmFilter(f)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                { fontSize: 12, textAlign: 'center' },
                alarmFilter === f
                  ? { color: '#1f2937', fontWeight: '600' }
                  : { color: '#6b7280' },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.historyList}>
        {filteredAlarms.length === 0 ? (
          <View style={styles.placeholderRow}>
            <Text style={styles.helperText}>알림 내역이 없습니다</Text>
          </View>
        ) : (
          filteredAlarms.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View
                style={[
                  styles.historyIcon,
                  item.type === 'attendance' && styles.historyIconAttendance,
                ]}
              />
              <View style={styles.historyContent}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <Text style={styles.historyBody}>{item.body}</Text>
              </View>
              <Text style={styles.historyTime}>
                {item.date + ' ' + item.time}
              </Text>
            </View>
          ))
        )}
      </View>
      {filteredAlarms.length > 0 && (
        <>
          <View style={styles.alarmTableHeader}>
            <View style={[styles.alarmTableCell, styles.alarmTableColDate]}>
              <Text style={styles.alarmTableHeaderText}>날짜</Text>
            </View>
            <View style={[styles.alarmTableCell, styles.alarmTableColTime]}>
              <Text style={styles.alarmTableHeaderText}>시간</Text>
            </View>
            <View style={[styles.alarmTableCell, styles.alarmTableColStatus]}>
              <Text style={styles.alarmTableHeaderText}>상태</Text>
            </View>
          </View>
          {filteredAlarms.map((item) => (
            <View key={item.id} style={styles.alarmTableRow}>
              <View style={[styles.alarmTableCell, styles.alarmTableColDate]}>
                <Text style={styles.alarmTableCellText}>{item.date}</Text>
              </View>
              <View style={[styles.alarmTableCell, styles.alarmTableColTime]}>
                <Text style={styles.alarmTableCellText}>{item.time}</Text>
              </View>
              <View
                style={[styles.alarmTableCell, styles.alarmTableColStatus]}
              >
                <Text style={styles.alarmTableCellText}>{item.status}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </SectionCard>
  );
}

