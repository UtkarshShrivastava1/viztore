import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { ChevronLeft, Search, Package, RotateCcw, CreditCard, User, Store, ChevronRight, MessageCircle, PhoneCall, Mail, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function HelpSupportScreen() {
  const router = useRouter();

  const quickHelp = [
    { id: 1, title: 'Orders & Delivery', icon: Package, color: '#3b82f6' },
    { id: 2, title: 'Returns & Refunds', icon: RotateCcw, color: '#f59e0b' },
    { id: 3, title: 'Payments & Offers', icon: CreditCard, color: '#10b981' },
    { id: 4, title: 'Account & Profile', icon: User, color: '#8b5cf6' },
    { id: 5, title: 'Selling on {branding.appName}', icon: Store, color: '#ec4899' },
  ];

  const topTopics = [
    'How do I track my order?',
    'How can I return or replace an item?',
    'When will I get my refund?',
    'How do I apply a coupon?',
    'How do I update my address?'
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>We're here to help you!</Text>
            <Text style={styles.heroSubtitle}>Find answers to your questions or contact our support team.</Text>
          </View>
          <View style={styles.heroImagePlaceholder}>
            {/* Headphones Illustration placeholder */}
            <View style={styles.mockIllustration}>
              <View style={styles.mockHeadphones} />
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#94a3b8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search for help topics, e.g., order, refund, payment"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Help</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickHelpScroll}>
            {quickHelp.map((item) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity key={item.id} style={styles.quickHelpItem}>
                  <View style={[styles.quickHelpIconWrap, { borderColor: item.color + '40', backgroundColor: item.color + '10' }]}>
                    <Icon size={24} color={item.color} />
                  </View>
                  <Text style={styles.quickHelpText}>{item.title}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Top Help Topics</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.topicsCard}>
            {topTopics.map((topic, index) => (
              <TouchableOpacity key={index} style={[styles.topicItem, index === topTopics.length - 1 && styles.topicItemLast]}>
                <Text style={styles.topicText}>{topic}</Text>
                <ChevronRight size={16} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.sectionSubtitle}>Choose the best way to reach us</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactScroll}>
            <TouchableOpacity style={styles.contactCard}>
              <View style={[styles.contactIconWrap, { backgroundColor: '#eff6ff' }]}>
                <MessageCircle size={24} color="#3b82f6" />
              </View>
              <View style={styles.contactHeaderRow}>
                <Text style={styles.contactTitle}>Chat with Us</Text>
                <ChevronRight size={16} color="#0f172a" />
              </View>
              <Text style={styles.contactDesc}>Chat instantly with our support team</Text>
              <Text style={[styles.contactInfo, { color: '#16a34a' }]}>Available 9AM - 9PM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard}>
              <View style={[styles.contactIconWrap, { backgroundColor: '#f0fdf4' }]}>
                <PhoneCall size={24} color="#16a34a" />
              </View>
              <View style={styles.contactHeaderRow}>
                <Text style={styles.contactTitle}>Call Us</Text>
                <ChevronRight size={16} color="#0f172a" />
              </View>
              <Text style={styles.contactDesc}>Speak with our customer care executive</Text>
              <Text style={[styles.contactInfo, { color: '#16a34a' }]}>1800-123-4567</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard}>
              <View style={[styles.contactIconWrap, { backgroundColor: '#f5f3ff' }]}>
                <Mail size={24} color="#8b5cf6" />
              </View>
              <View style={styles.contactHeaderRow}>
                <Text style={styles.contactTitle}>Email Us</Text>
                <ChevronRight size={16} color="#0f172a" />
              </View>
              <Text style={styles.contactDesc}>Drop us an email and we'll get back to you</Text>
              <Text style={[styles.contactInfo, { color: '#3b82f6' }]}>{branding.supportEmail}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.safeSecureCard}>
          <View style={styles.safeSecureIcon}>
            <ShieldCheck size={28} color="#3b82f6" />
          </View>
          <View style={styles.safeSecureTextWrap}>
            <Text style={styles.safeSecureTitle}>Safe & Secure</Text>
            <Text style={styles.safeSecureDesc}>Your information is safe with us. We never share your data with anyone.</Text>
          </View>
          <View style={styles.safeSecureBgArt} />
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  content: { padding: 16 },
  heroSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  heroTextContainer: { flex: 1, paddingRight: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#1e3a8a', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#475569', lineHeight: 20 },
  heroImagePlaceholder: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  mockIllustration: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' },
  mockHeadphones: { width: 40, height: 40, borderRadius: 20, borderWidth: 4, borderColor: '#3b82f6', borderBottomWidth: 0 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#0f172a' },
  section: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: '#64748b', marginBottom: 12 },
  viewAllText: { fontSize: 13, color: '#2563eb', fontWeight: '600' },
  quickHelpScroll: { paddingVertical: 8, gap: 16 },
  quickHelpItem: { alignItems: 'center', width: 70 },
  quickHelpIconWrap: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  quickHelpText: { fontSize: 11, color: '#0f172a', textAlign: 'center', fontWeight: '500' },
  topicsCard: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  topicItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  topicItemLast: { borderBottomWidth: 0 },
  topicText: { fontSize: 14, color: '#334155' },
  contactScroll: { gap: 16, paddingBottom: 8 },
  contactCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, width: 220, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 16 },
  contactIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  contactHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  contactTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  contactDesc: { fontSize: 12, color: '#64748b', marginBottom: 12, lineHeight: 18 },
  contactInfo: { fontSize: 13, fontWeight: '600' },
  safeSecureCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', position: 'relative', overflow: 'hidden' },
  safeSecureIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  safeSecureTextWrap: { flex: 1, zIndex: 2 },
  safeSecureTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  safeSecureDesc: { fontSize: 12, color: '#475569', lineHeight: 18 },
  safeSecureBgArt: { position: 'absolute', right: -20, bottom: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: '#bfdbfe', opacity: 0.5, zIndex: 1 },
});
