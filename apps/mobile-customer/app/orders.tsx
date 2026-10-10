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
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Search,
  Mic,
  Bell,
  ChevronLeft,
  User,
  CheckCircle2,
  Truck,
  XCircle,
  Calendar,
  ShoppingBag,
  Share2,
  ChevronRight
} from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Orders');
  const tabs = ['All Orders', 'To Be Delivered', 'Delivered', 'Returns', 'Cancelled', 'Reserve', 'Pickup'];

  const orders = [
    {
      id: '#ORD-123456789',
      date: '08 May 2024, 10:30 AM',
      status: 'Delivered',
      statusColor: '#16a34a',
      StatusIcon: CheckCircle2,
      product: 'Men Graphic Print T-shirt',
      details: 'Olive Green • Size: L • Qty: 1',
      price: '₹399',
      total: '₹399',
      btnText: 'Order Details'
    },
    {
      id: '#ORD-123456788',
      date: '05 May 2024, 09:15 PM',
      status: 'To Be Delivered',
      statusColor: '#f59e0b',
      StatusIcon: Truck,
      product: 'Men Striped Round Neck T-shirt',
      details: 'White/Navy • Size: M • Qty: 1',
      price: '₹449',
      total: '₹449',
      btnText: 'Order Details'
    },
    {
      id: '#ORD-123456787',
      date: '02 May 2024, 06:40 PM',
      status: 'Delivered',
      statusColor: '#16a34a',
      StatusIcon: CheckCircle2,
      product: 'Men Oversized T-shirt',
      details: 'Black • Size: XL • Qty: 1',
      price: '₹499',
      total: '₹499',
      btnText: 'Order Details'
    },
    {
      id: '#ORD-123456786',
      date: '28 Apr 2024, 11:20 AM',
      status: 'Cancelled',
      statusColor: '#ef4444',
      StatusIcon: XCircle,
      product: 'Men Cotton Plain T-shirt',
      details: 'Mauve • Size: M • Qty: 1',
      price: '₹329',
      total: '₹329',
      btnText: 'Order Details'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Gradient */}
      <LinearGradient
        colors={['#081028', '#1e3a8a', '#3b82f6', '#f8fafc']}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerTop}>
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
                <Heart size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <ShoppingCart size={24} color="#ffffff" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.locationProfileRow}>
            <TouchableOpacity style={styles.locationContainer}>
              <MapPin size={14} color="#ffffff" />
              <Text style={styles.locationText} numberOfLines={1}>
                Deliver to Harish Kumar - Q No- 6/B, Street -13, Sector -2, Bhilai
              </Text>
              <ChevronDown size={14} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Bell size={24} color="#ffffff" />
                <View style={styles.badgeRed}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <User size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#3b82f6" />
              <TextInput
                placeholder="Search for products, stores and more..."
                placeholderTextColor="#94a3b8"
                style={styles.searchInput}
              />
              <Mic size={20} color="#94a3b8" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Page Title */}
      <View style={styles.pageTitleRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1d4ed8" />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>My Orders</Text>
          <Text style={styles.pageSubtitle}>Track, manage and view all your orders</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            let icon = null;
            if (tab === 'Reserve') icon = <Calendar size={14} color={isActive ? '#1d4ed8' : '#64748b'} style={{marginRight: 4}} />;
            if (tab === 'Pickup') icon = <ShoppingBag size={14} color={isActive ? '#1d4ed8' : '#64748b'} style={{marginRight: 4}} />;
            
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab)}
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {icon}
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {orders.map((order, index) => {
          const StatusIcon = order.StatusIcon;
          return (
            <View key={index} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order ID: {order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={styles.orderStatusWrap}>
                  <Text style={[styles.orderStatus, { color: order.statusColor }]}>{order.status}</Text>
                  <StatusIcon size={16} color={order.statusColor} style={{ marginLeft: 4 }} />
                  <ChevronRight size={16} color="#94a3b8" style={{ marginLeft: 4 }} />
                </View>
              </View>

              <View style={styles.orderContent}>
                <View style={styles.orderImagePlaceholder}>
                  <View style={{width: 60, height: 60, backgroundColor: '#f1f5f9', borderRadius: 8}} />
                </View>
                <View style={styles.orderDetailsWrap}>
                  <View style={styles.orderTitleRow}>
                    <Text style={styles.orderProduct} numberOfLines={1}>{order.product}</Text>
                    <TouchableOpacity style={styles.shareBtn}>
                      <Share2 size={16} color="#1d4ed8" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.orderDetails}>{order.details}</Text>
                  <Text style={styles.orderPrice}>{order.price}</Text>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotalLabel}>Total Amount: <Text style={styles.orderTotalValue}>{order.total}</Text></Text>
                <TouchableOpacity style={styles.detailsBtn} onPress={() => router.push('/order-details')}>
                  <Text style={styles.detailsBtnText}>{order.btnText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerGradient: { paddingTop: Platform.OS === 'android' ? 40 : 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIconContainer: { width: 24, height: 24, position: 'relative', marginRight: 4 },
  logoIconLayer: { width: 14, height: 24, borderRadius: 6, position: 'absolute', transform: [{ skewX: '-15deg' }] },
  logoText: { color: '#ffffff', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  logoSubtext: { color: '#cbd5e1', fontSize: 9 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconButton: { position: 'relative' },
  badge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#3b82f6', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#081028' },
  badgeRed: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#081028' },
  badgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  locationProfileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 24, gap: 6, flex: 1, marginRight: 16 },
  locationText: { color: '#ffffff', fontSize: 11, flex: 1 },
  profileActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  searchBarContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 24, paddingHorizontal: 16, height: 48, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  backButton: { padding: 4 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  tabsWrapper: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tabsScroll: { paddingHorizontal: 16, gap: 24 },
  tabBtn: { paddingBottom: 12, position: 'relative' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#1d4ed8' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#1d4ed8', fontWeight: '700' },
  scrollContent: { padding: 16 },
  orderCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderId: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  orderDate: { fontSize: 11, color: '#64748b', marginTop: 2 },
  orderStatusWrap: { flexDirection: 'row', alignItems: 'center' },
  orderStatus: { fontSize: 12, fontWeight: '700' },
  orderContent: { flexDirection: 'row', marginBottom: 16 },
  orderImagePlaceholder: { marginRight: 12 },
  orderDetailsWrap: { flex: 1 },
  orderTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderProduct: { fontSize: 14, fontWeight: '700', color: '#1e3a8a', flex: 1 },
  shareBtn: { padding: 6, backgroundColor: '#eff6ff', borderRadius: 16 },
  orderDetails: { fontSize: 11, color: '#64748b', marginTop: 4, marginBottom: 8 },
  orderPrice: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  orderTotalLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  orderTotalValue: { color: '#0f172a', fontWeight: '800' },
  detailsBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#3b82f6' },
  detailsBtnText: { color: '#3b82f6', fontSize: 13, fontWeight: '700' }
});
