import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, Mic, Heart, ShoppingCart, Flame, Shirt, User, Baby, Footprints, Sparkles, Home, Smartphone, ShoppingBasket, Car, Dumbbell, Gamepad2, Book, MoreHorizontal, ChevronRight } from 'lucide-react-native';
import { branding } from '@repo/shared-types';

const CATEGORIES = [
  { id: 'trending', name: 'Trending Now', icon: Flame, color: '#ff4500' },
  { id: 'mens', name: 'Men\'s Fashion', icon: Shirt, color: '#2563eb' },
  { id: 'womens', name: 'Women\'s Fashion', icon: User, color: '#ec4899' },
  { id: 'kids', name: 'Kids Fashion', icon: Baby, color: '#eab308' },
  { id: 'footwear', name: 'Footwear', icon: Footprints, color: '#22c55e' },
  { id: 'beauty', name: 'Beauty & Grooming', icon: Sparkles, color: '#8b5cf6' },
  { id: 'home', name: 'Home & Living', icon: Home, color: '#06b6d4' },
  { id: 'electronics', name: 'Electronics', icon: Smartphone, color: '#3b82f6' },
  { id: 'grocery', name: 'Grocery & Staples', icon: ShoppingBasket, color: '#10b981' },
  { id: 'auto', name: 'Automotive', icon: Car, color: '#f43f5e' },
  { id: 'sports', name: 'Sports & Fitness', icon: Dumbbell, color: '#eab308' },
  { id: 'toys', name: 'Toys, Kids & Baby', icon: Gamepad2, color: '#a855f7' },
  { id: 'books', name: 'Books & Stationery', icon: Book, color: '#3b82f6' },
  { id: 'more', name: 'More Categories', icon: MoreHorizontal, color: '#64748b' },
];

const CASUAL_WEAR = [
  { id: 'shirts', name: 'Shirts', image: 'https://via.placeholder.com/150' },
  { id: 'tshirts', name: 'T-Shirts', image: 'https://via.placeholder.com/150' },
  { id: 'jeans', name: 'Jeans', image: 'https://via.placeholder.com/150' },
  { id: 'trousers', name: 'Trousers', image: 'https://via.placeholder.com/150' },
  { id: 'shorts', name: 'Shorts', image: 'https://via.placeholder.com/150' },
  { id: 'track', name: 'Track Pants', image: 'https://via.placeholder.com/150' },
  { id: 'jackets', name: 'Jackets', image: 'https://via.placeholder.com/150' },
  { id: 'sweatshirts', name: 'Sweatshirts', image: 'https://via.placeholder.com/150' },
  { id: 'sweaters', name: 'Sweaters', image: 'https://via.placeholder.com/150' },
];

const WORK_WEAR = [
  { id: 'formal_shirts', name: 'Formal Shirts', image: 'https://via.placeholder.com/150' },
  { id: 'blazers', name: 'Blazers', image: 'https://via.placeholder.com/150' },
  { id: 'formal_trousers', name: 'Formal Trousers', image: 'https://via.placeholder.com/150' },
  { id: 'coats', name: 'Coats', image: 'https://via.placeholder.com/150' },
  { id: 'ties', name: 'Ties', image: 'https://via.placeholder.com/150' },
  { id: 'formal_shoes', name: 'Formal Shoes', image: 'https://via.placeholder.com/150' },
];

export default function CategoriesScreen() {
  const [selectedCat, setSelectedCat] = useState('mens');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
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
            placeholder="Search for products, categories and more..."
            placeholderTextColor="#94a3b8"
          />
          <Mic color="#64748b" size={20} />
        </View>
      </View>

      <View style={styles.splitLayout}>
        {/* Left Vertical Rail */}
        <ScrollView style={styles.rail} showsVerticalScrollIndicator={false}>
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === selectedCat;
            const Icon = cat.icon;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.railItem, isActive && styles.railItemActive]}
                onPress={() => setSelectedCat(cat.id)}
              >
                <Icon color={isActive ? '#2563eb' : cat.color} size={24} style={styles.railIcon} />
                <Text style={[styles.railText, isActive && styles.railTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Right Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Promo Banner */}
          <View style={styles.promoBanner}>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>Men's{'\n'}Fashion Store</Text>
            </View>
            <View style={styles.promoArrow}>
              <ChevronRight color="#000" size={20} />
            </View>
          </View>

          {/* Casual Wear Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Casual Wear</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subGrid}>
            {CASUAL_WEAR.map((item) => (
              <TouchableOpacity key={item.id} style={styles.subCard}>
                <View style={styles.subImageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.subImage} />
                </View>
                <Text style={styles.subName} numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Work Wear Section */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <Text style={styles.sectionTitle}>Work Wear</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subGrid}>
            {WORK_WEAR.map((item) => (
              <TouchableOpacity key={item.id} style={styles.subCard}>
                <View style={styles.subImageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.subImage} />
                </View>
                <Text style={styles.subName} numberOfLines={2}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: '#ffffff', zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  placeholderLogo: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  logoText: { fontSize: 24, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
  tagline: { fontSize: 8, color: '#2563eb', fontWeight: '600', marginTop: -2 },
  headerIcons: { flexDirection: 'row', gap: 16 },
  iconBtn: { padding: 4, position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#2563eb', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', zIndex: 1, borderWidth: 1, borderColor: '#ffffff' },
  badgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, height: 46 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#0f172a' },
  splitLayout: { flex: 1, flexDirection: 'row' },
  rail: { width: 85, backgroundColor: '#ffffff', borderRightWidth: 1, borderColor: '#f1f5f9' },
  railItem: { paddingVertical: 16, paddingHorizontal: 4, alignItems: 'center', borderLeftWidth: 3, borderLeftColor: 'transparent' },
  railItemActive: { backgroundColor: '#eff6ff', borderLeftColor: '#2563eb' },
  railIcon: { marginBottom: 6 },
  railText: { fontSize: 10, color: '#475569', fontWeight: '500', textAlign: 'center' },
  railTextActive: { color: '#2563eb', fontWeight: '700' },
  content: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  promoBanner: { backgroundColor: '#eef2ff', borderRadius: 12, height: 110, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24, position: 'relative', overflow: 'hidden' },
  promoTextContainer: { flex: 1, zIndex: 2 },
  promoTitle: { fontSize: 18, fontWeight: '800', color: '#1e3a8a', lineHeight: 24 },
  promoArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  viewAllBtn: { fontSize: 13, fontWeight: '700', color: '#2563eb' },
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  subCard: { width: '30%', alignItems: 'center', marginBottom: 20 },
  subImageWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#f1f5f9', marginBottom: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' },
  subImage: { width: '100%', height: '100%' },
  subName: { fontSize: 11, fontWeight: '600', color: '#334155', textAlign: 'center', lineHeight: 14 },
});
