import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, Platform } from 'react-native';
import { Heart, ShoppingCart, ChevronLeft, Trash2, ChevronRight, Plus, Minus, Tag, Info } from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { router, useLocalSearchParams } from 'expo-router';

export default function SingleStoreCartScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const cartItems = [
    {
      id: '1',
      name: 'Men Solid Cotton Shirt',
      size: 'L',
      color: 'Light Blue',
      inStock: true,
      price: '899',
      mrp: '999',
      discount: '10% OFF',
      qty: 1,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: '2',
      name: 'Nike Revolution 7 Running Shoes',
      size: '8',
      color: 'White/Blue',
      inStock: true,
      price: '2,799',
      mrp: '3,999',
      discount: '30% OFF',
      qty: 1,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: '3',
      name: 'Solimo Stainless Steel Water Bottle',
      size: '750 ml',
      color: 'Blue',
      inStock: true,
      price: '499',
      mrp: '599',
      discount: '17% OFF',
      qty: 1,
      image: 'https://via.placeholder.com/150'
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
                <Text style={styles.badgeText}>3</Text>
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
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Cart Title Header */}
        <View style={styles.cartTitleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.cartTitle}>My Cart (3)</Text>
            <Text style={styles.cartSubtitle}>Items from a single store</Text>
          </View>
          <TouchableOpacity style={styles.clearCartBtn}>
            <Trash2 size={16} color="#3b82f6" />
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Store Info Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeCardInner}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.storeLogo} />
            <View style={styles.storeInfo}>
              <TouchableOpacity style={styles.storeNameRow} onPress={() => router.push(`/stores/${slug}`)}>
                <Text style={styles.storeName}>Fashion Hub</Text>
                <ChevronRight size={16} color="#0f172a" />
              </TouchableOpacity>
              <Text style={styles.storeAddress} numberOfLines={1}>123, MG Road, Near City Mall, Indore, Madhya Pradesh - 452001</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Open till 9:00 PM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewStoreBtn} onPress={() => router.push(`/stores/${slug}`)}>
              <Text style={styles.viewStoreBtnText}>View Store</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.deliveryBanner}>
            <Text style={styles.deliveryBannerText}>Yay! You get FREE delivery on this order.</Text>
          </View>
        </View>

        {/* Cart Items */}
        <View style={styles.itemsList}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemTopRow}>
                <View style={styles.itemImageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                </View>
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.itemPriceCol}>
                      <Text style={styles.itemPrice}>₹{item.price}</Text>
                      <View style={styles.mrpRow}>
                        <Text style={styles.itemMrp}>₹{item.mrp}</Text>
                        <Text style={styles.itemDiscount}>{item.discount}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={styles.itemMeta}>Size: {item.size} | Color: {item.color}</Text>
                  
                  {item.inStock && (
                    <View style={styles.inStockBadge}>
                      <Text style={styles.inStockText}>In Stock</Text>
                    </View>
                  )}
                  
                  <View style={styles.itemActionsRow}>
                    <View style={styles.itemTextActions}>
                      <TouchableOpacity style={styles.textActionBtn}>
                        <Heart size={14} color="#3b82f6" />
                        <Text style={styles.textActionText}>Move to Wishlist</Text>
                      </TouchableOpacity>
                      <View style={styles.actionDivider} />
                      <TouchableOpacity style={styles.textActionBtn}>
                        <Trash2 size={14} color="#64748b" />
                        <Text style={styles.textActionTextGray}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.qtyControl}>
                      <TouchableOpacity style={styles.qtyBtn}>
                        <Minus size={14} color="#0f172a" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.qty}</Text>
                      <TouchableOpacity style={styles.qtyBtn}>
                        <Plus size={14} color="#3b82f6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Price Details */}
        <View style={styles.priceDetailsCard}>
          <View style={styles.priceDetailsHeaderRow}>
            <Text style={styles.priceDetailsTitle}>Price Details</Text>
            <Text style={styles.priceDetailsCount}>3 Items</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total MRP</Text>
            <Text style={styles.priceValue}>₹5,597</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelSuccess}>Discount on MRP</Text>
            <Text style={styles.priceValueSuccess}>-₹700</Text>
          </View>
          
          <TouchableOpacity style={styles.couponBtn}>
            <View style={styles.couponLeft}>
              <View style={styles.couponIconWrapper}>
                <Tag size={16} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.couponTitle}>Apply Coupon / Offer</Text>
                <Text style={styles.couponSubtitle}>Save more on this order</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </TouchableOpacity>
          
          <View style={styles.priceRow}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.priceLabel}>GST (18%)</Text>
              <Info size={14} color="#94a3b8" />
            </View>
            <Text style={styles.priceValue}>₹881</Text>
          </View>
          <View style={styles.priceRow}>
            <View style={styles.labelWithIcon}>
              <Text style={styles.priceLabel}>Delivery Charges</Text>
              <Info size={14} color="#94a3b8" />
            </View>
            <Text style={styles.priceValueSuccess}>FREE</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹5,778</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Checkout Bar */}
      <View style={styles.checkoutBar}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Needed MapPin since it was used in Location Container
import { MapPin, ArrowRight } from 'lucide-react-native';

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
  content: {
    padding: 16,
    paddingBottom: 100, // Space for checkout bar
  },
  cartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  titleWrapper: {
    flex: 1,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  cartSubtitle: {
    fontSize: 12,
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
  storeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  storeCardInner: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
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
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '700',
  },
  viewStoreBtn: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewStoreBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  deliveryBanner: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryBannerText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsList: {
    gap: 16,
    marginBottom: 20,
  },
  cartItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 8,
  },
  itemPriceCol: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  mrpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  itemMrp: {
    fontSize: 10,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  itemDiscount: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '700',
  },
  itemMeta: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
  },
  inStockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 12,
  },
  inStockText: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '700',
  },
  itemActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3b82f6',
  },
  textActionTextGray: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  actionDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyBtn: {
    padding: 2,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  priceDetailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  priceDetailsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceDetailsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  priceDetailsCount: {
    fontSize: 12,
    color: '#64748b',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 13,
    color: '#475569',
  },
  priceValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  priceLabelSuccess: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
  },
  priceValueSuccess: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '700',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  couponBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  couponIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  couponSubtitle: {
    fontSize: 11,
    color: '#1e40af',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
