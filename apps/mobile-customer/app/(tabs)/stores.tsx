import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, StatusBar, Platform } from 'react-native';
import { MapPin, Search, Mic, Heart, ShoppingCart, ChevronDown, ChevronRight, Grid, Shirt, Pocket, Laptop, Home, ShoppingBag, MoreHorizontal, Star, Zap, Store, RotateCcw, ShieldCheck, HeadphonesIcon, ChevronLeft, Filter } from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { router } from 'expo-router';

export default function StoresScreen() {
  const [activeFilter, setActiveFilter] = useState('All Stores');

  const filters = [
    'All Stores', 'Fashion', 'Footwear', 'Electronics', 'Beauty', 'Home & Living'
  ];

  const stores = [
    { name: 'Fashion Hub', rating: '4.5', reviews: '(1.2K)', tags: 'Clothing, Accessories, Footwear & more', distance: '0.2 km', location: 'Boring Road', status: 'Open', img: 'https://via.placeholder.com/600x300' },
    { name: 'Sharma Electronics', rating: '4.3', reviews: '(890)', tags: 'Mobiles, Accessories, Gadgets & more', distance: '0.4 km', location: 'Boring Road', status: 'Open', img: 'https://via.placeholder.com/600x300' },
    { name: 'Beauty Corner', rating: '4.6', reviews: '(1.5K)', tags: 'Skincare, Haircare, Makeup & more', distance: '0.5 km', location: 'Boring Road', status: 'Open', img: 'https://via.placeholder.com/600x300' },
    { name: 'Home Needs', rating: '4.2', reviews: '(760)', tags: 'Home Decor, Kitchen, Furniture & more', distance: '0.7 km', location: 'Boring Road', status: 'Open', img: 'https://via.placeholder.com/600x300' },
    { name: 'Gadget Store', rating: '4.4', reviews: '(540)', tags: 'Smartwatches, Accessories, Audio & more', distance: '0.8 km', location: 'Boring Road', status: 'Closing Soon', img: 'https://via.placeholder.com/600x300' },
    { name: 'Shoe World', rating: '4.3', reviews: '(980)', tags: 'Men, Women & Kids Footwear', distance: '1.0 km', location: 'Boring Road', status: 'Open', img: 'https://via.placeholder.com/600x300' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Top Header */}
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
            placeholder="Search for products or stores..."
            placeholderTextColor="#64748b"
            style={styles.searchInput}
          />
          <Mic size={20} color="#64748b" />
        </View>
      </View>

      {/* Store Header Block */}
      <View style={styles.storeHeaderBlock}>
        <View style={styles.storeIconWrapper}>
          <Store size={32} color="#2563eb" />
        </View>
        <View style={styles.storeHeaderTextWrapper}>
          <Text style={styles.storeHeaderTitle}>Stores Near Me</Text>
          <Text style={styles.storeHeaderSubtitle}>Showing stores near your current location</Text>
          <View style={styles.locationPinRow}>
            <MapPin size={12} color="#64748b" />
            <Text style={styles.locationPinText}>Boring Road, Patna, Bihar</Text>
            <TouchableOpacity>
              <Text style={styles.locationChangeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {filters.map((f) => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity 
                key={f} 
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.filterChip}>
            <Filter size={14} color="#64748b" />
            <Text style={[styles.filterChipText, { marginLeft: 4 }]}>Filter</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sortRow}>
          <Text style={styles.sortText}>Nearest First</Text>
          <ChevronDown size={14} color="#081028" />
        </View>

        <View style={styles.storeList}>
          {stores.map((store) => (
            <TouchableOpacity key={store.name} style={styles.storeCard} onPress={() => router.push(`/stores/${store.name.toLowerCase().replace(/ /g, '-')}`)}>
              <View style={styles.storeImageContainer}>
                <Image source={{ uri: store.img }} style={styles.storeImage} />
                <View style={[styles.statusBadge, store.status === 'Closing Soon' ? styles.statusBadgeWarning : {}]}>
                  <Text style={styles.statusBadgeText}>{store.status}</Text>
                </View>
                <TouchableOpacity style={styles.favButton}>
                  <Heart size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <View style={styles.storeInfo}>
                <View style={styles.storeInfoLeft}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <View style={styles.storeMetaRow}>
                    <Text style={styles.ratingText}>{store.rating}</Text>
                    <Star size={12} color="#16a34a" fill="#16a34a" />
                    <Text style={styles.reviewsText}>{store.reviews}</Text>
                  </View>
                  <Text style={styles.storeTags} numberOfLines={1}>{store.tags}</Text>
                  <View style={styles.storeLocationRow}>
                    <MapPin size={12} color="#64748b" />
                    <Text style={styles.storeLocationText}>{store.distance} • {store.location}</Text>
                  </View>
                  <View style={styles.deliveryBadge}>
                    <Text style={styles.deliveryBadgeText}>Fast Delivery</Text>
                  </View>
                </View>
                <ChevronRight size={24} color="#94a3b8" />
              </View>
            </TouchableOpacity>
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
  storeHeaderBlock: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 16,
  },
  storeIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeHeaderTextWrapper: {
    flex: 1,
  },
  storeHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  storeHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 6,
  },
  locationPinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPinText: {
    fontSize: 12,
    color: '#64748b',
  },
  locationChangeLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    marginLeft: 4,
  },
  filtersWrapper: {
    paddingVertical: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  content: {
    paddingBottom: 24,
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081028',
  },
  storeList: {
    paddingHorizontal: 16,
    gap: 20,
  },
  storeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  storeImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeWarning: {
    backgroundColor: '#f59e0b',
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  favButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  storeInfoLeft: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#081028',
  },
  reviewsText: {
    fontSize: 12,
    color: '#64748b',
  },
  storeTags: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
  },
  storeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  storeLocationText: {
    fontSize: 12,
    color: '#64748b',
  },
  deliveryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
});
