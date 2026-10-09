import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ShieldCheck, User, Lock, Sliders, FileText, ChevronRight, HeadphonesIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const highlights = [
    { id: 1, title: 'Secure', desc: 'We use industry-standard security measures to protect your data.', icon: ShieldCheck, color: '#22c55e' },
    { id: 2, title: 'Your Data', desc: 'We collect only the information needed to provide and improve our services.', icon: User, color: '#3b82f6' },
    { id: 3, title: 'No Spam', desc: 'We never sell your personal information or send you unwanted messages.', icon: Lock, color: '#a855f7' },
    { id: 4, title: 'Your Control', desc: 'You can review, update or delete your information anytime.', icon: Sliders, color: '#f59e0b' },
  ];

  const contents = [
    { title: '1. Information We Collect', desc: 'Learn about the information we collect and why we collect it.' },
    { title: '2. How We Use Your Information', desc: 'Understand how we use your information to provide and improve our services.' },
    { title: '3. Information Sharing and Disclosure', desc: 'Learn when and with whom we share your information.' },
    { title: '4. Data Security', desc: 'How we protect your information and keep it secure.' },
    { title: '5. Your Rights and Choices', desc: 'Your rights to access, update or delete your information.' },
    { title: '6. Cookies and Tracking Technologies', desc: 'How we use cookies and similar technologies.' },
    { title: '7. Changes to This Policy', desc: 'How we may update this Privacy Policy from time to time.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Privacy Policy</Text>
            <Text style={styles.heroSubtitle}>Your privacy is important to us.</Text>
            <Text style={styles.heroDesc}>This Privacy Policy explains how {branding.appName} collects, uses, discloses and protects your information when you use our app, website and services.</Text>
          </View>
          <View style={styles.heroIllustration}>
             <ShieldCheck size={64} color="#3b82f6" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Highlights</Text>
          <View style={styles.highlightsGrid}>
            {highlights.map(item => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={styles.highlightCard}>
                  <View style={[styles.highlightIconWrap, { borderColor: item.color + '40' }]}>
                    <Icon size={24} color={item.color} />
                  </View>
                  <Text style={styles.highlightTitle}>{item.title}</Text>
                  <Text style={styles.highlightDesc}>{item.desc}</Text>
                </View>
              )
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policy Contents</Text>
          <View style={styles.contentsCard}>
            {contents.map((item, index) => (
              <TouchableOpacity key={index} style={[styles.contentItem, index === contents.length - 1 && styles.contentItemLast]}>
                <View style={styles.contentItemIcon}>
                  <FileText size={18} color="#3b82f6" />
                </View>
                <View style={styles.contentItemText}>
                  <Text style={styles.contentItemTitle}>{item.title}</Text>
                  <Text style={styles.contentItemDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={16} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.supportCard}>
          <View style={styles.supportIconWrap}>
            <HeadphonesIcon size={24} color="#3b82f6" />
          </View>
          <View style={styles.supportTextWrap}>
            <Text style={styles.supportTitle}>Questions about your privacy?</Text>
            <Text style={styles.supportDesc}>If you have any questions or concerns about this policy, please contact our support team.</Text>
          </View>
          <TouchableOpacity style={styles.supportBtn} onPress={() => router.push('/help-support')}>
            <Text style={styles.supportBtnText}>Contact Support</Text>
            <ChevronRight size={14} color="#2563eb" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <ShieldCheck size={14} color="#22c55e" />
          <Text style={styles.footerText}>Last updated: 20 May 2025</Text>
        </View>
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  content: { padding: 16 },
  heroSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, backgroundColor: '#ffffff', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  heroTextContainer: { flex: 1, paddingRight: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#1e3a8a', marginBottom: 4 },
  heroSubtitle: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  heroDesc: { fontSize: 12, color: '#64748b', lineHeight: 18 },
  heroIllustration: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  highlightsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  highlightCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  highlightIconWrap: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  highlightTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 6, textAlign: 'center' },
  highlightDesc: { fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 16 },
  contentsCard: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  contentItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  contentItemLast: { borderBottomWidth: 0 },
  contentItemIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contentItemText: { flex: 1, paddingRight: 12 },
  contentItemTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  contentItemDesc: { fontSize: 11, color: '#64748b', lineHeight: 16 },
  supportCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'column', marginBottom: 24 },
  supportIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  supportTextWrap: { marginBottom: 16 },
  supportTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  supportDesc: { fontSize: 12, color: '#64748b', lineHeight: 18 },
  supportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe' },
  supportBtnText: { color: '#2563eb', fontSize: 13, fontWeight: '600', marginRight: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 12, color: '#64748b' }
});
