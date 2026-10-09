import React from 'react';
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
  Star,
  Store
} from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { useRouter } from 'expo-router';

export default function FavouriteStoresScreen() {
  const router = useRouter();

  const stores = [
    {
      name: 'Fashion Hub',
      category: 'Clothing, Accessories',
      rating: '4.5',
      reviews: '1.2K',
      products: '320+',
      logoColor: '#000',
      logoText: ['Fashion', 'Hub']
    },
    {
      name: 'Tech World',
      category: 'Electronics',
      rating: '4.3',
      reviews: '856',
      products: '1.2K+',
      logoColor: '#064e3b',
      logoText: ['Tech', 'World'],
      logoHighlight: 1
    },
    {
      name: 'Home Delight',
      category: 'Home & Kitchen',
      rating: '4.6',
      reviews: '1.1K',
      products: '980+',
      logoColor: '#7f1d1d',
      logoText: ['Home', 'Delight'],
      useIcon: true
    },
    {
      name: 'Beauty Glow',
      category: 'Beauty & Personal Care',
      rating: '4.2',
      reviews: '732',
      products: '640+',
      logoColor: '#fce7f3',
      logoText: ['Beauty', 'Glow'],
      textColor: '#be185d'
    },
    {
      name: 'Daily Fresh',
      category: 'Food & Beverages',
      rating: '4.4',
      reviews: '920',
      products: '1.5K+',
      logoColor: '#fef3c7',
      logoText: ['Daily', 'Fresh'],
      textColor: '#047857',
      highlightColor: '#d97706'
    },
    {
      name: 'Kids Zone',
      category: 'Toys & Baby',
      rating: '4.5',
      reviews: '660',
      products: '480+',
      logoColor: '#f3e8ff',
      logoText: ['Kids', 'Zone'],
      textColor: '#7e22ce'
    },
    {
      name: 'Auto Care',
      category: 'Auto Accessories',
      rating: '4.1',
      reviews: '540',
      products: '370+',
      logoColor: '#dcfce7',
      logoText: ['Auto', 'Care'],
      textColor: '#0f766e'
    },
    {
      name: 'Sports Arena',
      category: 'Sports & Fitness',
      rating: '4.4',
      reviews: '610',
      products: '520+',
      logoColor: '#fee2e2',
      logoText: ['Sports', 'Arena'],
      textColor: '#1d4ed8',
      highlightColor: '#b91c1c'
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
            <Text style={styles.pageTitle}>Favourite Stores</Text>
            <Text style={styles.pageSubtitle}>Your favourite stores, all in one place.</Text>
          </View>
        </View>
        <Text style={styles.storeCount}>12 Stores</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {stores.map((store, index) => (
            <View key={index} style={styles.storeCard}>
              <View style={styles.storeBanner}>
                {/* Banner Placeholder */}
                <View style={[styles.bannerBg, {backgroundColor: '#e2e8f0'}]} />
                <TouchableOpacity style={styles.heartIconBtn}>
                  <View style={styles.heartIconBg}>
                    <Heart size={14} color="#ef4444" fill="#ef4444" />
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.storeDetails}>
                <View style={[styles.storeLogo, { backgroundColor: store.logoColor }]}>
                  {store.useIcon ? (
                    <Store size={18} color="#fff" style={{marginBottom: 2}} />
                  ) : null}
                  <Text style={[styles.storeLogoText, { color: store.textColor || '#fff' }]}>
                    {store.logoText[0]}
                  </Text>
                  <Text style={[styles.storeLogoText, { color: store.highlightColor || (store.logoHighlight ? '#eab308' : (store.textColor || '#fff')) }]}>
                    {store.logoText[1]}
                  </Text>
                </View>

                <View style={styles.storeInfoText}>
                  <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
                  <Text style={styles.storeCategory} numberOfLines={1}>{store.category}</Text>
                  
                  <View style={styles.storeStats}>
                    <View style={styles.ratingWrap}>
                      <Star size={10} color="#16a34a" fill="#16a34a" />
                      <Text style={styles.ratingText}>{store.rating} <Text style={styles.reviewsText}>({store.reviews})</Text></Text>
                    </View>
                    <View style={styles.statDivider} />
                    <Text style={styles.productsText}>{store.products} products</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
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
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  backButton: { padding: 4, marginLeft: -8 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  storeCount: { fontSize: 12, color: '#1e3a8a', fontWeight: '600' },
  scrollContent: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  storeCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  storeBanner: { height: 80, position: 'relative' },
  bannerBg: { flex: 1 },
  heartIconBtn: { position: 'absolute', top: 8, right: 8 },
  heartIconBg: { backgroundColor: '#ffffff', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  storeDetails: { padding: 12, paddingTop: 0, position: 'relative' },
  storeLogo: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: -24, borderWidth: 2, borderColor: '#ffffff', marginBottom: 8 },
  storeLogoText: { fontSize: 8, fontWeight: '800' },
  storeInfoText: {},
  storeName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  storeCategory: { fontSize: 10, color: '#64748b', marginTop: 2, marginBottom: 6 },
  storeStats: { flexDirection: 'row', alignItems: 'center' },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 10, fontWeight: '700', color: '#16a34a' },
  reviewsText: { color: '#64748b', fontWeight: '400' },
  statDivider: { width: 1, height: 10, backgroundColor: '#cbd5e1', marginHorizontal: 6 },
  productsText: { fontSize: 10, color: '#64748b' }
});
