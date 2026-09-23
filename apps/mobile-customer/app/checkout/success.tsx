import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CheckCircle2, Clock, KeyRound, ArrowRight } from 'lucide-react-native';

export default function OrderSuccessScreen() {
  const orderId = '#ORD-94218';
  const deliveryOtp = '4821';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <CheckCircle2 size={54} color="#16a34a" />
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.orderIdText}>{orderId}</Text>
        <Text style={styles.sub}>Your order has been sent to Fresh Mart Supermarket</Text>

        {/* Physical 4-Digit Delivery OTP Card */}
        <View style={styles.otpCard}>
          <View style={styles.otpHeader}>
            <KeyRound size={16} color="#d97706" />
            <Text style={styles.otpLabel}>Delivery Verification Code</Text>
          </View>
          <Text style={styles.otpValue}>{deliveryOtp}</Text>
          <Text style={styles.otpSub}>Share this 4-digit OTP only with your rider upon arrival</Text>
        </View>

        {/* ETA Timer */}
        <View style={styles.etaCard}>
          <Clock size={18} color="#2563eb" />
          <View>
            <Text style={styles.etaTitle}>Estimated Arrival: 18–22 Mins</Text>
            <Text style={styles.etaSub}>Store is packing your fresh items</Text>
          </View>
        </View>
      </View>

      {/* Return to Home / Track Order */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.trackBtn} onPress={() => router.replace('/(tabs)/account')}>
          <Text style={styles.trackBtnText}>Track Order Live</Text>
          <ArrowRight size={16} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '800', color: '#081028', textAlign: 'center' },
  orderIdText: { fontSize: 14, fontWeight: '700', color: '#f97316', marginTop: 4 },
  sub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 8, maxWidth: 280 },
  otpCard: { width: '100%', backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fef3c7', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 24 },
  otpHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  otpLabel: { fontSize: 11, fontWeight: '700', color: '#b45309', textTransform: 'uppercase' },
  otpValue: { fontSize: 32, fontWeight: '900', color: '#081028', letterSpacing: 8, marginVertical: 6 },
  otpSub: { fontSize: 11, color: '#92400e', textAlign: 'center' },
  etaCard: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, marginTop: 14 },
  etaTitle: { fontSize: 13, fontWeight: '700', color: '#1e40af' },
  etaSub: { fontSize: 11, color: '#3b82f6', marginTop: 2 },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#e2e8f0', gap: 10 },
  trackBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#081028', paddingVertical: 14, borderRadius: 10 },
  trackBtnText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  homeBtn: { alignItems: 'center', paddingVertical: 12 },
  homeBtnText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
});
