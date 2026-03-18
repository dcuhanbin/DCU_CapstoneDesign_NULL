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

export default function CashScreen({
  cashHistory,
  cashFilter,
  setCashFilter,
  cashPeriod,
  setCashPeriod,
}) {
  const now = new Date();

  const filteredCash = cashHistory.filter((item) => {
    if (cashFilter === '적립만' && item.type !== 'earn') return false;
    if (cashFilter === '사용만' && item.type !== 'spend') return false;
    if (cashPeriod === '오늘') {
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      if (!item.date.startsWith(month + '/' + day)) return false;
    }
    if (cashPeriod === '최근 7일') {
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const [md] = item.date.split(' ');
      const [m, d] = md.split('/');
      const itemDate = new Date(now.getFullYear(), Number(m) - 1, Number(d));
      if (itemDate < cutoff) return false;
    }
    if (cashPeriod === '최근 30일') {
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const [md] = item.date.split(' ');
      const [m, d] = md.split('/');
      const itemDate = new Date(now.getFullYear(), Number(m) - 1, Number(d));
      if (itemDate < cutoff) return false;
    }
    return true;
  });

  return (
    <SectionCard
      title="캐시 내역"
      badge="적립 · 사용 · 환불"
      badgeType="outline"
    >
      <View style={styles.historyFilters}>
        {['전체', '적립만', '사용만'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.historyFilter,
              cashFilter === f && styles.historyFilterActive,
            ]}
            onPress={() => setCashFilter(f)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                { fontSize: 12, textAlign: 'center' },
                cashFilter === f
                  ? { color: '#1f2937', fontWeight: '600' }
                  : { color: '#6b7280' },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.cashPeriodRow}>
        {['오늘', '최근 7일', '최근 30일', '전체'].map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.periodButton,
              cashPeriod === p && styles.periodButtonActive,
            ]}
            onPress={() => setCashPeriod(p)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                { fontSize: 12, textAlign: 'center' },
                cashPeriod === p
                  ? { color: '#1f2937', fontWeight: '600' }
                  : { color: '#6b7280' },
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.cashList}>
        {filteredCash.length === 0 ? (
          <View style={styles.placeholderRow}>
            <Text style={styles.helperText}>해당 내역이 없습니다</Text>
          </View>
        ) : (
          filteredCash.map((item) => (
            <View key={item.id} style={styles.cashItem}>
              <Text
                style={
                  item.type === 'earn'
                    ? styles.cashAmountPositive
                    : styles.cashAmountNegative
                }
              >
                {item.type === 'earn' ? '+' : '-'}
                {item.amount} 캐시
              </Text>
              <View style={styles.cashInfo}>
                <Text style={styles.cashReason}>{item.reason}</Text>
                <Text style={styles.cashMeta}>
                  잔액 {item.balance.toLocaleString()} 캐시 · {item.date}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </SectionCard>
  );
}

