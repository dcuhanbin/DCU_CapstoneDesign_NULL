import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../constants/styles';

export default function GuardianForm({
  guardianName,
  setGuardianName,
  guardianPhone,
  setGuardianPhone,
  guardianRelation,
  setGuardianRelation,
  nextPriority,
  isEditing,
  onAdd,
  onCancel,
}) {
  return (
    <View>
      <View style={styles.guardianRow}>
        <View style={styles.guardianInputGroup}>
          <Text style={styles.guardianLabel}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="보호자 이름"
            placeholderTextColor="#6b7280"
            value={guardianName}
            onChangeText={setGuardianName}
            autoCorrect={false}
          />
        </View>
        <View style={styles.guardianInputGroup}>
          <Text style={styles.guardianLabel}>전화번호</Text>
          <TextInput
            style={styles.input}
            placeholder="010-0000-0000"
            placeholderTextColor="#6b7280"
            value={guardianPhone}
            onChangeText={(text) => {
              const numbers = text.replace(/[^0-9]/g, '');
              let formatted = numbers;
              if (numbers.length <= 3) {
                formatted = numbers;
              } else if (numbers.length <= 7) {
                formatted = numbers.slice(0, 3) + '-' + numbers.slice(3);
              } else if (numbers.length <= 11) {
                formatted =
                  numbers.slice(0, 3) +
                  '-' +
                  numbers.slice(3, 7) +
                  '-' +
                  numbers.slice(7);
              } else {
                return;
              }
              setGuardianPhone(formatted);
            }}
            keyboardType="phone-pad"
          />
        </View>
      </View>
      <View style={styles.guardianRow}>
        <View style={styles.guardianInputGroup}>
          <Text style={styles.guardianLabel}>관계</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => {
              const relations = ['자녀', '부모', '배우자', '형제'];
              const idx = relations.indexOf(guardianRelation);
              setGuardianRelation(relations[(idx + 1) % relations.length]);
            }}
          >
            <Text style={styles.selectBoxText}>{guardianRelation}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.guardianInputGroup}>
          <Text style={styles.guardianLabel}>우선순위</Text>
          <View style={styles.selectBox}>
            <Text style={styles.selectBoxText}>
              {nextPriority > 3 ? '—' : nextPriority + '차'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.guardianActions}>
        <TouchableOpacity
          style={[styles.guardianBtn, styles.guardianBtnSecondary]}
          onPress={onCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.guardianBtnSecondaryText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.guardianBtn, styles.guardianBtnPrimary]}
          onPress={onAdd}
          activeOpacity={0.8}
        >
          <Text style={styles.guardianBtnPrimaryText}>
            {isEditing ? '수정하기' : '등록하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

