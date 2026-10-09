import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, Check, Store, Tag, LayoutGrid, Heart, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function LoggedOutScreen() {
  const router = useRouter();

  const exploreItems = [
    { id: 1, title: 'Local Stores', desc: 'Find and explore trusted local stores', icon: Store, color: '#10b981', bg: '#ecfdf5' },
    { id: 2, title: 'Best Deals', desc: 'Discover amazing offers and discounts', icon: Tag, color: '#f59e0b', bg: '#fffbeb' },
    { id: 3, title: 'Categories', desc: 'Browse products across categories', icon: LayoutGrid, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 4, title: 'Wishlist', desc: 'Save your favorite products', icon: Heart, color: '#ec4899', bg: '#fdf2f8' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/account')}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successSection}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Check size={40} color="#22c55e" strokeWidth={3} />
            </View>
            <View style={[styles.sparkle, { top: -10, left: 10 }]} />
            <View style={[styles.sparkle, { top: 20, right: -15 }]} />
            <View style={[styles.sparkle, { bottom: 10, left: -10 }]} />
            <View style={[styles.sparkle, { bottom: -5, right: 20 }]} />
          </View>
          <Text style={styles.successTitle}>You have been logged out</Text>
          <Text style={styles.successDesc}>You have successfully logged out of your account.</Text>
          
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Login / Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerBadge}>
            <Text style={styles.dividerText}>or</Text>
          </View>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>Explore {branding.appName}</Text>
          <View style={styles.exploreGrid}>
            {exploreItems.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity key={item.id} style={styles.exploreCard}>
                  <View style={[styles.exploreIconWrap, { backgroundColor: item.bg }]}>
                    <Icon size={24} color={item.color} />
                  </View>
                  <Text style={styles.exploreCardTitle}>{item.title}</Text>
                  <Text style={styles.exploreCardDesc}>{item.desc}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={styles.thankYouCard}>
          <View style={styles.thankYouIcon}>
            <ShieldCheck size={20} color="#16a34a" />
          </View>
          <View style={styles.thankYouTextWrap}>
            <Text style={styles.thankYouTitle}>Thank you for using {branding.appName}</Text>
            <Text style={styles.thankYouDesc}>We hope to see you again soon!</Text>
          </View>
        </View>
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  content: { padding: 16 },
  successSection: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  successIconOuter: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative' },
  successIconInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#22c55e' },
  sparkle: { position: 'absolute', width: 6, height: 6, backgroundColor: '#86efac', transform: [{rotate: '45deg'}] },
  successTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  successDesc: { fontSize: 14, color: '#475569', textAlign: 'center', marginBottom: 24 },
  loginBtn: { backgroundColor: '#2563eb', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 8, width: '100%', alignItems: 'center' },
  loginBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#ffffff', marginHorizontal: 12 },
  dividerText: { fontSize: 12, color: '#64748b' },
  exploreSection: { marginBottom: 24 },
  exploreTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  exploreGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  exploreCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
  exploreIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  exploreCardTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 4, textAlign: 'center' },
  exploreCardDesc: { fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 16 },
  thankYouCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  thankYouIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' },
  thankYouTextWrap: { flex: 1 },
  thankYouTitle: { fontSize: 14, fontWeight: '700', color: '#166534', marginBottom: 2 },
  thankYouDesc: { fontSize: 12, color: '#15803d' },
});
