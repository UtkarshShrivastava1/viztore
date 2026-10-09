import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { ChevronLeft, Heart, ShoppingCart, ShieldCheck, MapPin, CheckCircle2, Circle, CreditCard, Banknote, Smartphone, Zap, RotateCcw, Award, Lock, Calendar, Store, Info, ChevronDown } from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { router } from 'expo-router';

type DeliveryOption = 'reserve' | 'pickup' | 'deliver';
type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

export default function CheckoutScreen() {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('deliver');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  const getTopBannerText = () => {
    switch (deliveryOption) {
      case 'deliver': return 'Shop with confidence! Your order is 100% safe and secure.';
      case 'pickup': return 'Pick up your order from the store. No delivery charges applicable.';
      case 'reserve': return 'Reserve your order now! Pay later at the time of pickup or delivery.';
    }
  };

  const getOptionBannerText = () => {
    switch (deliveryOption) {
      case 'deliver': return 'Yay! You get FREE delivery on this order.';
      case 'pickup': return 'You will pick up your order from the store. No delivery charges applicable.';
      case 'reserve': return 'Your items will be reserved. You can pay later at the time of pickup or delivery.';
    }
  };

  const OptionRadio = ({ value, title, subtitle, selected, onSelect, icon: Icon }: any) => (
    <TouchableOpacity 
      style={[styles.optionCard, selected && styles.optionCardSelected]} 
      onPress={() => onSelect(value)}
    >
      <View style={[styles.optionIconWrapper, selected && styles.optionIconWrapperSelected]}>
        <Icon size={20} color={selected ? '#2563eb' : '#64748b'} />
      </View>
      <View style={styles.optionDetails}>
        <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      {selected ? (
        <CheckCircle2 size={24} color="#2563eb" />
      ) : (
        <Circle size={24} color="#cbd5e1" />
      )}
    </TouchableOpacity>
  );

  const PaymentRadio = ({ value, title, subtitle, selected, onSelect, icon: Icon }: any) => (
    <TouchableOpacity 
      style={styles.paymentCard} 
      onPress={() => onSelect(value)}
    >
      <View style={styles.paymentIconWrapper}>
        {typeof Icon === 'string' ? (
          <Text style={styles.paymentIconText}>{Icon}</Text>
        ) : (
          <Icon size={20} color="#0f172a" />
        )}
      </View>
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentTitle}>{title}</Text>
        <Text style={styles.paymentSubtitle}>{subtitle}</Text>
      </View>
      {selected ? (
        <CheckCircle2 size={24} color="#2563eb" />
      ) : (
        <Circle size={24} color="#cbd5e1" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Checkout Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Checkout</Text>
          <Text style={styles.pageSubtitle}>Review and place your order</Text>
        </View>

        {/* Top Banner */}
        <View style={styles.bannerContainer}>
          <ShieldCheck size={16} color="#16a34a" />
          <Text style={styles.bannerText}>{getTopBannerText()}</Text>
        </View>

        {/* 1. Address / Store */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              1. {deliveryOption === 'pickup' ? 'Pickup Store' : 'Delivery Address'}
            </Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.addressCard}>
            <View style={styles.addressIconWrapper}>
              {deliveryOption === 'pickup' ? (
                <Store size={20} color="#3b82f6" />
              ) : (
                <MapPin size={20} color="#3b82f6" />
              )}
            </View>
            <View style={styles.addressDetails}>
              <Text style={styles.addressName}>
                {deliveryOption === 'pickup' ? 'Fashion Hub' : 'Harish Kumar'}
              </Text>
              {deliveryOption !== 'pickup' && (
                <Text style={styles.addressPhone}>+91 98765 43210</Text>
              )}
              <Text style={styles.addressText}>
                123, MG Road, Near City Mall{'\n'}Indore, Madhya Pradesh - 452001
              </Text>
              
              {deliveryOption === 'pickup' ? (
                <View style={styles.pickupMetaRow}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Open till 9:00 PM</Text>
                  </View>
                  <TouchableOpacity style={styles.mapLink}>
                    <MapPin size={12} color="#2563eb" />
                    <Text style={styles.mapLinkText}>View on Map</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.homeBadge}>
                  <Text style={styles.homeBadgeText}>Home</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 2. Delivery Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>2. Delivery Options</Text>
          <Text style={styles.sectionSubtitle}>Choose how you want to receive your order</Text>
          
          <View style={styles.optionsList}>
            <OptionRadio
              value="reserve"
              title="Reserve"
              subtitle="Reserve your order for a specific date and time."
              icon={Calendar}
              selected={deliveryOption === 'reserve'}
              onSelect={setDeliveryOption}
            />
            <OptionRadio
              value="pickup"
              title="Pickup"
              subtitle="Pick up your order from the store."
              icon={Store}
              selected={deliveryOption === 'pickup'}
              onSelect={setDeliveryOption}
            />
            <OptionRadio
              value="deliver"
              title="Deliver"
              subtitle="Get your order delivered to your address."
              icon={MapPin}
              selected={deliveryOption === 'deliver'}
              onSelect={setDeliveryOption}
            />
          </View>
          
          <View style={styles.optionBanner}>
            {deliveryOption === 'reserve' ? (
              <Calendar size={16} color="#16a34a" />
            ) : deliveryOption === 'pickup' ? (
              <Store size={16} color="#16a34a" />
            ) : (
              <Zap size={16} color="#16a34a" />
            )}
            <Text style={styles.optionBannerText}>{getOptionBannerText()}</Text>
          </View>
        </View>

        {/* 3. Payment Methods (Skip for Reserve) */}
        {deliveryOption !== 'reserve' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>3. Payment Methods</Text>
            <Text style={styles.sectionSubtitle}>Select a payment method</Text>
            
            <View style={styles.paymentList}>
              <PaymentRadio
                value="upi"
                title="UPI"
                subtitle="Pay using any UPI app"
                icon="UPI"
                selected={paymentMethod === 'upi'}
                onSelect={setPaymentMethod}
              />
              <View style={styles.divider} />
              <PaymentRadio
                value="card"
                title="Credit / Debit Card"
                subtitle="Visa, Mastercard, Rupay, etc."
                icon={CreditCard}
                selected={paymentMethod === 'card'}
                onSelect={setPaymentMethod}
              />
              <View style={styles.divider} />
              <PaymentRadio
                value="netbanking"
                title="Net Banking"
                subtitle="All major banks supported"
                icon={Banknote}
                selected={paymentMethod === 'netbanking'}
                onSelect={setPaymentMethod}
              />
              <View style={styles.divider} />
              <PaymentRadio
                value="cod"
                title={deliveryOption === 'pickup' ? "Cash on Pickup" : "Cash on Delivery (COD)"}
                subtitle={deliveryOption === 'pickup' ? "Pay at the store while picking up" : "Pay when you receive"}
                icon={Banknote}
                selected={paymentMethod === 'cod'}
                onSelect={setPaymentMethod}
              />
            </View>
          </View>
        )}

        {/* 4. Order Summary */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {deliveryOption === 'reserve' ? '3. Order Summary' : '4. Order Summary'}
            </Text>
            <Text style={styles.summaryItemCount}>3 Items</Text>
          </View>
          
          <View style={styles.summaryBox}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total MRP</Text>
              <Text style={styles.priceValue}>₹2,547</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabelSuccess}>Discount on MRP</Text>
              <Text style={styles.priceValueSuccess}>-₹350</Text>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.labelWithIcon}>
                <Text style={styles.priceLabel}>GST (18%)</Text>
                <Info size={14} color="#94a3b8" />
              </View>
              <Text style={styles.priceValue}>₹395</Text>
            </View>
            {deliveryOption === 'deliver' && (
              <View style={styles.priceRow}>
                <View style={styles.labelWithIcon}>
                  <Text style={styles.priceLabel}>Delivery Charges</Text>
                  <Info size={14} color="#94a3b8" />
                </View>
                <Text style={styles.priceValueSuccess}>FREE</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>₹2,592</Text>
            </View>
          </View>
        </View>

        {deliveryOption === 'reserve' && (
          <View style={styles.reserveInfoBox}>
            <Lock size={16} color="#2563eb" />
            <Text style={styles.reserveInfoText}>No payment is required now. You can pay later at the time of pickup or delivery.</Text>
          </View>
        )}

        {/* Trust Badges */}
        <View style={styles.trustBadgesContainer}>
          <View style={styles.trustBadge}>
            <View style={styles.trustBadgeIcon}>
              <ShieldCheck size={20} color="#16a34a" />
            </View>
            <Text style={styles.trustBadgeTitle}>Secure Payments</Text>
            <Text style={styles.trustBadgeSub}>100% Secure</Text>
          </View>
          <View style={styles.trustBadge}>
            <View style={styles.trustBadgeIcon}>
              <RotateCcw size={20} color="#2563eb" />
            </View>
            <Text style={styles.trustBadgeTitle}>Easy Returns</Text>
            <Text style={styles.trustBadgeSub}>7 Days Return</Text>
          </View>
          <View style={styles.trustBadge}>
            <View style={styles.trustBadgeIcon}>
              <Award size={20} color="#3b82f6" />
            </View>
            <Text style={styles.trustBadgeTitle}>Top Quality</Text>
            <Text style={styles.trustBadgeSub}>Trusted Products</Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.stickyFooter}>
        {deliveryOption === 'reserve' ? (
          <TouchableOpacity style={styles.placeOrderBtnReserve}>
            <Calendar size={20} color="#ffffff" />
            <Text style={styles.placeOrderBtnText}>Reserve Order</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.footerPriceInfo}>
              <Text style={styles.footerPriceLabel}>Total Payable</Text>
              <Text style={styles.footerPriceAmount}>₹2,592</Text>
              <TouchableOpacity style={styles.viewDetailsBtn}>
                <Text style={styles.viewDetailsText}>View Price Details</Text>
                <ChevronDown size={14} color="#0f172a" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.placeOrderBtn}>
              <Lock size={18} color="#ffffff" />
              <Text style={styles.placeOrderBtnText}>Place Order</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
  backButton: {
    padding: 4,
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
  content: {
    paddingBottom: 100,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#0f172a',
    marginTop: 4,
    fontWeight: '600'
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  bannerText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  addressIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 10,
  },
  homeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  homeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  pickupMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  optionsList: {
    gap: 12,
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  optionCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  optionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconWrapperSelected: {
    backgroundColor: '#ffffff',
  },
  optionDetails: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: '#1e3a8a',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  optionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderRadius: 8,
  },
  optionBannerText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
    flex: 1,
  },
  paymentList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  paymentIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paymentIconText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#f59e0b',
    fontStyle: 'italic',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  summaryItemCount: {
    fontSize: 13,
    color: '#64748b',
  },
  summaryBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
  reserveInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  reserveInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#1e3a8a',
    fontWeight: '600',
  },
  trustBadgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  trustBadge: {
    alignItems: 'center',
    flex: 1,
  },
  trustBadgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  trustBadgeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
    textAlign: 'center',
  },
  trustBadgeSub: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  stickyFooter: {
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  footerPriceInfo: {
    flex: 1,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  footerPriceAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563eb',
    marginVertical: 2,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: '600',
  },
  placeOrderBtn: {
    flex: 1.2,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  placeOrderBtnReserve: {
    flex: 1,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  placeOrderBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
