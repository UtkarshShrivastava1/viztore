import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Heart, ShoppingCart, Search, Mic, MapPin, Share2, Star, Zap, RotateCcw, ShieldCheck, HeadphonesIcon, Filter, ChevronDown, ChevronRight } from 'lucide-react-native';
import { branding } from '@repo/shared-types';

export default function StoreDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const newArrivals = [
    { id: 'n1', name: 'Men Graphic Print T-shirt', price: '399', mrp: '599', discount: '33% OFF', rating: '4.4', reviews: '(320)', tag: 'NEW', img: 'https://via.placeholder.com/300' },
    { id: 'n2', name: 'Men Striped Round Neck T-shirt', price: '449', mrp: '699', discount: '36% OFF', rating: '4.5', reviews: '(280)', tag: 'NEW', img: 'https://via.placeholder.com/300' },
  ];

  const bestDeals = [
    { id: 'b1', name: 'Men Polo T-shirt', price: '349', mrp: '499', discount: '30% OFF', rating: '4.4', reviews: '(180)', tag: '30% OFF', img: 'https://via.placeholder.com/300' },
    { id: 'b2', name: 'Men Casual Shirt', price: '599', mrp: '799', discount: '25% OFF', rating: '4.5', reviews: '(260)', tag: '25% OFF', img: 'https://via.placeholder.com/300' },
  ];

  const topPicks = [
    { id: 't1', name: 'Men Hoodie', price: '899', mrp: '1,299', discount: '31% OFF', rating: '4.4', reviews: '(150)', tag: '', img: 'https://via.placeholder.com/300' },
    { id: 't2', name: 'Men Backpack', price: '1,199', mrp: '1,799', discount: '33% OFF', rating: '4.6', reviews: '(210)', tag: '', img: 'https://via.placeholder.com/300' },
  ];

  const renderProductGrid = (title: string, data: typeof newArrivals) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={14} color="#2563eb" />
        </TouchableOpacity>
      </View>
      <View style={styles.productGrid}>
        {data.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productCard}>
            <View style={styles.productImageWrapper}>
              <Image source={{ uri: product.img }} style={styles.productImage} />
              {product.tag ? (
                <View style={[styles.productTag, product.tag === 'NEW' ? styles.tagBlue : styles.tagOrange]}>
                  <Text style={[styles.productTagText, product.tag === 'NEW' ? styles.tagTextBlue : styles.tagTextOrange]}>{product.tag}</Text>
                </View>
              ) : null}
              <TouchableOpacity style={styles.favBtn}>
                <Heart color="#0f172a" size={16} />
              </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>₹{product.price}</Text>
                <Text style={styles.productMrp}>₹{product.mrp}</Text>
                {product.discount ? (
                  <View style={styles.discountPill}>
                    <Text style={styles.discountText}>{product.discount}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>{product.rating}</Text>
                <Star color="#16a34a" fill="#16a34a" size={12} />
                <Text style={styles.reviewsText}>{product.reviews}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#081028" />
        </TouchableOpacity>
        
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
            <Heart size={24} color="#081028" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <ShoppingCart size={24} color="#081028" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748b" />
          <TextInput
            placeholder="Search for products in Fashion Hub..."
            placeholderTextColor="#64748b"
            style={styles.searchInput}
          />
          <Mic size={20} color="#64748b" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Store Banner */}
        <View style={styles.storeBannerContainer}>
          <View style={styles.storeBannerImageWrapper}>
            <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.storeBannerImage} />
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>Open</Text>
            </View>
            <TouchableOpacity style={styles.bannerFavBtn}>
              <Heart size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.storeBannerInfo}>
            <View style={styles.storeNameRow}>
              <Text style={styles.storeBannerName}>Fashion Hub</Text>
              <TouchableOpacity style={styles.shareBtn}>
                <Share2 size={16} color="#2563eb" />
              </TouchableOpacity>
            </View>
            <View style={styles.storeMetaRow}>
              <Text style={styles.storeRatingText}>4.5</Text>
              <Star size={12} color="#16a34a" fill="#16a34a" />
              <Text style={styles.storeReviewsText}>(1.2K)</Text>
            </View>
            <Text style={styles.storeTagsText}>Clothing, Accessories, Footwear & more</Text>
            
            <View style={styles.storeLocationRow}>
              <MapPin size={12} color="#2563eb" />
              <Text style={styles.storeLocationText}>0.2 km • Boring Road, Patna, Bihar</Text>
            </View>
            
            <View style={styles.storePillRow}>
              <View style={styles.storePill}>
                <Zap size={10} color="#2563eb" />
                <Text style={styles.storePillText}>Fast Delivery</Text>
              </View>
              <View style={styles.storePill}>
                <RotateCcw size={10} color="#2563eb" />
                <Text style={styles.storePillText}>Easy Returns</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Horizontal Trust Badges */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trustScrollContent}>
          <View style={styles.trustItem}>
            <View style={styles.trustIconWrapper}>
              <Zap size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.trustTitle}>Fast Delivery</Text>
              <Text style={styles.trustSubtitle}>On orders above ₹199</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <View style={styles.trustIconWrapper}>
              <RotateCcw size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.trustTitle}>Easy Returns</Text>
              <Text style={styles.trustSubtitle}>7 days return policy</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <View style={styles.trustIconWrapper}>
              <ShieldCheck size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.trustTitle}>Secure Payments</Text>
              <Text style={styles.trustSubtitle}>100% secure payments</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <View style={styles.trustIconWrapper}>
              <HeadphonesIcon size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.trustTitle}>Support</Text>
              <Text style={styles.trustSubtitle}>24x7 assistance</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.divider} />

        {/* All Products Header */}
        <View style={styles.allProductsHeader}>
          <View>
            <Text style={styles.allProductsTitle}>All Products</Text>
            <Text style={styles.allProductsSubtitle}>320 Items</Text>
          </View>
          <View style={styles.allProductsActions}>
            <TouchableOpacity style={styles.filterBtn}>
              <Filter size={16} color="#2563eb" />
              <Text style={styles.filterBtnText}>Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortBtnText}>Sort by: Popular</Text>
              <ChevronDown size={16} color="#0f172a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sections */}
        {renderProductGrid('New Arrival', newArrivals)}
        {renderProductGrid('Best Deals', bestDeals)}
        {renderProductGrid('Top Picks For You', topPicks)}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? 40 : 0, 
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
    flex: 1,
    justifyContent: 'center',
    marginRight: 20
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
    color: '#081028',
  },
  logoSubtext: {
    fontSize: 9,
    color: '#64748b',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#3b82f6',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#081028',
  },
  content: {
    paddingBottom: 40,
  },
  storeBannerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 20,
  },
  storeBannerImageWrapper: {
    width: 140,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  storeBannerImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  bannerFavBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeBannerInfo: {
    flex: 1,
  },
  storeNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeBannerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  shareBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  storeRatingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  storeReviewsText: {
    fontSize: 12,
    color: '#64748b',
  },
  storeTagsText: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 8,
  },
  storeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  storeLocationText: {
    fontSize: 11,
    color: '#475569',
  },
  storePillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  storePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  storePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563eb',
  },
  trustScrollContent: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 20,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  trustSubtitle: {
    fontSize: 10,
    color: '#64748b',
  },
  divider: {
    height: 8,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
  },
  allProductsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  allProductsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  allProductsSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  allProductsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eff6ff',
  },
  filterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563eb',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productImageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagBlue: {
    backgroundColor: '#2563eb',
  },
  tagOrange: {
    backgroundColor: '#f59e0b',
  },
  productTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tagTextBlue: {
    color: '#ffffff',
  },
  tagTextOrange: {
    color: '#ffffff',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  productMrp: {
    fontSize: 12,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  discountPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#16a34a',
    fontSize: 10,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewsText: {
    fontSize: 11,
    color: '#64748b',
  },
});
