import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MapPin, Search, Bell, Heart, ChevronRight, Star, ShoppingBag } from 'lucide-react-native';
import { branding } from '@repo/shared-types';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header & Location Bar */}
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={18} color="#f97316" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationLabel}>Deliver to</Text>
            <Text style={styles.locationValue} numberOfLines={1}>
              Indiranagar, Bengaluru ▾
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Heart size={20} color="#081028" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={20} color="#081028" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color="#94a3b8" />
          <TextInput
            placeholder={`Search on ${branding.appName}...`}
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Promo Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>⚡ 30 MIN DELIVERY</Text>
          </View>
          <Text style={styles.heroTitle}>Fresh Groceries & Daily Needs</Text>
          <Text style={styles.heroSubtitle}>Delivered straight from neighborhood retailers</Text>
          <TouchableOpacity style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Shop Now</Text>
            <ChevronRight size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Quick Categories Rail */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRail}>
          {['Grocery', 'Fashion', 'Electronics', 'Pharmacy', 'Bakery'].map((cat, i) => (
            <TouchableOpacity key={cat} style={styles.categoryItem}>
              <View style={[styles.categoryCircle, { backgroundColor: i % 2 === 0 ? '#eff6ff' : '#fff7ed' }]}>
                <ShoppingBag size={22} color={i % 2 === 0 ? '#3b82f6' : '#f97316'} />
              </View>
              <Text style={styles.categoryName}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stores Near You */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Stores Near You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storeRail}>
          {[
            { name: 'Fresh Mart Supermarket', distance: '0.4 km', time: '15-20 min', rating: '4.8' },
            { name: 'City Grocers & Bakery', distance: '0.8 km', time: '20-25 min', rating: '4.6' },
            { name: 'Fashion Hub Retail', distance: '1.2 km', time: '30-35 min', rating: '4.9' },
          ].map((store) => (
            <TouchableOpacity key={store.name} style={styles.storeCard}>
              <View style={styles.storeThumbnail} />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName} numberOfLines={1}>{store.name}</Text>
                <View style={styles.storeMetaRow}>
                  <View style={styles.ratingBadge}>
                    <Star size={11} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>{store.rating}</Text>
                  </View>
                  <Text style={styles.storeMetaDot}>•</Text>
                  <Text style={styles.storeDistance}>{store.distance}</Text>
                  <Text style={styles.storeMetaDot}>•</Text>
                  <Text style={styles.storeTime}>{store.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Best Deals Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Deals Today</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All Deals</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dealsGrid}>
          {[
            { name: 'Organic Almond Milk 1L', price: '₹185', mrp: '₹220', discount: '16% OFF' },
            { name: 'Whole Wheat Bread 400g', price: '₹45', mrp: '₹55', discount: '18% OFF' },
          ].map((item) => (
            <View key={item.name} style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <View style={styles.discountTag}>
                  <Text style={styles.discountTagText}>{item.discount}</Text>
                </View>
              </View>
              <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
              <View style={styles.productPriceRow}>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Text style={styles.productMrp}>{item.mrp}</Text>
              </View>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  locationValue: {
    fontSize: 13,
    color: '#081028',
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#081028',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  heroBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: '#081028',
    borderRadius: 16,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#f97316',
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 22,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 12,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f97316',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  heroButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#081028',
  },
  seeAllText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '700',
  },
  categoryRail: {
    paddingLeft: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
  },
  categoryCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  storeRail: {
    paddingLeft: 16,
  },
  storeCard: {
    width: 220,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  storeThumbnail: {
    height: 90,
    backgroundColor: '#e2e8f0',
  },
  storeInfo: {
    padding: 10,
  },
  storeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081028',
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#081028',
  },
  storeMetaDot: {
    marginHorizontal: 4,
    color: '#94a3b8',
    fontSize: 10,
  },
  storeDistance: {
    fontSize: 11,
    color: '#64748b',
  },
  storeTime: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
  },
  dealsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
  },
  productImagePlaceholder: {
    height: 100,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
    position: 'relative',
  },
  discountTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountTagText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#081028',
    height: 32,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#081028',
  },
  productMrp: {
    fontSize: 11,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    marginTop: 8,
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
  },
});
