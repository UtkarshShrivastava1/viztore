import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Star, ShieldCheck, Clock, ArrowLeft, Heart, ShoppingBag } from 'lucide-react-native';

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [selectedSize, setSelectedSize] = useState('1 Litre');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Product Carousel Placeholder */}
        <View style={styles.imageGallery}>
          <View style={styles.badgeRow}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>16% OFF</Text>
            </View>
            <TouchableOpacity style={styles.wishlistBtn}>
              <Heart size={18} color="#081028" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Metadata */}
        <View style={styles.infoSection}>
          <Text style={styles.brandName}>Organic Valley</Text>
          <Text style={styles.title}>Organic Unsweetened Almond Milk (1L Bottle)</Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingPill}>
              <Star size={12} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingVal}>4.8</Text>
            </View>
            <Text style={styles.reviewCount}>(142 verified reviews)</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹185</Text>
            <Text style={styles.mrp}>₹220</Text>
            <Text style={styles.savings}>You save ₹35</Text>
          </View>

          {/* Size / Variant Picker */}
          <Text style={styles.variantLabel}>Select Pack Size</Text>
          <View style={styles.variantRow}>
            {['500 ml', '1 Litre', 'Pack of 2 (1L)'].map((size) => {
              const isSelected = size === selectedSize;
              return (
                <TouchableOpacity
                  key={size}
                  style={[styles.variantChip, isSelected && styles.variantChipActive]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.variantText, isSelected && styles.variantTextActive]}>{size}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Delivery Promise */}
          <View style={styles.promiseCard}>
            <Clock size={16} color="#16a34a" />
            <Text style={styles.promiseText}>Delivery in 15–20 mins from Fresh Mart Supermarket (0.4 km)</Text>
          </View>

          {/* Description & Specs Accordion */}
          <View style={styles.specBox}>
            <Text style={styles.specTitle}>Product Highlights</Text>
            <Text style={styles.specBullet}>• 100% Plant-Based & Dairy-Free</Text>
            <Text style={styles.specBullet}>• Rich in Calcium, Vitamin E & Vitamin D</Text>
            <Text style={styles.specBullet}>• Zero added sugars and preservatives</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total Price</Text>
          <Text style={styles.bottomPrice}>₹185</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(tabs)/cart')}>
          <ShoppingBag size={16} color="#ffffff" />
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { paddingBottom: 100 },
  imageGallery: { height: 260, backgroundColor: '#f8fafc', position: 'relative', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  badgeRow: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  discountBadge: { backgroundColor: '#dc2626', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
  wishlistBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.1, shadowRadius: 4 },
  infoSection: { padding: 16 },
  brandName: { fontSize: 12, fontWeight: '700', color: '#f97316', textTransform: 'uppercase' },
  title: { fontSize: 18, fontWeight: '800', color: '#081028', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingVal: { fontSize: 11, fontWeight: '700', color: '#b45309' },
  reviewCount: { fontSize: 12, color: '#64748b' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 12 },
  price: { fontSize: 22, fontWeight: '800', color: '#081028' },
  mrp: { fontSize: 14, color: '#94a3b8', textDecorationLine: 'line-through' },
  savings: { fontSize: 12, fontWeight: '700', color: '#16a34a' },
  variantLabel: { fontSize: 13, fontWeight: '700', color: '#081028', marginTop: 16, marginBottom: 8 },
  variantRow: { flexDirection: 'row', gap: 8 },
  variantChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', backgroundColor: '#ffffff' },
  variantChipActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  variantText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  variantTextActive: { color: '#c2410c', fontWeight: '700' },
  promiseCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#dcfce7', padding: 12, borderRadius: 10, marginTop: 16 },
  promiseText: { flex: 1, fontSize: 12, color: '#15803d', fontWeight: '600' },
  specBox: { marginTop: 18, padding: 14, backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  specTitle: { fontSize: 13, fontWeight: '800', color: '#081028', marginBottom: 6 },
  specBullet: { fontSize: 12, color: '#475569', lineHeight: 18 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#e2e8f0' },
  bottomLabel: { fontSize: 11, color: '#64748b' },
  bottomPrice: { fontSize: 20, fontWeight: '800', color: '#081028' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#081028', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 10 },
  addBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
