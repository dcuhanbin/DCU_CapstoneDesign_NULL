# 늘보담 📱

> 어르신의 일상을 함께하는 안부 확인 앱

가족과 떨어져 사는 어르신의 하루를 걸음수, 출석체크, 위치로 확인하고
이상이 감지되면 보호자에게 알림을 보내는 안심 생활 앱입니다.

---

## 주요 기능

- 🔒 잠금화면 — 실시간 시계, 오늘의 걸음수, 캐시 잔액 표시
- 👣 걸음수 측정 — 만보기 센서 연동, 통계 및 주간 그래프
- ✅ 출석체크 — 아침/점심/저녁 3회 체크 시 캐시 적립
- 📍 현재 위치 — 지도에서 어르신 현재 위치 확인
- 🛒 상점 — 모은 캐시로 편의점/카페/외식/기프티콘 교환
- 🎟️ 쿠폰함 — 구매한 쿠폰 관리 및 바코드 표시
- 👨‍👩‍👧 보호자 관리 — 최대 3명 등록, 우선순위 설정
- 🚨 비상알람 설정 — 무응답 기준 시간, 연속 미출석 기준 설정
- 🔔 알람 내역 — 출석/보호자/시스템 알림 기록 확인
- ⚙️ 설정 — 소리/진동/알람 ON·OFF

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | React Native (Expo) |
| 상태 관리 | React Hooks |
| 로컬 저장소 | AsyncStorage |
| 걸음수 센서 | expo-sensors (Pedometer) |
| 위치 | expo-location + react-native-maps |
| 차트 | react-native-chart-kit |
| 빌드 | EAS Build (Android APK) |

---

## 프로젝트 구조

neulbodam-app/
├── app.js                  # 메인 진입점, 전역 상태 관리
├── app.json                # Expo 설정
├── eas.json                # EAS Build 설정
├── components/
│   ├── AccountScreen.js    # 계정/프로필 화면
│   ├── GuardianForm.js     # 보호자 등록 폼
│   ├── LockScreen.js       # 잠금화면
│   └── SettingsPopup.js    # 설정 팝업
├── screens/
│   ├── HomeScreen.js       # 홈 (걸음수 + 지도)
│   ├── EventScreen.js      # 출석체크
│   ├── StoreScreen.js      # 상점 + 쿠폰함
│   ├── StatsScreen.js      # 통계
│   ├── CashScreen.js       # 캐시 내역
│   └── AlarmScreen.js      # 알람 내역
└── constants/
└── styles.js           # 공통 스타일

---

## 실행 방법

### 개발 환경 (Expo Go)

```bash
# 1. 저장소 클론
git clone https://github.com/dcuhanbin/DCU_CapstoneDesign_NULL.git
cd cursor-team-project

# 2. 패키지 설치
npm install

# 3. 개발 서버 실행
npx expo start
```

> 갤럭시 등 안드로이드 기기에서 **Expo Go** 앱 설치 후 QR코드 스캔

---

### APK 빌드 (실제 설치 파일)

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS 로그인
eas login

# Android APK 빌드
eas build -p android --profile preview
```

---

## 대상 사용자

- 혼자 사는 어르신 (앱 직접 사용)
- 어르신의 가족/보호자 (알림 수신)

---

## 개발 환경

- OS: Windows 11
- 테스트 기기: Galaxy S22 (Android 16)
- Node.js 18+
- Expo SDK 51

---

## 팀

**cursor-team-project** — 늘보담 개발팀
