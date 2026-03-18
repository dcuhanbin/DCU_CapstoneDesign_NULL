import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import styles from '../constants/styles';
import GuardianForm from './GuardianForm';

function AccountScreen({
  currentUser,
  joinDate,
  guardians,
  guardianName,
  setGuardianName,
  guardianPhone,
  setGuardianPhone,
  guardianRelation,
  setGuardianRelation,
  editingGuardianId,
  handleAddGuardian,
  handleEditGuardian,
  handleDeleteGuardian,
  handleLogout,
  setEditingGuardianId,
  emergencyHours,
  setEmergencyHours,
  emergencyMissCount,
  setEmergencyMissCount,
  emergencyNightLimit,
  setEmergencyNightLimit,
  saveEmergencySettings,
  showToast,
}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickname, setEditNickname] = useState(currentUser);
  const [editPhone, setEditPhone] = useState('');
  const [profileNickname, setProfileNickname] = useState(currentUser);
  const [profilePhone, setProfilePhone] = useState('');

  return (
    <>
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>프로필</Text>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeText}>계정 정보</Text>
          </View>
        </View>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>사진</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileNickname || currentUser}</Text>
            <Text style={styles.profileMeta}>{profilePhone || '전화번호 미설정'}</Text>
            <Text style={styles.profileMeta}>가입일 · {joinDate || '정보 없음'}</Text>
          </View>
        </View>
        <View style={styles.profileMenu}>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.btnSecondary, { flex: 1 }]}
              onPress={() => {
                setEditNickname(profileNickname);
                setEditPhone(profilePhone);
                setShowEditModal(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSecondaryText}>프로필 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnSecondary, { flex: 1, borderColor: '#f97373' }]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.btnSecondaryText, { color: '#f97373' }]}
              >
                로그아웃
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {editingGuardianId ? '보호자 수정' : '보호자 등록'}
          </Text>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeText}>
              {editingGuardianId ? '정보 수정 중' : '최대 3명까지'}
            </Text>
          </View>
        </View>
        <GuardianForm
          guardianName={guardianName}
          setGuardianName={setGuardianName}
          guardianPhone={guardianPhone}
          setGuardianPhone={setGuardianPhone}
          guardianRelation={guardianRelation}
          setGuardianRelation={setGuardianRelation}
          nextPriority={
            editingGuardianId
              ? guardians.find((g) => g.id === editingGuardianId)?.priority ??
                guardians.length + 1
              : guardians.length + 1
          }
          isEditing={!!editingGuardianId}
          onAdd={handleAddGuardian}
          onCancel={() => {
            setGuardianName('');
            setGuardianPhone('');
            setGuardianRelation('자녀');
            setEditingGuardianId(null);
          }}
        />
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>보호자 목록</Text>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeText}>우선순위 관리</Text>
          </View>
        </View>
        <View style={styles.guardianList}>
          {guardians.length === 0 ? (
            <View style={styles.placeholderRow}>
              <Text style={styles.helperText}>등록된 보호자가 없습니다</Text>
            </View>
          ) : (
            guardians.map((item) => (
              <View key={item.id} style={styles.guardianItem}>
                <Text style={styles.guardianPriority}>{item.priority}차</Text>
                <View style={styles.guardianMain}>
                  <Text style={styles.guardianName}>{item.name}</Text>
                  <Text style={styles.guardianMeta}>
                    {item.phone} · {item.relation}
                  </Text>
                </View>
                <View style={styles.guardianInlineActions}>
                  <TouchableOpacity
                    style={styles.guardianActionBtn}
                    onPress={() => handleEditGuardian(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.guardianActionBtnText}>수정</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.guardianActionBtn, styles.guardianActionBtnDanger]}
                    onPress={() => handleDeleteGuardian(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.guardianActionBtnDangerText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>비상 알람 설정</Text>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeText}>무응답 기준 설정</Text>
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabels}>
            <Text style={styles.settingTitle}>무응답 기준 시간</Text>
            <Text style={styles.settingDesc}>
              지정 시간 동안 활동이 없으면 보호자에게 알림
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              onPress={() => setEmergencyHours((h) => Math.max(1, h - 1))}
              style={styles.stepperBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.stepperBtnText}>－</Text>
            </TouchableOpacity>
            <Text style={styles.settingValue}>{emergencyHours}시간</Text>
            <TouchableOpacity
              onPress={() => setEmergencyHours((h) => Math.min(24, h + 1))}
              style={styles.stepperBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.stepperBtnText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabels}>
            <Text style={styles.settingTitle}>연속 미출석 기준</Text>
            <Text style={styles.settingDesc}>
              하루 3회 출석 미완료가 연속 n회 발생
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              onPress={() => setEmergencyMissCount((c) => Math.max(1, c - 1))}
              style={styles.stepperBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.stepperBtnText}>－</Text>
            </TouchableOpacity>
            <Text style={styles.settingValue}>{emergencyMissCount}회 연속</Text>
            <TouchableOpacity
              onPress={() => setEmergencyMissCount((c) => Math.min(7, c + 1))}
              style={styles.stepperBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.stepperBtnText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabels}>
            <Text style={styles.settingTitle}>야간 시간대 알림 제한</Text>
            <Text style={styles.settingDesc}>
              밤 시간에는 보호자 알림을 제한합니다.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setEmergencyNightLimit((v) => !v)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.switchBox,
                !emergencyNightLimit && { backgroundColor: '#d1d5db' },
              ]}
            >
              <View
                style={[
                  styles.switchKnob,
                  emergencyNightLimit
                    ? styles.switchKnobOn
                    : styles.switchKnobOff,
                ]}
              >
                <Text style={styles.switchTextLabel}>
                  {emergencyNightLimit ? 'ON' : 'OFF'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, styles.fullWidthButton]}
          activeOpacity={0.8}
          onPress={() => {
            saveEmergencySettings(
              emergencyHours,
              emergencyMissCount,
              emergencyNightLimit,
            );
            showToast('설정이 저장되었습니다.', 'success');
          }}
        >
          <Text style={styles.btnPrimaryText}>설정 저장</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937' }}>프로필 수정</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)} activeOpacity={0.8}>
                <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: '#ea580c',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 32 }}>👤</Text>
              </View>
            </View>

            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>닉네임</Text>
            <TextInput
              style={[styles.input, { marginBottom: 16 }]}
              value={editNickname}
              onChangeText={setEditNickname}
              placeholder="닉네임을 입력하세요"
              placeholderTextColor="#6b7280"
              autoCorrect={false}
            />

            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>전화번호</Text>
            <TextInput
              style={[styles.input, { marginBottom: 24 }]}
              value={editPhone}
              onChangeText={(text) => {
                const numbers = text.replace(/[^0-9]/g, '');
                let formatted = numbers;
                if (numbers.length <= 3) formatted = numbers;
                else if (numbers.length <= 7) formatted = numbers.slice(0,3) + '-' + numbers.slice(3);
                else if (numbers.length <= 11) formatted = numbers.slice(0,3) + '-' + numbers.slice(3,7) + '-' + numbers.slice(7);
                else return;
                setEditPhone(formatted);
              }}
              placeholder="010-0000-0000"
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.8}
              onPress={() => {
                if (!editNickname.trim()) {
                  showToast('닉네임을 입력하세요.', 'error');
                  return;
                }
                setProfileNickname(editNickname.trim());
                setProfilePhone(editPhone.trim());
                setShowEditModal(false);
                showToast('프로필이 수정되었습니다.', 'success');
              }}
            >
              <Text style={styles.btnPrimaryText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default AccountScreen;

