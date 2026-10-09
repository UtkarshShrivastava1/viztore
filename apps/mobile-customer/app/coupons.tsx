import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  Search,
  Ticket,
  ChevronDown,
  Heart,
  ShoppingCart,
  CreditCard
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function CouponsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { label: 'All', count: 8 },
    { label: 'Coupons', count: 5 },
    { label: 'Bank Offers', count: 3 }
  ];

  const coupons = [
    {
      code: 'VIZ200',
      title: 'FLAT ₹200 OFF',
      desc: 'Get flat ₹200 off on orders above ₹1499',
      validTill: '30 Jun 2024',
      badge: 'Best Deal',
      color: '#dcfce7',
      textColor: '#166534',
      codeColor: '#000'
    },
    {
      code: 'SAVE100',
      title: 'FLAT ₹100 OFF',
      desc: 'Get flat ₹100 off on orders above ₹999',
      validTill: '25 May 2024',
      color: '#eff6ff',
      textColor: '#1e40af',
      codeColor: '#000'
    },
    {
      code: 'EXTRA5',
      title: 'EXTRA 5% OFF',
      desc: 'Get extra 5% off on all prepaid orders',
      validTill: '20 May 2024',
      color: '#fef3c7',
      textColor: '#b45309',
      codeColor: '#000'
    },
    {
      code: 'NEW50',
      title: 'FLAT ₹50 OFF',
      desc: 'Flat ₹50 off for new users on orders above ₹499',
      validTill: '31 May 2024',
      badge: 'New User',
      color: '#f3e8ff',
      textColor: '#7e22ce',
      codeColor: '#000'
    },
    {
      code: 'WEEKEND10',
      title: 'EXTRA 10% OFF',
      desc: 'Extra 10% off on minimum order of ₹1999',
      validTill: '19 May 2024',
      color: '#ccfbf1',
      textColor: '#0f766e',
      codeColor: '#000'
    }
  ];

  const bankOffers = [
    { bank: 'SBI', type: 'Credit Cards', desc: '10% Instant Discount*', color: '#0ea5e9' },
    { bank: 'HDFC', type: 'Credit Cards', desc: '₹750 Instant Discount*', color: '#ef4444' },
    { bank: 'ICICI', type: 'Credit Cards', desc: '10% Instant Discount*', color: '#f97316' },
    { bank: 'AXIS', type: 'Credit Cards', desc: '₹500 Instant Discount*', color: '#be123c' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Simple white header for logo and back btn */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1d4ed8" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <View style={styles.logoIconContainer}>
              <View style={[styles.logoIconLayer, { backgroundColor: '#38bdf8', left: 0 }]} />
              <View style={[styles.logoIconLayer, { backgroundColor: '#f59e0b', left: 6 }]} />
            </View>
            <View>
              <Text style={styles.logoText}>{branding.appName}</Text>
              <Text style={styles.logoSubtext}>Making Local Stores Visible</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Heart size={24} color="#0f172a" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <ShoppingCart size={24} color="#0f172a" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pageTitleRow}>
          <Text style={styles.pageTitle}>Coupons & Offers</Text>
          <Text style={styles.pageSubtitle}>Save more on your favourite products</Text>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {tabs.map((tab) => (
              <TouchableOpacity 
                key={tab.label} 
                style={[styles.tabBtn, activeTab === tab.label && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.label)}
              >
                <Text style={[styles.tabText, activeTab === tab.label && styles.tabTextActive]}>
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.searchBar}>
            <Ticket size={20} color="#64748b" />
            <TextInput
              placeholder="Search coupon code"
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
            />
            <TouchableOpacity style={styles.searchBtn}>
              <Search size={16} color="#ffffff" />
              <Text style={styles.searchBtnText}>Search</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Coupons</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View T&C</Text>
            </TouchableOpacity>
          </View>

          {coupons.map((coupon, idx) => (
            <View key={idx} style={styles.couponCard}>
              <View style={[styles.couponLeft, { backgroundColor: coupon.color }]}>
                <Text style={[styles.couponAmountTitle, { color: coupon.textColor }]}>{coupon.title.split(' ')[0]}</Text>
                <Text style={[styles.couponAmount, { color: coupon.textColor }]}>{coupon.title.split(' ').slice(1, -1).join(' ')}</Text>
                <Text style={[styles.couponAmountTitle, { color: coupon.textColor }]}>{coupon.title.split(' ').slice(-1)}</Text>
              </View>
              <View style={styles.couponDivider}>
                {/* Dot separators */}
                {[...Array(6)].map((_, i) => <View key={i} style={styles.dot} />)}
              </View>
              <View style={styles.couponRight}>
                <View style={styles.couponHeader}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>
                    {coupon.badge && (
                      <View style={[styles.badgePill, { backgroundColor: coupon.color }]}>
                        <Text style={[styles.badgePillText, { color: coupon.textColor }]}>{coupon.badge}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity style={styles.copyBtn}>
                    <Text style={styles.copyBtnText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.couponDesc}>{coupon.desc}</Text>
                <View style={styles.couponFooter}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                    <Text style={styles.validTillText}>Valid till {coupon.validTill}</Text>
                  </View>
                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <ChevronDown size={14} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <View style={[styles.sectionHeader, {marginTop: 24}]}>
            <Text style={styles.sectionTitle}>Bank Offers</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bankOffersScroll}>
            {bankOffers.map((offer, idx) => (
              <View key={idx} style={styles.bankCard}>
                <View style={styles.bankLogoWrap}>
                  <Text style={[styles.bankLogoText, {color: offer.color}]}>{offer.bank}</Text>
                </View>
                <Text style={styles.bankDesc}>{offer.desc}</Text>
                <Text style={styles.bankType}>on {offer.bank} {offer.type}</Text>
                <TouchableOpacity style={{marginTop: 8}}>
                  <Text style={styles.tncText}>T&C Apply</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Banner */}
          <View style={styles.promoBanner}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitleSmall}>Super Saver Deal!</Text>
              <Text style={styles.promoTitleBig}>Upto 80% Off</Text>
              <Text style={styles.promoDesc}>Big savings on top categories</Text>
              <TouchableOpacity style={styles.shopNowBtn}>
                <Text style={styles.shopNowText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{height: 40}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 16, paddingBottom: 16 },
  backButton: { padding: 4, marginLeft: -8 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoIconContainer: { width: 20, height: 20, position: 'relative', marginRight: 4 },
  logoIconLayer: { width: 12, height: 20, borderRadius: 4, position: 'absolute', transform: [{ skewX: '-15deg' }] },
  logoText: { color: '#0f172a', fontSize: 16, fontWeight: '800', letterSpacing: -0.5 },
  logoSubtext: { color: '#2563eb', fontSize: 8 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconButton: { position: 'relative' },
  badge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#3b82f6', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#ffffff' },
  badgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  pageTitleRow: { paddingHorizontal: 16, paddingBottom: 16 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4 },
  tabsContainer: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tabsScroll: { paddingHorizontal: 16, gap: 24 },
  tabBtn: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#2563eb' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 8, paddingLeft: 16, paddingRight: 4, height: 48, gap: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 24 },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  searchBtn: { backgroundColor: '#0061ff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, borderRadius: 6, gap: 6 },
  searchBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e3a8a' },
  sectionLink: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
  couponCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  couponLeft: { width: 90, alignItems: 'center', justifyContent: 'center', padding: 12 },
  couponAmountTitle: { fontSize: 11, fontWeight: '700' },
  couponAmount: { fontSize: 20, fontWeight: '800', marginVertical: 2 },
  couponDivider: { width: 1, backgroundColor: 'transparent', justifyContent: 'space-around', alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1' },
  couponRight: { flex: 1, padding: 16 },
  couponHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  couponCode: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  badgePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgePillText: { fontSize: 9, fontWeight: '700' },
  copyBtn: { backgroundColor: '#0061ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  copyBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  couponDesc: { fontSize: 12, color: '#475569', marginBottom: 16, lineHeight: 18 },
  couponFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  validTillText: { fontSize: 11, color: '#64748b' },
  viewDetailsText: { fontSize: 11, color: '#2563eb', fontWeight: '600' },
  bankOffersScroll: { gap: 16, paddingBottom: 8 },
  bankCard: { width: 140, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, alignItems: 'center' },
  bankLogoWrap: { marginBottom: 12 },
  bankLogoText: { fontSize: 18, fontWeight: '800' },
  bankDesc: { fontSize: 12, fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: 4 },
  bankType: { fontSize: 10, color: '#64748b', textAlign: 'center' },
  tncText: { fontSize: 10, color: '#94a3b8' },
  promoBanner: { backgroundColor: '#eff6ff', borderRadius: 16, marginTop: 24, padding: 20, overflow: 'hidden' },
  promoContent: { width: '60%' },
  promoTitleSmall: { fontSize: 12, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
  promoTitleBig: { fontSize: 24, fontWeight: '800', color: '#2563eb', marginBottom: 8 },
  promoDesc: { fontSize: 12, color: '#475569', marginBottom: 16 },
  shopNowBtn: { backgroundColor: '#0061ff', alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  shopNowText: { color: '#ffffff', fontSize: 12, fontWeight: '700' }
});
