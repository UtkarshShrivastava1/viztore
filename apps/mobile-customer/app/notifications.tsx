import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Briefcase,
  Tag,
  Heart,
  Truck,
  Bell,
  Star,
  Shield,
  Search,
  ShoppingCart,
  Mic,
  MapPin,
  ChevronDown,
  User,
  Store,
  ChevronRight
} from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Orders', 'Offers', 'Account', 'Updates'];

  const notifications = [
    {
      id: 1,
      title: 'Your order has been delivered',
      desc: 'Order #VZ785612 has been delivered successfully.',
      time: '10 minutes ago',
      icon: Briefcase,
      iconColor: '#9333ea',
      iconBg: '#f3e8ff',
      unread: true
    },
    {
      id: 2,
      title: 'Special offer just for you!',
      desc: 'Get up to 50% OFF on Fashion products. Limited time only!',
      time: '1 hour ago',
      icon: Tag,
      iconColor: '#ef4444',
      iconBg: '#fee2e2',
      unread: true
    },
    {
      id: 3,
      title: 'Item back in stock',
      desc: 'The item in your wishlist "Men White Sneakers" is now back in stock.',
      time: '3 hours ago',
      icon: Heart,
      iconColor: '#ef4444',
      iconBg: '#fee2e2',
      unread: true
    },
    {
      id: 4,
      title: 'Your order is out for delivery',
      desc: 'Order #VZ785612 is out for delivery and will arrive today.',
      time: '5 hours ago',
      icon: Truck,
      iconColor: '#f97316',
      iconBg: '#ffedd5',
      unread: false
    },
    {
      id: 5,
      title: 'Flat ₹200 OFF',
      desc: 'Use code VZ200 and get flat ₹200 off on your next purchase.',
      time: '1 day ago',
      icon: Tag,
      iconColor: '#22c55e',
      iconBg: '#dcfce7',
      unread: false
    },
    {
      id: 6,
      title: 'Price drop alert',
      desc: 'The price of boAt Wave Sigma 3 has dropped to ₹1,599.',
      time: '2 days ago',
      icon: Bell,
      iconColor: '#eab308',
      iconBg: '#fef9c3',
      unread: false
    },
    {
      id: 7,
      title: 'New store near you',
      desc: 'Tech World is now available near your location.',
      time: '3 days ago',
      icon: Store,
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      unread: false
    },
    {
      id: 8,
      title: 'Rate your purchase',
      desc: 'How was your experience with Men Casual Shirt? Share your feedback.',
      time: '4 days ago',
      icon: Star,
      iconColor: '#9333ea',
      iconBg: '#f3e8ff',
      unread: false
    },
    {
      id: 9,
      title: 'Account security',
      desc: 'Your password was updated successfully.',
      time: '5 days ago',
      icon: Shield,
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      unread: false
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1d4ed8" />
          </TouchableOpacity>
          <View style={{marginLeft: 8}}>
            <Text style={styles.pageTitle}>Notifications</Text>
            <Text style={styles.pageSubtitle}>Stay updated with your orders, offers and more.</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={styles.markReadText}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity key={item.id} style={styles.notifCard}>
              <View style={[styles.iconWrap, {backgroundColor: item.iconBg}]}>
                <Icon size={20} color={item.iconColor} />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifDesc}>{item.desc}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              {item.unread && (
                <View style={styles.unreadDot} />
              )}
              <ChevronRight size={16} color="#94a3b8" style={{marginLeft: 8}} />
            </TouchableOpacity>
          )
        })}
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
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
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  backButton: { padding: 4, marginLeft: -8 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  markReadText: { color: '#2563eb', fontSize: 12, fontWeight: '700' },
  tabsContainer: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  tabsScroll: { paddingHorizontal: 16, gap: 16 },
  tabBtn: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: '#2563eb' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#0f172a' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  notifCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  notifDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: '#94a3b8' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', marginLeft: 8 }
});
