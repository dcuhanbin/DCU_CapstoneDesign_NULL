import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../constants/styles';

export default function SettingsPopup({
  soundMode,
  setSoundMode,
  alarmOn,
  setAlarmOn,
  saveSettings,
}) {
  return (
    <View style={styles.settingsPopup}>
      <View style={styles.settingsPopupSection}>
        <Text style={styles.settingsPopupSectionTitle}>소리</Text>
        <View style={styles.settingsPopupRow}>
          {[
            { key: 'sound', icon: '🔊' },
            { key: 'mute', icon: '🔇' },
            { key: 'vibrate', icon: '📳' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.settingsPopupItem}
              onPress={() => {
                setSoundMode(item.key);
                saveSettings(item.key, alarmOn);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.settingsPopupIcon}>{item.icon}</Text>
              <View
                style={[
                  styles.settingsPopupRadio,
                  soundMode === item.key && styles.settingsPopupRadioActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.settingsPopupDivider} />
      <View style={styles.settingsPopupSection}>
        <Text style={styles.settingsPopupSectionTitle}>알람</Text>
        <View style={styles.settingsPopupRow}>
          {[
            { key: true, icon: '🔔' },
            { key: false, icon: '🔕' },
          ].map((item) => (
            <TouchableOpacity
              key={String(item.key)}
              style={styles.settingsPopupItem}
              onPress={() => {
                setAlarmOn(item.key);
                saveSettings(soundMode, item.key);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.settingsPopupIcon}>{item.icon}</Text>
              <View
                style={[
                  styles.settingsPopupRadio,
                  alarmOn === item.key && styles.settingsPopupRadioActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

