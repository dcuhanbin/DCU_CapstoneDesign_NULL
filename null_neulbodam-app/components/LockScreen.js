import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../constants/styles';

export default function LockScreen({
  cashBalance,
  lockTime,
  lockDate,
  stepCount,
  lockGiftPopup,
  setLockGiftPopup,
  setStage,
  setMainTab,
}) {
  return (
    <View style={styles.lockNewWrap}>
      <View style={styles.lockNewTopBar}>
        <View style={styles.lockNewTopBarLeft}>
          <Text style={styles.lockNewCashIcon}>🪙</Text>
          <Text style={styles.lockNewCashText}>
            {cashBalance.toLocaleString()} 캐시
          </Text>
        </View>
        <View style={styles.lockNewTopBarRight}>
          <TouchableOpacity
            style={styles.lockNewTopBarRightItem}
            onPress={() => setStage('main')}
            activeOpacity={0.8}
          >
            <Text style={styles.lockNewNavIcon}>🏠</Text>
            <Text style={styles.lockNewNavText}>홈</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.lockNewTopBarRightItem}
            onPress={() => {
              setStage('main');
              setMainTab('attendance');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.lockNewNavIcon}>✅</Text>
            <Text style={styles.lockNewNavText}>출석체크</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.lockNewClockWrap}>
        <Text style={styles.lockNewClock}>{lockTime}</Text>
        <Text style={styles.lockNewDateText}>{lockDate}</Text>
      </View>

      <View style={styles.lockNewStepsSection}>
        <Text style={styles.lockNewStepsLabel}>오늘의 걸음수</Text>
        <TouchableOpacity
          style={styles.lockNewStepsCircle}
          onPress={() => setLockGiftPopup(!lockGiftPopup)}
          activeOpacity={0.9}
        >
          <Text style={styles.lockNewStepsValue}>
            {stepCount.toLocaleString()}
          </Text>
          {lockGiftPopup ? (
            <Text style={styles.lockNewGiftOverlay}>🎁</Text>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={styles.lockNewAdBlock}>
        <Text style={styles.lockNewAdText}>광고</Text>
      </View>

      <TouchableOpacity
        style={styles.lockUnlockButton}
        activeOpacity={0.9}
        onPress={() => setStage('main')}
      >
        <Text style={styles.lockUnlockText}>밀어서 잠금해제 &gt;&gt;</Text>
      </TouchableOpacity>
    </View>
  );
}

