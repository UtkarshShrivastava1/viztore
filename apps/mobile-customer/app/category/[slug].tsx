import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Heart, ShoppingCart, Search, Mic, MapPin, ChevronDown, SlidersHorizontal, ArrowUpDown, ShieldCheck, Zap, ArrowLeft, Star, ShoppingBag, Tag, Search as SearchIcon, MoreHorizontal, ChevronRight, Home } from 'lucide-react-native';
import { branding } from '@repo/shared-types';

const CATEGORY_CHIPS = [
  { id: 'all', name: 'All', image: 'https://via.placeholder.com/150' },
  { id: 'round', name: 'Round Neck', image: 'https://via.placeholder.com/150' },
  { id: 'vneck', name: 'V Neck', image: 'https://via.placeholder.com/150' },
  { id: 'polo', name: 'Polo T-shirts', image: 'https://via.placeholder.com/150' },
  { id: 'printed', name: 'Printed', image: 'https://via.placeholder.com/150' },
  { id: 'striped', name: 'Striped', image: 'https://via.placeholder.com/150' },
  { id: 'full', name: 'Full Sleeve', image: 'https://via.placeholder.com/150' },
  { id: 'more', name: 'More', image: 'https://via.placeholder.com/150' },
];

const PRODUCTS = [
  { id: '1', name: 'Men Round Neck Printed T-shirt', price: '399', mrp: '499', discount: '30% OFF', rating: '4.3', reviews: '2.1K', store: 'Fashion Hub', image: 'https://via.placeholder.com/300' },
  { id: '2', name: 'Men Solid Round Neck T-shirt', price: '349', mrp: '599', discount: '25% OFF', rating: '4.4', reviews: '1.6K', store: 'Fashion Hub', image: 'https://via.placeholder.com/300' },
  { id: '3', name: 'Men Striped Round Neck T-shirt', price: '449', mrp: '599', discount: '30% OFF', rating: '4.5', reviews: '2.3K', store: 'Fashion Hub', image: 'https://via.placeholder.com/300' },
  { id: '4', name: 'Men V Neck T-shirt', price: '379', mrp: '474', discount: '20% OFF', rating: '4.2', reviews: '1.2K', store: 'Fashion Hub', image: 'https://via.placeholder.com/300' },
];

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [activeChip, setActiveChip] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <ChevronLeft color="#081028" size={28} />
          </TouchableOpacity>
          <View style={styles.placeholderLogo}>
            <Text style={styles.logoText}>{branding.appName.toLowerCase()}</Text>
            <Text style={styles.tagline}>Making Local Stores Visible.</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Heart color="#2563eb" size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
              <ShoppingCart color="#2563eb" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#64748b" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for T-shirts..."
            placeholderTextColor="#94a3b8"
          />
          <Mic color="#64748b" size={20} />
        </View>

        <View style={styles.locationBar}>
          <MapPin color="#2563eb" size={16} />
          <Text style={styles.locationText} numberOfLines={1}>
            Deliver to: Harish Kumar - Q No- 6/B, Street -13, Sector -2, Bhilai
          </Text>
          <ChevronDown color="#64748b" size={16} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.pageTitle}>T-shirts for Men</Text>
            <Text style={styles.productCount}>12,456+ Products</Text>
          </View>
          <View style={styles.titleIcons}>
            <SearchIcon color="#475569" size={20} />
            <Heart color="#475569" size={20} />
            <ShoppingBag color="#475569" size={20} />
          </View>
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          {CATEGORY_CHIPS.map((chip) => {
            const isActive = chip.id === activeChip;
            return (
              <TouchableOpacity
                key={chip.id}
                style={styles.chipWrapper}
                onPress={() => setActiveChip(chip.id)}
              >
                <View style={[styles.chipImageContainer, isActive && styles.chipImageActive]}>
                  {chip.id === 'all' ? (
                    <View style={styles.allIconWrapper}>
                      <View style={styles.gridDots}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                      </View>
                    </View>
                  ) : chip.id === 'more' ? (
                    <MoreHorizontal color="#64748b" size={24} />
                  ) : (
                    <Image source={{ uri: chip.image }} style={styles.chipImage} />
                  )}
                </View>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{chip.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <TouchableOpacity style={styles.filterPill}>
            <ArrowUpDown color="#475569" size={14} />
            <Text style={styles.filterPillText}>Sort</Text>
            <ChevronDown color="#475569" size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>Size</Text>
            <ChevronDown color="#475569" size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>Color</Text>
            <ChevronDown color="#475569" size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>Brand</Text>
            <ChevronDown color="#475569" size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterPillText}>Filter</Text>
            <SlidersHorizontal color="#475569" size={14} />
          </TouchableOpacity>
        </ScrollView>

        {/* Promo Banners */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
          <View style={[styles.promoBanner, { backgroundColor: '#f1f5f9' }]}>
            <View style={styles.promoContent}>
              <Text style={styles.promoSeason}>AUTUMN WINTER'26</Text>
              <Text style={styles.promoTitle}>TRENDING{'\n'}T-SHIRTS</Text>
              <View style={styles.exploreRow}>
                <Text style={styles.exploreText}>Explore Now</Text>
                <ChevronRight color="#000" size={16} />
              </View>
            </View>
          </View>
          <View style={[styles.promoBanner, { backgroundColor: '#fef3c7', marginLeft: 12 }]}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>CLASSIC{'\n'}T-SHIRTS</Text>
              <Text style={styles.promoDesc}>Button Up For The Season</Text>
              <View style={styles.exploreRow}>
                <Text style={styles.exploreText}>Explore Now</Text>
                <ChevronRight color="#000" size={16} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Products Header */}
        <View style={styles.productsHeader}>
          <Text style={styles.productsCountLabel}>1,248 Products</Text>
          <View style={styles.sortDropdown}>
            <Text style={styles.sortLabel}>Popularity</Text>
            <ChevronDown color="#081028" size={16} />
          </View>
        </View>

        {/* Product Grid */}
        <View style={styles.productGrid}>
          {PRODUCTS.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard} onPress={() => router.push(`/products/${product.id}`)}>
              <View style={styles.productImageWrapper}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={styles.discountTag}>
                  <Text style={styles.discountTagText}>{product.discount}</Text>
                </View>
                <TouchableOpacity style={styles.favBtn}>
                  <Heart color="#0f172a" size={16} />
                </TouchableOpacity>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                  <Text style={styles.productMrp}>₹{product.mrp}</Text>
                </View>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingText}>{product.rating}</Text>
                  <Star color="#16a34a" fill="#16a34a" size={12} />
                  <Text style={styles.reviewsText}>({product.reviews})</Text>
                </View>
                <View style={styles.storeRow}>
                  <Home color="#2563eb" size={12} />
                  <Text style={styles.storeText}>{product.store}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Extra Bottom Padding */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky Bottom Offer Banner */}
      <View style={styles.stickyOffer}>
        <View style={styles.offerLeft}>
          <Tag color="#ec4899" size={16} />
          <Text style={styles.offerText}>Extra 10% OFF on prepaid orders</Text>
        </View>
        <Text style={styles.shopNowText}>Shop Now &gt;</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { backgroundColor: '#ffffff', paddingTop: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  placeholderLogo: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  logoText: { fontSize: 24, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
  tagline: { fontSize: 8, color: '#2563eb', fontWeight: '600', marginTop: -2 },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 4, position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#2563eb', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', zIndex: 1, borderWidth: 1, borderColor: '#ffffff' },
  badgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, height: 44, marginHorizontal: 16, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0f172a' },
  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff6ff', paddingVertical: 10, paddingHorizontal: 16 },
  locationText: { flex: 1, fontSize: 12, color: '#1e3a8a', fontWeight: '500', marginLeft: 6, marginRight: 8 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  productCount: { fontSize: 13, color: '#64748b', marginTop: 4 },
  titleIcons: { flexDirection: 'row', gap: 16, marginTop: 4 },
  chipsScroll: { paddingHorizontal: 16, marginBottom: 16 },
  chipWrapper: { alignItems: 'center', marginRight: 16 },
  chipImageContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginBottom: 8, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  chipImageActive: { borderColor: '#2563eb' },
  allIconWrapper: { width: 64, height: 64, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  gridDots: { flexDirection: 'row', flexWrap: 'wrap', width: 24, height: 24, justifyContent: 'space-between', alignContent: 'space-between' },
  dot: { width: 10, height: 10, backgroundColor: '#2563eb', borderRadius: 2 },
  chipImage: { width: '100%', height: '100%' },
  chipText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  chipTextActive: { color: '#2563eb', fontWeight: '700' },
  filtersScroll: { paddingHorizontal: 16, marginBottom: 20 },
  filterPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 10 },
  filterPillText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  promoScroll: { paddingHorizontal: 16, marginBottom: 24 },
  promoBanner: { width: 280, height: 130, borderRadius: 12, padding: 16, position: 'relative' },
  promoContent: { zIndex: 2, width: '60%' },
  promoSeason: { fontSize: 10, fontWeight: '700', color: '#475569', marginBottom: 4 },
  promoTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', lineHeight: 22, marginBottom: 4 },
  promoDesc: { fontSize: 11, color: '#475569', marginBottom: 8 },
  exploreRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  exploreText: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  productsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  productsCountLabel: { fontSize: 14, fontWeight: '700', color: '#475569' },
  sortDropdown: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortLabel: { fontSize: 14, fontWeight: '700', color: '#081028' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, justifyContent: 'space-between' },
  productCard: { width: '48%', marginBottom: 16, backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9' },
  productImageWrapper: { width: '100%', aspectRatio: 1, backgroundColor: '#f8fafc', position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  discountTag: { position: 'absolute', top: 8, left: 8, backgroundColor: '#2563eb', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  discountTagText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },
  favBtn: { position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  productInfo: { padding: 10 },
  productName: { fontSize: 12, fontWeight: '600', color: '#1e293b', marginBottom: 6, lineHeight: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  productMrp: { fontSize: 12, color: '#94a3b8', textDecorationLine: 'line-through' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#0f172a' },
  reviewsText: { fontSize: 11, color: '#64748b' },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  storeText: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  stickyOffer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fdf2f8', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: '#fbcfe8' },
  offerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  offerText: { fontSize: 13, fontWeight: '700', color: '#be185d' },
  shopNowText: { fontSize: 13, fontWeight: '700', color: '#be185d' }
});
