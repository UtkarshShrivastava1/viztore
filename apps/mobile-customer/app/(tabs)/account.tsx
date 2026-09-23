import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Package, Heart, MapPin, Tag, HelpCircle, ChevronRight, User, ShieldCheck } from 'lucide-react-native';
import { branding } from '@repo/shared-types';

export default function AccountScreen() {
  const menuItems = [
    { label: 'My Orders & Tracking', icon: Package, badge: '1 Active' },
    { label: 'Wishlist & Saved Items', icon: Heart },
    { label: 'Saved Delivery Addresses', icon: MapPin },
    { label: 'Coupons & Special Offers', icon: Tag, badge: '3 Available' },
    { label: 'Help & 24/7 Support', icon: HelpCircle },
    { label: `Sell on ${branding.appName}`, icon: ShieldCheck, isPromo: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <User size={28} color="#ffffff" />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.userName}>Rahul Sharma</Text>
          <Text style={styles.userPhone}>+91 98765 43210</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Navigation List */}
        <View style={styles.menuCard}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === menuItems.length - 1;
            return (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuRow, isLast && styles.menuRowLast, item.isPromo && styles.promoRow]}
              >
                <View style={styles.menuLeft}>
                  <View style={[styles.iconWrap, item.isPromo && styles.promoIconWrap]}>
                    <Icon size={18} color={item.isPromo ? '#ea580c' : '#334155'} />
                  </View>
                  <Text style={[styles.menuLabel, item.isPromo && styles.promoLabel]}>{item.label}</Text>
                </View>
                <View style={styles.menuRight}>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <ChevronRight size={16} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          {branding.appName} Mobile v1.0.0 • Hyperlocal Retail
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  profileHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#081028' },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#f97316', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  profileText: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
  userPhone: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  editBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  scroll: { padding: 16 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  menuRowLast: { borderBottomWidth: 0 },
  promoRow: { backgroundColor: '#fff7ed' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  promoIconWrap: { backgroundColor: '#ffedd5' },
  menuLabel: { fontSize: 13, fontWeight: '600', color: '#081028' },
  promoLabel: { color: '#c2410c', fontWeight: '700' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, color: '#2563eb', fontWeight: '700' },
  logoutBtn: { marginTop: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#fecaca', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#dc2626', fontSize: 13, fontWeight: '700' },
  versionText: { textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 24 },
});
