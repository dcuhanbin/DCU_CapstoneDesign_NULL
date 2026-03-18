import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
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

export default function StoreScreen({
  cashBalance,
  storeTab,
  setStoreTab,
  couponTab,
  setCouponTab,
  coupons,
  onBuyProduct,
}) {
  const [selectedCoupon, setSelectedCoupon] = useState(null);

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
    '사용 가능': coupons.filter(c => c.status === '사용 가능'),
    '사용 완료': coupons.filter(c => c.status === '사용 완료'),
    '유효기간 만료': coupons.filter(c => c.status === '유효기간 만료'),
  };

  const currentCoupons = couponData[couponTab] || [];

  return (
    <>
      <SectionCard title="상점" badge="모은 캐시로 교환" badgeType="outline">
        <View style={styles.storeBalanceRow}>
          <Text style={styles.storeBalanceLabel}>내 캐시</Text>
          <Text style={styles.storeBalanceValue}>
            {cashBalance.toLocaleString()} 캐시
          </Text>
        </View>
        <View style={styles.storeTabs}>
          {['편의점', '카페', '외식', '기프티콘'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.storeTab,
                storeTab === tab && styles.storeTabActive,
              ]}
              onPress={() => setStoreTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  { fontSize: 13, textAlign: 'center' },
                  storeTab === tab
                    ? { color: '#1f2937', fontWeight: '600' }
                    : { color: '#6b7280' },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.storeGrid}>
          {(storeProducts[storeTab] || []).map((product, idx) => (
            <View key={idx} style={styles.productCard}>
              <View style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  필요 캐시 {product.cash.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.productButton,
                  cashBalance < product.cash && { backgroundColor: '#d1d5db' }
                ]}
                activeOpacity={0.8}
                onPress={() => onBuyProduct(product)}
              >
                <Text style={styles.productButtonText}>
                  {cashBalance < product.cash ? '캐시 부족' : '구매'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text style={styles.helperText}>
          상품 정보, 재고, 구매 처리 로직은 추후 연동됩니다.
        </Text>
      </SectionCard>

      <SectionCard title="내 쿠폰함" badge="보유 쿠폰 관리" badgeType="outline">
        <View style={styles.couponTabs}>
          {['사용 가능', '사용 완료', '유효기간 만료'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.couponTab,
                couponTab === tab && styles.couponTabActive,
              ]}
              onPress={() => setCouponTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  { fontSize: 13, textAlign: 'center' },
                  couponTab === tab
                    ? { color: '#1f2937', fontWeight: '600' }
                    : { color: '#6b7280' },
                ]}
              >
                {tab}
              </Text>
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
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      backgroundColor: '#e5e7eb',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>🎟️</Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: '#6b7280',
                        marginTop: 2,
                      }}
                    >
                      예시
                    </Text>
                  </View>
                  <View style={styles.couponInfo}>
                    <Text style={styles.couponName}>{coupon.name}</Text>
                    <Text style={styles.couponMeta}>
                      유효기간 ~ {coupon.expire}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        color: '#ea580c',
                        marginTop: 2,
                      }}
                    >
                      {coupon.description}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.couponButton}
                  activeOpacity={0.8}
                  onPress={() =>
                    couponTab === '사용 가능' && setSelectedCoupon(coupon)
                  }
                >
                  <Text style={styles.couponButtonText}>
                    {couponTab === '사용 가능' ? '사용하기' : '확인'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </SectionCard>

      <Modal
        visible={selectedCoupon !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCoupon(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 24,
              width: '100%',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedCoupon(null)}
              style={{ alignSelf: 'flex-end', marginBottom: 8 }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
            </TouchableOpacity>

            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 16,
                backgroundColor: '#faedcd',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#e9c46a',
              }}
            >
              <Text style={{ fontSize: 48 }}>🎟️</Text>
            </View>

            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: 6,
                textAlign: 'center',
              }}
            >
              {selectedCoupon?.name}
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: '#6b7280',
                marginBottom: 4,
                textAlign: 'center',
              }}
            >
              {selectedCoupon?.description}
            </Text>

            <Text
              style={{
                fontSize: 11,
                color: '#ea580c',
                marginBottom: 24,
              }}
            >
              유효기간 ~ {selectedCoupon?.expire}
            </Text>

            <View
              style={{
                width: '100%',
                backgroundColor: '#f9fafb',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e5e7eb',
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: '#6b7280',
                  marginBottom: 8,
                }}
              >
                바코드
              </Text>
              <View style={{ flexDirection: 'row', height: 60, gap: 2 }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <View
                    key={i}
                    style={{
                      width: i % 3 === 0 ? 3 : 2,
                      height: i % 5 === 0 ? 60 : 45,
                      backgroundColor: '#1f2937',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: '#1f2937',
                  marginTop: 8,
                  letterSpacing: 2,
                  fontWeight: '600',
                }}
              >
                1234 5678 9012
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  color: '#ea580c',
                  marginTop: 4,
                }}
              >
                * 예시 바코드입니다. 실제 사용 불가.
              </Text>
            </View>

            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#ea580c',
                borderRadius: 10,
                paddingVertical: 14,
                alignItems: 'center',
              }}
              onPress={() => setSelectedCoupon(null)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: '600',
                }}
              >
                닫기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

