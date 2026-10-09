import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { MapPin, Search, Bell, Heart, ChevronDown, ShoppingCart, Mic, Grid, Store, RotateCcw, ShieldCheck, HeadphonesIcon, Star, ChevronRight } from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('ALL');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#081028', '#1e3a8a']}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoV}>V</Text>
              </View>
              <View>
                <Text style={styles.logoText}>{branding.appName}</Text>
                <Text style={styles.logoSubtext}>Making Local Stores Visible.</Text>
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

          {/* Location Bar */}
          <TouchableOpacity style={styles.locationContainer}>
            <MapPin size={16} color="#60a5fa" />
            <Text style={styles.locationText} numberOfLines={1}>
              Deliver to Harish Kumar - Q No- 6/B, Street -13, Sector -2, Bhilai
            </Text>
            <ChevronDown size={16} color="#ffffff" />
          </TouchableOpacity>

          {/* Search Bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Search size={20} color="#64748b" />
              <TextInput
                placeholder="Search for products, stores and more..."
                placeholderTextColor="#64748b"
                style={styles.searchInput}
              />
              <Mic size={20} color="#64748b" />
            </View>
            <TouchableOpacity style={styles.bellButton}>
              <Bell size={24} color="#ffffff" />
              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>H</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {['ALL', 'MEN', 'WOMEN', 'KIDS'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.gridButton}>
              <Grid size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Categories (Horizontal) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRail} contentContainerStyle={styles.categoryContent}>
          {[
            { name: 'Fashion', img: 'https://picsum.photos/seed/fashion/100' },
            { name: 'Beauty', img: 'https://picsum.photos/seed/beauty/100' },
            { name: 'Home & Living', img: 'https://picsum.photos/seed/home/100' },
            { name: 'Footwear', img: 'https://picsum.photos/seed/shoes/100' },
            { name: 'Electronics', img: 'https://picsum.photos/seed/electronics/100' },
            { name: 'Accessories', img: 'https://picsum.photos/seed/accessories/100' },
            { name: 'Value Store', img: 'https://picsum.photos/seed/value/100' },
          ].map((cat) => (
            <TouchableOpacity key={cat.name} style={styles.categoryItem}>
              <View style={styles.categoryImageContainer}>
                <Image source={{ uri: cat.img }} style={styles.categoryImage} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Banner */}
        <View style={styles.promoBannerContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/seed/promo/800/400' }} 
            style={styles.promoBanner} 
          />
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>BIG DEALS</Text>
            </View>
            <Text style={styles.promoUpTo}>UP TO</Text>
            <Text style={styles.promoTitle}>50% OFF</Text>
            <Text style={styles.promoSubtitle}>On top products from local stores near you</Text>
            <TouchableOpacity style={styles.promoButton}>
              <Text style={styles.promoButtonText}>Shop Now</Text>
              <ChevronRight size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadgesRow}>
          <View style={styles.trustBadge}>
            <Store size={24} color="#3b82f6" />
            <View>
              <Text style={styles.trustTitle}>Fast Delivery</Text>
              <Text style={styles.trustSubtitle}>On orders above ₹199</Text>
            </View>
          </View>
          <View style={styles.trustBadge}>
            <RotateCcw size={24} color="#3b82f6" />
            <View>
              <Text style={styles.trustTitle}>Easy Returns</Text>
              <Text style={styles.trustSubtitle}>7 days return policy</Text>
            </View>
          </View>
        </View>
        <View style={[styles.trustBadgesRow, { marginTop: 0 }]}>
          <View style={styles.trustBadge}>
            <ShieldCheck size={24} color="#3b82f6" />
            <View>
              <Text style={styles.trustTitle}>Secure Payments</Text>
              <Text style={styles.trustSubtitle}>100% secure payments</Text>
            </View>
          </View>
          <View style={styles.trustBadge}>
            <HeadphonesIcon size={24} color="#3b82f6" />
            <View>
              <Text style={styles.trustTitle}>Support</Text>
              <Text style={styles.trustSubtitle}>24x7 assistance</Text>
            </View>
          </View>
        </View>

        {/* Stores Near You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stores Near You</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color="#081028" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storeRail} contentContainerStyle={styles.storeContent}>
          {[
            { name: 'Fashion Hub', time: '10 mins', rating: '4.5', img: 'https://picsum.photos/seed/store1/300/200' },
            { name: 'Sharma Electronics', time: '12 mins', rating: '4.3', img: 'https://picsum.photos/seed/store2/300/200' },
            { name: 'Beauty Corner', time: '8 mins', rating: '4.6', img: 'https://picsum.photos/seed/store3/300/200' },
            { name: 'Home Needs', time: '15 mins', rating: '4.2', img: 'https://picsum.photos/seed/store4/300/200' },
          ].map((store) => (
            <TouchableOpacity key={store.name} style={styles.storeCard}>
              <View style={styles.storeImageContainer}>
                <Image source={{ uri: store.img }} style={styles.storeImage} />
                <View style={styles.timeBadge}>
                  <MapPin size={10} color="#16a34a" />
                  <Text style={styles.timeBadgeText}>{store.time}</Text>
                </View>
              </View>
              <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>{store.rating}</Text>
                <Star size={12} color="#16a34a" fill="#16a34a" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Best Deals for You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Deals for You</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={14} color="#081028" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.dealsGrid}>
          {[
            { name: 'Men Solid Cotton Shirt', price: '₹599', mrp: '₹999', discount: '20% OFF', rating: '4.3', reviews: '(2.1k)', store: 'Fashion Hub', img: 'https://picsum.photos/seed/shirt/200' },
            { name: 'boAt Airdopes 141 TWS Earbuds', price: '₹999', mrp: '₹1,499', discount: '25% OFF', rating: '4.4', reviews: '(3.2k)', store: 'Sharma Electronics', img: 'https://picsum.photos/seed/earbuds/200' },
            { name: 'Mamaearth Vitamin C Face Wash (100ml)', price: '₹299', mrp: '₹399', discount: '20% OFF', rating: '4.5', reviews: '(3.2k)', store: 'Beauty Corner', img: 'https://picsum.photos/seed/facewash/200' },
            { name: 'Prestige Non-stick Cookware Set', price: '₹1,499', mrp: '₹2,999', discount: '25% OFF', rating: '4.3', reviews: '(900)', store: 'Home Needs', img: 'https://picsum.photos/seed/cookware/200' },
          ].map((item) => (
            <View key={item.name} style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Image source={{ uri: item.img }} style={styles.productImage} resizeMode="cover" />
                <View style={styles.discountTag}>
                  <Text style={styles.discountTagText}>{item.discount}</Text>
                </View>
                <TouchableOpacity style={styles.favButton}>
                  <Heart size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
              <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Text style={styles.productMrp}>{item.mrp}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.productRating}>{item.rating}</Text>
                <Star size={12} color="#16a34a" fill="#16a34a" />
                <Text style={styles.productReviews}>{item.reviews}</Text>
              </View>
              <View style={styles.storeRow}>
                <Store size={12} color="#64748b" />
                <Text style={styles.productStore} numberOfLines={1}>{item.store}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? 40 : 0, // Fallback for android status bar if SafeAreaView doesn't cover it
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#f97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoV: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  logoSubtext: {
    fontSize: 9,
    color: '#cbd5e1',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#3b82f6',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#081028',
  },
  badgeRed: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#081028',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#081028',
  },
  bellButton: {
    position: 'relative',
  },
  profileButton: {
    // profile button styles
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 24,
  },
  tabItem: {
    paddingBottom: 6,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  gridButton: {
    marginLeft: 'auto',
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 16,
  },
  categoryRail: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  categoryImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eff6ff',
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081028',
    textAlign: 'center',
  },
  promoBannerContainer: {
    marginHorizontal: 16,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#e0e7ff',
    position: 'relative',
  },
  promoBanner: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  promoContent: {
    padding: 20,
    justifyContent: 'center',
    height: '100%',
    width: '60%',
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  promoBadgeText: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: '800',
  },
  promoUpTo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081028',
  },
  promoTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#081028',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 11,
    color: '#334155',
    marginBottom: 16,
    lineHeight: 16,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#081028',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  promoButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  trustBadgesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  trustBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081028',
  },
  trustSubtitle: {
    fontSize: 9,
    color: '#64748b',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#081028',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 12,
    color: '#081028',
    fontWeight: '700',
    marginRight: 2,
  },
  storeRail: {
    marginBottom: 24,
  },
  storeContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storeCard: {
    width: 140,
  },
  storeImageContainer: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#081028',
  },
  storeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081028',
    marginBottom: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#081028',
  },
  dealsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  productCard: {
    width: (width - 40) / 2, // 2 columns with 12 padding each side + 16 gap
    marginHorizontal: 4,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
  },
  productImagePlaceholder: {
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 12,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  discountTag: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  favButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ffffff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#081028',
    height: 34,
    marginBottom: 6,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081028',
  },
  productMrp: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  productRating: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081028',
  },
  productReviews: {
    fontSize: 11,
    color: '#64748b',
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  productStore: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
  },
});
