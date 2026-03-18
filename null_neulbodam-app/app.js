import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import styles from './constants/styles';
import AccountScreen from './components/AccountScreen';
import LockScreen from './components/LockScreen';
import SettingsPopup from './components/SettingsPopup';
import HomeScreen from './screens/HomeScreen';
import EventScreen from './screens/EventScreen';
import StoreScreen from './screens/StoreScreen';
import StatsScreen from './screens/StatsScreen';
import CashScreen from './screens/CashScreen';
import AlarmScreen from './screens/AlarmScreen';

const STORAGE_KEY = 'login_app_users';

export default function App() {
  const [authScreen, setAuthScreen] = useState('login'); // login | register
  const [mainTab, setMainTab] = useState('home'); // home | store | stats | cash | alarm | account | event
  const [currentUser, setCurrentUser] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [stage, setStage] = useState('auth'); // auth | lock | main
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const [attendance, setAttendance] = useState({
    morning: false,
    noon: false,
    evening: false,
  });

  const [cashBalance, setCashBalance] = useState(10000);
  const [cashHistory, setCashHistory] = useState([]);

  const [lockGiftPopup, setLockGiftPopup] = useState(false);
  const [lockTime, setLockTime] = useState('');
  const [lockDate, setLockDate] = useState('');

  const [stepCount, setStepCount] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  // 로그인 폼
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 회원가입 폼
  const [registerId, setRegisterId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');

  const [guardians, setGuardians] = useState([]);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('자녀');
  const [editingGuardianId, setEditingGuardianId] = useState(null);

  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [soundMode, setSoundMode] = useState('sound'); // sound | mute | vibrate
  const [alarmOn, setAlarmOn] = useState(true);
  const [emergencyHours, setEmergencyHours] = useState(12);
  const [emergencyMissCount, setEmergencyMissCount] = useState(2);
  const [emergencyNightLimit, setEmergencyNightLimit] = useState(true);

  const [alarmHistory, setAlarmHistory] = useState([]);

  const [storeTab, setStoreTab] = useState('편의점');
  const [couponTab, setCouponTab] = useState('사용 가능');
  const [cashFilter, setCashFilter] = useState('전체');
  const [cashPeriod, setCashPeriod] = useState('오늘');
  const [alarmFilter, setAlarmFilter] = useState('전체');
  const [coupons, setCoupons] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2500);
  };

  const getTodayKey = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const loadTodayAttendance = async () => {
    const key = 'attendance_' + currentUser + '_' + getTodayKey();
    try {
      const data = await AsyncStorage.getItem(key);
      if (data) setAttendance(JSON.parse(data));
    } catch (_) {}
  };

  const loadCashData = async () => {
    try {
      const balanceStr = await AsyncStorage.getItem('cash_balance_' + currentUser);
      const historyStr = await AsyncStorage.getItem('cash_history_' + currentUser);
      if (balanceStr != null) setCashBalance(Number(balanceStr) || 0);
      if (historyStr) {
        const parsed = JSON.parse(historyStr);
        setCashHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (_) {}
  };

  const loadGuardians = async () => {
    try {
      const data = await AsyncStorage.getItem('guardians_' + currentUser);
      if (data) {
        const parsed = JSON.parse(data);
        setGuardians(Array.isArray(parsed) ? parsed : []);
      }
    } catch (_) {}
  };

  const loadSettings = async () => {
    try {
      const s = await AsyncStorage.getItem('settings_' + currentUser);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed.soundMode) setSoundMode(parsed.soundMode);
        if (parsed.alarmOn !== undefined) setAlarmOn(parsed.alarmOn);
      }
    } catch (_) {}
  };

  const loadAlarmHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('alarm_history_' + currentUser);
      if (data) {
        const parsed = JSON.parse(data);
        setAlarmHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (_) {}
  };

  const saveSettings = async (newSound, newAlarm) => {
    try {
      await AsyncStorage.setItem('settings_' + currentUser, JSON.stringify({
        soundMode: newSound,
        alarmOn: newAlarm,
      }));
    } catch (_) {}
  };

  const saveEmergencySettings = async (hours, missCount, nightLimit) => {
    try {
      await AsyncStorage.setItem('emergency_settings_' + currentUser, JSON.stringify({
        hours, missCount, nightLimit,
      }));
    } catch (_) {}
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setLockTime(`${hh}:${mm}`);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const day = days[now.getDay()];
      setLockDate(`${month}월 ${date}일 ${day}요일`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let subscription;
    const subscribe = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          {
            title: '걸음수 권한 요청',
            message: '걸음수 측정을 위해 신체 활동 권한이 필요합니다.',
            buttonPositive: '허용',
            buttonNegative: '거부',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setIsPedometerAvailable(false);
          return;
        }
      }

      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);
      if (!isAvailable) return;

      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        if (result) setStepCount(result.steps);
      } catch (e) {}

      try {
        subscription = Pedometer.watchStepCount(() => {
          const end2 = new Date();
          const start2 = new Date();
          start2.setHours(0, 0, 0, 0);
          Pedometer.getStepCountAsync(start2, end2).then(r => {
            if (r) setStepCount(r.steps);
          }).catch(() => {});
        });
      } catch (e) {}
    };

    subscribe();
    return () => { if (subscription) subscription.remove(); };
  }, []);

  const addCash = async (amount, reason) => {
    const newBalance = cashBalance + amount;
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const dateStr = `${month}/${day} ${hours}:${minutes}`;
    const newEntry = {
      id: Date.now(),
      type: 'earn',
      amount,
      reason,
      balance: newBalance,
      date: dateStr,
    };
    const newHistory = [newEntry, ...cashHistory];
    setCashBalance(newBalance);
    setCashHistory(newHistory);
    try {
      await AsyncStorage.setItem('cash_balance_' + currentUser, String(newBalance));
      await AsyncStorage.setItem('cash_history_' + currentUser, JSON.stringify(newHistory));
    } catch (_) {}
  };

  const handleAttendanceCheck = async (period) => {
    if (attendance[period]) {
      showToast('이미 출석 완료된 시간대입니다.', 'error');
      return;
    }
    const periodLabels = { morning: '아침 출석 체크', noon: '점심 출석 체크', evening: '저녁 출석 체크' };
    addCash(10, periodLabels[period]);
    const next = { ...attendance, [period]: true };
    setAttendance(next);
    const key = 'attendance_' + currentUser + '_' + getTodayKey();
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next));
    } catch (_) {}

    const periodLabelsShort = { morning: '아침', noon: '점심', evening: '저녁' };
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const newAlarm = {
      id: Date.now(),
      type: 'attendance',
      title: periodLabelsShort[period] + ' 출석 완료',
      body: periodLabelsShort[period] + ' 출석 체크가 완료되었습니다. +10 캐시 적립',
      time: hh + ':' + mm,
      date: getTodayKey(),
      status: '확인',
    };
    const newAlarmHistory = [newAlarm, ...alarmHistory];
    setAlarmHistory(newAlarmHistory);
    try {
      await AsyncStorage.setItem('alarm_history_' + currentUser, JSON.stringify(newAlarmHistory));
    } catch (_) {}

    showToast('출석 완료! +10 캐시 적립', 'success');
  };

  const getUsers = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveUser = async (id, password) => {
    const users = await getUsers();
    users[id] = password;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const handleLogin = async () => {
    if (!loginId.trim()) {
      showToast('아이디를 입력하세요.', 'error');
      return;
    }
    if (!loginPassword) {
      showToast('비밀번호를 입력하세요.', 'error');
      return;
    }

    const users = await getUsers();
    if (users[loginId.trim()] === loginPassword) {
      const id = loginId.trim();
      setCurrentUser(id);
      setLoginId('');
      setLoginPassword('');
      const savedJoinDate = await AsyncStorage.getItem('join_date_' + id);
      if (savedJoinDate) setJoinDate(savedJoinDate);

      // 로그인한 유저의 데이터 로드 (id를 직접 전달)
      try {
        const balanceStr = await AsyncStorage.getItem('cash_balance_' + id);
        const historyStr = await AsyncStorage.getItem('cash_history_' + id);
        if (balanceStr != null) setCashBalance(Number(balanceStr) || 0);
        if (historyStr) {
          const parsed = JSON.parse(historyStr);
          setCashHistory(Array.isArray(parsed) ? parsed : []);
        }
      } catch (_) {}

      try {
        const data = await AsyncStorage.getItem('guardians_' + id);
        if (data) {
          const parsed = JSON.parse(data);
          setGuardians(Array.isArray(parsed) ? parsed : []);
        }
      } catch (_) {}

      try {
        const s = await AsyncStorage.getItem('settings_' + id);
        if (s) {
          const parsed = JSON.parse(s);
          if (parsed.soundMode) setSoundMode(parsed.soundMode);
          if (parsed.alarmOn !== undefined) setAlarmOn(parsed.alarmOn);
        }
      } catch (_) {}

      try {
        const e = await AsyncStorage.getItem('emergency_settings_' + id);
        if (e) {
          const ep = JSON.parse(e);
          if (ep.hours !== undefined) setEmergencyHours(ep.hours);
          if (ep.missCount !== undefined) setEmergencyMissCount(ep.missCount);
          if (ep.nightLimit !== undefined) setEmergencyNightLimit(ep.nightLimit);
        }
      } catch (_) {}

      try {
        const alarmData = await AsyncStorage.getItem('alarm_history_' + id);
        if (alarmData) {
          const parsed = JSON.parse(alarmData);
          setAlarmHistory(Array.isArray(parsed) ? parsed : []);
        }
      } catch (_) {}

      try {
        const couponData = await AsyncStorage.getItem('coupons_' + id);
        if (couponData) {
          const parsed = JSON.parse(couponData);
          setCoupons(Array.isArray(parsed) ? parsed : []);
        }
      } catch (_) {}

      const todayKey = 'attendance_' + id + '_' + getTodayKey();
      try {
        const attData = await AsyncStorage.getItem(todayKey);
        if (attData) setAttendance(JSON.parse(attData));
      } catch (_) {}

      setStage('lock');
      showToast('로그인되었습니다.', 'success');
    } else {
      showToast('아이디 또는 비밀번호가 올바르지 않습니다.', 'error');
    }
  };

  const handleRegister = async () => {
    const id = registerId.trim();
    if (!id || id.length < 4) {
      showToast('아이디는 4자 이상이어야 합니다.', 'error');
      return;
    }
    if (!registerPassword || registerPassword.length < 6) {
      showToast('비밀번호는 6자 이상이어야 합니다.', 'error');
      return;
    }
    if (registerPassword !== registerPasswordConfirm) {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    const users = await getUsers();
    if (users[id]) {
      showToast('이미 존재하는 아이디입니다.', 'error');
      return;
    }

    await saveUser(id, registerPassword);
    const joinDate = new Date();
    const joinY = joinDate.getFullYear();
    const joinM = String(joinDate.getMonth() + 1).padStart(2, '0');
    const joinD = String(joinDate.getDate()).padStart(2, '0');
    const joinDateStr = `${joinY}.${joinM}.${joinD}`;
    await AsyncStorage.setItem('join_date_' + id, joinDateStr);
    showToast('회원가입이 완료되었습니다. 로그인해 주세요.', 'success');
    setRegisterId('');
    setRegisterPassword('');
    setRegisterPasswordConfirm('');
    setAuthScreen('login');
  };

  const handleLogout = () => {
    setCurrentUser('');
    setJoinDate('');
    setCashBalance(0);
    setCashHistory([]);
    setGuardians([]);
    setAlarmHistory([]);
    setAttendance({ morning: false, noon: false, evening: false });
    setSoundMode('sound');
    setAlarmOn(true);
    setEmergencyHours(12);
    setEmergencyMissCount(2);
    setEmergencyNightLimit(true);
    setStage('auth');
    setAuthScreen('login');
    setMainTab('home');
    setCoupons([]);
    showToast('로그아웃되었습니다.', 'success');
  };

  const handleEditGuardian = (item) => {
    setEditingGuardianId(item.id);
    setGuardianName(item.name);
    setGuardianPhone(item.phone);
    setGuardianRelation(item.relation);
  };

  const handleAddGuardian = async () => {
    if (!guardianName.trim()) {
      showToast('이름을 입력하세요.', 'error');
      return;
    }
    if (!guardianPhone.trim()) {
      showToast('전화번호를 입력하세요.', 'error');
      return;
    }
    // 전화번호 형식 검증 (010-0000-0000 또는 010-000-0000)
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(guardianPhone.trim())) {
      showToast('전화번호 형식이 올바르지 않습니다.\n예: 010-1234-5678', 'error');
      return;
    }

    if (editingGuardianId !== null) {
      const next = guardians.map(g =>
        g.id === editingGuardianId
          ? { ...g, name: guardianName.trim(), phone: guardianPhone.trim(), relation: guardianRelation }
          : g
      );
      setGuardians(next);
      setGuardianName('');
      setGuardianPhone('');
      setGuardianRelation('자녀');
      setEditingGuardianId(null);
      try {
        await AsyncStorage.setItem('guardians', JSON.stringify(next));
      } catch (_) {}
      showToast('보호자 정보가 수정되었습니다.', 'success');
      return;
    }

    if (guardians.length >= 3) {
      showToast('보호자는 최대 3명까지 등록 가능합니다.', 'error');
      return;
    }
    const newGuardian = {
      id: Date.now(),
      name: guardianName.trim(),
      phone: guardianPhone.trim(),
      relation: guardianRelation,
      priority: guardians.length + 1,
    };
    const next = [...guardians, newGuardian];
    setGuardians(next);
    setGuardianName('');
    setGuardianPhone('');
    try {
      await AsyncStorage.setItem('guardians_' + currentUser, JSON.stringify(next));
    } catch (_) {}
    showToast('보호자가 등록되었습니다.', 'success');
  };

  const handleDeleteGuardian = async (id) => {
    const next = guardians.filter(g => g.id !== id).map((g, i) => ({ ...g, priority: i + 1 }));
    setGuardians(next);
    try {
      await AsyncStorage.setItem('guardians_' + currentUser, JSON.stringify(next));
    } catch (_) {}
    showToast('보호자가 삭제되었습니다.', 'success');
  };

  const handleBuyProduct = (product) => {
    if (cashBalance < product.cash) {
      showToast('캐시가 부족합니다.', 'error');
      return;
    }
    const newBalance = cashBalance - product.cash;
    const today = new Date();
    const expireDate = `${today.getFullYear() + 1}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    const newCoupon = {
      id: Date.now(),
      name: product.name,
      expire: expireDate,
      description: '예시 쿠폰입니다. 실제 사용 불가.',
      status: '사용 가능',
    };
    setCashBalance(newBalance);
    setCoupons(prev => [newCoupon, ...prev]);
    try {
      AsyncStorage.setItem('cash_balance_' + currentUser, String(newBalance));
      const d = new Date();
      const newEntry = {
        id: Date.now(),
        type: 'spend',
        amount: product.cash,
        reason: product.name + ' 구매',
        balance: newBalance,
        date: String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0') + ' ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0'),
      };
      const newHistory = [newEntry, ...cashHistory];
      setCashHistory(newHistory);
      AsyncStorage.setItem('cash_history_' + currentUser, JSON.stringify(newHistory));
      AsyncStorage.setItem('coupons_' + currentUser, JSON.stringify([newCoupon, ...coupons]));
    } catch (_) {}
    showToast(product.name + ' 구매 완료!', 'success');
  };

  const renderAuthCard = () => {
    const isLogin = authScreen === 'login';

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? '로그인' : '회원가입'}</Text>

        {!isLogin && (
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>이메일/전화번호 대신 간단한 아이디로만 로그인하는 예제입니다.</Text>
          </View>
        )}

        {isLogin ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력하세요"
              placeholderTextColor="#6b7280"
              value={loginId}
              onChangeText={setLoginId}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor="#6b7280"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.btnPrimaryText}>로그인</Text>
            </TouchableOpacity>
            <Text style={styles.switchText}>
              계정이 없으신가요?{' '}
              <Text style={styles.link} onPress={() => setAuthScreen('register')}>
                회원가입
              </Text>
            </Text>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력하세요 (4자 이상)"
              placeholderTextColor="#6b7280"
              value={registerId}
              onChangeText={setRegisterId}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
              placeholderTextColor="#6b7280"
              value={registerPassword}
              onChangeText={setRegisterPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력하세요"
              placeholderTextColor="#6b7280"
              value={registerPasswordConfirm}
              onChangeText={setRegisterPasswordConfirm}
              secureTextEntry
            />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.btnPrimaryText}>회원가입</Text>
            </TouchableOpacity>
            <Text style={styles.switchText}>
              이미 계정이 있으신가요?{' '}
              <Text style={styles.link} onPress={() => setAuthScreen('login')}>
                로그인
              </Text>
            </Text>
          </>
        )}
      </View>
    );
  };

  // renderMainContent is defined earlier in this component.

  const getTabTitle = () => {
    const titles = { home: '홈', store: '상점', stats: '통계', cash: '캐시내역', alarm: '알람내역', account: '계정', attendance: '출석체크' };
    return titles[mainTab] || '홈';
  };

  const renderCommonHeader = () => (
    <View style={styles.commonHeader}>
      <TouchableOpacity style={styles.headerProfileWrap} onPress={() => setMainTab('account')} activeOpacity={0.8}>
        <View style={styles.headerProfileIcon}>
          <Text style={styles.headerProfileEmoji}>👤</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.commonHeaderTitle}>{getTabTitle()}</Text>
      <TouchableOpacity style={styles.headerSettingsWrap} onPress={() => setShowSettingsPopup(!showSettingsPopup)} activeOpacity={0.8}>
        <Text style={styles.headerSettingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBottomTabBar = () => {
    const tabs = [
      { key: 'store', label: '상점', icon: '🏷️' },
      { key: 'stats', label: '통계', icon: '📊' },
      { key: 'home', label: '홈', icon: '🏠', center: true },
      { key: 'cash', label: '캐시내역', icon: '🪙' },
      { key: 'alarm', label: '알람내역', icon: '🔔' },
    ];
    return (
      <View style={styles.bottomTabBar}>
        {tabs.map(tab => {
          const isActive = mainTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.bottomTabItem, tab.center && styles.bottomTabItemCenter]}
              onPress={() => setMainTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.bottomTabIcon, tab.center && styles.bottomTabIconCenter, isActive && styles.bottomTabActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.bottomTabLabel, isActive && styles.bottomTabActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const SectionCard = ({ title, badge, badgeType = 'outline', children }) => (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {badge ? (
          <View style={badgeType === 'filled' ? styles.badgeFilled : styles.badgeOutline}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );

  const renderHomeScreen = () => (
    <View style={styles.homeWrap}>
      <View style={styles.homeTopBar}>
        <View style={styles.homeTopBarLeft}>
          <Text style={styles.homeCashIcon}>🪙</Text>
          <Text style={styles.homeCashText}>{cashBalance.toLocaleString()} 캐시</Text>
        </View>
        <TouchableOpacity style={styles.homeTopBarRight} onPress={() => setMainTab('attendance')} activeOpacity={0.8}>
          <Text style={styles.homeEventIcon}>🎁</Text>
          <Text style={styles.homeEventText}>출석체크</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeStepsSection}>
        <Text style={styles.homeStepsLabel}>오늘의 걸음수</Text>
        <View style={styles.homeStepsCircle}>
          <Text style={styles.homeStepsValue}>{stepCount.toLocaleString()}</Text>
          <Text style={styles.homeStepsScreenTimeLabel}>스크린타임</Text>
          <Text style={styles.homeStepsScreenTimeValue}>00:00:00</Text>
        </View>
        {!isPedometerAvailable && (
          <Text style={styles.homeStepsUnsupportedText}>이 기기는 걸음수 측정을 지원하지 않습니다</Text>
        )}
      </View>

      <View style={styles.homeMapSection}>
        <Text style={styles.homeMapTitle}>지도</Text>
        <View style={styles.homeMapPlaceholder}>
          <Text style={styles.homeMapPlaceholderText}>📍 지도 영역 (react-native-maps 연동 예정)</Text>
        </View>
      </View>
    </View>
  );

  const renderEventScreen = () => {
    const periods = [
      { key: 'morning', label: '아침', icon: '☀️' },
      { key: 'noon', label: '점심', icon: '🌞' },
      { key: 'evening', label: '저녁', icon: '🌙' },
    ];
    return (
      <View style={styles.eventWrap}>
        <Text style={styles.eventTitle}>출석 체크</Text>
        <View style={styles.attendanceCheckRow}>
          {periods.map(p => (
            <TouchableOpacity
              key={p.key}
              style={styles.attendanceCheckItem}
              onPress={() => handleAttendanceCheck(p.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.attendanceCheckLabel}>{p.label}</Text>
              <Text style={styles.attendanceCheckIcon}>{p.icon}</Text>
              <View style={[styles.attendanceCheckBox, attendance[p.key] && styles.attendanceCheckBoxDone]}>
                {attendance[p.key] ? <Text style={styles.attendanceCheckMark}>✓</Text> : null}
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
  };

  const renderStoreScreen = () => {
    const storeProducts = {
      편의점: [
        { name: '편의점 1,000원 상품권', cash: 500 },
        { name: '편의점 2,000원 상품권', cash: 900 },
      ],
      카페: [
        { name: '카페 아메리카노', cash: 800 },
        { name: '카페 라떼', cash: 1000 },
      ],
      외식: [
        { name: '패밀리 레스토랑 쿠폰', cash: 2000 },
        { name: '한식 뷔페 쿠폰', cash: 1800 },
      ],
      기프티콘: [
        { name: '치킨 기프티콘', cash: 3000 },
        { name: '피자 기프티콘', cash: 3500 },
      ],
    };
    const couponData = {
      '사용 가능': [
        { brand: 'B', name: '편의점 1,000원 상품권', expire: '2026.12.31' },
      ],
      '사용 완료': [
        { brand: 'C', name: '카페 아메리카노', expire: '2026.02.28' },
      ],
      '유효기간 만료': [
        { brand: 'E', name: '패밀리 레스토랑 쿠폰', expire: '2025.12.31' },
      ],
    };
    const currentCoupons = couponData[couponTab] || [];

    return (
      <>
        <SectionCard title="상점" badge="모은 캐시로 교환" badgeType="outline">
          <View style={styles.storeBalanceRow}>
            <Text style={styles.storeBalanceLabel}>내 캐시</Text>
            <Text style={styles.storeBalanceValue}>{cashBalance.toLocaleString()} 캐시</Text>
          </View>
          <View style={styles.storeTabs}>
            {['편의점', '카페', '외식', '기프티콘'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.storeTab, storeTab === tab && styles.storeTabActive]}
                onPress={() => setStoreTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[
                  { fontSize: 11, textAlign: 'center' },
                  storeTab === tab
                    ? { color: '#1f2937', fontWeight: '600' }
                    : { color: '#6b7280' }
                ]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.storeGrid}>
            {(storeProducts[storeTab] || []).map((product, idx) => (
              <View key={idx} style={styles.productCard}>
                <View style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productMeta}>필요 캐시 {product.cash.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.productButton} activeOpacity={0.8}>
                  <Text style={styles.productButtonText}>구매</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <Text style={styles.helperText}>상품 정보, 재고, 구매 처리 로직은 추후 연동됩니다.</Text>
        </SectionCard>

        <SectionCard title="내 쿠폰함" badge="보유 쿠폰 관리" badgeType="outline">
          <View style={styles.couponTabs}>
            {['사용 가능', '사용 완료', '유효기간 만료'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.couponTab, couponTab === tab && styles.couponTabActive]}
                onPress={() => setCouponTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[
                  { fontSize: 11, textAlign: 'center' },
                  couponTab === tab
                    ? { color: '#1f2937', fontWeight: '600' }
                    : { color: '#6b7280' }
                ]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.couponList}>
            {currentCoupons.length === 0 ? (
              <View style={styles.placeholderRow}>
                <Text style={styles.helperText}>쿠폰이 없습니다</Text>
              </View>
            ) : (
              currentCoupons.map((coupon, idx) => (
                <View key={idx} style={styles.couponItem}>
                  <View style={styles.couponMain}>
                    <View style={styles.couponBrand}>
                      <Text style={styles.couponBrandText}>{coupon.brand}</Text>
                    </View>
                    <View style={styles.couponInfo}>
                      <Text style={styles.couponName}>{coupon.name}</Text>
                      <Text style={styles.couponMeta}>유효기간 ~ {coupon.expire}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.couponButton} activeOpacity={0.8}>
                    <Text style={styles.couponButtonText}>
                      {couponTab === '사용 가능' ? '사용하기' : '확인'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </SectionCard>
      </>
    );
  };

  const renderStatsScreen = () => {
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
            <Text style={styles.statsCircleValue}>{stepCount.toLocaleString()}</Text>
          </View>
          <View style={styles.statsMetricRow}>
            <View style={styles.statsMetricItem}>
              <Text style={styles.statsMetricIcon}>📍</Text>
              <Text style={styles.statsMetricValue}>{(stepCount * 0.0007).toFixed(2)}</Text>
              <Text style={styles.statsMetricUnit}>Km</Text>
            </View>
            <View style={styles.statsMetricItem}>
              <Text style={styles.statsMetricIcon}>🔥</Text>
              <Text style={styles.statsMetricValue}>{Math.round(stepCount * 0.04)}</Text>
              <Text style={styles.statsMetricUnit}>kcal</Text>
            </View>
            <View style={styles.statsMetricItem}>
              <Text style={styles.statsMetricIcon}>⏱️</Text>
              <Text style={styles.statsMetricValue}>{Math.floor(stepCount / 100) + 'h ' + (stepCount % 100) + 'm'}</Text>
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
  };

  const renderAlarmScreen = () => {
    const filteredAlarms = alarmHistory.filter(item => {
      if (alarmFilter === '전체') return true;
      if (alarmFilter === '출석 알림') return item.type === 'attendance';
      if (alarmFilter === '보호자 알림') return item.type === 'guardian';
      if (alarmFilter === '시스템 공지') return item.type === 'system';
      return true;
    });

    return (
      <>
        <SectionCard title="알림 내역" badge="출석 · 보호자 · 시스템" badgeType="outline">
          <View style={styles.historyFilters}>
            {['전체', '출석 알림', '보호자 알림', '시스템 공지'].map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.historyFilter, alarmFilter === f && styles.historyFilterActive]}
                onPress={() => setAlarmFilter(f)}
                activeOpacity={0.8}
              >
                <Text style={[
                  { fontSize: 10, textAlign: 'center' },
                  alarmFilter === f
                    ? { color: '#1f2937', fontWeight: '600' }
                    : { color: '#6b7280' }
                ]}>{f}</Text>
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
                  <View style={[styles.historyIcon, item.type === 'attendance' && styles.historyIconAttendance]} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                    <Text style={styles.historyBody}>{item.body}</Text>
                  </View>
                  <Text style={styles.historyTime}>{item.date + ' ' + item.time}</Text>
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
                  <View style={[styles.alarmTableCell, styles.alarmTableColStatus]}>
                    <Text style={styles.alarmTableCellText}>{item.status}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </SectionCard>
      </>
    );
  };

  const renderCashScreen = () => {
    const now = new Date();
    const filteredCash = cashHistory.filter(item => {
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
      <>
        <SectionCard title="캐시 내역" badge="적립 · 사용 · 환불" badgeType="outline">
          <View style={styles.historyFilters}>
            {['전체', '적립만', '사용만'].map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.historyFilter, cashFilter === f && styles.historyFilterActive]}
                onPress={() => setCashFilter(f)}
                activeOpacity={0.8}
              >
                <Text style={[
                  { fontSize: 10, textAlign: 'center' },
                  cashFilter === f
                    ? { color: '#1f2937', fontWeight: '600' }
                    : { color: '#6b7280' }
                ]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.cashPeriodRow}>
            {['오늘', '최근 7일', '최근 30일', '전체'].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.periodButton, cashPeriod === p && styles.periodButtonActive]}
                onPress={() => setCashPeriod(p)}
                activeOpacity={0.8}
              >
                <Text style={[
                  { fontSize: 10, textAlign: 'center' },
                  cashPeriod === p
                    ? { color: '#1f2937', fontWeight: '600' }
                    : { color: '#6b7280' }
                ]}>{p}</Text>
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
                  <Text style={item.type === 'earn' ? styles.cashAmountPositive : styles.cashAmountNegative}>
                    {item.type === 'earn' ? '+' : '-'}{item.amount} 캐시
                  </Text>
                  <View style={styles.cashInfo}>
                    <Text style={styles.cashReason}>{item.reason}</Text>
                    <Text style={styles.cashMeta}>잔액 {item.balance.toLocaleString()} 캐시 · {item.date}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </SectionCard>
      </>
    );
  };

  const renderMainContent = () => {
    switch (mainTab) {
      case 'store':
        return (
          <StoreScreen
            cashBalance={cashBalance}
            storeTab={storeTab}
            setStoreTab={setStoreTab}
            couponTab={couponTab}
            setCouponTab={setCouponTab}
            coupons={coupons}
            onBuyProduct={handleBuyProduct}
          />
        );
      case 'stats':
        return <StatsScreen stepCount={stepCount} />;
      case 'cash':
        return (
          <CashScreen
            cashHistory={cashHistory}
            cashFilter={cashFilter}
            setCashFilter={setCashFilter}
            cashPeriod={cashPeriod}
            setCashPeriod={setCashPeriod}
          />
        );
      case 'alarm':
        return (
          <AlarmScreen
            alarmHistory={alarmHistory}
            alarmFilter={alarmFilter}
            setAlarmFilter={setAlarmFilter}
          />
        );
      case 'account':
        return (
          <AccountScreen
            currentUser={currentUser}
            joinDate={joinDate}
            guardians={guardians}
            guardianName={guardianName}
            setGuardianName={setGuardianName}
            guardianPhone={guardianPhone}
            setGuardianPhone={setGuardianPhone}
            guardianRelation={guardianRelation}
            setGuardianRelation={setGuardianRelation}
            editingGuardianId={editingGuardianId}
            handleAddGuardian={handleAddGuardian}
            handleEditGuardian={handleEditGuardian}
            handleDeleteGuardian={handleDeleteGuardian}
            handleLogout={handleLogout}
            setEditingGuardianId={setEditingGuardianId}
            emergencyHours={emergencyHours}
            setEmergencyHours={setEmergencyHours}
            emergencyMissCount={emergencyMissCount}
            setEmergencyMissCount={setEmergencyMissCount}
            emergencyNightLimit={emergencyNightLimit}
            setEmergencyNightLimit={setEmergencyNightLimit}
            saveEmergencySettings={saveEmergencySettings}
            showToast={showToast}
          />
        );
      case 'attendance':
        return (
          <EventScreen
            attendance={attendance}
            handleAttendanceCheck={handleAttendanceCheck}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            cashBalance={cashBalance}
            stepCount={stepCount}
            isPedometerAvailable={isPedometerAvailable}
            setMainTab={setMainTab}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.container} onStartShouldSetResponder={() => { setShowSettingsPopup(false); return false; }}>
        {stage === 'auth' ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.inner}>{renderAuthCard()}</View>
          </KeyboardAvoidingView>
        ) : stage === 'lock' ? (
          <View style={styles.mainShell}>
            <LockScreen
              cashBalance={cashBalance}
              lockTime={lockTime}
              lockDate={lockDate}
              stepCount={stepCount}
              lockGiftPopup={lockGiftPopup}
              setLockGiftPopup={setLockGiftPopup}
              setStage={setStage}
              setMainTab={setMainTab}
            />
          </View>
        ) : (
          <View style={styles.mainShell}>
            {renderCommonHeader()}
            <ScrollView
              style={styles.shellScroll}
              contentContainerStyle={styles.shellScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="none"
            >
              {renderMainContent()}
            </ScrollView>
            {renderBottomTabBar()}
          </View>
        )}
      </View>

      {showSettingsPopup && (
        <SettingsPopup
          soundMode={soundMode}
          setSoundMode={setSoundMode}
          alarmOn={alarmOn}
          setAlarmOn={setAlarmOn}
          saveSettings={saveSettings}
        />
      )}

      {toast.visible && (
        <View style={[styles.toast, toast.type === 'error' ? styles.toastError : styles.toastSuccess]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
