import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Heart, ShoppingCart, Search, Mic, MapPin, ChevronDown, Share2, ScanSearch, Star, ShieldCheck, RefreshCw, Award, MapPin as MapPinIcon, Truck, Box, Zap } from 'lucide-react-native';
import { branding } from '@repo/shared-types';

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('navy');

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
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <Image source={{ uri: 'https://via.placeholder.com/600' }} style={styles.mainImage} />
          <View style={styles.floatingActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Heart color="#0f172a" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Share2 color="#0f172a" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <ScanSearch color="#0f172a" size={20} />
              <Text style={styles.actionLabel}>Similar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productTitle}>Men Round Neck Printed T-shirt</Text>
          <Text style={styles.tags}>Navy Blue  •  100% Cotton  •  Regular Fit</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹399</Text>
            <Text style={styles.mrp}>₹699</Text>
            <View style={styles.discountPill}>
              <Text style={styles.discountText}>42% OFF</Text>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <Star color="#16a34a" fill="#16a34a" size={14} />
            <Text style={styles.ratingValue}>4.3</Text>
            <Text style={styles.reviewCount}>(1.2K Reviews)</Text>
          </View>
        </View>

        {/* Variations */}
        <View style={styles.variationsSection}>
          <View style={styles.sizeHeader}>
            <Text style={styles.sectionLabel}>Select Size</Text>
            <Text style={styles.sizeChartText}>📐 Size Chart</Text>
          </View>
          <View style={styles.sizeRow}>
            {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
              <TouchableOpacity key={s} style={[styles.sizeBox, selectedSize === s && styles.sizeBoxActive]} onPress={() => setSelectedSize(s)}>
                <Text style={[styles.sizeText, selectedSize === s && styles.sizeTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.qtyColorRow}>
            <View style={styles.qtyBlock}>
              <Text style={styles.sectionLabel}>Quantity</Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.colorBlock}>
              <Text style={styles.sectionLabel}>Colour: Navy Blue</Text>
              <View style={styles.colorRow}>
                {['#1e3a8a', '#1c1917', '#4d7c0f', '#e5e5e5'].map((c, i) => (
                  <TouchableOpacity key={i} style={[styles.colorCircleWrapper, selectedColor === (i===0?'navy':'other') && styles.colorCircleActive]} onPress={() => setSelectedColor(i===0?'navy':'other')}>
                    <View style={[styles.colorCircle, { backgroundColor: c }]} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.addToCartBtn}>
            <ShoppingCart color="#2563eb" size={20} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowBtn}>
            <Zap color="#ffffff" size={20} />
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustGrid}>
          <View style={styles.trustItem}>
            <ShieldCheck color="#22c55e" size={24} />
            <View>
              <Text style={styles.trustTitle}>Secure Payments</Text>
              <Text style={styles.trustDesc}>100% Secure</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <RefreshCw color="#3b82f6" size={24} />
            <View>
              <Text style={styles.trustTitle}>Easy Returns</Text>
              <Text style={styles.trustDesc}>7 Days Return</Text>
            </View>
          </View>
          <View style={styles.trustItem}>
            <Award color="#3b82f6" size={24} />
            <View>
              <Text style={styles.trustTitle}>Top Quality</Text>
              <Text style={styles.trustDesc}>Trusted Products</Text>
            </View>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.detailsBox}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Product Details</Text>
            <ChevronDown color="#0f172a" size={20} style={{ transform: [{ rotate: '180deg' }] }} />
          </View>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Weave Pattern</Text>
              <Text style={styles.specValue}>Regular</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Transparency</Text>
              <Text style={styles.specValue}>Opaque</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Fit</Text>
              <Text style={styles.specValue}>Slim Fit</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Sustainable</Text>
              <Text style={styles.specValue}>Regular</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Fabric</Text>
              <Text style={styles.specValue}>100% Cotton</Text>
            </View>
          </View>
          <Text style={styles.descText}>
            Navy blue round neck printed t-shirt with "Explore The Unknown" graphic print. Made from soft and breathable cotton fabric for all-day comfort.
          </Text>
        </View>

        {/* Delivery Details */}
        <View style={styles.deliveryBox}>
          <Text style={styles.detailsTitle}>Delivery Details</Text>
          
          <View style={styles.deliveryRow}>
            <MapPinIcon color="#10b981" size={24} />
            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryInfoTop}>
                <Text style={styles.deliveryLabel}>Deliver to</Text>
                <Text style={styles.deliveryLink}>Change</Text>
              </View>
              <Text style={styles.deliveryAddress}>123, MG Road, Near City Mall, Indore, Madhya Pradesh - 452001</Text>
            </View>
          </View>
          
          <View style={styles.deliveryRow}>
            <Truck color="#3b82f6" size={24} />
            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryInfoTop}>
                <Text style={styles.deliveryLabel}>Delivery by</Text>
                <Text style={styles.deliveryFree}>FREE</Text>
              </View>
              <Text style={styles.deliveryValue}>Tomorrow, 12 May</Text>
              <Text style={styles.deliveryTime}>Order within 2h 30m</Text>
            </View>
          </View>

          <View style={styles.deliveryRow}>
            <Box color="#3b82f6" size={24} />
            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryInfoTop}>
                <Text style={styles.deliveryLabel}>Return Policy</Text>
                <Text style={styles.deliveryLink}>Know More</Text>
              </View>
              <Text style={styles.deliveryValue}>7 Days easy return & exchange</Text>
            </View>
          </View>
        </View>
        
        {/* Ratings */}
        <View style={styles.ratingsBox}>
           <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>Ratings & Reviews</Text>
              <Text style={styles.viewAllBtn}>View All</Text>
           </View>
           <View style={styles.ratingSummary}>
              <View style={styles.ratingBig}>
                <Text style={styles.ratingBigVal}>4.3</Text>
                <Star color="#16a34a" fill="#16a34a" size={24} />
              </View>
              <Text style={styles.reviewCount}>(1.2K Reviews)</Text>
           </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  imageGallery: { width: '100%', height: 400, backgroundColor: '#f1f5f9', position: 'relative' },
  mainImage: { width: '100%', height: '100%' },
  floatingActions: { position: 'absolute', top: 16, right: 16, gap: 12 },
  actionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  actionLabel: { fontSize: 9, fontWeight: '700', color: '#0f172a', marginTop: 2 },
  pagination: { position: 'absolute', bottom: 16, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#cbd5e1' },
  dotActive: { backgroundColor: '#1e3a8a', width: 8, height: 8, borderRadius: 4, transform: [{ translateY: -1 }] },
  infoSection: { padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  productTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  tags: { fontSize: 12, color: '#475569', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 10 },
  price: { fontSize: 26, fontWeight: '800', color: '#2563eb' },
  mrp: { fontSize: 16, color: '#94a3b8', textDecorationLine: 'line-through' },
  discountPill: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: '#16a34a', fontSize: 12, fontWeight: '800' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingValue: { fontSize: 14, fontWeight: '700', color: '#16a34a' },
  reviewCount: { fontSize: 13, color: '#64748b' },
  variationsSection: { padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  sizeChartText: { fontSize: 13, fontWeight: '600', color: '#2563eb' },
  sizeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  sizeBox: { width: 50, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
  sizeBoxActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  sizeText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  sizeTextActive: { color: '#ffffff' },
  qtyColorRow: { flexDirection: 'row', justifyContent: 'space-between' },
  qtyBlock: { flex: 1 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, width: 100 },
  qtyBtn: { width: 32, height: 36, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 18, color: '#64748b' },
  qtyValue: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#0f172a' },
  colorBlock: { flex: 1.2 },
  colorRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  colorCircleWrapper: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  colorCircleActive: { borderColor: '#2563eb' },
  colorCircle: { width: 26, height: 26, borderRadius: 13 },
  actionButtonsRow: { flexDirection: 'row', padding: 16, gap: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  addToCartBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: '#2563eb', paddingVertical: 14, borderRadius: 12 },
  addToCartText: { color: '#2563eb', fontSize: 15, fontWeight: '700' },
  buyNowBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12 },
  buyNowText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  trustGrid: { flexDirection: 'row', padding: 16, gap: 12, flexWrap: 'wrap', borderBottomWidth: 1, borderColor: '#f1f5f9' },
  trustItem: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 8 },
  trustTitle: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  trustDesc: { fontSize: 10, color: '#64748b' },
  detailsBox: { padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailsTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 16 },
  specItem: { width: '45%' },
  specLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  specValue: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  descText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  deliveryBox: { padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  deliveryRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  deliveryInfo: { flex: 1 },
  deliveryInfoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  deliveryLabel: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  deliveryLink: { fontSize: 12, fontWeight: '600', color: '#2563eb' },
  deliveryFree: { fontSize: 13, fontWeight: '800', color: '#16a34a' },
  deliveryAddress: { fontSize: 12, color: '#475569', lineHeight: 18 },
  deliveryValue: { fontSize: 13, color: '#475569', marginBottom: 2 },
  deliveryTime: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  ratingsBox: { padding: 16 },
  viewAllBtn: { fontSize: 13, fontWeight: '700', color: '#2563eb' },
  ratingSummary: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingBig: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingBigVal: { fontSize: 36, fontWeight: '800', color: '#0f172a' },
});
