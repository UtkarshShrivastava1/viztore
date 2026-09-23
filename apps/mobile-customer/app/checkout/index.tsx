import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Truck, Store, CreditCard, Banknote, ShieldCheck } from 'lucide-react-native';

export default function CheckoutScreen() {
  const [fulfillment, setFulfillment] = useState<'deliver' | 'pickup'>('deliver');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Step 1: Fulfillment Mode */}
        <Text style={styles.sectionHeading}>1. Fulfillment Option</Text>
        <View style={styles.fulfillmentRow}>
          <TouchableOpacity
            style={[styles.modeCard, fulfillment === 'deliver' && styles.modeCardActive]}
            onPress={() => setFulfillment('deliver')}
          >
            <Truck size={20} color={fulfillment === 'deliver' ? '#f97316' : '#64748b'} />
            <Text style={[styles.modeTitle, fulfillment === 'deliver' && styles.modeTitleActive]}>Delivery</Text>
            <Text style={styles.modeSub}>To your door in 20 min</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeCard, fulfillment === 'pickup' && styles.modeCardActive]}
            onPress={() => setFulfillment('pickup')}
          >
            <Store size={20} color={fulfillment === 'pickup' ? '#f97316' : '#64748b'} />
            <Text style={[styles.modeTitle, fulfillment === 'pickup' && styles.modeTitleActive]}>Self Pickup</Text>
            <Text style={styles.modeSub}>Pick from store (Free)</Text>
          </TouchableOpacity>
        </View>

        {/* Step 2: Address Selection */}
        {fulfillment === 'deliver' ? (
          <View style={styles.sectionBox}>
            <View style={styles.boxHeader}>
              <Text style={styles.sectionHeading}>2. Delivery Address</Text>
              <TouchableOpacity>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addressCard}>
              <MapPin size={18} color="#f97316" />
              <View style={styles.addressInfo}>
                <View style={styles.addressBadge}>
                  <Text style={styles.badgeText}>HOME</Text>
                </View>
                <Text style={styles.addressText}>Flat 402, Green View Apts, 12th Main</Text>
                <Text style={styles.addressSub}>Indiranagar, Bengaluru - 560038</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeading}>2. Pickup Location</Text>
            <View style={styles.addressCard}>
              <Store size={18} color="#f97316" />
              <View style={styles.addressInfo}>
                <Text style={styles.addressText}>Fresh Mart Supermarket</Text>
                <Text style={styles.addressSub}>Shop 4, 100ft Road, Indiranagar (0.4 km away)</Text>
                <Text style={styles.timingSub}>Ready in 15 mins • Open till 10:00 PM</Text>
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Payment Method */}
        <Text style={styles.sectionHeading}>3. Payment Mode</Text>
        <View style={styles.paymentBox}>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'upi' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('upi')}
          >
            <CreditCard size={18} color={paymentMethod === 'upi' ? '#2563eb' : '#64748b'} />
            <View style={styles.paymentTextWrap}>
              <Text style={styles.paymentName}>UPI / Online Instant Pay</Text>
              <Text style={styles.paymentSub}>Google Pay, PhonePe, Paytm, Cards</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('cod')}
          >
            <Banknote size={18} color={paymentMethod === 'cod' ? '#16a34a' : '#64748b'} />
            <View style={styles.paymentTextWrap}>
              <Text style={styles.paymentName}>Cash on Delivery (COD)</Text>
              <Text style={styles.paymentSub}>Pay at door on delivery</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceSummary}>
          <Text style={styles.summaryTitle}>Order Total</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Items Total (2 items)</Text>
            <Text style={styles.rowVal}>₹230</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivery Charges</Text>
            <Text style={styles.rowVal}>{fulfillment === 'deliver' ? '₹25' : 'FREE'}</Text>
          </View>
          <View style={[styles.row, styles.totalBorder]}>
            <Text style={styles.grandLabel}>Amount Payable</Text>
            <Text style={styles.grandPrice}>₹{fulfillment === 'deliver' ? '255' : '230'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={() => router.replace('/checkout/success')}>
          <ShieldCheck size={18} color="#ffffff" />
          <Text style={styles.placeOrderText}>Confirm & Place Order (₹{fulfillment === 'deliver' ? '255' : '230'})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 100 },
  sectionHeading: { fontSize: 13, fontWeight: '800', color: '#081028', marginBottom: 8, marginTop: 12 },
  fulfillmentRow: { flexDirection: 'row', gap: 10 },
  modeCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 12, alignItems: 'center' },
  modeCardActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  modeTitle: { fontSize: 13, fontWeight: '700', color: '#64748b', marginTop: 6 },
  modeTitleActive: { color: '#c2410c' },
  modeSub: { fontSize: 10, color: '#94a3b8', marginTop: 2, textAlign: 'center' },
  sectionBox: { marginTop: 4 },
  boxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  changeLink: { fontSize: 12, fontWeight: '700', color: '#f97316' },
  addressCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', gap: 12, alignItems: 'flex-start' },
  addressInfo: { flex: 1 },
  addressBadge: { alignSelf: 'flex-start', backgroundColor: '#eff6ff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#2563eb' },
  addressText: { fontSize: 13, fontWeight: '700', color: '#081028' },
  addressSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  timingSub: { fontSize: 11, color: '#16a34a', fontWeight: '600', marginTop: 4 },
  paymentBox: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  paymentOptionActive: { backgroundColor: '#f8fafc' },
  paymentTextWrap: { flex: 1 },
  paymentName: { fontSize: 13, fontWeight: '700', color: '#081028' },
  paymentSub: { fontSize: 11, color: '#64748b' },
  priceSummary: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 16 },
  summaryTitle: { fontSize: 13, fontWeight: '800', color: '#081028', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { fontSize: 12, color: '#64748b' },
  rowVal: { fontSize: 12, fontWeight: '600', color: '#081028' },
  totalBorder: { borderTopWidth: 1, borderColor: '#f1f5f9', marginTop: 6, paddingTop: 6 },
  grandLabel: { fontSize: 13, fontWeight: '800', color: '#081028' },
  grandPrice: { fontSize: 16, fontWeight: '800', color: '#081028' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#ffffff', padding: 16, borderTopWidth: 1, borderColor: '#e2e8f0' },
  placeOrderBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#16a34a', paddingVertical: 14, borderRadius: 10 },
  placeOrderText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});
