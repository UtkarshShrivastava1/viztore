import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, FileText, Calendar, Users, ShoppingBag, ShieldAlert, RefreshCcw, ShieldCheck, CreditCard, XCircle, AlertTriangle, Scale, HeadphonesIcon, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function TermsConditionsScreen() {
  const router = useRouter();

  const highlights = [
    { id: 1, title: 'User Agreement', desc: `By using ${branding.appName}, you agree to these terms.`, icon: Users, color: '#3b82f6' },
    { id: 2, title: 'Use of Services', desc: 'Use our app and services only for lawful purposes.', icon: ShoppingBag, color: '#10b981' },
    { id: 3, title: 'Your Responsibilities', desc: 'Provide accurate information and keep your account secure.', icon: ShieldAlert, color: '#8b5cf6' },
    { id: 4, title: 'Policy Updates', desc: 'We may update these terms. Continued use means you accept the changes.', icon: RefreshCcw, color: '#f59e0b' },
  ];

  const termsList = [
    { id: 1, title: '1. Acceptance of Terms', desc: `By accessing or using ${branding.appName}, you agree to be bound by these Terms and Conditions.`, icon: FileText },
    { id: 2, title: `2. About ${branding.appName}`, desc: `Learn about ${branding.appName}, our platform and the services we provide.`, icon: ShieldCheck },
    { id: 3, title: '3. User Accounts', desc: 'Rules and responsibilities related to creating and managing your account.', icon: Users },
    { id: 4, title: '4. Use of Services', desc: `Guidelines for using ${branding.appName} and what you can expect from our services.`, icon: ShoppingBag },
    { id: 5, title: '5. Orders and Payments', desc: 'Information about placing orders, pricing and payment methods.', icon: CreditCard },
    { id: 6, title: '6. Returns and Refunds', desc: 'Our policy on returns, refunds and cancellations.', icon: RefreshCcw },
    { id: 7, title: '7. Prohibited Activities', desc: `Activities that are not allowed on ${branding.appName}.`, icon: XCircle },
    { id: 8, title: '8. Limitation of Liability', desc: 'Limitations of our liability to the fullest extent permitted by law.', icon: AlertTriangle },
    { id: 9, title: '9. Governing Law', desc: 'These terms are governed by the laws of India.', icon: Scale },
    { id: 10, title: '10. Contact Us', desc: 'How to reach us for any questions about these terms.', icon: HeadphonesIcon },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Terms & Conditions</Text>
            <Text style={styles.heroDesc}>Please read these terms and conditions carefully before using {branding.appName}.</Text>
            <View style={styles.dateTag}>
              <Calendar size={14} color="#64748b" />
              <Text style={styles.dateText}>Last updated: 20 May 2025</Text>
            </View>
          </View>
          <View style={styles.heroIllustration}>
             <FileText size={64} color="#3b82f6" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Highlights</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.highlightsScroll}>
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
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <View style={styles.contentsCard}>
            {termsList.map((item, index) => {
              // Quick fix for missing icon
              const Icon = item.icon;
              return (
                <TouchableOpacity key={item.id} style={[styles.contentItem, index === termsList.length - 1 && styles.contentItemLast]}>
                  <View style={styles.contentItemIcon}>
                    <Icon size={18} color="#3b82f6" />
                  </View>
                  <View style={styles.contentItemText}>
                    <Text style={styles.contentItemTitle}>{item.title}</Text>
                    <Text style={styles.contentItemDesc}>{item.desc}</Text>
                  </View>
                  <ChevronRight size={16} color="#94a3b8" />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <View style={styles.ackCard}>
          <ShieldCheck size={20} color="#16a34a" />
          <Text style={styles.ackText}>By continuing to use {branding.appName}, you acknowledge that you have read, understood and agree to these Terms & Conditions.</Text>
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
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#1e3a8a', marginBottom: 8 },
  heroDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },
  dateTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  dateText: { fontSize: 11, color: '#475569', fontWeight: '500' },
  heroIllustration: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  highlightsScroll: { gap: 16, paddingBottom: 8 },
  highlightCard: { width: 160, backgroundColor: '#ffffff', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 16 },
  highlightIconWrap: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  highlightTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 6, textAlign: 'center' },
  highlightDesc: { fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 16 },
  contentsCard: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  contentItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  contentItemLast: { borderBottomWidth: 0 },
  contentItemIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  contentItemText: { flex: 1, paddingRight: 12 },
  contentItemTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  contentItemDesc: { fontSize: 11, color: '#64748b', lineHeight: 16 },
  ackCard: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1, borderColor: '#dcfce7' },
  ackText: { flex: 1, fontSize: 12, color: '#166534', lineHeight: 18, fontWeight: '500' },
});
