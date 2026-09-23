import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ShieldCheck, ArrowRight, Store, Plus, Minus, Trash2 } from 'lucide-react-native';

export default function CartScreen() {
  const [qty1, setQty1] = useState(2);
  const [qty2, setQty2] = useState(1);

  const price1 = 185;
  const price2 = 45;
  const subtotal = qty1 * price1 + qty2 * price2;
  const deliveryFee = 25;
  const grandTotal = subtotal + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerBadge}>2 Items</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Single Store Lock Banner */}
        <View style={styles.storeBanner}>
          <Store size={16} color="#f97316" />
          <View style={styles.storeBannerInfo}>
            <Text style={styles.storeBannerTitle}>Ordering from Fresh Mart Supermarket</Text>
            <Text style={styles.storeBannerSub}>Items from one store per order</Text>
          </View>
        </View>

        {/* Free Delivery Milestone Progress */}
        <View style={styles.milestoneBox}>
          <Text style={styles.milestoneText}>🎉 Add ₹85 more to unlock Free Delivery!</Text>
        </View>

        {/* Items List */}
        <View style={styles.itemCard}>
          <View style={styles.itemThumb} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Organic Almond Milk 1L</Text>
            <Text style={styles.itemPrice}>₹{price1}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => setQty1(Math.max(1, qty1 - 1))} style={styles.stepBtn}>
                <Minus size={12} color="#081028" />
              </TouchableOpacity>
              <Text style={styles.stepVal}>{qty1}</Text>
              <TouchableOpacity onPress={() => setQty1(qty1 + 1)} style={styles.stepBtn}>
                <Plus size={12} color="#081028" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.itemCard}>
          <View style={styles.itemThumb} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>Whole Wheat Bread 400g</Text>
            <Text style={styles.itemPrice}>₹{price2}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity onPress={() => setQty2(Math.max(1, qty2 - 1))} style={styles.stepBtn}>
                <Minus size={12} color="#081028" />
              </TouchableOpacity>
              <Text style={styles.stepVal}>{qty2}</Text>
              <TouchableOpacity onPress={() => setQty2(qty2 + 1)} style={styles.stepBtn}>
                <Plus size={12} color="#081028" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bill Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Subtotal</Text>
            <Text style={styles.summaryVal}>₹{subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryVal}>₹{deliveryFee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>To Pay</Text>
            <Text style={styles.totalVal}>₹{grandTotal}</Text>
          </View>
        </View>

        {/* Trust Badge */}
        <View style={styles.trustBadge}>
          <ShieldCheck size={16} color="#16a34a" />
          <Text style={styles.trustText}>Safe & Contactless Delivery by Verified Local Partners</Text>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomSub}>Total Amount</Text>
          <Text style={styles.bottomPrice}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <ArrowRight size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#081028' },
  headerBadge: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  scroll: { padding: 16, paddingBottom: 100 },
  storeBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#ffedd5', padding: 12, borderRadius: 12, marginBottom: 12 },
  storeBannerInfo: { flex: 1 },
  storeBannerTitle: { fontSize: 13, fontWeight: '700', color: '#9a3412' },
  storeBannerSub: { fontSize: 11, color: '#c2410c' },
  milestoneBox: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#dcfce7', padding: 10, borderRadius: 10, marginBottom: 12 },
  milestoneText: { fontSize: 12, fontWeight: '600', color: '#15803d', textAlign: 'center' },
  itemCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  itemThumb: { width: 64, height: 64, backgroundColor: '#f1f5f9', borderRadius: 8, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: '#081028' },
  itemPrice: { fontSize: 14, fontWeight: '800', color: '#081028', marginTop: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  stepBtn: { padding: 4 },
  stepVal: { fontSize: 12, fontWeight: '700', color: '#081028', minWidth: 16, textAlign: 'center' },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 8 },
  summaryTitle: { fontSize: 14, fontWeight: '800', color: '#081028', marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 13, color: '#64748b' },
  summaryVal: { fontSize: 13, fontWeight: '600', color: '#081028' },
  totalRow: { borderTopWidth: 1, borderColor: '#f1f5f9', marginTop: 8, paddingTop: 8 },
  totalLabel: { fontSize: 14, fontWeight: '800', color: '#081028' },
  totalVal: { fontSize: 16, fontWeight: '800', color: '#081028' },
  trustBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, justifyContent: 'center' },
  trustText: { fontSize: 11, color: '#16a34a', fontWeight: '500' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#e2e8f0' },
  bottomSub: { fontSize: 11, color: '#64748b' },
  bottomPrice: { fontSize: 18, fontWeight: '800', color: '#081028' },
  checkoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f97316', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  checkoutBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
});
