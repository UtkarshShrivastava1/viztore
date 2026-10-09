import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  Heart,
  ShoppingCart,
  Rocket,
  Users,
  TrendingUp,
  ShieldCheck,
  HeadphonesIcon,
  Tag,
  PieChart,
  Calendar,
  Wallet,
  ChevronRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function SellOn{branding.appName}Screen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
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

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Sell on {branding.appName}</Text>
            <Text style={styles.heroSubtitle}>Start selling and grow your business with India's trusted local marketplace</Text>
            {/* Placeholder for illustration */}
            <View style={styles.illustrationPlaceholder} />
          </View>

          {/* CTA Banner */}
          <View style={styles.ctaBanner}>
            <View style={styles.ctaIconWrap}>
              <Rocket size={24} color="#22c55e" />
            </View>
            <View style={styles.ctaTextWrap}>
              <Text style={styles.ctaTitle}>Grow your business with {branding.appName}</Text>
              <Text style={styles.ctaSubtitle}>Reach more local customers and boost your sales</Text>
            </View>
            <TouchableOpacity style={styles.ctaBtn}>
              <Text style={styles.ctaBtnText}>Get Started</Text>
              <ChevronRight size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Why Sell */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Why sell on {branding.appName}?</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#eff6ff'}]}>
                  <Users size={24} color="#2563eb" />
                </View>
                <Text style={styles.featureTitle}>Local Customers</Text>
                <Text style={styles.featureDesc}>Reach thousands of local buyers near you</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#dcfce7'}]}>
                  <TrendingUp size={24} color="#16a34a" />
                </View>
                <Text style={styles.featureTitle}>Grow Your Business</Text>
                <Text style={styles.featureDesc}>Increase sales and expand your brand</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#f3e8ff'}]}>
                  <ShieldCheck size={24} color="#9333ea" />
                </View>
                <Text style={styles.featureTitle}>Secure & Reliable</Text>
                <Text style={styles.featureDesc}>Safe payments and seller protection</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#ffedd5'}]}>
                  <HeadphonesIcon size={24} color="#f97316" />
                </View>
                <Text style={styles.featureTitle}>Dedicated Support</Text>
                <Text style={styles.featureDesc}>Get help at every step of your journey</Text>
              </View>
            </View>
          </View>

          {/* Steps */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Start Selling in 3 Simple Steps</Text>
            <View style={styles.stepsRow}>
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepTitle}>Register</Text>
                <Text style={styles.stepDesc}>Sign up and provide your business details</Text>
              </View>
              <View style={styles.stepDashedLine} />
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepTitle}>Verify & Setup</Text>
                <Text style={styles.stepDesc}>Verify your documents and set up your store</Text>
              </View>
              <View style={styles.stepDashedLine} />
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>3</Text>
                </View>
                <Text style={styles.stepTitle}>List & Sell</Text>
                <Text style={styles.stepDesc}>List your products and start selling instantly</Text>
              </View>
            </View>
          </View>

          {/* Tools */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Tools to Grow Your Business</Text>
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#eff6ff'}]}>
                  <Tag size={24} color="#3b82f6" />
                </View>
                <Text style={styles.featureTitle}>Promotions & Ads</Text>
                <Text style={styles.featureDesc}>Increase visibility and boost sales</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#dcfce7'}]}>
                  <PieChart size={24} color="#22c55e" />
                </View>
                <Text style={styles.featureTitle}>Business Insights</Text>
                <Text style={styles.featureDesc}>Track performance and growth</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#f3e8ff'}]}>
                  <Calendar size={24} color="#9333ea" />
                </View>
                <Text style={styles.featureTitle}>Inventory Manager</Text>
                <Text style={styles.featureDesc}>Manage stock and orders easily</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, {backgroundColor: '#ffedd5'}]}>
                  <Wallet size={24} color="#f97316" />
                </View>
                <Text style={styles.featureTitle}>Payouts</Text>
                <Text style={styles.featureDesc}>Easy withdrawals and settlements</Text>
              </View>
            </View>
          </View>

          {/* Help Banner */}
          <TouchableOpacity style={styles.helpBanner}>
            <HeadphonesIcon size={24} color="#0f172a" />
            <View style={styles.helpTextWrap}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <Text style={styles.helpDesc}>Our team is here to help you at every step.</Text>
            </View>
            <Text style={styles.contactSupportText}>Contact Support</Text>
            <ChevronRight size={16} color="#2563eb" />
          </TouchableOpacity>

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
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  heroSection: { marginBottom: 24 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#1e3a8a', marginBottom: 12 },
  heroSubtitle: { fontSize: 14, color: '#475569', lineHeight: 22, width: '60%' },
  illustrationPlaceholder: { height: 160, position: 'absolute', right: -16, top: 0, width: 160 }, // Placeholder for illustration
  ctaBanner: { flexDirection: 'row', backgroundColor: '#f0fdf4', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#bbf7d0' },
  ctaIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  ctaTextWrap: { flex: 1 },
  ctaTitle: { fontSize: 13, fontWeight: '700', color: '#166534', marginBottom: 4 },
  ctaSubtitle: { fontSize: 11, color: '#15803d' },
  ctaBtn: { backgroundColor: '#16a34a', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, gap: 4 },
  ctaBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  sectionBlock: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1e3a8a', marginBottom: 16 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  featureItem: { width: '50%', padding: 8, alignItems: 'center' },
  featureIconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  featureTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: 6 },
  featureDesc: { fontSize: 11, color: '#64748b', textAlign: 'center', lineHeight: 16 },
  stepsRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 16 },
  stepItem: { alignItems: 'center', width: 80 },
  stepCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#bfdbfe' },
  stepNumber: { fontSize: 18, fontWeight: '800', color: '#2563eb' },
  stepTitle: { fontSize: 12, fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: 4 },
  stepDesc: { fontSize: 10, color: '#64748b', textAlign: 'center', lineHeight: 14 },
  stepDashedLine: { flex: 1, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1', marginTop: 24, marginHorizontal: -12 },
  helpBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  helpTextWrap: { flex: 1, marginLeft: 16 },
  helpTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  helpDesc: { fontSize: 11, color: '#64748b' },
  contactSupportText: { fontSize: 12, fontWeight: '600', color: '#2563eb', marginRight: 4 }
});
