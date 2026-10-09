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
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Search,
  Mic,
  Heart,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Bell,
  User,
  Frown,
  Meh,
  Smile,
  ShoppingBag,
  Package,
  Truck,
  Store,
  Smartphone,
  Camera,
  ArrowRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function FeedbackScreen() {
  const router = useRouter();
  const [rating, setRating] = useState('Good');
  const [feedbackAbout, setFeedbackAbout] = useState('Overall Experience');
  const [recommendScore, setRecommendScore] = useState(10);

  const experienceLevels = [
    { label: 'Very Poor', icon: Frown },
    { label: 'Poor', icon: Frown }, // Using frown for poor as well, just illustration
    { label: 'Average', icon: Meh },
    { label: 'Good', icon: Smile },
    { label: 'Excellent', icon: Smile },
  ];

  const feedbackCategories = [
    { label: 'Overall Experience', icon: ShoppingBag },
    { label: 'Product Quality', icon: Package },
    { label: 'Delivery Experience', icon: Truck },
    { label: 'Store Experience', icon: Store },
    { label: 'App Experience', icon: Smartphone },
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
            <Text style={styles.pageTitle}>Feedback</Text>
            <Text style={styles.pageSubtitle}>We value your feedback and are always looking to improve.</Text>
          </View>
        </View>
        {/* Placeholder for rating illustration */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Experience Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience with {branding.appName}?</Text>
          <View style={styles.experienceRow}>
            {experienceLevels.map((exp) => {
              const Icon = exp.icon;
              const isActive = rating === exp.label;
              return (
                <TouchableOpacity key={exp.label} style={styles.expItem} onPress={() => setRating(exp.label)}>
                  <View style={[styles.expIconWrap, isActive && styles.expIconWrapActive]}>
                    <Icon size={32} color={isActive ? '#2563eb' : '#94a3b8'} />
                  </View>
                  <Text style={[styles.expLabel, isActive && styles.expLabelActive]}>{exp.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Feedback Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is your feedback about?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {feedbackCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = feedbackAbout === cat.label;
              return (
                <TouchableOpacity 
                  key={cat.label} 
                  style={[styles.catCard, isActive && styles.catCardActive]}
                  onPress={() => setFeedbackAbout(cat.label)}
                >
                  <Icon size={24} color={isActive ? '#2563eb' : '#64748b'} />
                  <Text style={[styles.catLabel, isActive && styles.catLabelActive]}>{cat.label}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Text Area */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tell us more <Text style={styles.optionalText}>(Optional)</Text></Text>
          <View style={styles.textAreaWrap}>
            <TextInput 
              placeholder="Share your thoughts, suggestions or issues..."
              placeholderTextColor="#94a3b8"
              style={styles.textArea}
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>0/500</Text>
          </View>
        </View>

        {/* NPS Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Would you recommend {branding.appName} to others?</Text>
          <View style={styles.npsRow}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(score => (
              <TouchableOpacity 
                key={score} 
                style={[styles.npsBtn, recommendScore === score && styles.npsBtnActive]}
                onPress={() => setRecommendScore(score)}
              >
                <Text style={[styles.npsBtnText, recommendScore === score && styles.npsBtnTextActive]}>{score}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.npsLabels}>
            <Text style={styles.npsLabelText}>Not at all</Text>
            <Text style={styles.npsLabelText}>Definitely</Text>
          </View>
        </View>

        {/* Upload Screenshots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Screenshots <Text style={styles.optionalText}>(Optional)</Text></Text>
          <Text style={styles.uploadSubtext}>You can upload screenshots to help us understand better.</Text>
          <TouchableOpacity style={styles.uploadBox}>
            <Camera size={24} color="#64748b" />
            <Text style={styles.uploadText}>Upload Image</Text>
            <Text style={styles.uploadSub}>(Max 3 images)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Submit Feedback</Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>

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
  pageSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2, width: '80%' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  optionalText: { fontSize: 12, color: '#94a3b8', fontWeight: '400' },
  experienceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 },
  expItem: { alignItems: 'center' },
  expIconWrap: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  expIconWrapActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  expLabel: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  expLabelActive: { color: '#2563eb', fontWeight: '700' },
  categoryScroll: { gap: 12, paddingBottom: 8 },
  catCard: { width: 100, height: 80, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  catCardActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  catLabel: { fontSize: 10, color: '#64748b', textAlign: 'center', marginTop: 8, fontWeight: '500' },
  catLabelActive: { color: '#2563eb', fontWeight: '700' },
  textAreaWrap: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, backgroundColor: '#ffffff' },
  textArea: { height: 120, padding: 12, fontSize: 14, color: '#0f172a' },
  charCount: { position: 'absolute', bottom: 12, right: 12, fontSize: 11, color: '#94a3b8' },
  npsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  npsBtn: { flex: 1, height: 40, borderWidth: 1, borderColor: '#e2e8f0', marginHorizontal: 2, alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#f8fafc' },
  npsBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  npsBtnText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  npsBtnTextActive: { color: '#ffffff' },
  npsLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  npsLabelText: { fontSize: 10, color: '#64748b', fontWeight: '500' },
  uploadSubtext: { fontSize: 12, color: '#64748b', marginBottom: 12, marginTop: -8 },
  uploadBox: { width: 100, height: 100, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  uploadText: { fontSize: 11, color: '#64748b', fontWeight: '600', marginTop: 8 },
  uploadSub: { fontSize: 9, color: '#94a3b8', marginTop: 2 },
  submitBtn: { backgroundColor: '#0061ff', height: 48, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' }
});
