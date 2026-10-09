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
  Trash2
} from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { useRouter } from 'expo-router';

export default function WishlistScreen() {
  const router = useRouter();

  const products = [
    {
      name: 'Men White Sneakers',
      store: 'Fashion Hub',
      optionLabel: 'Size',
      optionValue: '9',
      price: '₹1,299',
    },
    {
      name: 'boAt Wave Sigma 3 Smartwatch',
      store: 'Fashion Hub',
      optionLabel: 'Color',
      optionValue: 'Black',
      price: '₹1,799',
    },
    {
      name: 'Men Casual Shirt',
      store: 'Fashion Hub',
      optionLabel: 'Size',
      optionValue: 'L',
      optionValue2: 'Navy Blue',
      price: '₹699',
    },
    {
      name: 'Laptop Backpack',
      store: 'Fashion Hub',
      optionLabel: 'Color',
      optionValue: 'Black',
      price: '₹899',
    },
    {
      name: 'pTron Bassbuds Vista',
      store: 'Fashion Hub',
      optionLabel: 'Color',
      optionValue: 'Mint Green',
      price: '₹1,099',
    },
    {
      name: 'Wild Stone Blue Eau De Parfum',
      store: 'Fashion Hub',
      optionLabel: 'Size',
      optionValue: '100 ml',
      price: '₹499',
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
        <View style={{marginLeft: 8, flex: 1}}>
          <Text style={styles.pageTitle}>My Wishlist</Text>
          <Text style={styles.pageSubtitle}>Items you love, saved for later.</Text>
        </View>
      </View>
      <View style={styles.itemsCountRow}>
        <Heart size={14} color="#ef4444" fill="#ef4444" />
        <Text style={styles.itemsCountText}>6 Items</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {products.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <View style={styles.productImageWrap}>
                <View style={styles.productImageBg} />
                <TouchableOpacity style={styles.heartBtn}>
                  <Heart size={16} color="#ef4444" fill="#ef4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.storeName}>{item.store}</Text>
                
                <View style={styles.optionsRow}>
                  <TouchableOpacity style={styles.optionPill}>
                    <Text style={styles.optionText}>{item.optionLabel}: {item.optionValue}</Text>
                    <ChevronDown size={12} color="#64748b" style={{marginLeft: 4}} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.stockStatus}>In Stock</Text>
                
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.deleteBtn}>
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cartBtn}>
                    <Text style={styles.cartBtnText}>Move to Cart</Text>
                  </TouchableOpacity>
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
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 },
  backButton: { padding: 4, marginLeft: -8 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  itemsCountRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 12, gap: 6 },
  itemsCountText: { fontSize: 13, fontWeight: '700', color: '#1e3a8a' },
  scrollContent: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  productImageWrap: { height: 120, position: 'relative', backgroundColor: '#f8fafc', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  productImageBg: { flex: 1 },
  heartBtn: { position: 'absolute', top: 8, right: 8 },
  productInfo: { padding: 12 },
  productName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  storeName: { fontSize: 11, color: '#2563eb', marginTop: 2 },
  optionsRow: { flexDirection: 'row', marginTop: 8, marginBottom: 8 },
  optionPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  optionText: { fontSize: 10, color: '#334155', fontWeight: '500' },
  price: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  stockStatus: { fontSize: 10, color: '#16a34a', fontWeight: '700', marginTop: 4, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  deleteBtn: { width: 36, height: 36, borderRadius: 6, borderWidth: 1, borderColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  cartBtn: { flex: 1, height: 36, backgroundColor: '#0061ff', borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  cartBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' }
});
