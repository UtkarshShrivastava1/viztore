import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, StatusBar, Platform } from 'react-native';
import { MapPin, Search, Mic, Heart, ShoppingCart, ChevronRight, Trash2, ArrowRight } from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { router } from 'expo-router';

export default function CartScreen() {
  const groupedCarts = [
    {
      storeId: 'fashion-hub',
      storeName: 'Fashion Hub',
      address: '123, MG Road, Near City Mall, Indore, Madhya Pradesh - 452001',
      status: 'Open till 9:00 PM',
      totalItems: 5,
      totalAmount: '4,098',
      mrp: '5,297',
      savings: '1,199',
      images: [
        'https://via.placeholder.com/100/e0f2fe',
        'https://via.placeholder.com/100/f1f5f9',
        'https://via.placeholder.com/100/ffedd5'
      ],
      extraCount: 2
    },
    {
      storeId: 'sharma-electronics',
      storeName: 'Sharma Electronics',
      address: '45, Nehru Nagar, Main Road, Bhilai, Chhattisgarh - 490020',
      status: 'Open till 10:00 PM',
      totalItems: 3,
      totalAmount: '2,799',
      mrp: '3,399',
      savings: '600',
      images: [
        'https://via.placeholder.com/100/dbeafe',
        'https://via.placeholder.com/100/f3f4f6',
        'https://via.placeholder.com/100/f8fafc'
      ],
      extraCount: 1
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#081028" />
      
      {/* Header Area */}
      <View style={styles.headerBackground}>
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
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={styles.locationSelector}>
            <MapPin size={14} color="#e2e8f0" />
            <Text style={styles.locationText} numberOfLines={1}>
              Deliver to Harish Kumar - Q No- 6/B, Street -13, Sector -2, Bhilai
            </Text>
            <ChevronRight size={14} color="#e2e8f0" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748b" />
            <TextInput
              placeholder="Search for products, stores and more..."
              placeholderTextColor="#64748b"
              style={styles.searchInput}
            />
            <Mic size={20} color="#64748b" />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Cart Title Header */}
        <View style={styles.cartTitleRow}>
          <View>
            <Text style={styles.cartTitle}>My Cart (2)</Text>
            <Text style={styles.cartSubtitle}>Items from 2 stores</Text>
          </View>
          <TouchableOpacity style={styles.clearCartBtn}>
            <Trash2 size={16} color="#3b82f6" />
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Store Carts */}
        <View style={styles.storeCartsContainer}>
          {groupedCarts.map((storeCart, index) => (
            <View key={index} style={styles.storeCard}>
              <View style={styles.storeCardHeader}>
                <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.storeLogo} />
                <View style={styles.storeInfo}>
                  <TouchableOpacity style={styles.storeNameRow} onPress={() => router.push(`/stores/${storeCart.storeId}`)}>
                    <Text style={styles.storeName}>{storeCart.storeName}</Text>
                    <ChevronRight size={16} color="#0f172a" />
                  </TouchableOpacity>
                  <Text style={styles.storeAddress} numberOfLines={1}>{storeCart.address}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{storeCart.status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cartContentRow}>
                <View style={styles.imagesGroup}>
                  {storeCart.images.map((img, i) => (
                    <View key={i} style={styles.itemThumb}>
                      <Image source={{ uri: img }} style={styles.itemThumbImg} />
                    </View>
                  ))}
                  {storeCart.extraCount > 0 && (
                    <View style={styles.extraCountThumb}>
                      <Text style={styles.extraCountText}>+{storeCart.extraCount}{'\n'}more</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.priceGroup}>
                  <Text style={styles.totalPrice}>₹{storeCart.totalAmount}</Text>
                  <Text style={styles.mrpText}>MRP ₹{storeCart.mrp}</Text>
                  <Text style={styles.savingsText}>You save ₹{storeCart.savings}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.itemsCount}>
                  <ShoppingCart size={16} color="#475569" />
                  <Text style={styles.itemsCountText}>{storeCart.totalItems} items</Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewCartBtn}
                  onPress={() => router.push(`/cart/store/${storeCart.storeId}`)}
                >
                  <Text style={styles.viewCartBtnText}>View Cart</Text>
                  <ArrowRight size={16} color="#2563eb" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  headerBackground: {
    backgroundColor: '#081028',
    paddingBottom: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
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
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoV: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  logoSubtext: {
    fontSize: 9,
    color: '#94a3b8',
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
    borderColor: '#081028',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  locationContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  locationText: {
    color: '#f8fafc',
    fontSize: 12,
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#081028',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  cartTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  cartSubtitle: {
    fontSize: 13,
    color: '#0f172a',
    marginTop: 2,
    fontWeight: '600'
  },
  clearCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearCartText: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '600',
  },
  storeCartsContainer: {
    gap: 16,
  },
  storeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storeCardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  storeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
  },
  storeInfo: {
    flex: 1,
  },
  storeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  storeAddress: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '700',
  },
  cartContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
  },
  imagesGroup: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  itemThumbImg: {
    width: '100%',
    height: '100%',
  },
  extraCountThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraCountText: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: '700',
    textAlign: 'center',
  },
  priceGroup: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  mrpText: {
    fontSize: 11,
    color: '#64748b',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  savingsText: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemsCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  viewCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
});
